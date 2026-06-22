---
title: "String Indexing and Substrings: Interview Questions"
domain: "Swift"
topic: "Strings and Characters"
concept: "String Indexing and Substrings"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - string-index
  - substring
  - slicing
  - performance
---

# String Indexing and Substrings: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why can't Swift strings be subscripted with integer offsets?](#q1-string-index) | Senior | Unicode boundaries and complexity |
| [When do string indices become invalid?](#q2-index-validity) | Senior | Mutation, snapshots, and versioning |
| [When should a `Substring` become a `String`?](#q3-substring-ownership) | Senior | Storage retention and ownership |
| [How should native Swift ranges interoperate with `NSRange`?](#q4-nsrange-interop) | Senior | UTF-16 conversion and failure |

---

<a id="q1-string-index"></a>
## Q1: Why Can't Swift Strings Be Subscripted With Integer Offsets?

### Short Answer

Swift strings contain variable-width extended grapheme clusters, so an integer
doesn't inherently identify a valid character boundary or promise constant-time
access. Use `String.Index`, direct iteration, searches returning indices, and
bounded index movement. `endIndex` is an exclusive boundary, not an element.

### Expanded Answer

One `Character` can contain several scalars and many UTF-8 or UTF-16 code units.
Finding the nth character may require traversal and segmentation. Integer
subscripting would hide that cost and invite offsets measured in the wrong unit.

```swift
let text = "A🇯🇵é"
let second = text.index(after: text.startIndex)
precondition(text[second] == "🇯🇵")
```

For sequential work, iterate once. Repeatedly calling
`index(startIndex, offsetBy: n)` for increasing `n` restarts traversal and can turn
a linear task quadratic. When input supplies a count, use limited movement and
handle failure.

### Trade-offs

- Native indices preserve Unicode correctness but aren't portable integers.
- Direct iteration is efficient and general but offers less random-access syntax.
- Byte processing is appropriate for byte protocols but changes the abstraction.

### Example

A mention parser loops over every integer from zero to `text.count`, deriving each
index from `startIndex`. It becomes slow on long messages. A single-pass state
machine over `text.indices` preserves grapheme boundaries and linear traversal.

---

<a id="q2-index-validity"></a>
## Q2: When Do String Indices Become Invalid?

### Short Answer

A `String.Index` is valid only for compatible positions in the string content and
view it came from. Treat saved indices and ranges as invalid after mutation,
especially because combining content can change adjacent grapheme boundaries.
Don't persist or transfer native indices independently. Keep positions with an
immutable string snapshot or use a defined offset plus content version.

### Expanded Answer

Appending a combining mark can merge with the preceding grapheme, so mutation may
change segmentation rather than simply append an indexed element. Re-derive
positions after an edit.

An index validated against one actor-owned string can also become stale before use
if another operation mutates the string. Capture an immutable string value and
derive all indices from that snapshot, or validate and apply the operation inside
the same isolation boundary. If an edit targets current state after slow work,
check a version before committing.

Native indices aren't persistence formats. A database needs a documented unit,
content identity, and version, plus a policy for rebasing positions after edits.

### Trade-offs

- Snapshot-local indices are simple and safe but snapshots become stale.
- Versioned encoded offsets can cross processes but require checked conversion.
- Edit-aware anchors preserve intent across changes at substantial model cost.

### Example

A background task finds a highlight range, then applies it after the document has
changed. The feature attaches the document generation to the result and discards
or rebases the range when the current generation differs.

---

<a id="q3-substring-ownership"></a>
## Q3: When Should a `Substring` Become a `String`?

### Short Answer

Keep a `Substring` while performing short-lived parsing or transformation because
it can reuse source storage. Convert to `String` when the result enters a model,
cache, async job, or API that promises durable independent text ownership. A tiny
substring can retain a large source; conversion pays a copy to release that
storage relationship.

### Expanded Answer

Range subscripting and methods such as `prefix` return `Substring`. It supports
most string operations, so parsers can pass slices through several stages without
allocating at every boundary.

The optimization becomes a memory cost when a long-lived object stores one small
token from a large payload. `String(token)` creates an owned result with an
explicit lifetime contract. Converting every intermediate slice is also wrong in
many pipelines because it adds avoidable allocation and copying.

APIs generic over `StringProtocol` can accept either type for read-only work, but
that abstraction doesn't decide whether a result should retain input storage.

### Trade-offs

- Substrings reduce immediate copies but can increase retained memory.
- Owned strings cost allocation but simplify long-term lifetime.
- `StringProtocol` improves input flexibility but can complicate API signatures
  and doesn't replace ownership decisions.

### Example

A CSV importer caches identifiers as substrings of each multi-megabyte line
buffer. Memory grows despite tiny logical records. Converting identifiers to
`String` at model construction releases the input buffers after parsing.

---

<a id="q4-nsrange-interop"></a>
## Q4: How Should Native Swift Ranges Interoperate With `NSRange`?

### Short Answer

Treat Foundation `NSRange` values as UTF-16-based when the API documents that
contract. Convert with `NSRange(swiftRange, in: string)` and the failable
`Range(nsRange, in: string)` using the exact unchanged string. Handle conversion
failure. Don't reinterpret `location` and `length` as character or UTF-8 offsets.

### Expanded Answer

```swift
import Foundation

let text = "Hi 👋"
let native = text.startIndex..<text.endIndex
let foundation = NSRange(native, in: text)

guard let converted = Range(foundation, in: text) else {
    throw RangeError.invalidBoundary
}
```

Conversion can fail when the integer range is out of bounds or ends at a UTF-16
position that doesn't correspond to valid native string boundaries. The range is
also stale if the text changes between production and conversion.

Keep this impedance mismatch in a Foundation adapter. Native feature code should
receive `Range<String.Index>` or, preferably, the semantic result it needs.

### Trade-offs

- Boundary conversion preserves native correctness but requires failure handling.
- Exposing `NSRange` everywhere avoids adapters but spreads unit confusion.
- Returning semantic matches hides range details but may reduce caller flexibility.

### Example

A text detector returns UTF-16 ranges. One adapter converts every range against
the detector's exact input snapshot, rejects invalid results with metrics, and
passes typed matches to the UI. The UI never performs manual integer arithmetic.
