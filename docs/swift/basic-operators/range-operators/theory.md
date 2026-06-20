---
title: "Range Operators: Theory"
domain: "Swift"
topic: "Basic Operators"
concept: "Range Operators"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - ranges
  - collection-indices
  - slicing
  - boundaries
---

# Range Operators: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `a...b` includes both bounds, `a..<b` excludes the upper bound, and one-sided
> forms defer a missing boundary to the consuming context. A valid numeric range
> is not automatically a valid collection subscript.

- Prefer half-open ranges for offsets and slices because adjacent ranges compose
  without overlap and `lower == upper` represents empty.
- A collection's indices aren't generally integers, zero-based, or interchangeable
  with indices from another collection.
- `collection[range]` returns the collection's subsequence, which can retain the
  original storage and indices.
- One-sided ranges are bounded by a collection subscript, but some standalone
  forms are unbounded and unsafe to iterate without an explicit stop.
- Validate decoded boundaries before arithmetic; converting an inclusive end with
  `end + 1` can overflow.

## Mental Model

A range expresses a set or interval of comparable bounds. The consumer gives the
range operational meaning:

- A loop may enumerate discrete values.
- `contains` tests interval membership.
- A collection subscript interprets bounds in that collection's index space.
- A slice represents a view over part of existing storage.

Separate three questions:

1. Does the range itself have valid ordering?
2. Are its bounds valid for this consumer?
3. Can any arithmetic used to derive the bounds overflow or lose meaning?

Passing the first check doesn't prove the other two.

## How It Works

### Closed Ranges

`a...b` creates a `ClosedRange` that contains both `a` and `b`:

```swift
let supportedVersions = 3...5
supportedVersions.contains(5) // true
```

The lower bound must not be greater than the upper bound. Equal bounds form a
single-element closed range, not an empty range.

Closed ranges fit domains whose specification is naturally inclusive: supported
versions, a score band, or a calendar interval with defined endpoint semantics.
They are less convenient for empty slices and adjacency because `1...3` and
`3...5` overlap at `3`.

### Half-Open Ranges

`a..<b` creates a `Range` that includes `a` and excludes `b`:

```swift
let firstPage = 0..<20
let secondPage = 20..<40
```

The lower bound must not be greater than the upper bound. Equal bounds produce an
empty range. Half-open intervals compose directly: the upper bound of one segment
can be the lower bound of the next without overlap or a gap.

They align with collection boundaries because `startIndex..<endIndex` represents
all valid positions while `endIndex` remains a boundary that can't be
subscripted.

### One-Sided Ranges

One-sided forms omit a boundary:

| Syntax | Type | Included boundary |
|---|---|---|
| `start...` | `PartialRangeFrom` | Includes `start` |
| `...end` | `PartialRangeThrough` | Includes `end` |
| `..<end` | `PartialRangeUpTo` | Excludes `end` |

In a collection subscript, the collection supplies the missing boundary:

```swift
let names = ["Ana", "Bo", "Cy", "Dee"]

let suffix = names[2...]  // "Cy", "Dee"
let prefix = names[..<2]  // "Ana", "Bo"
let through = names[...2] // "Ana", "Bo", "Cy"
```

Outside a bounded consumer, one-sided ranges require care. A range with no lower
bound has no starting point for forward iteration. A range with no upper bound
can continue indefinitely for an iterable bound type, so a loop needs an explicit
termination condition and must account for the bound type's limits.

### Ranges and Collection Indices

An integer range isn't a universal collection range. `Collection` requires an
associated `Index` type; it doesn't promise `Int`, zero-based indices, or constant-
time offset movement.

Generic collection code should use the collection's own indices:

```swift
func firstTwo<C: Collection>(_ collection: C) -> C.SubSequence {
    let end = collection.index(
        collection.startIndex,
        offsetBy: 2,
        limitedBy: collection.endIndex
    ) ?? collection.endIndex

    return collection[collection.startIndex..<end]
}
```

An index is meaningful only for the collection and version that produced it.
Using an index from a different collection or after an invalidating mutation can
trap or violate API preconditions.

`String.Index` is the canonical example: character boundaries aren't integer
offsets, and moving an index can require traversal. Use string index APIs rather
than converting a character position into an integer subscript.

### Slices Preserve Index Space

Range subscripting returns `SubSequence`, such as `ArraySlice<Element>` for an
array. A slice typically retains the original collection's indices:

```swift
let values = [10, 20, 30, 40]
let slice = values[1..<3]

slice.startIndex // 1, not necessarily 0
slice[1]         // 20
```

Don't pass a slice to code that assumes zero-based indexing. Iterate it, use its
own `indices`, or create an `Array(slice)` when an independent zero-based array is
part of the required contract.

A slice can share and retain the base collection's storage. Keeping a tiny slice
alive may therefore keep a large buffer alive. Conversion to an owning collection
costs allocation and copying but can release the large base storage and establish
the desired index semantics.

### Boundary and Overflow Considerations

External protocols often describe intervals as `(offset, length)` or inclusive
`(start, end)`. Validate before constructing a collection subscript.

For an offset and length, avoid computing `offset + length` before proving it is
representable and within capacity:

```swift
func checkedRange(
    offset: Int,
    length: Int,
    capacity: Int
) -> Range<Int>? {
    guard offset >= 0, length >= 0, capacity >= 0 else { return nil }
    guard offset <= capacity else { return nil }
    guard length <= capacity - offset else { return nil }
    return offset..<(offset + length)
}
```

The subtraction is safe only after proving `offset <= capacity`. The final
addition is then proven within `0...capacity`.

Don't convert an inclusive upper bound into a half-open bound with `upper + 1`
unless the domain has a valid successor and overflow has been ruled out. Retain a
closed range, use index navigation, or validate the successor explicitly.

### Core Invariants

- A closed range includes both bounds; equal bounds contain one value.
- A half-open range excludes its upper bound; equal bounds are empty.
- Range bounds must be ordered when constructing bounded ranges.
- `endIndex` is a boundary and isn't a valid element subscript.
- Collection range bounds must belong to the collection's valid index space.
- Slices preserve subsequence semantics; they don't promise independent storage
  or rebased indices.

### Constraints and Guarantees

- A range's bound type and operator form determine its concrete range type.
- Range construction doesn't validate a range against an unrelated collection.
- Range syntax doesn't guarantee cheap iteration, subscripting, or index movement.
- One-sided collection subscripts use the collection to resolve the missing bound.
- Index validity across mutation depends on the collection's documented contract.
- Integer arithmetic used to derive a range retains ordinary overflow behavior.

## Failure Modes

- **Using `0..<count` in generic collection code:** Assumes integer, zero-based
  indices that `Collection` doesn't guarantee.
- **Subscripting `endIndex`:** Treats an exclusive boundary as an element index
  and traps.
- **Applying a foreign or stale index:** Uses a position from another collection
  or before an invalidating mutation.
- **Assuming a slice starts at zero:** Produces invalid subscripts or incorrect
  position reporting.
- **Retaining a tiny slice indefinitely:** Keeps a much larger base buffer alive.
- **Constructing an inverted range:** Violates the range ordering precondition.
- **Adding one to an inclusive endpoint:** Overflows at the maximum value or
  invents a successor the domain doesn't define.
- **Adding offset and length before validation:** Traps on hostile or corrupt
  input.
- **Iterating an unbounded range without a stop:** Creates nontermination or
  eventual bound failure.
- **Slicing mutable shared state after validation elsewhere:** The collection can
  change between checking bounds and applying them.

## Engineering Judgment

### When to Use It

- Use closed ranges when both domain endpoints are intentionally included.
- Use half-open ranges for offsets, pagination, partitioning, and collection
  boundaries.
- Use one-sided ranges when the consuming collection naturally supplies one end.
- Preserve native collection indices in generic algorithms.
- Convert a slice to an owning collection when independent storage or rebased
  indices are required.

### When Not to Use It

- Don't use an integer range as a substitute for arbitrary collection indices.
- Don't use a closed range merely to include the “last index”; prefer the
  collection's `endIndex` boundary with half-open slicing.
- Don't construct ranges directly from untrusted offsets before proving ordering,
  representability, and capacity.
- Don't expose a raw range when the domain needs units, normalization, circular
  behavior, or open/closed endpoints chosen at runtime.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Closed range | Mirrors inclusive specifications | Awkward empty and adjacent segments | Inclusive domain bounds |
| Half-open range | Empty-friendly and composable | Requires care translating inclusive protocols | Slices, offsets, pagination |
| One-sided range | Concise relative-to-boundary slicing | Meaning depends on consumer; may be unbounded alone | Prefixes and suffixes |
| Retained slice | Often avoids immediate copying | Preserves indices and may retain large storage | Short-lived local views |
| Owning collection copy | Independent storage and expected index base | Allocation and element copy | Long-lived or API-boundary results |

### Alternatives

- Use `collection.indices`, `index(_:offsetBy:limitedBy:)`, or iteration instead
  of integer offsets.
- Use `stride` when the step is part of the requirement rather than assuming a
  range's unit advancement.
- Use a validated domain interval type for byte ranges, timestamps, or protocol
  fields with explicit units and endpoint rules.
- Use a circular-range abstraction when wraparound is real domain behavior; a
  standard ordered range can't represent it directly.

## Production Considerations

### Performance

Range values are compact descriptions, but consuming them can be linear. Index
movement and distance are constant time only for collections with the relevant
random-access guarantees. Unicode-correct `String` traversal is not integer
offset arithmetic.

Slicing can avoid an eager copy, which is useful in pipelines. For long-lived
small results, measure retained memory as well as allocation count; copying a
small result can reduce total memory by releasing a large base buffer.

### Concurrency and Thread Safety

A range value doesn't synchronize the collection it will index. Bounds validation
and slicing must observe a compatible collection version. Perform both within the
collection owner's isolation, or create an immutable snapshot and derive indices
from that snapshot.

Never derive indices from one actor-isolated value and later apply them to a
mutated or independently fetched value. Send stable domain identifiers or offsets
with an explicit version when a boundary must cross concurrency domains.

### Testing

Cover interval and consumer boundaries:

- Empty, single-element, first, and full-span half-open ranges.
- Closed ranges with equal bounds and both endpoints included.
- `startIndex`, the last valid index, and `endIndex` as an exclusive boundary.
- Prefix, suffix, through, and up-to one-sided slices.
- Negative, inverted, oversized, and overflow-prone external offsets.
- Slice index preservation and long-lived storage behavior where material.
- Generic collections with nonzero or noninteger index assumptions.
- Strings containing extended grapheme clusters.

Property tests can verify that adjacent half-open partitions have no gaps or
overlaps and that validated offset-length ranges remain within capacity.

### Observability and Debugging

For rejected external ranges, record sanitized offset, length, capacity, units,
and protocol version. Distinguish arithmetic overflow, inverted bounds, and
out-of-bounds access because they point to different upstream defects.

When diagnosing memory retention, inspect live slices and their base storage.
When diagnosing index crashes, capture the collection version and mutation path,
not only the numeric-looking index description.

### Compatibility and Migration

Changing inclusive endpoints to exclusive endpoints is a wire and persistence
semantic change even if both use two integers. Version the representation and
test zero-length and maximum-bound cases during migration.

When replacing arrays with other collection types, audit assumptions about zero-
based indices, constant-time movement, slice storage, and concrete return types.
Expose sequence-oriented APIs when callers don't need index semantics.

## Staff and Principal Perspective

### System Impact

Range contracts appear in pagination, byte serving, media timelines, database
queries, and text processing. Endpoint convention, units, overflow behavior, and
snapshot version must agree across producers and consumers. A local off-by-one
fix can otherwise become cross-service duplication or data loss.

### Decision Framework

For a shared range contract, specify:

1. Units and bound type.
2. Inclusive or exclusive endpoint semantics.
3. Empty-range representation.
4. Ordering, maximum size, and overflow policy.
5. Whether offsets refer to bytes, elements, characters, or a versioned snapshot.
6. Ownership and lifetime of returned slices or buffers.
7. Validation location, observability, rollout, and compatibility strategy.

### Organizational Impact

Publish one canonical interval contract for shared protocols and SDKs. Provide
checked conversion helpers at trust boundaries rather than asking each feature to
repeat endpoint arithmetic. Changes need coordinated fixtures across producers
and consumers, especially when platforms use different native range conventions.

## Common Mistakes

### “Every collection can be indexed with `0..<count`”

**Why it is wrong:** `Collection.Index` need not be `Int`, zero-based, or cheap to
offset.

**Better approach:** Use `indices`, native index navigation, or direct iteration.

### “A slice is a small independent array”

**Why it is wrong:** A subsequence can preserve the base indices and retain its
storage.

**Better approach:** Keep short-lived views as slices; create an owning collection
when rebased indices or independent lifetime are part of the contract.

### “Inclusive end plus one always makes a half-open range”

**Why it is wrong:** The addition can overflow and some domains don't define a
discrete successor.

**Better approach:** Preserve endpoint semantics or perform a checked,
domain-specific conversion.

## References

- [Basic Operators: Range Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Range-Operators)
- [Basic Operators: Closed Range Operator](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Closed-Range-Operator)
- [Basic Operators: Half-Open Range Operator](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Half-Open-Range-Operator)
- [Basic Operators: One-Sided Ranges](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#One-Sided-Ranges)
- [Swift Standard Library: Range](https://developer.apple.com/documentation/swift/range)
- [Swift Standard Library: ClosedRange](https://developer.apple.com/documentation/swift/closedrange)
- [Swift Standard Library: Collection](https://developer.apple.com/documentation/swift/collection)
- [Swift Standard Library: Slice](https://developer.apple.com/documentation/swift/slice)
- [Strings and Characters: String Indices](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#String-Indices)
