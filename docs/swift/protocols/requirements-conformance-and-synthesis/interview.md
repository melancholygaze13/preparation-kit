---
title: "Requirements, Conformance, and Synthesis: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Requirements, Conformance, and Synthesis"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-30
---

# Requirements, Conformance, and Synthesis: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does protocol conformance guarantee?](#q1-conformance-guarantees) | Senior | Shape versus laws |
| [When is synthesized conformance unsafe as domain policy?](#q2-synthesized-conformance) | Staff | Identity and schema |
| [How do you choose equality, hashing, and identity for a model?](#q3-equality-hashing-identity) | Senior | Domain identity contracts |

---

<a id="q1-conformance-guarantees"></a>
## Q1: What Does Protocol Conformance Guarantee?

### Short Answer

The compiler guarantees matching witnesses for requirements and applicable isolation/type
rules. It usually cannot prove behavior rules, complexity, idempotency, equality consistency,
or lifecycle behavior; those need documentation and shared conformance tests.

### Expanded Answer

Property requirements specify capability rather than storage. Mutating requirements permit
value conformers to change `self`. Initializer requirements must remain available through
nonfinal class hierarchies. Marker protocols can carry semantics without members.

### Trade-offs

- Minimal contracts improve substitutability.
- Rich protocols reduce boilerplate but couple unrelated concerns.

### Example

Two cache implementations compile against one protocol, but one treats misses as errors
and another as nil. The protocol must define the outcome contract before substitution is safe.

---

<a id="q2-synthesized-conformance"></a>
## Q2: When Is Synthesized Conformance Unsafe as Domain Policy?

### Short Answer

Synthesis is unsafe when stored representation is not domain identity or schema. Cached,
derived, secret, versioned, or non-sendable fields can make generated behavior incorrect
even though conformance compiles.

### Expanded Answer

Adding or reordering stored fields can change equality, hashing, or Codable output.
`Sendable` requires the complete graph to be safe. Implement explicit witnesses or a
stable DTO when compatibility must not follow storage mechanically.

### Trade-offs

- Synthesis is concise and consistent with representation.
- Explicit witnesses carry maintenance cost but stabilize semantics.

### Example

A cached display string is added to a model and synthesized equality changes, causing
unexpected diffing. Equality is rewritten around stable identity and meaningful state.

---

<a id="q3-equality-hashing-identity"></a>
## Q3: How Do You Choose Equality, Hashing, and Identity for a Model?

### Short Answer

I start from the domain rule. `Equatable` answers whether two values are the same for
the operation. `Hashable` must use fields consistent with equality. `Identifiable`
should use a stable identity, such as a database or server ID, when selection or diffing
must survive content changes.

### Expanded Answer

These protocols are not interchangeable. A record can keep the same identity while its
title or status changes. Sorting may use a date or display name even when identity uses
an ID. Hash values are lookup implementation details, not persisted identifiers.

For reference types stored in sets or dictionary keys, avoid mutating any field used by
equality or hashing while the instance is stored. Prefer immutable IDs, value keys, or
remove-update-reinsert behavior.

### Example

A message row uses `id` for `Identifiable`, compares meaningful message fields in
`Equatable` for tests, and sorts by `sentAt`. Including `isSelected` in equality would
make a UI concern change the model's domain identity.
