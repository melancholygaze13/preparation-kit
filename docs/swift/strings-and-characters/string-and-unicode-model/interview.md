---
title: "String and Unicode Model: Interview Questions"
domain: "Swift"
topic: "Strings and Characters"
concept: "String and Unicode Model"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
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
| [How should a system define shared text semantics?](#q4-text-contract) | Staff | Encoding, identity, privacy, and migration |

---

<a id="q1-character-model"></a>
## Q1: What Does a Swift `Character` Represent?

### What It Evaluates

Whether the candidate distinguishes user-perceived characters from Unicode
scalars and encoded code units.

### Short Answer

A Swift `Character` is one Unicode extended grapheme cluster. It can contain one
scalar or a sequence such as a base plus combining marks, an emoji joined
sequence, or a flag. UTF-8 bytes, UTF-16 code units, Unicode scalars, and
`Character` values therefore have different counts and boundaries. Choose the
unit from the operation's contract.

### Detailed Answer

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

### Engineering Trade-offs

- `Character` boundaries are appropriate for many editing operations.
- Scalar access is necessary for some Unicode algorithms but splits clusters.
- Encoded units match storage protocols but can split both scalars and clusters.

### Production Scenario

A profile service limits a display name. The product specifies a server-enforced
UTF-8 byte maximum for storage and a separate UI guideline. The client validates
the byte limit without claiming it equals visible characters or rendered width.

### Follow-up Questions

- Can one `Character` contain several scalars?
- Is `String.count` a display-width measurement?
- Why might concatenation affect grapheme segmentation?

### Strong Answer Signals

- Names extended grapheme clusters precisely.
- Separates four text layers and their counts.
- Connects units to storage, UI, and performance consequences.

### Weak Answer Signals

- Defines `Character` as one byte or Unicode scalar.
- Uses character count as pixel width.
- Assumes ASCII examples prove multilingual correctness.

### Related Theory

- [Extended Grapheme Clusters and Character](theory.md#extended-grapheme-clusters-and-character)

---

<a id="q2-string-equality"></a>
## Q2: What Does Swift String Equality Guarantee?

### What It Evaluates

Understanding of canonical equivalence and the additional policy needed for
localized or security-sensitive matching.

### Short Answer

Swift `String` and `Character` equality uses Unicode canonical equivalence, so
precomposed and canonically equivalent decomposed forms compare equal. It isn't
locale-sensitive and doesn't automatically provide case-insensitive comparison,
search collation, or confusable protection. Those require an explicit domain and
often Foundation policy.

### Detailed Answer

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

### Engineering Trade-offs

- Standard equality is deterministic and Unicode-aware without locale context.
- Locale-aware comparison better matches users but can vary by locale and purpose.
- Restrictive identifier profiles reduce spoofing risk but limit accepted names.

### Production Scenario

A client lowercases usernames locally before login, while the server uses a
different Unicode policy. Users can create collisions or fail authentication.
The fix is a server-owned canonical identifier contract, not another client-only
string comparison.

### Follow-up Questions

- Is Swift equality locale-sensitive?
- Does canonical equivalence prevent homograph attacks?
- Should display names and login identifiers use the same policy?

### Strong Answer Signals

- States both the guarantee and its limits.
- Separates display text, search, and security identifiers.
- Requires cross-system agreement for identity.

### Weak Answer Signals

- Claims visually identical strings always compare equal.
- Applies naive lowercasing as a universal normalization rule.
- Treats display-name freedom and authentication identity identically.

### Related Theory

- [Equality and Canonical Equivalence](theory.md#equality-and-canonical-equivalence)

---

<a id="q3-text-view-selection"></a>
## Q3: How Do You Choose Between `Character`, UTF-8, UTF-16, and Scalar Views?

### What It Evaluates

Ability to select a representation from the consuming boundary instead of using
one unit universally.

### Short Answer

Use `Character` for extended-grapheme operations, `unicodeScalars` for algorithms
defined over Unicode scalars, UTF-8 for byte-oriented protocols that specify it,
and UTF-16 for contracts such as Cocoa ranges that explicitly use UTF-16 units.
Keep malformed external input as bytes until applying an explicit reject-or-
repair decoding policy.

### Detailed Answer

Each view is a collection over the same text but exposes different elements.
Offsets are not portable between them. A UTF-16 range received from Foundation
must be converted relative to the exact Swift string; applying its integers as
character or UTF-8 offsets is invalid.

For network input, decoding policy is part of correctness. Replacement characters
may be acceptable for display-only content but can destroy evidence or change
meaning for signed payloads, paths, and identifiers. Those boundaries should
reject malformed input or validate bytes before textual interpretation.

### Engineering Trade-offs

- Higher-level character processing preserves grapheme boundaries but doesn't
  match byte protocols.
- UTF-8 is compact and interoperable but byte slicing needs boundary validation.
- UTF-16 eases Cocoa interop but creates unit-conversion risk in native Swift code.

### Production Scenario

A regex API returns an `NSRange`. The adapter converts that UTF-16 range with the
original `String`, immediately exposes a native `Range<String.Index>`, and rejects
failed conversions. The rest of the feature never handles raw integer offsets.

### Follow-up Questions

- Can a UTF-16 offset be used as a Swift character offset?
- When is replacement-character decoding unsafe?
- Which representation should a wire protocol document?

### Strong Answer Signals

- Makes the boundary contract authoritative.
- Treats offset conversion as validated and string-relative.
- Defines malformed-input behavior explicitly.

### Weak Answer Signals

- Chooses UTF-16 because iOS uses it everywhere.
- Treats offsets from different views as equivalent.
- Silently repairs security-sensitive input.

### Related Theory

- [Unicode Representations](theory.md#unicode-representations)

---

<a id="q4-text-contract"></a>
## Q4: How Should a System Define Shared Text Semantics?

### What It Evaluates

Staff-level reasoning about distributed text identity, storage, privacy, and
migration.

### Short Answer

Define encoding, malformed-input behavior, length unit and maximum, normalization,
case and locale rules, allowed characters, equality and ordering, storage/wire
representation, and privacy classification. Give the contract one owner and
cross-platform fixtures. Version policy changes and plan reindexing or dual-read
migration because they can change identity and lookup results.

### Detailed Answer

“A string” is not a complete schema. Services and clients can disagree about byte
limits, normalization, case folding, or whether invalid input is repaired. These
differences affect authentication, deduplication, search, caches, and signatures.

The schema should distinguish display text from identifiers and machine tokens.
It should provide non-ASCII, canonically equivalent, confusable, maximum-size, and
malformed-input fixtures. Logs and analytics need an explicit privacy policy;
text accepted by the product isn't automatically safe to record.

A Unicode or normalization-policy change can alter stored keys. Shadow comparison,
collision analysis, backfill, dual lookup, staged rollout, and rollback may all be
needed.

### Engineering Trade-offs

- Central policy improves consistency but requires coordinated releases.
- Strict validation reduces ambiguity and risk but can reject legitimate display
  text if applied indiscriminately.
- Persisting canonical and display forms supports identity plus presentation at
  additional storage and migration cost.

### Production Scenario

Search results differ across platforms because each client normalizes queries
differently. The organization moves query normalization into a versioned search
contract, publishes shared fixtures, rebuilds the index under the new policy, and
keeps old and new query paths available during rollout.

### Follow-up Questions

- Which text fields need restrictive identifier rules?
- How do you detect collisions before normalization changes?
- What text is safe to log?

### Strong Answer Signals

- Covers schema, ownership, cross-platform tests, migration, and privacy.
- Separates display, search, and identity policies.
- Treats Unicode policy changes as data changes.

### Weak Answer Signals

- Defines only a database column type.
- Pushes canonicalization independently to every client.
- Reindexes without collision analysis or rollback.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
