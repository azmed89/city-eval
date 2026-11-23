# Moroccan city-review evaluation

This project evaluates a local Ollama model against synthetic Moroccan delivery
orders. It compares each response with the expected city or `needs_review` in
`data/cases.json` and writes a report and raw results to `results/`.

## Run with Docker

Install Docker Desktop (or Docker Engine with the Compose plugin) and start it.
No host Node.js or npm installation is needed. From this directory, run:

```sh
docker compose up -d ollama
docker compose exec ollama ollama pull qwen2.5:3b
docker compose run --rm --build eval
```

The first model pull needs internet access and disk space. The model is stored
in a Docker volume for later runs. Once the image and model are available, the
evaluation uses the local Ollama service. The first build also downloads the
Node dependencies inside the image.

Each run writes a timestamped directory under `results/`, containing `report.md`
and `results.json` with complete inputs, responses, prompt hash and model metadata.
The files directly under `results/` are the earlier run and are preserved.
Set `HARDWARE` on the evaluation container to record the host and execution
device, for example `docker compose run --rm -e "HARDWARE=CPU and RAM details" eval`.
P95 uses the nearest-rank method: sort recorded response times and select the
one at rank ceil(0.95 × N), counting from 1. Failed requests without a response
time are excluded.

To try another model, pull it first, then override the evaluator's model:

```sh
docker compose exec ollama ollama pull qwen2.5:7b
docker compose run --rm -e MODEL=qwen2.5:7b eval
```

Stop the service with `docker compose down`. This keeps the model volume.
Response times depend on the machine and model; the evaluator warms up the
model before measuring the cases.
