---
title: "Range Operators: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Range Operators"
page_type: interview
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

# Range Operators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use closed, half-open, or one-sided ranges?](#q1-range-selection) | Senior | Endpoint semantics and composition |
| [Why is `0..<collection.count` unsafe in generic collection code?](#q2-collection-indices) | Senior | Native index spaces and complexity |
| [What should you know about collection slices?](#q3-slice-semantics) | Senior | Preserved indices, storage, and lifetime |
| [How do you safely construct a range from an offset and length?](#q4-validated-boundaries) | Senior | Bounds validation and overflow |
| [How would you define a range contract across system boundaries?](#q5-range-contract) | Staff | Units, versioning, and migration |

---

<a id="q1-range-selection"></a>
## Q1: When Should You Use Closed, Half-Open, or One-Sided Ranges?

### What It Evaluates

Whether the candidate chooses a range from endpoint semantics rather than habit.

### Short Answer

Use `a...b` when both endpoints are meaningful and included. Use `a..<b` for
offsets, partitions, and collection boundaries because equal bounds are empty and
adjacent ranges compose without overlap. Use `a...`, `...b`, or `..<b` when a
consumer such as a collection naturally provides the missing boundary. Treat
standalone unbounded iteration as a termination and overflow risk.

### Detailed Answer

A closed range with equal bounds contains one value; a half-open range with equal
bounds is empty. This makes half-open ranges a natural representation for slices
and `(offset, length)` spans:

```swift
let page1 = 0..<20
let page2 = 20..<40
```

There is no overlap and no need to add or subtract one at the join. A closed range
better matches an inclusive version or score specification.

One-sided ranges get their practical boundary from context. `items[start...]`
ends at the collection's `endIndex`; `items[..<end]` begins at its `startIndex`.
Outside that context, a missing bound can prevent forward iteration or create an
unbounded sequence that needs an explicit stop.

### Engineering Trade-offs

- Closed bounds mirror inclusive requirements but are awkward for empty spans.
- Half-open bounds compose cleanly but require explicit translation from
  inclusive external protocols.
- One-sided syntax is concise but depends more heavily on consumer context.

### Production Scenario

A paginated cache stores entries by half-open offset ranges so pages join without
duplication. A server API returns inclusive byte endpoints, so the adapter keeps
that external contract explicit and performs a checked conversion rather than
scattering `end + 1` throughout the client.

### Follow-up Questions

- What does `5..<5` contain?
- What does `5...5` contain?
- Why can `upper + 1` be unsafe?

### Strong Answer Signals

- Explains empty and adjacency semantics.
- Chooses endpoint convention from the domain.
- Identifies termination and overflow concerns for missing bounds.

### Weak Answer Signals

- Says the forms differ only in spelling.
- Uses a closed range for every collection slice.
- Converts inclusive endpoints with unchecked addition.

### Related Theory

- [Closed Ranges](theory.md#closed-ranges)
- [Half-Open Ranges](theory.md#half-open-ranges)
- [One-Sided Ranges](theory.md#one-sided-ranges)

---

<a id="q2-collection-indices"></a>
## Q2: Why Is `0..<collection.count` Unsafe in Generic Collection Code?

### What It Evaluates

Understanding of `Collection.Index`, index validity, and complexity contracts.

### Short Answer

`Collection` doesn't guarantee integer or zero-based indices, and `count` doesn't
turn offsets into valid indices. Use direct iteration, `collection.indices`, or
the collection's index navigation APIs. Indices belong to a specific collection
version, `endIndex` isn't subscriptable, and offset movement isn't necessarily
constant time.

### Detailed Answer

An array happens to have zero-based integer indices, but generic code can receive
a slice, string, or custom collection. A slice can start at a nonzero index, while
`String` uses `String.Index` at valid character boundaries.

```swift
for index in collection.indices {
    consume(collection[index])
}
```

When an algorithm needs a bounded offset, use
`index(_:offsetBy:limitedBy:)`. The returned index is derived in the collection's
own space, and the limit prevents moving beyond a known boundary.

An index from another collection, even one with equal contents, isn't a portable
position. Mutations can also invalidate indices according to the collection's
contract.

### Engineering Trade-offs

- Direct iteration is the most general but doesn't expose positions.
- Native indices preserve correctness but are less convenient than integers.
- Converting to an array provides integer indices at allocation and copy cost.

### Production Scenario

A reusable text-highlighting algorithm written with `0..<count` fails for
`String` and misbehaves for an `ArraySlice`. Rewriting it around native index
ranges supports both without inventing integer character offsets.

### Follow-up Questions

- Is `endIndex` a valid subscript?
- Are indices reusable after mutation?
- Is advancing an arbitrary collection index constant time?

### Strong Answer Signals

- Separates offsets from indices.
- Mentions slice and string index behavior.
- Reasons from the collection's complexity and invalidation guarantees.

### Weak Answer Signals

- Assumes all collections are arrays.
- Subscripts `endIndex` as the last element.
- Converts strings to integer offsets without a stated representation policy.

### Related Theory

- [Ranges and Collection Indices](theory.md#ranges-and-collection-indices)

---

<a id="q3-slice-semantics"></a>
## Q3: What Should You Know About Collection Slices?

### What It Evaluates

Knowledge of subsequence types, index preservation, storage sharing, and API
boundaries.

### Short Answer

Range subscripting returns the collection's `SubSequence`, not necessarily a new
owning collection. An array slice usually preserves the base array's indices and
can retain its storage, so it may not start at zero and a tiny long-lived slice
can keep a large buffer alive. Keep slices for short-lived views; convert to an
owning collection when independent lifetime or rebased indices are required.

### Detailed Answer

```swift
let source = [10, 20, 30, 40]
let slice = source[1..<3]

slice.startIndex // 1
slice[1]         // 20
```

Code that loops from `0..<slice.count` will use invalid positions. It should use
`slice.indices` or direct iteration.

Slicing often avoids an eager copy, which is efficient in a local pipeline.
Because the subsequence can share backing storage, retaining a few elements from a
large payload can retain the whole allocation. `Array(slice)` makes an owning,
zero-based result but pays allocation and copying cost.

### Engineering Trade-offs

- A slice reduces immediate copying and preserves a view into a range.
- An owning copy gives independent lifetime and familiar indices.
- Converting every slice defensively can waste time and memory; retaining every
  slice can increase peak memory.

### Production Scenario

A parser stores a 100-byte slice from a 50 MB response in a cache. Memory remains
high because the slice retains the response storage. Copying the validated token
into an owning value at the cache boundary releases the large buffer.

### Follow-up Questions

- Does an `ArraySlice` start at zero?
- When should you call `Array(slice)`?
- Why might slicing reduce allocations but increase retained memory?

### Strong Answer Signals

- Separates subsequence semantics from owning-copy assumptions.
- Covers both index and storage consequences.
- Makes conversion a boundary decision, not a universal rule.

### Weak Answer Signals

- Calls every slice an independent array.
- Assumes `slice[0]` is valid when the slice is nonempty.
- Optimizes only allocation count and ignores retained memory.

### Related Theory

- [Slices Preserve Index Space](theory.md#slices-preserve-index-space)

---

<a id="q4-validated-boundaries"></a>
## Q4: How Do You Safely Construct a Range From an Offset and Length?

### What It Evaluates

Trust-boundary validation, arithmetic ordering, and collection bounds reasoning.

### Short Answer

Reject negative values, prove `offset <= capacity`, then prove
`length <= capacity - offset` before calculating the end. Only after those checks
construct `offset..<(offset + length)`. This ordering prevents overflow and proves
the half-open upper bound is at most capacity. For noninteger collection indices,
derive the end with the collection's limited index APIs instead.

### Detailed Answer

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

Computing `offset + length` first can trap even when the subsequent comparison
would reject the result. Using wrapping addition would be worse: it can turn an
invalid input into a plausible small endpoint.

This helper is appropriate only where integers actually represent the consumer's
index or byte-offset space. Generic collections need native index navigation, and
text protocols must specify whether positions count bytes, Unicode scalars, or
user-perceived characters.

### Engineering Trade-offs

- Checked conversion adds branches but fails gracefully on hostile input.
- Trapping can enforce internal invariants after validation but isn't a boundary
  policy.
- A validated domain range type reduces duplicated checks at API cost.

### Production Scenario

A media parser receives an offset and length from a file. It validates conversion
to `Int`, checks the range without overflowing, and slices an immutable byte
buffer from the same snapshot. Invalid fields return a parse error with sanitized
diagnostics rather than terminating the process.

### Follow-up Questions

- Why check subtraction before addition?
- Why not use `&+`?
- What changes for a `String`?

### Strong Answer Signals

- Orders checks so every intermediate operation is safe.
- Distinguishes internal invariant traps from external-input rejection.
- Identifies units and native index space as part of the contract.

### Weak Answer Signals

- Adds first and validates afterward.
- Uses overflow operators as crash prevention.
- Applies byte offsets directly to Swift character indices.

### Related Theory

- [Boundary and Overflow Considerations](theory.md#boundary-and-overflow-considerations)

---

<a id="q5-range-contract"></a>
## Q5: How Would You Define a Range Contract Across System Boundaries?

### What It Evaluates

Staff-level ability to standardize interval semantics and migrate producers and
consumers safely.

### Short Answer

Specify units, bound representation, inclusive or exclusive endpoints, empty
range semantics, maximum size, ordering and overflow policy, and the snapshot or
resource version the offsets address. Centralize checked conversion. Version
semantic changes, test shared fixtures across platforms, observe rejected ranges,
and coordinate rollout and rollback for every producer and consumer.

### Detailed Answer

Two integers are insufficient as a durable range contract. A consumer needs to
know whether they mean `(start, end)`, `(offset, length)`, bytes, elements,
characters, or time units. It also needs endpoint rules and the identity/version
of the resource being indexed.

A protocol should define canonical half-open or inclusive semantics explicitly,
including zero length and maximum bounds. SDK adapters convert into native range
types using checked arithmetic. Cross-platform fixtures should cover empty,
single-unit, final-unit, oversized, inverted, and maximum-value cases.

If the resource is mutable, bind the range to an ETag, generation, or snapshot ID
so validation and consumption address the same version.

### Engineering Trade-offs

- `(offset, length)` expresses empty spans naturally but still needs overflow-safe
  end calculation.
- `(start, exclusiveEnd)` composes well but must define the coordinate space.
- Version binding improves consistency but can increase retries when data changes.

### Production Scenario

An image service and iOS client disagree about whether the final byte is
inclusive. The team defines byte-based half-open ranges tied to an object version,
ships shared boundary fixtures, adds server-side rejection reason metrics, and
supports the old representation until client adoption reaches the rollback-safe
threshold.

### Follow-up Questions

- Which range representation would you choose and why?
- How do you prevent time-of-check/time-of-use errors?
- What fixtures are essential for a migration?

### Strong Answer Signals

- Defines units, endpoints, empty behavior, and resource version.
- Includes checked adapters, cross-platform tests, rollout, and rollback.
- Connects concurrent mutation to range validity.

### Weak Answer Signals

- Documents only two field names.
- Assumes every platform interprets native ranges identically.
- Changes endpoint semantics in place without versioning.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
