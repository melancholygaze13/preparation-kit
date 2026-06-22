---
title: "String and Unicode Model: Interview Questions"
domain: "Swift"
topic: "Strings and Characters"
concept: "String and Unicode Model"
page_type: interview
interview_priority: high
estimated_read_minutes: 5
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - strings
  - unicode
  - grapheme-clusters
  - text-encoding
---

# String and Unicode Model: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does a Swift `Character` represent?](#q1-character-model) | Senior | Grapheme clusters, scalars, and code units |
| [What does Swift string equality guarantee?](#q2-string-equality) | Senior | Canonical equivalence and policy limits |
| [How do you choose between `Character`, UTF-8, UTF-16, and scalar views?](#q3-text-view-selection) | Senior | Boundary-driven representation |

---

<a id="q1-character-model"></a>
## Q1: What Does a Swift `Character` Represent?

### Short Answer

A Swift `Character` is one Unicode extended grapheme cluster. It can contain one
scalar or a sequence such as a base plus combining marks, an emoji joined
sequence, or a flag. UTF-8 bytes, UTF-16 code units, Unicode scalars, and
`Character` values therefore have different counts and boundaries. Choose the
unit from the operation's contract.

### Expanded Answer

```swift
let family = "👨‍👩‍👧‍👦"

family.count                // 1 Character
family.unicodeScalars.count // Multiple scalars
family.utf8.count           // Multiple bytes
```

Swift segments the string according to Unicode extended grapheme cluster rules.
That model supports user-perceived iteration, but `Character` still isn't a
display-width unit; font shaping and rendering context determine visual width.

Because segmentation is variable-width and contextual, character counting and
offset movement can require traversal. Algorithms should iterate once instead of
repeatedly treating positions as cheap integer arithmetic.

### Trade-offs

- `Character` boundaries are appropriate for many editing operations.
- Scalar access is necessary for some Unicode algorithms but splits clusters.
- Encoded units match storage protocols but can split both scalars and clusters.

### Example

A profile service limits a display name. The product specifies a server-enforced
UTF-8 byte maximum for storage and a separate UI guideline. The client validates
the byte limit without claiming it equals visible characters or rendered width.

---

<a id="q2-string-equality"></a>
## Q2: What Does Swift String Equality Guarantee?

### Short Answer

Swift `String` and `Character` equality uses Unicode canonical equivalence, so
precomposed and canonically equivalent decomposed forms compare equal. It isn't
locale-sensitive and doesn't automatically provide case-insensitive comparison,
search collation, or confusable protection. Those require an explicit domain and
often Foundation policy.

### Expanded Answer

```swift
let precomposed = "caf\u{E9}"
let decomposed = "caf\u{65}\u{301}"

precondition(precomposed == decomposed)
```

This prevents storage representation from changing basic textual equality for
canonically equivalent content. It doesn't make Latin `A` equal to visually
similar Cyrillic `А`, and it doesn't decide whether `I` and `i` should match in a
particular locale.

Domain identifiers need a documented normalization, case, script, and allowed-
character policy shared with the authority that stores or authenticates them.
User-facing search and sorting need locale-aware APIs and product expectations.

### Trade-offs

- Standard equality is deterministic and Unicode-aware without locale context.
- Locale-aware comparison better matches users but can vary by locale and purpose.
- Restrictive identifier profiles reduce spoofing risk but limit accepted names.

### Example

A client lowercases usernames locally before login, while the server uses a
different Unicode policy. Users can create collisions or fail authentication.
The fix is a server-owned canonical identifier contract, not another client-only
string comparison.

---

<a id="q3-text-view-selection"></a>
## Q3: How Do You Choose Between `Character`, UTF-8, UTF-16, and Scalar Views?

### Short Answer

Use `Character` for user-visible graphemes and `unicodeScalars` for scalar-based
algorithms. Use UTF-8 or UTF-16 only when an external contract specifies that
encoding, such as a byte protocol or Cocoa range.
Keep malformed external input as bytes until applying an explicit reject-or-
repair decoding policy.

### Expanded Answer

Each view is a collection over the same text but exposes different elements.
Offsets are not portable between them. A UTF-16 range received from Foundation
must be converted relative to the exact Swift string; applying its integers as
character or UTF-8 offsets is invalid.

For network input, decoding policy is part of correctness. Replacement characters
may be acceptable for display-only content but can destroy evidence or change
meaning for signed payloads, paths, and identifiers. Those boundaries should
reject malformed input or validate bytes before textual interpretation.

### Trade-offs

- Higher-level character processing preserves grapheme boundaries but doesn't
  match byte protocols.
- UTF-8 is compact and interoperable but byte slicing needs boundary validation.
- UTF-16 eases Cocoa interop but creates unit-conversion risk in native Swift code.

### Example

A regex API returns an `NSRange`. The adapter converts that UTF-16 range with the
original `String`, immediately exposes a native `Range<String.Index>`, and rejects
failed conversions. The rest of the feature never handles raw integer offsets.
