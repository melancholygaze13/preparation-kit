---
title: "Dictionaries: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: interview
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

# Dictionaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why must Dictionary keys be Hashable?](#q1-hashable-keys) | Senior | Key identity and expected lookup cost |
| [What exactly does Dictionary subscript optionality mean?](#q2-subscript-optionality) | Senior | Absence, removal, and nested optionals |
| [When should you use updateValue, removeValue, or the default subscript?](#q3-mutation-apis) | Senior | Intent and prior-state handling |
| [How should dictionary merges resolve duplicate keys?](#q4-merge-conflicts) | Senior | Domain conflict policy |
| [Why are Dictionary iteration, keys, and values unordered?](#q5-iteration-and-views) | Senior | Views and deterministic boundaries |
| [When is Dictionary better than an array-based lookup?](#q6-dictionary-versus-array) | Senior | Representation, complexity, and migration |
| [How should a system own keys, absence, and concurrent mutation?](#q7-system-ownership) | Staff | Cross-boundary contracts and rollout |

---

<a id="q1-hashable-keys"></a>
## Q1: Why Must Dictionary Keys Be Hashable?

### What It Evaluates

Whether the candidate connects hashing, equality, stable identity, and lookup
complexity.

### Short Answer

Dictionary uses a key's hash to locate candidate storage and equality to confirm
the key, enabling expected O(1) lookup, insertion, and removal on average. Equal
keys must hash consistently; unequal keys may collide. Key identity must remain
stable while stored, and `hashValue` itself is neither unique nor persistent.

### Detailed Answer

The hash table avoids scanning every pair by narrowing the search from the key's
hash. It still checks equality because collisions are valid. A custom key must
make `==` and `hash(into:)` describe the same identity.

Stable identity is as important as conformance syntax. If a reference key's
hash-relevant property changes, it remains stored according to its old hash and
future lookup can fail. Prefer immutable value keys such as `UserID` over entire
mutable models or labels.

### Engineering Trade-offs

- Hash tables improve average keyed access but add memory and hashing cost.
- Compact immutable IDs are cheap and stable; composite keys can encode richer
  identity at greater hashing and migration cost.
- Poor hash quality degrades performance even when correctness remains intact.

### Production Scenario

A cache keys profiles by mutable username. Renaming a user creates a miss and
leaves an orphaned old entry. Moving to immutable account ID fixes lookup and
aligns the cache with service identity.

### Follow-up Questions

- May unequal keys have the same hash?
- Can a hash be used as a database primary key?
- What happens when a class key changes after insertion?

### Strong Answer Signals

- Separates hash location from equality confirmation.
- Uses average or expected complexity, not a worst-case promise.
- Requires immutable domain identity.

### Weak Answer Signals

- Claims hashes uniquely identify keys.
- Hashes different fields than equality compares.
- Uses mutable presentation state as a durable key.

### Related Theory

- [Hashable Keys and Stable Identity](theory.md#hashable-keys-and-stable-identity)
- [Complexity, Hash Quality, and Capacity](theory.md#complexity-hash-quality-and-capacity)

---

<a id="q2-subscript-optionality"></a>
## Q2: What Exactly Does Dictionary Subscript Optionality Mean?

### What It Evaluates

Precise understanding of absent keys, optional values, and assignment semantics.

### Short Answer

Reading `dictionary[key]` returns `Value?`: outer `nil` means the key is absent.
Assigning outer `nil` removes the key. If `Value` is itself optional, lookup is
conceptually nested: outer nil is absent, while outer some containing inner nil is
a present key with a nil value. Use `.some(nil)` or `updateValue(nil, forKey:)` to
store that state, or prefer a domain enum when the distinction matters.

### Detailed Answer

```swift
var values: [String: Int?] = [:]

values["empty"] = .some(nil) // present, stored value is nil
values["missing"]            // outer nil: absent
values["empty"]              // outer some, inner nil

values["empty"] = nil        // remove
```

Ordinary `if let` unwraps the outer optional and then the inner optional may still
be nil. Operators such as `??` can intentionally or accidentally collapse these
states. If they represent cache loading or business status, an enum makes states
and transitions clearer.

### Engineering Trade-offs

- Optional values compactly represent three states but are easy to misread.
- A domain enum adds code while making state exhaustive and named.
- Removing by nil is concise but can obscure intent in optional-valued
  dictionaries; `removeValue` is explicit.

### Production Scenario

A cache uses absent for “not fetched” and stored nil for “server confirmed no
record.” A generic `cache[id] ?? nil` collapses both, causing repeated requests.
An enum-backed cache entry makes loading state explicit.

### Follow-up Questions

- What does `dictionary[key] = nil` do?
- How do you store nil when `Value == Int?`?
- When is a nested optional preferable to an enum?

### Strong Answer Signals

- Names outer versus inner optional states.
- Distinguishes removal from storing an optional nil.
- Connects representation to domain state.

### Weak Answer Signals

- Says dictionaries can't store optional values.
- Claims assigning nil always stores nil.
- Force-unwraps to avoid reasoning about absence.

### Related Theory

- [Subscript Read and Write Semantics](theory.md#subscript-read-and-write-semantics)
- [Missing Key Versus Optional Stored Value](theory.md#missing-key-versus-optional-stored-value)

---

<a id="q3-mutation-apis"></a>
## Q3: When Should You Use updateValue, removeValue, or the Default Subscript?

### What It Evaluates

API selection based on required state transitions rather than syntax preference.

### Short Answer

Use ordinary subscript assignment when only the final association matters. Use
`updateValue` when the previous value affects logging, validation, or behavior,
and `removeValue` when the removed value matters or removal should be explicit.
Use the default-value subscript for read-modify-write with a true identity default,
such as incrementing a missing counter from zero.

### Detailed Answer

`updateValue(_:forKey:)` returns the old value or nil if the key was absent.
`removeValue(forKey:)` returns the removed value or nil. With optional `Value`,
these results are conceptually nested, so simple optional binding can miss a
present-nil state.

The default-value subscript is well suited to accumulation:

```swift
counts[word, default: 0] += 1
groups[key, default: []].append(value)
```

A plain read with a default doesn't need to insert. Mutation through the subscript
writes the modified result. Don't default a missing authorization, price, or
configuration merely because the syntax is convenient.

### Engineering Trade-offs

- Subscripts are concise but don't return prior state.
- Method results support audit and conditional behavior.
- Defaults simplify accumulation but can hide invalid absence.

### Production Scenario

A metrics aggregator uses the default subscript to increment counts. A
configuration loader instead uses `guard let`, because treating a missing timeout
as zero would create immediate failures rather than expose invalid configuration.

### Follow-up Questions

- Does reading with a default insert the key?
- What does `updateValue` return on insertion?
- Why might `removeValue` be clearer than assigning nil?

### Strong Answer Signals

- Selects APIs from whether prior state is needed.
- Uses algebraic identity defaults for aggregation.
- Keeps invalid absence visible.

### Weak Answer Signals

- Uses defaults for every missing key.
- Claims `updateValue` returns the new value.
- Ignores nested optional results.

### Related Theory

- [updateValue and removeValue](theory.md#updatevalue-and-removevalue)
- [Default-Value Subscript](theory.md#default-value-subscript)

---

<a id="q4-merge-conflicts"></a>
## Q4: How Should Dictionary Merges Resolve Duplicate Keys?

### What It Evaluates

Recognition that the combining closure encodes a domain conflict policy.

### Short Answer

Every merge must define what an equal key means and which value wins: keep
current, keep incoming, combine, select by version, or reject. The closure's
argument order matters, and “last write wins” is valid only when the system has a
meaningful ordering. Use mutating `merge` under owned mutation and nonmutating
`merging` when an independent result is clearer.

### Detailed Answer

```swift
totals.merge(incoming) { current, next in current + next }
```

Addition is a natural policy for counts. Configuration precedence may keep
current or incoming. Entity records may require an explicit version comparison.
Security or financial data may reject duplicates instead of silently combining.

If a merge is distributed or parallelized, determine whether the operation is
associative and commutative. A result that depends on processing order cannot be
replayed deterministically without preserving that order or version metadata.

### Engineering Trade-offs

- Silent precedence is simple but can lose data.
- Validation exposes corruption but can reject legacy input.
- Combining preserves information only when the domain operation is valid.
- Version-based selection adds metadata and clock or ordering assumptions.

### Production Scenario

Offline and server records share IDs. The client initially keeps incoming values,
overwriting newer local edits. The sync policy moves to per-field version vectors
and emits conflicts that can't be resolved safely.

### Follow-up Questions

- What order are closure arguments passed in?
- Is the merge operation associative or commutative?
- How should duplicate input be observed?

### Strong Answer Signals

- Treats merge behavior as domain policy.
- Identifies ordering and version assumptions.
- Includes telemetry or rejection for unsafe conflicts.

### Weak Answer Signals

- Always keeps incoming values without justification.
- Assumes processing order is globally meaningful.
- Uses a merge closure solely to suppress duplicate-key failure.

### Related Theory

- [Merge and Conflict Resolution](theory.md#merge-and-conflict-resolution)

---

<a id="q5-iteration-and-views"></a>
## Q5: Why Are Dictionary Iteration, Keys, and Values Unordered?

### What It Evaluates

Ability to distinguish collection views and observed implementation behavior from
documented ordering contracts.

### Short Answer

Dictionary is a hash-based keyed collection with no defined traversal order.
Iteration and the `keys` and `values` views inherit that lack of ordering; hash
seeding, resizing, mutation, construction history, and runtime changes can alter
it. Sort by a stable domain key for deterministic presentation or serialization,
and materialize an Array only when independent array storage is required.

### Detailed Answer

The views avoid an automatic array allocation and let callers traverse current
keys or values. They are not insertion-ordered arrays. Tests should compare
dictionary content, not tuple sequence. A signed or cached payload should derive a
canonical ordering from stable keys before encoding.

Sorting values alone can lose their association or produce ambiguous ties. Often
the correct boundary is sorted keys followed by lookup, or sorted key-value pairs
using key as a tie-breaker.

### Engineering Trade-offs

- Views avoid materialization but provide no stable order.
- Sorting adds O(n log n) work and allocation.
- An ordered dictionary owns order directly at added storage and mutation cost.

### Production Scenario

Snapshot tests encode a dictionary directly and become flaky across process
launches. The serializer canonicalizes by stable key, while unit tests compare
dictionary equality separately from serialization order.

### Follow-up Questions

- Are `keys` and `values` Arrays?
- Should deterministic output sort by hash value?
- What if insertion order is domain state?

### Strong Answer Signals

- Applies the order rule to iteration and both views.
- Uses an explicit stable comparator at boundaries.
- Selects an ordered representation when order is state.

### Weak Answer Signals

- Assumes modern Dictionary preserves insertion order as a contract.
- Snapshot-tests raw description output.
- Sorts by process-local hashes.

### Related Theory

- [Keys and Values Views](theory.md#keys-and-values-views)
- [Iteration Order Is Not a Contract](theory.md#iteration-order-is-not-a-contract)

---

<a id="q6-dictionary-versus-array"></a>
## Q6: When Is Dictionary Better Than an Array-Based Lookup?

### What It Evaluates

Representation decisions, complexity reasoning, and migration safety.

### Short Answer

Choose Dictionary when a stable unique key maps to one value and repeated lookup,
update, or removal by key dominates. Those operations are expected O(1) on
average versus an array's O(n) scan. Keep Array when order, duplicates, or
positional traversal is the actual model, especially for small collections. If
both order and keyed lookup matter, one abstraction should own an array plus
index or an ordered dictionary.

### Detailed Answer

Asymptotic lookup isn't the only criterion. A dictionary costs hashing, extra
storage, resizing, and often output sorting. An array can be superior for a small,
read-sequential list. Rebuilding a dictionary for every single lookup defeats its
benefit; build and retain the index at the correct ownership boundary.

Migration also changes semantics. Duplicate array entries require a keep, merge,
or reject policy, and dictionary traversal can't preserve implicit array order.
Audit these dependencies before changing the type.

### Engineering Trade-offs

- Dictionary improves repeated keyed access but adds memory and hash cost.
- Array keeps compact sequence semantics but scales linearly for lookup.
- Dual structures support both access patterns but require atomic consistency.

### Production Scenario

A screen repeatedly finds models by ID in a ten-thousand-element array, producing
quadratic diffing. A repository builds one dictionary index and returns ordered
IDs separately, keeping identity lookup and presentation order explicit.

### Follow-up Questions

- Where should the index be built and retained?
- How do you handle duplicate array IDs during migration?
- When would a small array still be preferable?

### Strong Answer Signals

- Balances semantics, average complexity, memory, and collection size.
- Audits duplicates and order during migration.
- Gives dual state one owner.

### Weak Answer Signals

- Converts the array to a dictionary on every lookup.
- Silently keeps whichever duplicate is processed last.
- Discards required ordering.

### Related Theory

- [Trade-offs](theory.md#trade-offs)
- [Compatibility and Migration](theory.md#compatibility-and-migration)

---

<a id="q7-system-ownership"></a>
## Q7: How Should a System Own Keys, Absence, and Concurrent Mutation?

### What It Evaluates

Staff-level design of identity contracts, repository boundaries, concurrency,
and migration.

### Short Answer

The domain boundary should own canonical immutable key types and define absence,
optional payload, duplicate, and merge semantics. A repository, actor, or cache
owner should encapsulate mutable dictionary state and atomic compound operations;
callers receive values or snapshots rather than shared mutable storage. Identity
changes require coordinated schema and API migration, telemetry, compatibility
windows, and rollback.

### Detailed Answer

Conditional `Sendable` conformance means a dictionary can cross isolation when
its keys and values are sendable. It doesn't make check-then-insert atomic or make
shared reference values safe. Ownership should provide operations such as
`value(for:)`, `upsert`, and `remove`, with actor isolation or synchronization
where state is shared.

The same boundary translates raw optional lookup into domain results: not loaded,
not found, forbidden, or corrupt should not all become nil. It also implements
canonical conflict policy rather than letting features choose local merge
closures.

For key migration, dual-read or dual-write only with explicit consistency rules.
Measure missing keys, collisions under the new identity, conflict outcomes, and
old-reader traffic before cutover.

### Engineering Trade-offs

- Encapsulation reduces flexibility but preserves atomicity and policy.
- Snapshots simplify readers but can incur COW or payload-copy costs.
- Dual-key migrations add complexity while protecting persisted and distributed
  compatibility.

### Production Scenario

Several features mutate a shared cache dictionary from detached tasks. Races and
inconsistent defaulting appear. The platform moves ownership into an actor,
defines typed cache outcomes, publishes stable IDs, and exposes batch operations
that make check-and-update atomic.

### Follow-up Questions

- Does `Dictionary: Sendable` make it thread-safe?
- Where should missing-key semantics be translated?
- How would you migrate from email keys to account IDs?

### Strong Answer Signals

- Separates transfer safety from shared-mutation safety.
- Encapsulates atomic operations and absence policy.
- Includes cross-team migration, telemetry, and rollback.

### Weak Answer Signals

- Shares an `inout` dictionary across task boundaries.
- Treats every miss as the same nil result.
- Changes key equality without coordinating persisted consumers.

### Related Theory

- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)
- [Decision Framework](theory.md#decision-framework)
- [Organizational Impact](theory.md#organizational-impact)
