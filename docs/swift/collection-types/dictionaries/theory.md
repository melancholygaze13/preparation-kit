---
title: "Dictionaries: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-20
tags:
  - dictionaries
  - hashable
  - optionals
  - value-semantics
  - collections
---

# Dictionaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `Dictionary<Key, Value>` models unordered lookup from each unique `Hashable`
> key to one associated value.

- Reading `dictionary[key]` returns `Value?` because the key can be absent;
  assignment of outer `nil` removes the key.
- If `Value` is optional, missing and present-with-`nil` are distinct states and
  require deliberate nested-optional handling.
- `updateValue` and `removeValue` return prior or removed values; the
  default-value subscript supports read-modify-write without manual branching.
- Lookup is expected O(1) on average, with collision, hashing, resizing, and COW
  costs outside any worst-case constant-time guarantee.
- Keys, values, and iteration have no defined order; deterministic output needs
  an explicit ordering rule.

## Mental Model

A dictionary is an in-memory index. Hashing narrows where a key could be stored;
equality confirms the key. The key defines stable lookup identity, while the value
is the replaceable payload associated with that identity.

```swift
var displayNames: [UUID: String] = [:]
displayNames[userID] = "Ana"

let name: String? = displayNames[userID]
```

Absence is part of the read API because any valid key might not be present. It
must be translated into domain behavior rather than force-unwrapped away.

## How It Works

### Hashable Keys and Stable Identity

`Dictionary` requires `Key: Hashable`. Equal keys must feed equivalent components
to `Hasher`; unequal keys may collide and are distinguished with equality. The
same consistency and mutation rules that apply to set members apply to dictionary
keys.

Use immutable domain keys:

```swift
struct UserID: Hashable, Sendable {
    let rawValue: UUID
}
```

Avoid keying by mutable display names, localized strings, whole mutable models, or
transient array positions. A key is an API and data-model contract. Its
`hashValue` is not the key and must not be persisted.

Reference-type keys are hazardous when equality- or hash-relevant properties can
change after insertion. The dictionary doesn't observe property changes and
rehash automatically. Prefer small immutable value keys even when values are
reference types.

### Subscript Read and Write Semantics

The primary subscript expresses both lookup and mutation:

```swift
var scores: [String: Int] = ["Ana": 10]

let existing = scores["Ana"]      // Int? == 10
let missing = scores["Bo"]        // Int? == nil

scores["Bo"] = 8                  // Insert.
scores["Ana"] = 11                // Replace.
scores["Bo"] = nil                // Remove.
```

A read returns `Value?` because the key can be absent. A write of a value inserts
or replaces. Assigning outer `nil` removes the key; it doesn't store a nil entry
for an ordinary nonoptional `Value`.

Use optional binding, `guard`, or a domain default when absence is expected. A
forced unwrap is justified only when a nearby invariant makes presence certain
and a trap is the intended response to programmer error.

### Missing Key Versus Optional Stored Value

When `Value` is itself optional, subscript lookup has the conceptual type
`Value?`, producing two optional layers:

```swift
var cache: [String: Int?] = [:]

cache["known-empty"] = .some(nil)

cache["missing"]      // outer nil: key is absent
cache["known-empty"]  // outer some, inner nil: key is present with nil
```

These states can represent “not loaded” versus “loaded and no result,” but they
are easy to collapse accidentally with ordinary optional binding or `??`.

Assignment is equally precise:

```swift
cache["known-empty"] = nil         // Remove the key (outer nil).
cache["known-empty"] = .some(nil)  // Store an optional nil value.
```

`updateValue(nil, forKey:)` accepts `nil` as the `Int?` value and therefore stores
a present nil rather than removing the key. If this distinction is important,
consider a domain enum such as `.notLoaded`, `.missing`, and `.value(Int)`; it is
often clearer than nested optionals.

### updateValue and removeValue

Use methods when the previous state affects behavior:

```swift
if let previous = scores.updateValue(12, forKey: "Ana") {
    print("Replaced \(previous)")
}

if let removed = scores.removeValue(forKey: "Ana") {
    print("Removed \(removed)")
}
```

`updateValue(_:forKey:)` inserts or replaces and returns the old value when the
key existed. `removeValue(forKey:)` removes and returns the associated value when
present. Their optional results can again be nested when `Value` is optional, so
don't use a simple `if let` if present-nil is a meaningful prior state.

### Default-Value Subscript

The default-value subscript supplies a fallback and supports efficient
read-modify-write:

```swift
var counts: [String: Int] = [:]

for word in words {
    counts[word, default: 0] += 1
}
```

Reading `counts[key, default: 0]` returns the stored value or the default. A plain
read of a missing key doesn't need to insert the default; mutating through this
subscript writes the updated value into the dictionary.

Choose defaults that are true identity values for the operation: zero for
addition, an empty array for append, or an empty set for membership accumulation.
Don't use a convenient default that hides invalid absence.

### Merge and Conflict Resolution

Merging requires an explicit policy for duplicate keys:

```swift
var inventory = ["apple": 2, "pear": 1]
inventory.merge(["apple": 3, "orange": 4]) { current, incoming in
    current + incoming
}
```

`merge(_:uniquingKeysWith:)` mutates the receiver. `merging` returns a new
dictionary. The combining closure is called when both inputs contain an equal
key, and its argument order matters when implementing keep-current,
keep-incoming, aggregation, version selection, or validation.

Conflict policy is domain logic:

- **Keep current:** existing configuration has precedence.
- **Keep incoming:** a newer authoritative snapshot replaces local state.
- **Combine:** counters, sets, or partial records can be safely aggregated.
- **Reject:** duplicates indicate corrupt or ambiguous input.

Document associativity and ordering assumptions if merges occur in batches or in
distributed flows. A “last write wins” closure is not meaningful unless the
system defines a reliable ordering or version.

### Keys and Values Views

`dictionary.keys` and `dictionary.values` are collection views over the
dictionary, not arrays with an independent stable order:

```swift
for key in scores.keys { /* unordered */ }
for value in scores.values { /* unordered */ }

let sortedNames = scores.keys.sorted()
let materializedValues = Array(scores.values)
```

Materialize an Array only when an API requires owned array storage or a stable
snapshot. A view's validity and observed contents are tied to the dictionary
value from which it is used; avoid treating it as a durable identity-bearing
collection.

### Iteration Order Is Not a Contract

Dictionary iteration yields `(key, value)` tuples, but the order is undefined.
The same applies to `keys` and `values`. Mutation, resizing, hash seeding,
construction history, and runtime changes can alter traversal.

For deterministic output, sort stable keys and then look up values, or sort
key-value pairs with an explicit comparator. Never sort by `hashValue`. If order
is domain state, use an ordered representation instead of reconstructing it from
a dictionary.

### Value Semantics and Copy-on-Write

Dictionary assignment creates logically independent dictionary values:

```swift
var first = ["a": 1]
var second = first
second["b"] = 2

// first remains ["a": 1].
```

Storage may remain shared until mutation. The first write after sharing can
allocate and copy, and capacity growth can rehash entries. These are performance
effects beneath the value-semantic contract.

Keys and values keep their own semantics. Two copied dictionaries can contain
references to the same mutable value object. Mutating that object is visible
through both dictionaries; COW only isolates changes to dictionary storage and
value slots. Mutable reference keys additionally risk corrupting lookup
assumptions.

### Complexity, Hash Quality, and Capacity

Lookup, insertion, update, and removal are expected O(1) on average. Worst-case
behavior can approach O(n) under heavy collision. Individual insertions can also
allocate and rehash during resizing, and a COW separation can copy O(n) entries.

Hash all equality-relevant key components through `Hasher`. Use
`reserveCapacity(_:)` for predictable bulk construction. Measure hashing cost,
collision distribution, resize allocation, COW patterns, and value-copy cost on
realistic data rather than treating asymptotic averages as latency ceilings.

### Core Invariants

- Each distinct key according to equality is associated with at most one value.
- Equal keys supply consistent hash input.
- Equality- and hash-relevant key state remains stable while stored.
- A missing key is represented by the outer optional returned from lookup.
- Dictionary structure has value semantics; key and value reference semantics are
  preserved.
- Ordering is never inferred from traversal.

### Constraints and Guarantees

- `Key` conforms to `Hashable`; `Value` has no hashing requirement.
- Subscript read returns `Value?`; assigning outer `nil` removes a key.
- Hash collisions are valid, while inconsistent equality and hashing are not.
- Iteration order, hash values, bucket layout, capacity, and resize strategy are
  not persistent contracts.
- Expected constant-time lookup is not a worst-case guarantee.
- A sendable dictionary can cross isolation boundaries only when key and value
  types are sendable; this does not make shared mutation safe.

## Failure Modes

- **Force-unwrapping a normal lookup miss:** Converts expected absence into a
  crash.
- **Collapsing nested optional states:** Loses “present but no value” versus
  “absent” semantics.
- **Assigning nil when intending to store an optional nil:** Removes the key.
- **Using mutable reference keys:** Makes inserted entries unreachable after key
  identity changes.
- **Using a mutable or localized label as a key:** Breaks stable lookup and
  migration when presentation changes.
- **Ignoring merge conflicts:** Silently drops or overwrites data according to an
  accidental closure.
- **Persisting iteration order:** Produces nondeterministic payloads and tests.
- **Copying a dictionary of objects as a snapshot:** Shares referenced payloads.
- **Sharing a mutable dictionary across tasks:** Creates a race despite value
  semantics.
- **Repeatedly scanning an array for keyed lookup:** Can make bulk workflows
  quadratic.

## Engineering Judgment

### When to Use It

- A stable unique key identifies one replaceable value.
- Lookup, update, removal, grouping, or aggregation by key dominates.
- Order is irrelevant or applied explicitly at a boundary.
- Duplicate-key conflict behavior can be defined.

### When Not to Use It

- Sequence order or duplicate entries carry domain meaning.
- Keys can't remain stable and hashable.
- Range queries or persistent sorted traversal dominate.
- Multiple values per key are required without a clear grouped-value model.
- A tiny ordered array is simpler and performance is immaterial.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `[Key: Value]` | Unique keyed lookup, expected O(1) access | No order contract, hashing and resize overhead | In-memory index |
| `[(Key, Value)]` | Preserves order and duplicates | O(n) lookup, no enforced key uniqueness | Ordered event-like pairs |
| `[Value]` plus linear ID search | Simple ordered storage | O(n) keyed operations and manual duplicate policy | Small presentation collections |
| Array plus Dictionary index | Order and fast keyed lookup | Dual-state consistency and memory cost | Ordered mutable models behind one owner |
| Sorted key-value array | Deterministic traversal and compact snapshots | O(n) insertion; more lookup/update work | Read-heavy sorted data |

### Alternatives

Use a set when only membership matters. Use a dictionary when the key identifies
associated payload. When order and keyed lookup are both first-class, use an
ordered dictionary or hide an array-plus-index implementation behind one type.
For multimap behavior, model `[Key: [Value]]` or `[Key: Set<Value>]` and define
both per-key duplicate and ordering semantics.

## Production Considerations

### Performance

An array-to-dictionary migration improves repeated keyed lookup from linear to
expected constant time, but increases memory, hashing, and construction cost.
Avoid rebuilding the index for every lookup or render. Reserve capacity for bulk
loads, select compact stable key types, and profile output sorting if every
consumer needs deterministic order.

### Concurrency and Thread Safety

Dictionary conditionally conforms to `Sendable` when both `Key` and `Value` are
`Sendable`. Transfer an immutable snapshot across isolation, or keep mutation
inside an actor or another synchronization owner. Conditional sendability doesn't
make compound operations such as check-then-insert atomic.

Reference values can expose shared mutable state even when dictionary storage is
isolated. Prefer sendable value snapshots or actors for shared services, and make
concurrency ownership part of repository and cache APIs.

### Testing

Test present, absent, replacement, removal, and default-subscript paths. For
optional values, explicitly test all nested states. Test every documented merge
conflict case, including argument precedence and nonassociative closures. Compare
dictionaries by content; sort a projection only when testing an explicit output
order.

Custom key tests should verify equality and hashing agreement, stable identity
under nonidentity changes, and collision correctness. Performance tests should
exercise realistic key distributions, resize points, and COW mutation patterns.

### Observability and Debugging

Log stable keys, hit/miss rates, entry counts, duplicate-key conflicts, merge
decisions, eviction reasons, and lookup latency. Never log or correlate by
`hashValue`. For sensitive keys, use an approved redaction or durable diagnostic
identifier rather than exposing raw identity.

### Compatibility and Migration

To migrate from an array-based keyed lookup:

1. Define the canonical stable key and audit missing or duplicate keys.
2. Decide duplicate resolution: reject, keep first, keep last, or merge.
3. Determine whether callers depend on array order or duplicate position.
4. Build the dictionary once at an ownership boundary, not per lookup.
5. Dual-read or compare array and dictionary results for high-risk migrations.
6. Instrument conflicts and misses, then remove the old scan after validation.

The initializer `Dictionary(_:uniquingKeysWith:)` can encode conflict resolution
when converting pairs. Don't choose `{ _, incoming in incoming }` merely to make
the initializer succeed; that silently declares a precedence rule.

## Staff and Principal Perspective

### System Impact

A dictionary key often mirrors a service, database, cache, or analytics identity.
Changing its equality semantics can merge previously distinct records, fragment
one entity into several entries, invalidate caches, or alter synchronization.
Local type design therefore has cross-boundary compatibility consequences.

### Decision Framework

Evaluate:

1. Which system owns the canonical key, and can it ever be reassigned?
2. What does absence mean, and is optional payload a separate state?
3. Which source wins on duplicate or merge conflict, and why?
4. Is ordering presentation-only or persisted domain state?
5. What sizes, mutation patterns, and latency requirements shape representation?
6. Who owns concurrent mutation and atomic compound operations?
7. How will identity or conflict-policy migrations be observed and rolled back?

### Organizational Impact

Publish canonical key types and merge policies at shared boundaries. Keep
repositories and caches responsible for atomic access rather than leaking mutable
dictionaries to callers. When identity changes, coordinate schema, service,
client, cache, and analytics owners; backfill data; dual-compute results; define
compatibility windows; and retain rollback until old readers and persisted keys
are retired.

## Common Mistakes

### Treating Subscript Lookup as Total

**Why it is wrong:** Any valid key can be absent, so the read result is optional.

**Better approach:** Translate absence into a domain result, error, default, or
invariant check at the owning boundary.

### Using `??` to Erase Meaningful States

**Why it is wrong:** A default can conflate absent, present-nil, and legitimate
domain values.

**Better approach:** Pattern-match nested optionals or use a domain enum with
named states.

### Keeping the Last Duplicate Without a Policy

**Why it is wrong:** Input order becomes an undocumented source-of-truth rule.

**Better approach:** Validate duplicates and encode an explicit, observable
conflict strategy.

## References

- [The Swift Programming Language: Dictionaries](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Dictionaries)
- [Swift Standard Library: Dictionary](https://developer.apple.com/documentation/swift/dictionary)
- [Swift Standard Library: Hashable](https://developer.apple.com/documentation/swift/hashable)
- [SE-0206: Hashable Enhancements](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0206-hashable-enhancements.md)
- [SE-0302: Sendable and @Sendable Closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
