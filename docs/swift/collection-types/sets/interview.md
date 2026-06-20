---
title: "Sets: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Sets"
page_type: interview
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

# Sets: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why does Set require Hashable?](#q1-why-hashable) | Senior | Hash lookup and equality confirmation |
| [What contract must equality and hashing satisfy?](#q2-equality-hashing-contract) | Senior | Identity correctness and collisions |
| [Why is mutating hash-relevant state dangerous?](#q3-mutating-hash-state) | Senior | Hash-table invariants and reference elements |
| [When should you choose Set instead of Array?](#q4-set-versus-array) | Senior | Representation and access patterns |
| [How do set algebra and membership relationships improve a design?](#q5-set-algebra) | Senior | Declarative domain operations |
| [Why must Set iteration order not be persisted or tested?](#q6-iteration-order) | Senior | Noncontractual ordering |
| [Who should own identity and uniqueness semantics across a system?](#q7-identity-ownership) | Staff | Governance, migration, and rollout |

---

<a id="q1-why-hashable"></a>
## Q1: Why Does Set Require Hashable?

### What It Evaluates

Whether the candidate understands hashing as candidate-location machinery and
equality as the final uniqueness decision.

### Short Answer

Set uses an element's hash to locate likely storage efficiently and equality to
confirm whether a matching member already exists. `Hashable` inherits from
`Equatable`, so the element supplies both parts. This enables expected O(1)
membership operations on average. Hashes need not be unique: unequal values may
collide, and the set resolves collisions with equality.

### Detailed Answer

A linear collection can find an equal value by checking every element. A hash
table first maps the searched value toward a smaller candidate region, then uses
`==` to distinguish equal values from collisions. That is why a set can't use a
type with no stable hashing and equality semantics.

Hashing is not identity by itself. A correct set supports two unequal members
with the same hash. Performance depends on useful distribution, while correctness
depends on equal values always supplying consistent hash input.

### Engineering Trade-offs

- Hashing adds computation and storage overhead.
- Average membership lookup improves from Array's O(n) to expected O(1).
- Poor hash quality or adversarial collisions can degrade toward O(n).

### Production Scenario

An ingestion service deduplicates event IDs. A Set makes membership checks
efficient, but the team hashes only a low-cardinality event category. Results
remain correct because equality is consistent, while latency degrades from heavy
collisions. Hashing the full identity restores useful distribution.

### Follow-up Questions

- Must different values have different hashes?
- Is average O(1) a worst-case guarantee?
- Why does `Hashable` inherit from `Equatable`?

### Strong Answer Signals

- Separates candidate lookup from equality confirmation.
- Allows collisions without calling them a correctness failure.
- Qualifies constant-time behavior as average or expected.

### Weak Answer Signals

- Claims a hash uniquely identifies an element.
- Says Set compares only hash values.
- Treats O(1) as an unconditional latency guarantee.

### Related Theory

- [Hashable Defines Uniqueness](theory.md#hashable-defines-uniqueness)
- [Complexity, Hash Quality, and Resizing](theory.md#complexity-hash-quality-and-resizing)

---

<a id="q2-equality-hashing-contract"></a>
## Q2: What Contract Must Equality and Hashing Satisfy?

### What It Evaluates

Ability to define coherent domain identity and implement a valid manual
`Hashable` conformance.

### Short Answer

If `a == b`, both values must feed equivalent equality-relevant components to
`Hasher` in the same order. Unequal values may hash alike. Equality and hashing
should describe the same domain identity, and that identity should remain stable
while the value is stored. Hash values themselves aren't persistent IDs and can
change between executions.

### Detailed Answer

For synthesized conformance, Swift derives equality and hashing from eligible
stored properties. A manual conformance is appropriate when only part of the
state defines identity, but both implementations must agree:

```swift
struct User: Hashable {
    let id: UUID
    var name: String

    static func == (lhs: User, rhs: User) -> Bool { lhs.id == rhs.id }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
```

Including `name` only in `hash(into:)` would violate the contract for equal users
with different names. Omitting it from both methods deliberately makes the ID the
uniqueness rule.

### Engineering Trade-offs

- Synthesized conformance reduces inconsistency risk but may make all state part
  of identity.
- ID-only equality supports payload refresh via `update(with:)` but conflates
  values when IDs are reused incorrectly.
- Manual conformance becomes compatibility-sensitive domain code.

### Production Scenario

Two modules define user uniqueness differently: one uses database ID and another
uses email. Set counts disagree after an email change. The platform establishes a
canonical immutable `UserID` and requires collections to key membership by it.

### Follow-up Questions

- Can unequal values have the same hash?
- When is synthesized conformance unsuitable?
- Can `hashValue` be stored in a database?

### Strong Answer Signals

- States the one-way implication from equality to consistent hashing.
- Connects conformance to domain identity.
- Rejects persisted hashes.

### Weak Answer Signals

- Requires unique hashes for every unequal value.
- Implements `==` and `hash(into:)` from different fields.
- Treats a successful lookup today as proof the contract is durable.

### Related Theory

- [Hashable Defines Uniqueness](theory.md#hashable-defines-uniqueness)
- [Hash Values Are Process-Local Artifacts](theory.md#hash-values-are-process-local-artifacts)

---

<a id="q3-mutating-hash-state"></a>
## Q3: Why Is Mutating Hash-Relevant State Dangerous?

### What It Evaluates

Understanding of the stability invariant behind hash-table placement, especially
for reference-type elements.

### Short Answer

A set places a member using the hash and equality state it had at insertion. If
that state changes in place, especially through a shared class reference, future
lookup searches according to the new hash while the member remains in its old
location. `contains` and `remove` can fail, and logical duplicates can appear.
Use immutable identity or remove, mutate, and reinsert under one owner.

### Detailed Answer

Value-type members aren't exposed as mutable lvalues through Set, which prevents
ordinary in-place mutation. A class instance can still be changed through another
reference. Copy-on-write doesn't help because the set's storage didn't mutate and
both collections may reference the same object.

The safe design is an immutable identity value. If identity genuinely changes,
perform a controlled transition that removes the old member before changing the
identity and reinserts afterward. Ensure no concurrent observer sees the broken
intermediate state.

### Engineering Trade-offs

- Immutable identity constrains models but keeps hashed collections reliable.
- Remove-and-reinsert supports identity transitions but needs atomic ownership.
- Hashing object identity avoids mutable fields but changes logical equality.

### Production Scenario

A cache stores mutable session objects in a Set keyed by token text. Token
rotation mutates the text in place; eviction can no longer find the session.
Replacing the set with a dictionary keyed by immutable session ID separates
lookup identity from mutable token payload.

### Follow-up Questions

- Why doesn't Set's value semantics prevent this?
- Can a struct member be mutated directly inside a set?
- When is a Dictionary a better representation?

### Strong Answer Signals

- Describes stale placement rather than vaguely calling mutation unsafe.
- Distinguishes collection COW from referenced object mutation.
- Proposes immutable identity or an owned remove/reinsert transition.

### Weak Answer Signals

- Assumes Set automatically rehashes when an object property changes.
- Copies the set to repair reference-element mutation.
- Suggests calling `contains` after mutation as sufficient validation.

### Related Theory

- [Mutating Equality-Relevant State](theory.md#mutating-equality-relevant-state)
- [Value Semantics and Reference Elements](theory.md#value-semantics-and-reference-elements)

---

<a id="q4-set-versus-array"></a>
## Q4: When Should You Choose Set Instead of Array?

### What It Evaluates

Representation selection from invariants and access patterns rather than habit.

### Short Answer

Choose Set when uniqueness is an invariant, order is irrelevant, and membership
or set algebra dominates. Choose Array when order, duplicates, positional access,
or compact sequential traversal is meaningful. Set lookup is expected O(1) on
average versus Array's O(n), but small arrays can be simpler and faster in
practice. If both stable order and uniqueness matter, encode both with an ordered
collection or one abstraction owning an array-plus-set invariant.

### Detailed Answer

The first question is semantic: does position or duplicate count mean anything?
The second is operational: how large is the collection, how often is it searched,
and how is it mutated? Converting an array to a set only to sort it back for every
render may indicate the model needs ordered uniqueness rather than an unordered
set.

An array plus set can work when one component owns every mutation. Exposing both
independently creates divergence risk. A dictionary is often clearer when lookup
uses stable identity and each identity has replaceable payload.

### Engineering Trade-offs

- Set enforces uniqueness but discards order and adds hashing overhead.
- Array preserves sequence semantics but needs linear membership checks.
- Dual structures improve mixed operations at memory and consistency cost.

### Production Scenario

A selected-item list must render in selection order and prevent duplicates.
Replacing its Array with Set breaks UI ordering. The feature adopts a small type
that owns an ordered ID array and membership set, with atomic insert and remove
operations.

### Follow-up Questions

- Would you use Set for ten rarely searched values?
- How would you preserve insertion order and uniqueness?
- When would a dictionary keyed by ID be better?

### Strong Answer Signals

- Starts from domain semantics, then uses complexity and measurement.
- Recognizes that order plus uniqueness needs another representation.
- Avoids universal rules based only on asymptotic complexity.

### Weak Answer Signals

- Always replaces arrays with sets for deduplication.
- Relies on observed set iteration order.
- Maintains parallel structures with no single owner.

### Related Theory

- [When to Use It](theory.md#when-to-use-it)
- [Trade-offs](theory.md#trade-offs)

---

<a id="q5-set-algebra"></a>
## Q5: How Do Set Algebra and Membership Relationships Improve a Design?

### What It Evaluates

Ability to translate business rules into precise collection operations.

### Short Answer

Set algebra expresses membership changes directly: union combines, intersection
keeps common members, subtracting finds one-sided members, and symmetric
difference finds members in exactly one set. Subset, strict subset, superset,
equality, and disjoint tests express validation relationships. These operations
make intent and edge cases clearer than nested loops or ad hoc flags.

### Detailed Answer

For desired-state reconciliation:

```swift
let toAdd = desired.subtracting(current)
let toRemove = current.subtracting(desired)
let unchanged = current.intersection(desired)
```

For authorization, `requested.isSubset(of: allowed)` verifies all requested
permissions are allowed. Use `isStrictSubset` only when equality must be rejected;
ordinary subset includes equality. Use `isDisjoint` when no overlap is permitted.

The element equality contract still determines the meaning of every operation.
Correct syntax can't compensate for inconsistent identity across services.

### Engineering Trade-offs

- Nonmutating operations create clear result values but may allocate.
- Mutating `form...` variants can reduce intermediates under clear ownership.
- Converting inputs to sets costs hashing and may discard meaningful duplicates.

### Production Scenario

A sync engine reconciles locally cached IDs with server-desired IDs. Separate
`toAdd` and `toRemove` sets drive idempotent batches, while metrics track the
symmetric difference as convergence lag.

### Follow-up Questions

- Does `isSubset` permit equality?
- When would symmetric difference be more useful than subtracting?
- What changes when duplicate counts matter?

### Strong Answer Signals

- Maps each operation to a concrete rule.
- Handles strict versus nonstrict containment correctly.
- Notes allocation and identity semantics.

### Weak Answer Signals

- Confuses subtracting with symmetric difference.
- Uses strict subset when ordinary authorization equality should pass.
- Converts duplicate-sensitive data to sets without policy.

### Related Theory

- [Set Algebra](theory.md#set-algebra)
- [Membership Relationships](theory.md#membership-relationships)

---

<a id="q6-iteration-order"></a>
## Q6: Why Must Set Iteration Order Not Be Persisted or Tested?

### What It Evaluates

Recognition of documented contracts versus accidental runtime behavior.

### Short Answer

Set has no defined ordering. Its current iteration sequence can change after
mutation, resizing, process-specific hash seeding, runtime or toolchain changes,
or different construction history. Persisting or snapshot-testing that order
turns an implementation detail into a false contract. Compare membership
directly, or sort using an explicit stable rule at the boundary.

### Detailed Answer

Repeated iteration without mutation may look consistent, but that observation
doesn't establish an API guarantee. Hash values themselves can differ between
executions, so bucket-derived traversal can differ too.

Deterministic output requires a domain ordering. Use `sorted(by:)` and serialize
the resulting array. Tests should compare sets or sorted projections. If insertion
order must survive, model it rather than reconstruct it from a set.

### Engineering Trade-offs

- Boundary sorting adds O(n log n) work and an allocation.
- An ordered representation carries more state and mutation cost.
- Unordered comparisons produce robust tests but don't validate presentation
  rules; test the explicit ordering separately.

### Production Scenario

A JSON payload encodes a Set by direct iteration. Equivalent requests produce
different byte sequences across launches, defeating cache keys and signatures.
The encoder sorts stable IDs before serialization.

### Follow-up Questions

- Is iteration stable if the set is not mutated?
- What should a snapshot test assert?
- How should signed payloads represent a set?

### Strong Answer Signals

- Distinguishes observed stability from a documented guarantee.
- Connects deterministic output to an explicit sort rule.
- Avoids persisting hashes as a workaround.

### Weak Answer Signals

- Calls current iteration order insertion order.
- Seeds tests with one construction sequence and accepts the output.
- Sorts by `hashValue` for determinism.

### Related Theory

- [Iteration and Ordering](theory.md#iteration-and-ordering)
- [Hash Values Are Process-Local Artifacts](theory.md#hash-values-are-process-local-artifacts)

---

<a id="q7-identity-ownership"></a>
## Q7: Who Should Own Identity and Uniqueness Semantics Across a System?

### What It Evaluates

Staff-level reasoning about cross-boundary consistency, migration, and
organizational ownership.

### Short Answer

The domain or platform boundary that owns entity identity should define a
canonical immutable identifier and duplicate policy. Feature teams should not
independently redefine `Hashable` from mutable payload fields. The owner must
document how producers, persistence, caches, sync, and UI interpret uniqueness;
version migrations; instrument duplicate behavior; and coordinate rollout and
rollback when semantics change.

### Detailed Answer

Set equality is a local manifestation of a system contract. If the client uses
email, the server uses database ID, and analytics uses normalized name, counts and
updates diverge even though every local collection is internally valid.

A staff-level design identifies the source of truth, provides small identifier
types, separates identity from mutable attributes, and defines duplicate handling
at ingress. A migration audits existing collisions, dual-computes old and new
identity, measures disagreement, updates producers and consumers in a compatible
order, and retains rollback until persisted data is safe.

### Engineering Trade-offs

- Central identity standards reduce drift but require cross-team governance.
- Compatibility periods add code and telemetry but reduce irreversible data loss.
- Rejecting duplicates preserves invariants; merging or keeping one value may be
  necessary for legacy input but needs explicit conflict rules.

### Production Scenario

An organization changes account uniqueness from email to immutable account ID.
The platform ships the ID type and dual-key telemetry, backfills persisted data,
updates APIs to carry both during transition, then switches deduplication only
after collision and missing-ID thresholds meet rollout criteria.

### Follow-up Questions

- Where should duplicate conflicts be resolved?
- How would you roll back an identity migration?
- What metrics reveal semantic disagreement?

### Strong Answer Signals

- Treats identity as a cross-system compatibility contract.
- Names ownership, sequencing, observability, and rollback.
- Separates immutable IDs from mutable display data.

### Weak Answer Signals

- Solves each disagreement with another local Set conversion.
- Changes `Hashable` conformance without auditing persisted data.
- Omits duplicate policy or rollout coordination.

### Related Theory

- [System Impact](theory.md#system-impact)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
- [Organizational Impact](theory.md#organizational-impact)
