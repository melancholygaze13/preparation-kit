---
title: "Arrays: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Arrays"
page_type: interview
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

# Arrays: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do Array value semantics and copy-on-write work together?](#q1-value-semantics-and-cow) | Senior | Observable independence and storage optimization |
| [Does copying an array isolate mutations to its elements?](#q2-element-semantics) | Senior | Reference elements and repeated values |
| [When do array indices become invalid or misleading?](#q3-index-validity) | Senior | Bounds, mutation, and stable identity |
| [What is the difference between `Array` and `ArraySlice`?](#q4-array-slice) | Senior | Index space and storage lifetime |
| [What are the important Array complexity characteristics?](#q5-array-complexity) | Senior | Mutation position, capacity, and search |
| [When should an API accept Array versus a collection protocol?](#q6-api-abstraction) | Senior | Ownership and generic constraints |
| [How do you recognize that Array is the wrong system representation?](#q7-representation-choice) | Staff | Identity, access patterns, and migration |

---

<a id="q1-value-semantics-and-cow"></a>
## Q1: How Do Array Value Semantics and Copy-on-Write Work Together?

### What It Evaluates

Whether the candidate separates the public value contract from the storage
optimization used to implement it efficiently.

### Short Answer

Array has value semantics: after assignment, mutating one array doesn't
observably mutate the other. Swift can initially share backing storage and copy
only when a mutation requires unique writable storage. Assignment therefore need
not copy all elements immediately, but the first mutation after sharing may
allocate and copy. Storage identity is not part of Array's public contract.

### Detailed Answer

```swift
var original = [1, 2, 3]
var copy = original

copy.append(4)

// original == [1, 2, 3]
// copy == [1, 2, 3, 4]
```

The two array values are logically independent from assignment onward. Before
`copy` mutates, both values may point to one buffer. The mutation checks whether
storage can be updated uniquely; if not, it creates appropriate independent
storage first.

This means “pass by value” doesn't imply an eager O(n) deep copy. It also doesn't
make every mutation O(1): COW separation can be O(n), and later capacity growth
can allocate again.

Correct code should rely on value semantics, not on assumptions about buffer
addresses, uniqueness checks, or capacity growth. Performance-sensitive code
should measure the actual assignment and mutation pattern.

### Engineering Trade-offs

- Value semantics simplify ownership and snapshots.
- Shared storage avoids unnecessary copies for read-heavy flows.
- The first mutation after sharing can introduce a latency or memory spike.

### Production Scenario

A reducer takes an application-state array, produces a modified copy, and leaves
the previous snapshot available for diffing. COW keeps unchanged snapshots cheap,
while profiling identifies one large first mutation that should be reorganized as
a batched transformation.

### Follow-up Questions

- Does every array assignment allocate?
- When can a mutation trigger an O(n) copy?
- Is the backing-buffer identity observable API?

### Strong Answer Signals

- States observable independence before discussing implementation.
- Recognizes delayed copy and mutation cost.
- Avoids depending on storage uniqueness as domain behavior.

### Weak Answer Signals

- Claims Array is a reference type because buffers can be shared.
- Claims assignment always copies all elements immediately.
- Assumes every append after assignment remains constant time.

### Related Theory

- [Value Semantics and Copy-on-Write](theory.md#value-semantics-and-copy-on-write)
- [Performance](theory.md#performance)

---

<a id="q2-element-semantics"></a>
## Q2: Does Copying an Array Isolate Mutations to Its Elements?

### What It Evaluates

Understanding that collection value semantics don't imply deep value semantics
for referenced element graphs.

### Short Answer

It isolates changes to the array's element slots and structure, but elements keep
their own semantics. If elements are structures, replacing or mutating one copy's
element doesn't affect the other. If elements are class references, both arrays
can reference the same instances, so object mutation is visible through both.
`Array(repeating: instance, count:)` also repeats one reference rather than
creating independent objects.

### Detailed Answer

```swift
final class Item {
    var value: Int

    init(value: Int) {
        self.value = value
    }
}

let item = Item(value: 1)
var first = [item]
var second = first

second[0].value = 2
// first[0].value is also 2.

second[0] = Item(value: 3)
// first[0] still references the original object.
```

The second operation changes an array slot and COW preserves array independence.
The first operation changes an object reached through a copied reference; the
array buffer itself doesn't mutate.

Similarly:

```swift
let items = Array(repeating: Item(value: 0), count: 3)
```

All three positions hold references to the same `Item`. Use a loop or mapping
operation that constructs a new instance for each position when independent
identity is required.

### Engineering Trade-offs

- Reference elements support shared identity and coordinated updates.
- Value elements provide stronger snapshot semantics.
- Deep copying can isolate graphs but needs explicit ownership, cycle, and cost
  policy.

### Production Scenario

A screen copies an array of mutable view models before editing. Changes still
appear in the original because both arrays reference the same models. The design
moves editable state into value-semantic models and keeps shared services outside
the snapshot.

### Follow-up Questions

- What does COW copy when only an object's property changes?
- How do you create several independent reference instances?
- Is deep copying always the correct fix?

### Strong Answer Signals

- Separates collection slots from object graphs.
- Explains both replacing a reference and mutating its object.
- Treats deep copy as an explicit domain decision.

### Weak Answer Signals

- Calls an array of classes deeply value-semantic.
- Assumes `Array(repeating:)` reruns the expression for every element.
- Copies the array again to fix shared object mutation.

### Related Theory

- [Element Semantics Are Preserved](theory.md#element-semantics-are-preserved)

---

<a id="q3-index-validity"></a>
## Q3: When Do Array Indices Become Invalid or Misleading?

### What It Evaluates

Knowledge of index bounds, structural mutation, and the distinction between
position and identity.

### Short Answer

An Array element index is valid only in its current `startIndex..<endIndex` range;
`endIndex` equals `count` and isn't subscriptable. Structural mutations such as
insertion, removal, replacement, and sorting can invalidate saved indices or make
the same integer identify a different element. Use indices for local traversal,
not persistent identity. Store a stable domain identifier when an item must
survive reordering.

### Detailed Answer

An index can fail in two ways:

1. It is no longer within the array's bounds and subscripting traps.
2. It remains in bounds but now points to another logical item.

```swift
var names = ["Ana", "Bo", "Chen"]
let index = names.firstIndex(of: "Bo")!

names.insert("Ari", at: names.startIndex)
// index is still the integer 1, but names[1] is now "Ana".
```

Checking only `index < count` prevents a bounds trap but doesn't preserve
identity. UI selections, navigation, persistence, and asynchronous work should
carry an item identifier or value rather than an old offset.

For local mutation, use collection algorithms or carefully controlled indices.
Remove several positions in descending order so earlier removals don't shift
later pending indices.

### Engineering Trade-offs

- Integer indices make local random access efficient.
- Stable identifiers require additional storage and lookup.
- Recomputing an index by identifier is linear unless the representation is
  keyed.

### Production Scenario

A network response reorders a list while an asynchronous delete operation stores
the selected row index. The callback deletes the wrong row. Passing the model's
stable ID and resolving it against current state prevents positional corruption.

### Follow-up Questions

- Is `array[array.count]` valid?
- Can an index be misleading even when still in bounds?
- How would you remove multiple indexed elements safely?

### Strong Answer Signals

- Distinguishes validity from logical identity.
- Treats offsets as ephemeral traversal values.
- Accounts for asynchronous state changes.

### Weak Answer Signals

- Uses `index < count` as proof it still identifies the intended item.
- Persists row offsets as model identity.
- Mutates collection shape during forward index iteration without adjustment.

### Related Theory

- [Indices and Bounds](theory.md#indices-and-bounds)
- [Mutation and Index Validity](theory.md#mutation-and-index-validity)

---

<a id="q4-array-slice"></a>
## Q4: What Is the Difference Between `Array` and `ArraySlice`?

### What It Evaluates

Understanding of slice index spaces, shared storage lifetime, and deliberate
materialization.

### Short Answer

Array owns a zero-based array value. Slicing produces `ArraySlice`, a view-like
value that preserves the original indices and can share the source buffer. A
small long-lived slice can retain a large allocation, and its `startIndex` may not
be zero. Keep slices temporary or convert with `Array(slice)` when independent,
zero-based, long-lived storage is required.

### Detailed Answer

```swift
let values = [10, 20, 30, 40]
let slice = values[1...2]

slice.startIndex // 1
slice[1]         // 20
// slice[0]      // Invalid index.
```

Preserving indices makes slices efficient in generic collection algorithms and
avoids immediate copying. It also means code that assumes `0..<count` is not
generic collection code.

Because the slice can share the source buffer, storing a two-element slice from a
million-element array may keep the large buffer alive. Materialize when the slice
escapes the short operation or when memory ownership should be independent:

```swift
let stored = Array(slice)
```

Conversion has O(n) cost for the slice length and creates zero-based Array
indices.

### Engineering Trade-offs

- Slices reduce allocation for short-lived subrange work.
- Shared storage can increase retained memory unexpectedly.
- Materialization clarifies ownership at copy cost.

### Production Scenario

A parser stores a tiny header slice from a large downloaded buffer in a cache.
Memory remains high because each slice retains its source allocation. Copying only
the header into an Array at the cache boundary releases the large buffer.

### Follow-up Questions

- Does an ArraySlice start at zero?
- Why can a small slice retain substantial memory?
- When should a generic function preserve a slice instead of converting it?

### Strong Answer Signals

- Mentions both original indices and shared storage.
- Places materialization at a lifetime or ownership boundary.
- Uses collection indices rather than integer assumptions.

### Weak Answer Signals

- Treats ArraySlice as a type alias for Array.
- Subscripts every slice from zero.
- Converts all slices immediately without considering allocation or lifetime.

### Related Theory

- [Array Slices](theory.md#array-slices)

---

<a id="q5-array-complexity"></a>
## Q5: What Are the Important Array Complexity Characteristics?

### What It Evaluates

Practical performance reasoning about contiguous ordered storage.

### Short Answer

Indexed access and count are O(1). Append is amortized O(1), but an individual
append can allocate and copy when capacity grows. Removing the last element is
O(1); inserting or removing near the front or middle is O(n) because later
elements shift. Linear search is O(n), and the first mutation of shared COW
storage may copy O(n). Reserve capacity for reliable known growth.

### Detailed Answer

Performance depends on the operation sequence, not one isolated call:

- Repeated `removeFirst()` can become O(n²).
- Repeated append is normally efficient, especially after `reserveCapacity`.
- `firstIndex(of:)` in a loop can create repeated linear scans.
- `filter`, `map`, and concatenation allocate materialized results unless a lazy
  or fused design is used.
- Reference elements improve copy size but add indirection and scattered object
  storage.

`reserveCapacity` is useful when the final size is reasonably known. It doesn't
change logical count or guarantee a particular growth strategy.

Use a deque for frequent front operations, a set for membership, and a dictionary
for keyed lookup. Choosing a better representation generally matters more than
micro-optimizing Array syntax.

### Engineering Trade-offs

- Contiguous order gives strong iteration locality and random access.
- Middle mutation pays for shifting.
- Lazy pipelines avoid intermediates but can repeat work and retain sources.

### Production Scenario

A queue processes thousands of events using `removeFirst`, producing quadratic
shifting. Replacing it with a deque or a head-index buffer removes the dominant
cost. The team chooses the deque when compaction and lifecycle complexity of a
manual head index isn't justified.

### Follow-up Questions

- Why is append amortized rather than always O(1)?
- When does COW introduce an O(n) mutation?
- Which representation fits repeated membership checks?

### Strong Answer Signals

- Explains operation sequences and representation choice.
- Includes capacity growth and COW separation.
- Uses measurement rather than assuming all array use is slow or fast.

### Weak Answer Signals

- Calls every append O(1) without qualification.
- Optimizes repeated linear search while keeping the wrong collection type.
- Uses `reserveCapacity` as though it changes array count.

### Related Theory

- [Capacity and Mutation Complexity](theory.md#capacity-and-mutation-complexity)
- [Performance](theory.md#performance)

---

<a id="q6-api-abstraction"></a>
## Q6: When Should an API Accept Array Versus a Collection Protocol?

### What It Evaluates

Whether the candidate expresses the minimum semantic and performance requirements
of an algorithm.

### Short Answer

Accept Array when the API needs owned contiguous materialization, Array mutation,
zero-based integer access, or a specific bridging contract. Accept `Sequence`
when one-pass iteration is sufficient, `Collection` for repeatable traversal, and
`RandomAccessCollection` when efficient offset and distance operations are
required. A protocol constraint avoids needless conversion of slices and other
collections.

### Detailed Answer

An API taking `[Element]` requires every caller to materialize an Array even when
the algorithm only iterates. That can allocate, copy a slice, and destroy lazy
behavior.

Choose the weakest honest constraint:

- `Sequence`: consume elements in order, potentially only once.
- `Collection`: traverse repeatedly and use stable collection traversal.
- `RandomAccessCollection`: rely on efficient index offset and distance.
- `Array`: retain, mutate, bridge, or expose array-specific storage behavior.

Generic collection code must not assume zero-based integer indices. Use
`startIndex`, `endIndex`, `indices`, and collection index methods.

Returning an Array is appropriate when callers need a stable reusable snapshot.
Returning a lazy view can be useful but must document source lifetime, repeated
evaluation, capture, and concurrency behavior.

### Engineering Trade-offs

- Array parameters are simple and concrete.
- Generic constraints improve reuse and avoid materialization at signature and
  compile-time complexity cost.
- Lazy returns can save work while making lifetime and repeated execution less
  obvious.

### Production Scenario

A checksum function accepts `[UInt8]` but only iterates. Callers holding
`Data.SubSequence` and `ArraySlice<UInt8>` allocate arrays unnecessarily. Changing
the function to accept a suitable sequence or collection removes conversions
without changing the checksum contract.

### Follow-up Questions

- Why can a Sequence be single-pass?
- What additional guarantee does RandomAccessCollection provide?
- When is materializing an Array still the better boundary?

### Strong Answer Signals

- Selects constraints from actual algorithm requirements.
- Recognizes nonzero and noninteger collection indices.
- Includes ownership and lazy-lifetime implications.

### Weak Answer Signals

- Accepts Array everywhere because it is familiar.
- Uses `0..<collection.count` in generic Collection code.
- Returns a lazy pipeline without documenting captured source lifetime.

### Related Theory

- [Choosing Collection-Oriented APIs](theory.md#choosing-collection-oriented-apis)

---

<a id="q7-representation-choice"></a>
## Q7: How Do You Recognize That Array Is the Wrong System Representation?

### What It Evaluates

Staff-level reasoning about domain semantics, access patterns, and migration.

### Short Answer

Array is wrong when code repeatedly repairs properties it doesn't provide:
deduplicating for uniqueness, scanning for keyed lookup, preserving index-based
identity through reordering, removing from the front, or rebuilding maps for every
update. Measure dominant operations and model order, duplicates, identity,
ownership, and scale explicitly. Migrate to Set, Dictionary, deque, or a composed
representation while preserving any truly semantic order.

### Detailed Answer

Common signals are:

- Many `firstIndex(where:)` calls by the same identifier.
- Duplicate prevention before every append.
- UI and persistence storing offsets as identity.
- Repeated sorting because order isn't owned.
- O(n) front removal in a queue workload.
- Several modules independently creating dictionaries from the same array.

Before migrating, establish whether order is semantic. A dictionary may solve
lookup while losing presentation order, so the system may need keyed storage plus
an ordered ID list or an ordered-keyed collection.

Migration affects serialization, diffing, equality, tests, and concurrency.
Introduce the new owner, dual-read or adapt at boundaries, compare behavior and
performance, then remove positional assumptions incrementally.

Avoid maintaining several denormalized representations without one source of
truth and update invariant. Faster lookup isn't useful if indexes drift from the
canonical data.

### Engineering Trade-offs

- Keyed storage improves lookup but adds hashing and ordering policy.
- Multiple synchronized indexes improve read patterns at mutation complexity.
- A specialized deque improves endpoint mutation while giving up some familiar
  Array assumptions.

### Production Scenario

An app stores thousands of conversations in an array and searches by ID for every
event. It migrates canonical state to a dictionary keyed by conversation ID and
maintains a separate ordered ID list for the inbox. One actor owns updates to both
structures and validates their consistency during rollout.

### Follow-up Questions

- When is Dictionary plus ordered IDs better than one Array?
- How would you prevent two representations from drifting?
- Which metrics justify the migration?

### Strong Answer Signals

- Diagnoses representation mismatch from repeated operations.
- Preserves semantic order separately when necessary.
- Includes ownership, invariants, migration, and measurement.

### Weak Answer Signals

- Replaces Array with Dictionary without addressing ordering.
- Adds caches and indexes with no canonical owner.
- Chooses a collection from asymptotic complexity alone without workload data.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
