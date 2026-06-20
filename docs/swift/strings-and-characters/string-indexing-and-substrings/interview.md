---
title: "String Indexing and Substrings: Interview Questions"
domain: "Swift"
topic: "Strings and Characters"
concept: "String Indexing and Substrings"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
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
| [How would you design persistent text positions?](#q5-persistent-positions) | Staff | Units, versions, edits, and migration |

---

<a id="q1-string-index"></a>
## Q1: Why Can't Swift Strings Be Subscripted With Integer Offsets?

### What It Evaluates

Whether the candidate connects Unicode segmentation to API and complexity design.

### Short Answer

Swift strings contain variable-width extended grapheme clusters, so an integer
doesn't inherently identify a valid character boundary or promise constant-time
access. Use `String.Index`, direct iteration, searches returning indices, and
bounded index movement. `endIndex` is an exclusive boundary, not an element.

### Detailed Answer

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

### Engineering Trade-offs

- Native indices preserve Unicode correctness but aren't portable integers.
- Direct iteration is efficient and general but offers less random-access syntax.
- Byte processing is appropriate for byte protocols but changes the abstraction.

### Production Scenario

A mention parser loops over every integer from zero to `text.count`, deriving each
index from `startIndex`. It becomes slow on long messages. A single-pass state
machine over `text.indices` preserves grapheme boundaries and linear traversal.

### Follow-up Questions

- Can `endIndex` be subscripted?
- Is advancing a string index constant time?
- When should parsing happen over UTF-8 bytes instead?

### Strong Answer Signals

- Explains validity and complexity, not only syntax.
- Recommends single-pass traversal and bounded movement.
- Selects byte parsing only for a byte-defined grammar.

### Weak Answer Signals

- Says Swift omitted integer subscripting for style.
- Uses `Array(text)` as a universal fix without discussing allocation.
- Assumes `count` plus integer offsets gives random access.

### Related Theory

- [Why Strings Don't Use Integer Subscripts](theory.md#why-strings-dont-use-integer-subscripts)
- [Performance](theory.md#performance)

---

<a id="q2-index-validity"></a>
## Q2: When Do String Indices Become Invalid?

### What It Evaluates

Reasoning about content-relative positions, mutation, concurrency, and stale
snapshots.

### Short Answer

A `String.Index` is valid only for compatible positions in the string content and
view it came from. Treat saved indices and ranges as invalid after mutation,
especially because combining content can change adjacent grapheme boundaries.
Don't persist or transfer native indices independently. Keep positions with an
immutable string snapshot or use a defined offset plus content version.

### Detailed Answer

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

### Engineering Trade-offs

- Snapshot-local indices are simple and safe but snapshots become stale.
- Versioned encoded offsets can cross processes but require checked conversion.
- Edit-aware anchors preserve intent across changes at substantial model cost.

### Production Scenario

A background task finds a highlight range, then applies it after the document has
changed. The feature attaches the document generation to the result and discards
or rebases the range when the current generation differs.

### Follow-up Questions

- Can appending text affect an earlier grapheme boundary?
- How would you move positions across actor boundaries?
- What should happen when the document version changes?

### Strong Answer Signals

- Connects mutation to Unicode segmentation.
- Identifies time-of-check/time-of-use risk.
- Requires a versioned model for persistent positions.

### Weak Answer Signals

- Persists a native `String.Index` directly.
- Assumes append-only mutation preserves every saved index.
- Validates against one snapshot and applies to another without rechecking.

### Related Theory

- [Index Validity and Mutation](theory.md#index-validity-and-mutation)
- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q3-substring-ownership"></a>
## Q3: When Should a `Substring` Become a `String`?

### What It Evaluates

Understanding of temporary views, copy timing, retained storage, and API ownership.

### Short Answer

Keep a `Substring` while performing short-lived parsing or transformation because
it can reuse source storage. Convert to `String` when the result enters a model,
cache, async job, or API that promises durable independent text ownership. A tiny
substring can retain a large source; conversion pays a copy to release that
storage relationship.

### Detailed Answer

Range subscripting and methods such as `prefix` return `Substring`. It supports
most string operations, so parsers can pass slices through several stages without
allocating at every boundary.

The optimization becomes a memory cost when a long-lived object stores one small
token from a large payload. `String(token)` creates an owned result with an
explicit lifetime contract. Converting every intermediate slice is also wrong in
many pipelines because it adds avoidable allocation and copying.

APIs generic over `StringProtocol` can accept either type for read-only work, but
that abstraction doesn't decide whether a result should retain input storage.

### Engineering Trade-offs

- Substrings reduce immediate copies but can increase retained memory.
- Owned strings cost allocation but simplify long-term lifetime.
- `StringProtocol` improves input flexibility but can complicate API signatures
  and doesn't replace ownership decisions.

### Production Scenario

A CSV importer caches identifiers as substrings of each multi-megabyte line
buffer. Memory grows despite tiny logical records. Converting identifiers to
`String` at model construction releases the input buffers after parsing.

### Follow-up Questions

- Does `Substring` always copy its characters?
- Should every function accept `StringProtocol`?
- How would you diagnose retained source storage?

### Strong Answer Signals

- Makes conversion at a durable ownership boundary.
- Balances allocation against retained memory.
- Avoids turning `StringProtocol` into a blanket style rule.

### Weak Answer Signals

- Stores substrings indefinitely without considering the source.
- Converts every slice immediately without measuring.
- Claims value semantics guarantee independent substring storage.

### Related Theory

- [Substring Ownership and Retained Storage](theory.md#substring-ownership-and-retained-storage)

---

<a id="q4-nsrange-interop"></a>
## Q4: How Should Native Swift Ranges Interoperate With `NSRange`?

### What It Evaluates

Knowledge of UTF-16 conventions, validated conversion, and adapter boundaries.

### Short Answer

Treat Foundation `NSRange` values as UTF-16-based when the API documents that
contract. Convert with `NSRange(swiftRange, in: string)` and the failable
`Range(nsRange, in: string)` using the exact unchanged string. Handle conversion
failure. Don't reinterpret `location` and `length` as character or UTF-8 offsets.

### Detailed Answer

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

### Engineering Trade-offs

- Boundary conversion preserves native correctness but requires failure handling.
- Exposing `NSRange` everywhere avoids adapters but spreads unit confusion.
- Returning semantic matches hides range details but may reduce caller flexibility.

### Production Scenario

A text detector returns UTF-16 ranges. One adapter converts every range against
the detector's exact input snapshot, rejects invalid results with metrics, and
passes typed matches to the UI. The UI never performs manual integer arithmetic.

### Follow-up Questions

- Why is conversion failable?
- Can the range be reused after text mutation?
- Where should conversion live architecturally?

### Strong Answer Signals

- Identifies UTF-16 units and exact-string coupling.
- Handles invalid boundaries and stale content.
- Confines legacy representation to an adapter.

### Weak Answer Signals

- Uses `location` directly with `String.Index`.
- Force-unwraps conversions from external APIs.
- Passes raw `NSRange` through every Swift layer.

### Related Theory

- [Foundation NSRange Interoperability](theory.md#foundation-nsrange-interoperability)

---

<a id="q5-persistent-positions"></a>
## Q5: How Would You Design Persistent Text Positions?

### What It Evaluates

Staff-level judgment about coordinate systems, document versions, editing, and
cross-platform compatibility.

### Short Answer

Define the coordinate unit, endpoint convention, source document identity and
version, valid-boundary rules, and how edits rebase or invalidate positions. Use
checked platform adapters and shared Unicode fixtures. Version any unit migration;
UTF-8, UTF-16, scalar, and grapheme offsets can't be numerically reinterpreted.

### Detailed Answer

Persistent highlights or annotations need more than `(location, length)`. The
schema must state whether positions count UTF-8 bytes, UTF-16 units, scalars, or
graphemes and whether the end is exclusive. It must bind positions to a document
revision.

For immutable content, a versioned offset range can be sufficient. Editable or
collaborative documents need an edit log, operational transformation, CRDT
anchors, or another domain model that defines how positions move. Raw Swift
indices are unsuitable across launches and platforms.

A unit migration requires conversion against the original content version. Shared
fixtures must include combining sequences, surrogate pairs, emoji sequences, and
positions at valid and invalid boundaries.

### Engineering Trade-offs

- Byte offsets are stable for exact encoded content but unfriendly for user edits.
- Grapheme offsets align with many UI actions but are costly to derive and can
  shift as segmentation changes.
- Edit-aware anchors preserve intent but add storage and algorithmic complexity.

### Production Scenario

An annotation service stores UTF-16 ranges from iOS, while a web client uses UTF-8
offsets. The service standardizes a versioned coordinate system, converts with the
referenced document snapshot, publishes cross-platform fixtures, and migrates old
annotations in batches with invalid-range metrics and rollback.

### Follow-up Questions

- Which unit would you choose for immutable versus editable content?
- How are positions handled after an edit?
- How do you migrate existing ranges safely?

### Strong Answer Signals

- Defines units, endpoints, versions, boundaries, and edit semantics.
- Includes shared fixtures, migration evidence, and rollback.
- Rejects native in-memory indices as wire formats.

### Weak Answer Signals

- Stores an undocumented pair of integers.
- Converts offsets without the original content.
- Assumes one platform's native coordinate system is universal.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
