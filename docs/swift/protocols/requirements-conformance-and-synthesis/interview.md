---
title: "Requirements, Conformance, and Synthesis: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Requirements, Conformance, and Synthesis"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Separation of compiler witnesses from semantic substitutability.

### Short Answer

The compiler guarantees matching witnesses for requirements and applicable isolation/type
rules. It usually cannot prove semantic laws, complexity, idempotency, equality consistency,
or lifecycle behavior; those need documentation and shared conformance tests.

### Detailed Answer

Property requirements specify capability rather than storage. Mutating requirements permit
value conformers to change `self`. Initializer requirements must remain available through
nonfinal class hierarchies. Marker protocols can carry semantics without members.

### Engineering Trade-offs

- Minimal contracts improve substitutability.
- Rich protocols reduce boilerplate but couple unrelated concerns.

### Production Scenario

Two cache implementations compile against one protocol, but one treats misses as errors
and another as nil. The protocol must define the outcome contract before substitution is safe.

### Follow-up Questions

- Why mark a requirement `mutating`?
- How do class initializer witnesses differ?

### Strong Answer Signals

- Distinguishes signatures and laws.
- Includes ownership, failure, and mutation semantics.

### Weak Answer Signals

- Calls compilation complete correctness proof.
- Uses protocols only for mocking.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-synthesized-conformance"></a>
## Q2: When Is Synthesized Conformance Unsafe as Domain Policy?

### What It Evaluates

Awareness of generated equality, hashing, coding, and transfer semantics.

### Short Answer

Synthesis is unsafe when stored representation is not domain identity or schema. Cached,
derived, secret, versioned, or non-sendable fields can make generated behavior incorrect
even though conformance compiles.

### Detailed Answer

Adding or reordering stored fields can change equality, hashing, or Codable output.
`Sendable` requires the complete graph to be safe. Implement explicit witnesses or a
stable DTO when compatibility must not follow storage mechanically.

### Engineering Trade-offs

- Synthesis is concise and consistent with representation.
- Explicit witnesses carry maintenance cost but stabilize semantics.

### Production Scenario

A cached display string is added to a model and synthesized equality changes, causing
unexpected diffing. Equality is rewritten around stable identity and meaningful state.

### Follow-up Questions

- Which protocol laws should shared tests cover?
- When should persistence use a separate representation?

### Strong Answer Signals

- Audits every stored field.
- Treats schemas and identity as explicit contracts.

### Weak Answer Signals

- Assumes synthesis is always the preferred implementation.
- Ignores versioned clients.

### Related Theory

- [Failure Modes](theory.md#failure-modes)
