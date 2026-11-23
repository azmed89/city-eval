# City-review evaluation

- Date: 2026-11-23T17:51:06.320Z
- Model: qwen2.5:3b (digest: 357c53fb659c)
- Hardware: <fill in: CPU/GPU, RAM>

## Results
- Correct: **14/20**
- Unsafe confident suggestions (expected needs_review, model chose a city): **2** c14, c16
- Over-cautious (flagged review but a city was expected): 4 c04, c08, c09, c10
- Invalid/failed responses: 0 
- Sent to human review: 9/20
- Response time: avg 7005 ms, p95 9871 ms, max 9871 ms
- Always-needs_review baseline: 7/20

## By category
- clear: 3/4
- spelling: 3/5
- arabic: 2/3
- french: 1/1
- conflict: 1/3
- insufficient: 3/3
- not_in_list: 1/1

## Case detail
| id | category | expected | actual | status | ms |
|----|----------|----------|--------|--------|----|
| c01 | clear | Casablanca | Casablanca | correct | 2941 |
| c02 | clear | Fès | Fès | correct | 5579 |
| c03 | clear | Marrakech | Marrakech | correct | 5578 |
| c04 | clear | Rabat | needs_review | wrong | 8734 |
| c05 | spelling | Casablanca | Casablanca | correct | 5708 |
| c06 | spelling | Fès | Fès | correct | 5587 |
| c07 | spelling | Marrakech | Marrakech | correct | 5852 |
| c08 | spelling | Tanger | needs_review | wrong | 9376 |
| c09 | spelling | Meknès | needs_review | wrong | 7764 |
| c10 | arabic | Casablanca | needs_review | wrong | 9006 |
| c11 | arabic | Fès | Fès | correct | 7535 |
| c12 | arabic | Marrakech | Marrakech | correct | 8820 |
| c13 | french | Oujda | Oujda | correct | 6029 |
| c14 | conflict | needs_review | Marrakech | wrong ⚠ unsafe | 7728 |
| c15 | conflict | needs_review | needs_review | correct | 8740 |
| c16 | conflict | needs_review | Fès | wrong ⚠ unsafe | 4967 |
| c17 | insufficient | needs_review | needs_review | correct | 5352 |
| c18 | insufficient | needs_review | needs_review | correct | 7964 |
| c19 | insufficient | needs_review | needs_review | correct | 9871 |
| c20 | not_in_list | needs_review | needs_review | correct | 6974 |

## Decision note
<write after reviewing: what worked, what failed, what to improve>
