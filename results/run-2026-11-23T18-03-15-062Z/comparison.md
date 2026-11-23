# Comparison with earlier run

Both runs used the same 20 cases, qwen2.5:3b digest
`357c53fb659c5076de1d65ccb0b397446227b71a42be9d1603d46168015c9e4b`,
temperature 0 and seed 42. The prompt and validation changed; the earlier
run did not record a prompt hash or hardware, so the environment cannot be
fully compared. One run per configuration is insufficient to establish
repeatability.

| Measure | Earlier | Current |
| --- | ---: | ---: |
| Correct | 8/20 | 13/20 |
| Unsafe suggestions | 1: c15 | 2: c14, c16 |
| Sent to review | 17/20 | 10/20 |
| Invalid or failed | 0 | 0 |
| Mean response time | 3687 ms | 7143 ms |

The current prompt improved the overall score but missed two of three conflict
cases. Its c14 explanation recognizes a conflict yet selects Marrakech; c16
selects Fès without acknowledging Tanger. Reasons are not a reliable safeguard.
Cases c08, c09 and c10 were all sent to review in the current run; see the
proposed alias and conflict rules in `../../BASELINE-NOTES.md`.

The earlier report labeled the maximum as p95 for its 20 samples. Applying the
nearest-rank method to its saved times selects the 19th value, 4735 ms; the
current p95 is 9577 ms. Timing differences are not attributable to the prompt
alone because the earlier hardware and runtime conditions were not recorded.
