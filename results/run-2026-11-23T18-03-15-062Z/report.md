# City-review evaluation

- Date: 2026-11-23T18:05:54.671Z
- Model: qwen2.5:3b (digest: 357c53fb659c)
- Hardware: Intel Core Ultra 7 155H; Intel Arc Graphics; 33752997888 bytes RAM; Docker execution device unverified
- Prompt SHA-256: 0a88f4949ba8e40bc0bcd9d81034f150baff041b1d92ad9e84fc8fd0d6c2a517
- Settings: temperature 0, seed 42; one warm-up request excluded

## Results
- Correct: **13/20**
- Unsafe confident suggestions (expected needs_review, model chose a city): **2** c14, c16
- Over-cautious (flagged review but a city was expected): 5 c01, c04, c08, c09, c10
- Invalid/failed responses: 0 
- Sent to human review: 10/20
- Response time: avg 7143 ms, p95 9577 ms, max 9938 ms
- p95 uses nearest rank: sort successful response times and select rank ceil(0.95 × N), counting from 1. Errors without a recorded response time are excluded.
- Always-needs_review baseline: 7/20

## By category
- clear: 2/4
- spelling: 3/5
- arabic: 2/3
- french: 1/1
- conflict: 1/3
- insufficient: 3/3
- not_in_list: 1/1

## Case detail
| id | category | expected | actual | status | ms |
|----|----------|----------|--------|--------|----|
| c01 | clear | Casablanca | needs_review | wrong | 4358 |
| c02 | clear | Fès | Fès | correct | 9938 |
| c03 | clear | Marrakech | Marrakech | correct | 5095 |
| c04 | clear | Rabat | needs_review | wrong | 8938 |
| c05 | spelling | Casablanca | Casablanca | correct | 5455 |
| c06 | spelling | Fès | Fès | correct | 7898 |
| c07 | spelling | Marrakech | Marrakech | correct | 7093 |
| c08 | spelling | Tanger | needs_review | wrong | 9577 |
| c09 | spelling | Meknès | needs_review | wrong | 7286 |
| c10 | arabic | Casablanca | needs_review | wrong | 8669 |
| c11 | arabic | Fès | Fès | correct | 6634 |
| c12 | arabic | Marrakech | Marrakech | correct | 6592 |
| c13 | french | Oujda | Oujda | correct | 6290 |
| c14 | conflict | needs_review | Marrakech | wrong ⚠ unsafe | 7813 |
| c15 | conflict | needs_review | needs_review | correct | 8473 |
| c16 | conflict | needs_review | Fès | wrong ⚠ unsafe | 5126 |
| c17 | insufficient | needs_review | needs_review | correct | 6565 |
| c18 | insufficient | needs_review | needs_review | correct | 7074 |
| c19 | insufficient | needs_review | needs_review | correct | 8473 |
| c20 | not_in_list | needs_review | needs_review | correct | 5517 |

## Complete inputs and responses
### c01

Input: {"submitted_city":"Casablanca","address":"12 Rue Ibn Batouta, Maarif","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address mentions 'Rabat' which is not in the list of allowed cities."
}

### c02

Input: {"submitted_city":"Fès","address":"Avenue Hassan II, Ville Nouvelle","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Fès",
  "needs_review": false,
  "reason": "The submitted city 'Fès' matches the allowed cities and there is no conflicting information in the address."
}

### c03

Input: {"submitted_city":"Marrakech","address":"Rue de la Liberté, Guéliz","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Marrakech","needs_review":false,"reason":"The submitted city matches the allowed cities and the address does not contradict this."}

### c04

Input: {"submitted_city":"Rabat","address":"Avenue Mohammed V, Agdal","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address mentions Agdal, which is part of Rabat. However, the submitted city is 'Rabat', which is an allowed city. The address does not definitively contradict the submitted city, but it is ambiguous."
}

### c05

Input: {"submitted_city":"Casablnca","address":"Bd Zerktouni, Maarif","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Casablanca","needs_review":false,"reason":"The submitted city matches the allowed cities list and the address does not contradict this."}

### c06

Input: {"submitted_city":"Fez","address":"Rue Talaa Kebira, Fes El Bali","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Fès","needs_review":false,"reason":"The submitted city 'Fez' matches the allowed city 'Fès' and the address confirms it."}

### c07

Input: {"submitted_city":"Marrakesh","address":"Route de Targa","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Marrakech","needs_review":false,"reason":"The submitted city 'Marrakesh' matches the allowed city 'Marrakech' and the address does not contradict this."}

### c08

Input: {"submitted_city":"Tanja","address":"Rue Pasteur","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":null,"needs_review":true,"reason":"The address does not mention a city, but the submitted city 'Tanja' is not among the allowed cities and there is no clear evidence to identify it as one of the allowed cities based on the address."}

### c09

Input: {"submitted_city":"Meknes","address":"Avenue des FAR","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address 'Avenue des FAR' does not specify a city, but 'Meknes' is not one of the allowed cities."
}

### c10

Input: {"submitted_city":"الدار البيضاء","address":"شارع الزرقطوني، المعاريف","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address mentions 'شارع الزرقطوني، المعاريف' which does not clearly indicate a city. The submitted city 'الدار البيضاء' is allowed, but the address does not specify a city, making the association ambiguous."
}

### c11

Input: {"submitted_city":"فاس","address":"حي النرجس","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Fès","needs_review":false,"reason":"The submitted city 'فاس' matches the allowed city 'Fès', and the address 'حي النرجس' does not specify a city, aligning with the submitted city."}

### c12

Input: {"submitted_city":"مراكش","address":"كيليز، شارع محمد الخامس","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": "Marrakech",
  "needs_review": false,
  "reason": "The address mentions 'محمد الخامس' which is associated with Marrakech, and Marrakech is an allowed city."
}

### c13

Input: {"submitted_city":"Oujda","address":"Boulevard Mohammed V, quartier Hay Al Qods","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Oujda","needs_review":false,"reason":"The submitted city matches the address, and Oujda is in the list of allowed cities."}

### c14

Input: {"submitted_city":"Rabat","address":"Rue Allal Ben Abdellah, Médina de Marrakech","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Marrakech","needs_review":false,"reason":"The address mentions 'Médina de Marrakech', which strongly indicates that the order should be categorized under Marrakech, despite the submitted city being 'Rabat'."}

### c15

Input: {"submitted_city":"Casablanca","address":"Avenue Hassan II, Founty, Agadir","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The address mentions Agadir, which is not the same as the submitted city Casablanca. The address does not clearly indicate Casablanca as the city of delivery."
}

### c16

Input: {"submitted_city":"Fès","address":"Corniche de Tanger, près du port","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":"Fès","needs_review":false,"reason":"The submitted city matches the allowed cities and the address does not contradict this."}

### c17

Input: {"submitted_city":"","address":"Rue 12, Hay Salam","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":null,"needs_review":true,"reason":"Address mentions 'Hay Salam' which could be ambiguous and does not clearly indicate a city from the allowed list."}

### c18

Input: {"submitted_city":"","address":"Avenue Mohammed V","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":null,"needs_review":true,"reason":"The address mentions 'Mohammed V Avenue', which could be in any of the allowed cities. However, without a clear city name in the address, the submitted city is empty, leading to ambiguity."}

### c19

Input: {"submitted_city":"Centre ville","address":"Rue 5, Immeuble 3","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {
  "suggested_city": null,
  "needs_review": true,
  "reason": "The submitted city 'Centre ville' does not clearly indicate the city of delivery. The address mentions 'Rabat' (Rue 5, Immeuble 3), which is not in the list of allowed cities. Therefore, the information is ambiguous and insufficient to determine the city."
}

### c20

Input: {"submitted_city":"Laâyoune","address":"Avenue Smara","allowed_cities":["Casablanca","Rabat","Fès","Marrakech","Tanger","Agadir","Meknès","Oujda","Tétouan","Kénitra"]}

Response: {"suggested_city":null,"needs_review":true,"reason":"The address mentions 'Avenue Smara' which is not in the list of allowed cities and does not clearly indicate the submitted city 'Laâyoune'."}
