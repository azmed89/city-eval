# Baseline review: proposed safeguards

These are proposals for a later evaluation; the current run measures the model
without preprocessing or a conflict override.

## Explicit aliases

For an exact, normalized submitted-city field, consider these reviewed mappings:

| Case | Input | Canonical city | Evidence |
| --- | --- | --- | --- |
| c08 | Tanja | Tanger | [Academic reference](https://escholarship.org/content/qt8rz6317r/qt8rz6317r_noSplash_6421ffba8ad9a53dce2502da85e1163b.pdf) identifies Tanja and Tanger as city names. |
| c09 | Meknes | Meknès | [Moroccan statistics authority](https://www.hcp.ma/region-meknes/docs/docs/Annuaire%20Statistique%20Meknes%202023%20%2826dec25%29.pdf) uses both spellings. |
| c10 | الدار البيضاء | Casablanca | [Casablanca city portal](https://www.casablancacity.ma/ar) identifies the city in Arabic and its domain in French. |

Use Unicode normalization, whitespace and case normalization and an explicit
alias table; accept a match only when it maps to exactly one allowed city. Do
not use fuzzy matching or infer a city from the address when no unique match is
available. Alias normalization alone does not resolve conflicting evidence.

## Conflict safeguard

Resolve the entire submitted-city field using verified aliases. Independently
extract verified city names from address components with Unicode-aware word
boundaries. Only treat an address mention as destination evidence when its
position or context is unambiguous, such as a separate final city component or
a verified locality expression. If both sides resolve uniquely to different
cities, force `needs_review`, record both matched spans and do not trust the
model's explanation to determine conflict.

For c14, a reviewed rule for `Médina de Marrakech` can identify Marrakech
against Rabat. For c16, `Corniche de Tanger` can identify Tanger against Fès
only if that expression is verified as a locality rather than a street name.
c15 has Agadir as a final address component against Casablanca. These rules
need their own adversarial cases before use: a city name in a street, business,
route destination, or quoted text is not necessarily the delivery city.
Generic streets and unknown neighborhoods provide no reliable independent city
evidence; multiple mentions or ambiguous aliases should go to human review.
No absence of a detected conflict establishes that the address is correct.
