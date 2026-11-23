import { readFile, writeFile, mkdir } from "node:fs/promises";
import { z } from "zod";
import { createHash } from "node:crypto";

const OLLAMA = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.MODEL ?? "qwen2.5:3b";
const RUN_DIR = process.env.RUN_DIR ?? `results/run-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const HARDWARE = process.env.HARDWARE ?? "not recorded";

type Case = {
  id: string; category: string;
  submitted_city: string; address: string; expected: string;
};
const data = JSON.parse(await readFile("data/cases.json", "utf8")) as {
  allowed_cities: string[]; cases: Case[];
};
const ALLOWED = data.allowed_cities;

// Strict contract: validated again in code, not just by Ollama
const Answer = z.object({
  suggested_city: z.string().nullable(),
  needs_review: z.boolean(),
  reason: z.string().max(400),
}).strict().superRefine((v, ctx) => {
  if (v.suggested_city !== null && !ALLOWED.includes(v.suggested_city))
    ctx.addIssue({ code: "custom", message: "city not in allowed list" });
  if (!v.needs_review && v.suggested_city === null)
    ctx.addIssue({ code: "custom", message: "no city but needs_review=false" });
  if (v.needs_review && v.suggested_city !== null)
    ctx.addIssue({ code: "custom", message: "city provided but needs_review=true" });
});

const format = {
    type: "object",
    properties: {
        suggested_city: { enum: [...ALLOWED, null] },
        needs_review: { type: "boolean" },
        reason: { type: "string" },
    },
    required: ["suggested_city", "needs_review", "reason"],
    additionalProperties: false,
};

const SYSTEM = `You review delivery orders for a Moroccan e-commerce company.
You get the submitted city, the address, and a list of allowed cities.
Decide which allowed city the order belongs to using the submitted city and address.
Rules:
- Recognize common French, Arabic, transliteration, accent and spelling variants
  when they clearly identify an allowed city (for example Fez means Fès).
- A clear submitted city can be sufficient when the address does not name a city.
  The absence of a city name in the address is not itself a conflict.
- If the address gives clear evidence of a different city, the information is
  ambiguous or insufficient, or the identified city is not allowed, choose review.
- For review, return suggested_city: null and needs_review: true. Otherwise return
  the exact allowed city name and needs_review: false. Give a short reason.
- Never guess. Answer with JSON only.`;
const promptHash = createHash("sha256").update(SYSTEM).digest("hex");

async function ask(c: Case) {
  const t0 = performance.now();
  const res = await fetch(`${OLLAMA}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, stream: false, format,
      options: { temperature: 0, seed: 42 },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify({
            submitted_city: c.submitted_city,
            address: c.address,
            allowed_cities: ALLOWED }) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { message: { content: string } };
  return { raw: body.message.content, ms: Math.round(performance.now() - t0) };
}

type Row = {
  id: string; category: string; expected: string; actual: string | null;
  status: "correct" | "wrong" | "invalid" | "error";
  unsafe: boolean; ms: number; reason?: string; raw?: string; error?: string;
};

// model version info
const tags = (await (await fetch(`${OLLAMA}/api/tags`)).json()) as
  { models: { name: string; digest: string }[] };
const modelInfo = tags.models.find((m) => m.name === MODEL || m.name.startsWith(MODEL));

// warm-up so model load time doesn't pollute case 1
console.log("Warming up...");
await ask(data.cases[0]).catch(() => {});

const rows: Row[] = [];
for (const c of data.cases) {
  const base = { id: c.id, category: c.category, expected: c.expected };
  try {
    const { raw, ms } = await ask(c);
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      rows.push({ ...base, actual: null, status: "invalid", unsafe: false, ms, raw,
                  error: "Response is not valid JSON" });
      console.log(c.id, "invalid");
      continue;
    }
    const parsed = Answer.safeParse(json);
    if (!parsed.success) {
      rows.push({ ...base, actual: null, status: "invalid", unsafe: false, ms, raw,
                  error: parsed.error.issues.map((i) => i.message).join("; ") });
      continue;
    }
    const a = parsed.data;
    const actual = a.needs_review || a.suggested_city === null ? "needs_review" : a.suggested_city;
    rows.push({ ...base, actual, ms, raw, reason: a.reason,
      status: actual === c.expected ? "correct" : "wrong",
      unsafe: c.expected === "needs_review" && actual !== "needs_review" });
  } catch (e) {
    console.log(e)
    rows.push({ ...base, actual: null, status: "error", unsafe: false, ms: 0, error: String(e) });
  }
  console.log(c.id, rows.at(-1)!.status);
}

// metrics
const correct = rows.filter((r) => r.status === "correct").length;
const unsafe = rows.filter((r) => r.unsafe);
const invalid = rows.filter((r) => r.status === "invalid" || r.status === "error");
const overCautious = rows.filter((r) => r.status === "wrong" && r.actual === "needs_review");
const humanReview = rows.filter((r) => r.actual === "needs_review").length;
const times = rows.map((r) => r.ms).filter((m) => m > 0).sort((a, b) => a - b);
const avg = Math.round(times.reduce((s, n) => s + n, 0) / (times.length || 1));
const p95 = times[Math.ceil(times.length * 0.95) - 1] ?? 0;

const byCat: Record<string, { ok: number; n: number }> = {};
for (const r of rows) {
  byCat[r.category] ??= { ok: 0, n: 0 };
  byCat[r.category].n++;
  if (r.status === "correct") byCat[r.category].ok++;
}

const baseline = rows.filter((r) => r.expected === "needs_review").length;

const report = `# City-review evaluation

- Date: ${new Date().toISOString()}
- Model: ${MODEL} (digest: ${modelInfo?.digest?.slice(0, 12) ?? "unknown"})
- Hardware: ${HARDWARE}
- Prompt SHA-256: ${promptHash}
- Settings: temperature 0, seed 42; one warm-up request excluded

## Results
- Correct: **${correct}/${rows.length}**
- Unsafe confident suggestions (expected needs_review, model chose a city): **${unsafe.length}** ${unsafe.map((r) => r.id).join(", ")}
- Over-cautious (flagged review but a city was expected): ${overCautious.length} ${overCautious.map((r) => r.id).join(", ")}
- Invalid/failed responses: ${invalid.length} ${invalid.map((r) => r.id).join(", ")}
- Sent to human review: ${humanReview}/${rows.length}
- Response time: avg ${avg} ms, p95 ${p95} ms, max ${times.at(-1) ?? 0} ms
- p95 uses nearest rank: sort successful response times and select rank ceil(0.95 × N), counting from 1. Errors without a recorded response time are excluded.
- Always-needs_review baseline: ${baseline}/${rows.length}

## By category
${Object.entries(byCat).map(([k, v]) => `- ${k}: ${v.ok}/${v.n}`).join("\n")}

## Case detail
| id | category | expected | actual | status | ms |
|----|----------|----------|--------|--------|----|
${rows.map((r) => `| ${r.id} | ${r.category} | ${r.expected} | ${r.actual ?? "-"} | ${r.status}${r.unsafe ? " ⚠ unsafe" : ""} | ${r.ms} |`).join("\n")}

## Complete inputs and responses
${rows.map((r, i) => `### ${r.id}\n\nInput: ${JSON.stringify({ submitted_city: data.cases[i].submitted_city, address: data.cases[i].address, allowed_cities: ALLOWED })}\n\nResponse: ${r.raw ?? r.error ?? "unavailable"}`).join("\n\n")}
`;

await mkdir(RUN_DIR, { recursive: true });
await writeFile(`${RUN_DIR}/results.json`, JSON.stringify({ model: MODEL, modelInfo, hardware: HARDWARE, prompt_sha256: promptHash, system_prompt: SYSTEM, settings: { temperature: 0, seed: 42 }, rows: rows.map((row, i) => ({ ...row, input: { submitted_city: data.cases[i].submitted_city, address: data.cases[i].address, allowed_cities: ALLOWED } })) }, null, 2));
await writeFile(`${RUN_DIR}/report.md`, report);
console.log(`\nDone: ${correct}/${rows.length} correct, ${unsafe.length} unsafe.`);
