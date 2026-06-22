---
title: "Requirements, Conformance, and Synthesis: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Requirements, Conformance, and Synthesis"
page_type: interview
interview_priority: core
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Requirements, Conformance, and Synthesis: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does protocol conformance guarantee?](#q1-conformance-guarantees) | Senior | Shape versus laws |
| [When is synthesized conformance unsafe as domain policy?](#q2-synthesized-conformance) | Staff | Identity and schema |

---

<a id="q1-conformance-guarantees"></a>
## Q1: What Does Protocol Conformance Guarantee?

### Short Answer

The compiler guarantees matching witnesses for requirements and applicable isolation/type
rules. It usually cannot prove semantic laws, complexity, idempotency, equality consistency,
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
