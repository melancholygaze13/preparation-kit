---
title: "Sets: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Sets"
page_type: theory
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-20
tags:
  - sets
  - hashable
  - value-semantics
  - collections
---

# Sets: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `Set<Element>` models unordered membership: every distinct `Hashable` value is
> present at most once, and position is not part of the value.

- Equal elements must hash consistently; hash collisions between unequal values
  are valid and are resolved using equality.
- `insert`, `contains`, and `remove` are expected O(1) on average, not guaranteed
  constant time in every case.
- Iteration order is unspecified and must not be persisted, serialized, or tested.
- Value semantics isolate set structure, but don't deep-copy referenced elements.
- If uniqueness and order are both requirements, encode both deliberately instead
  of depending on current `Set` iteration behavior.

## Mental Model

A set answers “is this distinct value a member?” rather than “what is at this
position?” Hashing narrows the candidate location; equality confirms identity.
The element's `Hashable` conformance therefore defines what uniqueness means.

```swift
let requested: Set<String> = ["read", "write", "read"]

requested.count               // 2
requested.contains("write")   // true
```

The duplicate disappears because the two `"read"` values are equal. No promise
is made about which value appears first during iteration.

## How It Works

### Hashable Defines Uniqueness

`Set` requires `Element: Hashable`; `Hashable` inherits from `Equatable`. For any
two values `a` and `b`, the conformance must satisfy:

```text
a == b  implies  a and b feed equivalent components to Hasher
```

The reverse is not required. Unequal values may collide, so a set still checks
equality after locating candidates by hash. A collision affects performance, not
correctness, when the conformance obeys the equality contract.

Prefer synthesized `Hashable` when all equality-relevant stored properties should
participate. For a manual conformance, make `==` and `hash(into:)` use the same
notion of identity:

```swift
struct Account: Hashable {
    let id: UUID
    var displayName: String

    static func == (lhs: Account, rhs: Account) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
```

This design says two account values with the same ID are the same set member even
when their display names differ. That is a domain contract, not merely a
performance implementation.

### Hash Values Are Process-Local Artifacts

`hashValue` and values finalized by `Hasher` aren't durable identifiers. Swift's
standard hasher is normally randomly seeded, so the same input can produce a
different result in another process execution. Hash implementation details can
also change between toolchains.

Persist the stable domain ID itself. Never store a hash as a database key, cache
identity, synchronization token, or wire-format field.

### Mutation Operations

The core operations expose whether membership changed and which value was
retained or replaced:

```swift
var names: Set = ["Ana", "Bo"]

let insertion = names.insert("Ana")
insertion.inserted             // false
insertion.memberAfterInsert    // "Ana"

let old = names.update(with: "Chen")
// old is nil; "Chen" was inserted.

let removed = names.remove("Bo")
// removed is Optional("Bo").

names.contains("Chen")         // true
```

- `insert(_:)` keeps the existing equal member when one exists and returns the
  member after the operation.
- `update(with:)` replaces an existing equal member and returns the old member,
  or inserts and returns `nil`.
- `remove(_:)` returns the stored member or `nil` when absent.
- `contains(_:)` reports membership without changing the set.

`update(with:)` matters when equality uses only stable identity but the stored
value contains newer nonidentity data.

### Mutating Equality-Relevant State

Changing any state that participates in equality or hashing while an element is
stored invalidates the assumptions used to place it. Value-type elements can't be
mutated in place through a set; remove the old value and insert or update the new
value.

Reference elements require more care because code can mutate the object through
another reference:

```swift
final class Token: Hashable {
    var rawValue: String

    init(_ rawValue: String) { self.rawValue = rawValue }

    static func == (lhs: Token, rhs: Token) -> Bool {
        lhs.rawValue == rhs.rawValue
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(rawValue)
    }
}

let token = Token("old")
var tokens: Set = [token]
token.rawValue = "new"  // The set's hash-table placement is now stale.
```

After this mutation, lookup or removal can fail and apparent uniqueness can be
violated. Prefer immutable identity for hashable reference types. If identity
must change, remove the member before mutation and reinsert it afterward; in
shared systems, prevent intervening observation or use a value snapshot.

### Set Algebra

Set operations make business rules explicit:

| Operation | Result |
|---|---|
| `a.union(b)` | Members in either set |
| `a.intersection(b)` | Members in both sets |
| `a.subtracting(b)` | Members in `a` but not `b` |
| `a.symmetricDifference(b)` | Members in exactly one set |

```swift
let current: Set = ["read", "write"]
let desired: Set = ["read", "share"]

let toGrant = desired.subtracting(current)   // {"share"}
let toRevoke = current.subtracting(desired)  // {"write"}
let unchanged = current.intersection(desired) // {"read"}
```

Use the mutating forms such as `formUnion(_:)` when updating an owned set in
place is clearer and profiling shows avoiding an intermediate result matters.

### Membership Relationships

Relationships express validation rules without manual loops:

- `a == b`: both sets contain exactly the same members.
- `a.isSubset(of: b)`: every member of `a` is in `b`; equality is allowed.
- `a.isStrictSubset(of: b)`: `a` is a subset and is not equal to `b`.
- `a.isSuperset(of: b)` and `isStrictSuperset(of:)`: inverse relationships.
- `a.isDisjoint(with: b)`: the sets share no members.

An empty set is a subset of every set, including itself, but it isn't a strict
subset of itself. “Strict” encodes proper containment, not stronger checking.

### Iteration and Ordering

`Set` has no defined ordering. Current output can appear stable in a narrow run,
but insertion, removal, resizing, hash seeding, runtime changes, or a different
toolchain can change it.

Sort at the boundary when a deterministic presentation or serialization is
required:

```swift
let stableNames = names.sorted()
```

Sorting produces an array and costs O(n log n). If insertion order or a custom
order is domain state, `Set` alone is the wrong representation. Use an ordered
collection, or maintain an array plus a set behind one abstraction that preserves
their consistency.

### Value Semantics and Reference Elements

Set assignment creates logically independent set values. The implementation can
share storage until one value mutates through copy-on-write:

```swift
var first: Set = [1, 2]
var second = first
second.insert(3)

// first remains {1, 2}; second contains {1, 2, 3}.
```

The first write after sharing may allocate and copy storage. As with arrays,
copy-on-write is an optimization beneath the value contract.

If elements are class references, copying a set copies references, not the
objects. Both sets can observe object mutation. This is especially hazardous when
that mutation changes equality or hashing, but even nonidentity mutation means
the collection isn't a deep snapshot.

### Complexity, Hash Quality, and Resizing

Hash-table operations such as insertion, membership lookup, update, and removal
are expected O(1) on average. They can degrade toward O(n) with extensive
collisions or adversarial behavior. Individual insertions can also allocate and
rehash during capacity growth; average behavior across growth is the relevant
expectation.

A correct but low-quality custom hash that maps many unequal values together
preserves results but damages latency and CPU use. Feed all equality-relevant
components to `Hasher` and let it provide the mixing. Don't combine fields with a
home-grown XOR formula, and don't omit varying identity fields for convenience.

Use `reserveCapacity(_:)` when a reliable approximate member count is known and
large incremental growth is expected. Capacity and bucket layout remain
implementation details.

### Core Invariants

- Every distinct element according to `==` appears at most once.
- Equal elements produce consistent hash input.
- Equality- and hash-relevant state remains stable while stored.
- Membership, not iteration position, defines the collection's value.
- Set value semantics isolate structural mutation between set values.
- Element reference semantics remain intact.

### Constraints and Guarantees

- Element types conform to `Hashable`; collisions between unequal elements are
  permitted.
- Iteration order, bucket layout, hash values, capacity, and resize strategy are
  not durable contracts.
- Average constant-time lookup is a hash-table performance expectation, not an
  absolute worst-case guarantee.
- Copy-on-write doesn't make shared mutation atomic or deeply copy reference
  elements.
- Sending a set across isolation boundaries requires sendable elements; concurrent
  mutation of one shared variable still requires isolation.

## Failure Modes

- **Persisting iteration order:** Produces unstable snapshots, payloads, or tests.
- **Persisting `hashValue`:** Breaks identity across executions and toolchains.
- **Hashing fewer fields than equality requires:** Creates inconsistent
  conformances and invalid lookup behavior.
- **Mutating a stored reference's identity fields:** Makes its bucket placement
  stale and lookup unreliable.
- **Using Set when UI order matters:** Loses domain information and encourages
  accidental sorting rules.
- **Keeping an array as the only uniqueness check:** Repeated linear scans can
  become quadratic during bulk ingestion.
- **Assuming COW is thread safety:** Allows races on a shared mutable set or on
  referenced elements.
- **Trusting average complexity as a latency ceiling:** Misses collision and
  resize spikes in performance-sensitive paths.

## Engineering Judgment

### When to Use It

- Uniqueness is an invariant and order is irrelevant.
- Membership checks, deduplication, set algebra, or relationship tests dominate.
- Element equality accurately represents domain membership identity.
- Expected hash-table performance is appropriate for the workload.

### When Not to Use It

- Duplicate count or insertion order carries meaning.
- Positional random access or stable presentation order is required.
- Elements can't provide stable, coherent `Hashable` semantics.
- A small array is clearer and membership lookup isn't a meaningful cost.
- Deterministic sorted traversal dominates and a sorted representation better
  owns that requirement.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `Set<Element>` | Enforced uniqueness, expected O(1) membership, set algebra | No order contract, hashing overhead | Unordered membership |
| `[Element]` | Preserved order and duplicates, simple traversal | O(n) membership and manual uniqueness | Small ordered sequences |
| Array plus Set | Stable order and expected O(1) membership | Duplicate storage and consistency invariant | Ordered unique values behind one owner |
| Sorted array | Deterministic order, compact traversal | O(n) insertion; lookup/update design is more complex | Read-heavy sorted snapshots |
| Dictionary keyed by ID | Direct lookup with associated payload | Key/value invariant and conflict policy | Unique identity with mutable data |

### Alternatives

When order and uniqueness are both first-class, expose one abstraction that owns
both rather than allowing callers to mutate a parallel array and set separately.
An ordered-set implementation can encode the invariant directly. A dictionary
can be more appropriate when uniqueness is based on stable ID but the stored
payload changes independently of that ID.

## Production Considerations

### Performance

Measure complete workloads: hashing cost, collision distribution, allocation,
resizing, COW separation, and any sorting at output boundaries. Sets can be slower
than arrays for very small collections despite better asymptotic lookup. Reserve
capacity for predictable bulk construction and avoid repeated array-to-set
conversion inside hot loops.

### Concurrency and Thread Safety

`Set` conditionally conforms to `Sendable` when its element is `Sendable`. This
allows the value to cross an isolation boundary; it doesn't authorize concurrent
mutation of the same variable or make a mutable referenced element safe.

Keep mutable sets actor-isolated or under one synchronization owner. Prefer
immutable snapshots for cross-task reads, and require stable sendable identity
types at API boundaries.

### Testing

Test membership and relationship results, never raw iteration order. Add contract
tests for custom `Hashable` types: equal samples must hash from identical
components, duplicate logical identities must collapse, and nonidentity changes
must not alter equality. Exercise empty, fully overlapping, partially overlapping,
and disjoint set algebra cases.

Performance tests should include realistic distributions and bulk sizes; one
friendly dataset won't reveal poor hash quality or resize spikes.

### Observability and Debugging

Log stable element IDs and counts, not hash values or bucket assumptions. Useful
signals include input count versus unique count, duplicate rate, collision-related
latency observed through profiling, and resize-heavy allocation spikes. Sort only
the diagnostic representation when deterministic logs are useful.

### Compatibility and Migration

When migrating from a duplicate-prone array:

1. Define and document what makes two elements the same.
2. Audit existing duplicates and decide whether to reject, keep first, keep last,
   or merge them.
3. Confirm whether callers implicitly depend on array order.
4. Introduce the set behind an API boundary and dual-run validation if data risk
   is high.
5. Make serialization deterministic independently of set iteration.
6. Remove old linear uniqueness checks after telemetry confirms equivalent
   behavior.

Changing `[Element]` to `Set<Element>` is a data-model migration, not a mechanical
type substitution: it changes duplicate, ordering, and often conflict semantics.

## Staff and Principal Perspective

### System Impact

The chosen `Hashable` identity propagates into caches, synchronization, diffing,
authorization, persistence adapters, and API behavior. If different subsystems
use different equality definitions, a local set can appear correct while the
system loses or conflates entities at boundaries.

### Decision Framework

Record the answers to these questions:

1. What exact fields define membership identity, and are they immutable?
2. Are duplicates invalid input, idempotent repeats, or mergeable updates?
3. Is order presentation-only or durable domain state?
4. What are the expected collection sizes, lookup patterns, and latency limits?
5. Who owns mutation, concurrency isolation, and serialization policy?
6. How will a change in identity semantics be migrated and observed?

### Organizational Impact

Assign ownership of canonical identity types and review manual `Hashable`
conformances as compatibility-sensitive code. Shared libraries should provide
domain operations rather than expose parallel order and membership structures.
For migrations, align producers and consumers on duplicate policy, deploy
instrumentation before enforcement, and define rollback behavior for rejected or
collapsed data.

## Common Mistakes

### Treating a Hash as Identity

**Why it is wrong:** Hashes can collide and can change between executions.

**Better approach:** Persist and compare a stable domain identifier; use hashing
only as an in-process lookup mechanism.

### Hashing Mutable Presentation State

**Why it is wrong:** Renaming an object can make a stored member unreachable and
accidentally redefine uniqueness.

**Better approach:** Hash immutable identity and keep presentation data outside
the equality contract when the domain permits it.

### Testing the Printed Set

**Why it is wrong:** Printed and iteration order is unspecified.

**Better approach:** Compare sets directly or sort a deliberately ordered test
projection.

## References

- [The Swift Programming Language: Sets](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Sets)
- [The Swift Programming Language: Performing Set Operations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Performing-Set-Operations)
- [Swift Standard Library: Set](https://developer.apple.com/documentation/swift/set)
- [Swift Standard Library: Hashable](https://developer.apple.com/documentation/swift/hashable)
- [SE-0206: Hashable Enhancements](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0206-hashable-enhancements.md)
- [SE-0302: Sendable and @Sendable Closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
