# City-review evaluation

- Date: 2026-11-23T18:20:52.151Z
- Model: qwen2.5:7b (digest: 845dbda0ea48)
- Hardware: not recorded
- Prompt SHA-256: 0a88f4949ba8e40bc0bcd9d81034f150baff041b1d92ad9e84fc8fd0d6c2a517
- Settings: temperature 0, seed 42; one warm-up request excluded

## Results
- Correct: **18/20**
- Unsafe confident suggestions (expected needs_review, model chose a city): **1** c16
- Over-cautious (flagged review but a city was expected): 1 c08
- Invalid/failed responses: 0 
- Sent to human review: 7/20
- Response time: avg 12997 ms, p95 16068 ms, max 16654 ms
- p95 uses nearest rank: sort successful response times and select rank ceil(0.95 × N), counting from 1. Errors without a recorded response time are excluded.
- Always-needs_review baseline: 7/20

## By category
- clear: 4/4
- spelling: 4/5
- arabic: 3/3
- french: 1/1
- conflict: 2/3
- insufficient: 3/3
- not_in_list: 1/1

## Case detail
| id | category | expected | actual | status | ms |
|----|----------|----------|--------|--------|----|
| c01 | clear | Casablanca | Casablanca | correct | 7908 |
| c02 | clear | Fès | Fès | correct | 12336 |
| c03 | clear | Marrakech | Marrakech | correct | 14956 |
| c04 | clear | Rabat | Rabat | correct | 9392 |
| c05 | spelling | Casablanca | Casablanca | correct | 10931 |
| c06 | spelling | Fès | Fès | correct | 14678 |
| c07 | spelling | Marrakech | Marrakech | correct | 11234 |
| c08 | spelling | Tanger | needs_review | wrong | 13214 |
| c09 | spelling | Meknès | Meknès | correct | 13873 |
| c10 | arabic | Casablanca | Casablanca | correct | 13687 |
| c11 | arabic | Fès | Fès | correct | 16654 |
| c12 | arabic | Marrakech | Marrakech | correct | 10974 |
| c13 | french | Oujda | Oujda | correct | 16068 |
| c14 | conflict | needs_review | needs_review | correct | 15820 |
| c15 | conflict | needs_review | needs_review | correct | 15070 |
| c16 | conflict | needs_review | Fès | wrong ⚠ unsafe | 13175 |
| c17 | insufficient | needs_review | needs_review | correct | 12411 |
| c18 | insufficient | needs_review | needs_review | correct | 12219 |
| c19 | insufficient | needs_review | needs_review | correct | 11701 |
| c20 | not_in_list | needs_review | needs_review | correct | 13634 |

## Complete inputs and responses
### c01

Input: {"submitted_city":"Casablanca","address":"12 Rue Ibn Batouta, Maarif","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Casablanca","needs_review":false,"reason":"The submitted city matches the allowed city and the address does not provide evidence of a different city."}

### c02

Input: {"submitted_city":"Fès","address":"Avenue Hassan II, Ville Nouvelle","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Fès","needs_review":false,"reason":"The submitted city matches the allowed city and the address is in the city of Fès."}

### c03

Input: {"submitted_city":"Marrakech","address":"Rue de la Liberté, Guéliz","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city": "Marrakech", "needs_review": false, "reason": "The submitted city matches the allowed city and the address provides additional location context but does not suggest a different city."}

### c04

Input: {"submitted_city":"Rabat","address":"Avenue Mohammed V, Agdal","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Rabat","needs_review":false,"reason":"The submitted city matches the allowed city and the address does not contradict this."}

### c05

Input: {"submitted_city":"Casablnca","address":"Bd Zerktouni, Maarif","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city": "Casablanca", "needs_review": false, "reason": "The submitted city matches the allowed city name, despite a spelling variant."}

### c06

Input: {"submitted_city":"Fez","address":"Rue Talaa Kebira, Fes El Bali","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Fès",
  "needs_review": false,
  "reason": "The submitted city 'Fez' is a recognized variant of 'Fès', and the address clearly indicates 'Fes El Bali', which is in Fès."
}

### c07

Input: {"submitted_city":"Marrakesh","address":"Route de Targa","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city": "Marrakech", "needs_review": false, "reason": "The submitted city matches the allowed city name with a slight spelling variation."}

### c08

Input: {"submitted_city":"Tanja","address":"Rue Pasteur","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The submitted city 'Tanja' does not match any allowed cities and the address does not provide a clear city name."
}

### c09

Input: {"submitted_city":"Meknes","address":"Avenue des FAR","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Meknès",
  "needs_review": false,
  "reason": "The submitted city 'Meknes' matches the allowed city 'Meknès'. The address does not provide additional conflicting information."
}

### c10

Input: {"submitted_city":"الدار البيضاء","address":"شارع الزرقطوني، المعاريف","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Casablanca",
  "needs_review": false,
  "reason": "The submitted city 'الدار البيضاء' is an exact match for the allowed city 'Casablanca'."
}

### c11

Input: {"submitted_city":"فاس","address":"حي النرجس","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Fès",
  "needs_review": false,
  "reason": "The submitted city 'فاس' is a clear transliteration of the allowed city 'Fès'. The address 'حي النرجس' does not name a city but is specific enough to align with Fès."
}

### c12

Input: {"submitted_city":"مراكش","address":"كيليز، شارع محمد الخامس","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Marrakech","needs_review":false,"reason":"The submitted city 'مراكش' and the address clearly indicate Marrakech."}

### c13

Input: {"submitted_city":"Oujda","address":"Boulevard Mohammed V, quartier Hay Al Qods","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Oujda",
  "needs_review": false,
  "reason": "The submitted city matches one of the allowed cities and is clearly identified in the address."
}

### c14

Input: {"submitted_city":"Rabat","address":"Rue Allal Ben Abdellah, Médina de Marrakech","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address indicates Marrakech, which contradicts the submitted city of Rabat. The information is ambiguous."
}

### c15

Input: {"submitted_city":"Casablanca","address":"Avenue Hassan II, Founty, Agadir","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address clearly indicates Agadir, which is a different city than the submitted city Casablanca."
}

### c16

Input: {"submitted_city":"Fès","address":"Corniche de Tanger, près du port","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Fès","needs_review":false,"reason":"The submitted city 'Fès' matches the allowed city 'Fès' and the address does not provide evidence of a different city."}

### c17

Input: {"submitted_city":"","address":"Rue 12, Hay Salam","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address does not provide a clear city name and the submitted city is empty, making the assignment ambiguous."
}

### c18

Input: {"submitted_city":"","address":"Avenue Mohammed V","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address does not provide a clear city name and no submitted city was provided, making the assignment ambiguous."
}

### c19

Input: {"submitted_city":"Centre ville","address":"Rue 5, Immeuble 3","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The submitted city 'Centre ville' is too generic and the address does not provide a clear city name."
}

### c20

Input: {"submitted_city":"Laâyoune","address":"Avenue Smara","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The submitted city 'Laâyoune' does not match any allowed cities and the address does not provide additional context to determine a clear city."
}
