---
title: "Arrays: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Arrays"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - arrays
  - value-semantics
  - copy-on-write
  - collections
---

# Arrays: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `Array<Element>` is an ordered, zero-based, random-access value collection that
> permits duplicate elements.

- Assignment is logically independent; storage may remain shared until mutation
  through copy-on-write.
- Subscripts require a valid index and trap on violation; `endIndex` equals
  `count` and isn't a valid element position.
- End appends are amortized constant time, while insertion or removal near the
  front shifts elements and is linear.
- `ArraySlice` shares array storage and preserves original indices; retain it
  deliberately or copy it into `Array`.
- Array value semantics don't deep-copy class instances stored as elements.

## Mental Model

An array owns an ordered sequence of element slots. The array itself has value
semantics: mutating one array value must not observably mutate another array value
created by assignment. Its elements retain their own semantics.

```swift
var first = [1, 2, 3]
var second = first
second.append(4)

// first is [1, 2, 3]
// second is [1, 2, 3, 4]
```

The standard library can implement this efficiently by sharing storage until a
mutation needs unique writable storage. Copy-on-write is an optimization beneath
the value contract, not shared logical ownership.

## How It Works

### Type, Order, and Mutability

`Array<Element>` and `[Element]` are equivalent spellings. Every element has the
same static type, order is significant, and duplicates are permitted.

```swift
let immutable = [1, 2, 3]
var mutable = [1, 2, 3]
mutable.append(4)
```

A `let` array can't change its element slots or count. If an element is a mutable
class instance, `let` doesn't make the referenced object immutable.

Empty literals need type context:

```swift
let identifiers: [UUID] = []
```

Use `isEmpty` to express an emptiness check. It communicates intent and works
across collections without manually comparing `count`.

### Value Semantics and Copy-on-Write

Array assignment creates a logically independent collection. Implementations can
share a backing buffer while neither value mutates. Before a mutation becomes
observable, the mutating array ensures it has suitable unique storage.

This has several consequences:

- Assignment is often cheap initially but doesn't promise that later mutation is
  cheap.
- The first mutation after sharing can allocate and copy elements.
- Passing an array by value doesn't mean an eager deep copy occurred.
- Storage identity and reference count aren't part of the public value contract.

Avoid defensive copying merely because an array crosses a function boundary.
Profile the complete operation and preserve value-oriented APIs unless ownership
requirements say otherwise.

### Element Semantics Are Preserved

Copy-on-write isolates the array's slots, not arbitrary object graphs reachable
from those slots:

```swift
final class Item {
    var name: String

    init(name: String) {
        self.name = name
    }
}

let item = Item(name: "Original")
var first = [item]
var second = first

second[0].name = "Changed"
// first[0].name is also "Changed" because both arrays store the same reference.
```

Changing `second[0]` to reference another `Item` doesn't change `first[0]`, but
mutating the shared object is visible through both arrays.

The same issue appears with `Array(repeating:count:)`:

```swift
let shared = Item(name: "Shared")
let items = Array(repeating: shared, count: 3)
```

This repeats one reference three times; it doesn't call an initializer three
times. Construct distinct objects explicitly when independent identity is needed.

### Indices and Bounds

For `Array`, valid element indices are in `startIndex..<endIndex`. In ordinary
arrays, `startIndex` is zero and `endIndex` equals `count`.

```swift
guard values.indices.contains(index) else {
    throw LookupError.invalidIndex(index)
}

let value = values[index]
```

`values[values.count]` is always out of bounds. A safe subscript doesn't return
`nil`; it enforces a precondition and traps when the index is invalid.

Use `first`, `last`, iteration, and domain-specific lookup when absence is normal.
Add a failable boundary deliberately rather than scattering unchecked subscripts.

### Mutation and Index Validity

Insertion, removal, replacement, sorting, and other structural mutations can
invalidate stored indices or change which element an integer identifies.

```swift
var values = ["A", "B", "C"]
let savedIndex = values.firstIndex(of: "B")!
values.insert("New", at: values.startIndex)
// savedIndex no longer identifies the original logical position of "B".
```

An integer can remain numerically in range while now referring to a different
element. Store stable element identity when the product cares about an item across
mutations; don't treat an array offset as a durable identifier.

Mutating while iterating requires a deliberate algorithm. Common approaches are:

- Produce a transformed array with `map`, `filter`, or `compactMap`.
- Iterate over a snapshot when mutation of another collection is intended.
- Remove matching indices in descending order.
- Use `removeAll(where:)` when removal is the operation.
- Mutate elements through valid indices only when collection shape stays stable.

### Range Replacement

Array range subscripting can replace a range with a different number of elements:

```swift
var values = [0, 1, 2, 3, 4]
values[1...3] = [10, 11]
// values is [0, 10, 11, 4]
```

This is a structural mutation and can shift all following indices. Validate the
range against the array's current index space and don't assume replacement keeps
the same count.

### Array Slices

Array slicing returns `ArraySlice<Element>`, not a new `Array<Element>`:

```swift
let values = [10, 20, 30, 40]
let slice = values[1...2]

slice.startIndex // 1, not 0
```

A slice preserves the original indices and can share the original backing
storage. Retaining a tiny slice can therefore keep a much larger array buffer
alive. This is useful for temporary, allocation-conscious processing but risky
for long-lived stored results.

Convert deliberately when independent zero-based storage is wanted:

```swift
let storedValues = Array(slice)
```

Don't write generic collection code that assumes every collection starts at zero.
Use `startIndex`, `endIndex`, `indices`, and index-advancement APIs.

### Capacity and Mutation Complexity

Important practical complexity expectations for `Array` are:

| Operation | Typical complexity |
|---|---:|
| Indexed read/write | O(1) |
| `count`, `isEmpty`, `first`, `last` | O(1) |
| `append` | Amortized O(1) |
| `removeLast` | O(1) |
| Insert/remove near front or middle | O(n) |
| Search such as `firstIndex(of:)` | O(n) |
| Copy triggered by COW mutation | O(n) |

Appending may exceed capacity and allocate a larger buffer, making an individual
append O(n) even though a sequence of appends is amortized O(1).

Use `reserveCapacity` when a reliable approximate final size is known and the
array will grow incrementally:

```swift
var result: [Output] = []
result.reserveCapacity(inputs.count)
```

Capacity is an optimization detail, not logical count. Don't expose or depend on
growth strategy.

### Choosing Collection-Oriented APIs

Accept `[Element]` when the API requires owned array storage, integer random
access, array mutation, or Foundation bridging. Otherwise, a protocol constraint
can state the actual need:

- `Sequence` for one-pass iteration.
- `Collection` for repeatable traversal and stable traversal semantics.
- `RandomAccessCollection` for efficient distance and offset indexing.

Generic collection parameters let arrays, slices, and other collection types call
the same algorithm without unnecessary conversion. They also require code to use
collection indices rather than assuming zero-based integers.

Return an array when callers need a materialized reusable result. Return or expose
a lazy sequence only when deferred work, source lifetime, repeated evaluation, and
thread-safety implications are clear.

### Foundation Bridging

Swift arrays bridge to Foundation `NSArray`, but bridging isn't a universal
zero-cost cast. It can involve representation conversion, object bridging, or
copying depending on element and storage types.

Keep Swift-native arrays inside Swift APIs. Bridge at Objective-C or Foundation
boundaries, measure hot paths, and avoid exposing `NSArray` merely to share a
collection between Swift modules.

### Unsafe Buffer Access

Array can provide temporary access to contiguous elements through unsafe buffer
APIs. The pointer is valid only for the documented closure scope, and structural
mutation during that access violates the contract.

Use unsafe buffer access for a C API or measured bulk operation, keep it lexical,
and don't store or return the pointer. Validate element counts and byte arithmetic
before crossing the unsafe boundary.

### Core Invariants

- Array order and duplicates are preserved.
- Valid element indices are in `startIndex..<endIndex`.
- Array assignment preserves value semantics even when storage is shared
  internally.
- Structural mutation can invalidate indices and slices' assumptions.
- `ArraySlice` can have a nonzero `startIndex` and retain shared storage.
- Element value or reference semantics aren't changed by array containment.

### Constraints and Guarantees

- Subscript bounds violations trap rather than return nil.
- Copy-on-write doesn't promise a specific capacity, allocation, or uniqueness
  strategy.
- An array of class instances isn't a deep value graph.
- Array mutation isn't atomic or thread-safe merely because Array is a value type.
- Bridging and unsafe buffer access have boundary-specific cost and lifetime.
- Integer offsets aren't stable domain identifiers.

## Failure Modes

- **Using `count` as a subscript:** Accesses one position past the final element.
- **Persisting an array index as identity:** Breaks when insertion, removal, or
  sorting changes positions.
- **Holding a small `ArraySlice` long term:** Retains a large backing buffer and
  preserves surprising nonzero indices.
- **Assuming an array copy deep-copies objects:** Leaks mutation through shared
  element references.
- **Using `Array(repeating: instance, count:)` for independent objects:** Stores
  the same reference repeatedly.
- **Removing repeatedly from the front:** Produces quadratic behavior as elements
  shift on every operation.
- **Mutating a shared array from multiple tasks:** Creates a data race despite
  value semantics.
- **Escaping a temporary buffer pointer:** Uses storage outside its guaranteed
  lifetime.
- **Converting every input to Array:** Forces allocation and discards useful slice
  or lazy behavior.
- **Assuming Foundation bridging is free:** Hides conversion and allocation in a
  hot boundary.

## Engineering Judgment

### Use an Array When

- Order is part of the contract.
- Duplicate elements are valid.
- Efficient random access by position is needed.
- The collection is commonly traversed sequentially.
- Mutation patterns are append-heavy or otherwise compatible with contiguous
  storage.

### Consider Another Representation When

- Uniqueness and membership dominate: use `Set`.
- Lookup is by stable key: use `Dictionary`.
- Frequent front insertion/removal dominates: use a queue/deque representation.
- Stable identity must survive reordering: store identifiers or keyed values.
- Data is too large to materialize: use a sequence, stream, or incremental
  processing design.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `Array` | Ordered, compact, random access, value semantics | Middle mutation and linear search | Ordered application data |
| `ArraySlice` | Cheap temporary view preserving storage | Retains buffer and original indices | Short-lived subrange processing |
| Generic `Collection` input | Reuses algorithms without materialization | More abstract index code | Read-only reusable algorithms |
| Lazy sequence | Avoids intermediate arrays and defers work | Source lifetime and repeated-work complexity | Pipelines with controlled consumption |
| Keyed collection | Stable lookup independent of position | Different ordering and storage costs | Identity-driven state |

### Alternatives

- Use `Set` for uniqueness and repeated membership tests.
- Use `Dictionary` when offsets are standing in for identifiers.
- Use a dedicated queue/deque for frequent operations at both ends.
- Use `Array(slice)` when storing a small slice independently.
- Accept a generic collection rather than forcing caller-side conversion.

## Production Considerations

### Performance

Profile allocation, copying, search, mutation position, element size, and bridging
together. A function that accepts an array cheaply may trigger a full COW copy on
its first mutation. A sequence of front removals can dominate otherwise trivial
work.

Reserve capacity for known growth, prefer bulk transforms over repeated structural
mutation, and avoid materializing intermediate arrays when a measured hot path can
consume a lazy or fused pipeline safely.

Contiguous storage often has strong cache locality, but an array of class
references stores references contiguously, not the referenced object bodies.

### Concurrency and Thread Safety

Independent array values can be used independently, and arrays can cross
concurrency boundaries when their elements satisfy sendability requirements. A
single mutable array variable must still have one isolated owner.

Copy-on-write isn't synchronization. Concurrently reading and mutating the same
array variable outside Swift's concurrency guarantees is still a race. Use actor
isolation, task-local ownership, a lock, or immutable snapshots.

### Testing

Test array logic with:

- Empty, single-element, and large collections.
- First, last, and one-past-end boundaries.
- Duplicate values and reference-type elements.
- Mutations before, at, and after stored logical positions.
- Slices with nonzero start indices.
- Capacity growth and COW-sensitive performance benchmarks where relevant.
- Concurrency stress only inside the actual synchronization design.

Property-based tests are useful for order preservation, transformation laws, and
round trips between arrays and slices.

### Observability and Debugging

Bounds traps should be traced back to the owner of index validation. Record safe
rejections at untrusted boundaries rather than logging every internal lookup.

For memory regressions, inspect retained `ArraySlice` values, large copy-on-write
separations, bridged collections, and reference graphs inside elements. Array count
alone doesn't describe retained memory.

### Compatibility and Migration

Changing an API from array to set or dictionary changes ordering, duplicate, and
lookup semantics. Changing to a generic collection can improve flexibility but
may affect overload resolution and caller type inference.

When replacing positional identity with stable keys, migrate persisted positions
and in-flight UI state deliberately. Preserve order separately when the product
contract still needs it.

## Staff and Principal Perspective

### System Impact

Arrays often become default state containers even when the system is actually
keyed by identity. Repeated linear searches, index-based updates, and duplicate
repair logic are signals that the representation no longer matches the domain.

Collection choice affects diffing, persistence, networking, concurrency, and UI
updates. Make ordering, uniqueness, identity, and mutation patterns explicit at
module boundaries.

### Decision Framework

For a shared collection contract, document:

1. Whether order is semantic or incidental.
2. Whether duplicates are valid.
3. How elements are identified across mutations.
4. Expected size and dominant access patterns.
5. Ownership and concurrency isolation.
6. Materialization, slicing, and lifetime expectations.
7. Bridging, persistence, and migration behavior.

### Organizational Impact

Shared APIs should avoid requiring arrays solely for convenience when they only
need iteration. Domain owners should define stable element identity and ordering
policy. Performance reviews should focus on collection-wide access patterns rather
than isolated complexity folklore.

## Common Mistakes

### “Array is a value type, so every assignment copies all elements”

**Why it is wrong:** Value semantics guarantee independent observable mutation,
not eager storage copying.

**Better approach:** Rely on value semantics and profile COW separation in real
mutation paths.

### “An array index identifies an item”

**Why it is wrong:** Structural mutation and sorting change which item occupies a
position.

**Better approach:** Use a stable domain identifier when identity must survive
collection changes.

### “A slice is a small standalone array”

**Why it is wrong:** `ArraySlice` preserves source indices and may retain the full
backing storage.

**Better approach:** Keep slices temporary or convert them to `Array` for
long-lived independent storage.

### “Copying an array of objects isolates all mutation”

**Why it is wrong:** Both arrays can still contain references to the same mutable
instances.

**Better approach:** Use value-semantic elements, immutable references, or an
explicit deep-copy policy when independent graphs are required.

## References

- [Collection Types: Arrays](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Arrays)
- [Collection Types: Mutability of Collections](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Mutability-of-Collections)
- [Swift Standard Library: Array](https://developer.apple.com/documentation/swift/array)
- [Swift Standard Library: ArraySlice](https://developer.apple.com/documentation/swift/arrayslice)
- [Swift Standard Library: Collection](https://developer.apple.com/documentation/swift/collection)
- [Swift Standard Library: RandomAccessCollection](https://developer.apple.com/documentation/swift/randomaccesscollection)
- [Swift Standard Library: Array.withUnsafeBufferPointer](https://developer.apple.com/documentation/swift/array/withunsafebufferpointer(_:))
