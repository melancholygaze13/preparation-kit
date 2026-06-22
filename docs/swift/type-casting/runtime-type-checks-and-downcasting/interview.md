---
title: "Runtime Type Checks and Downcasting: Interview Questions"
domain: "Swift"
topic: "Type Casting"
concept: "Runtime Type Checks and Downcasting"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Runtime Type Checks and Downcasting: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do is, as, as?, and as! differ?](#q1-cast-operators) | Senior | Runtime proof and failure |
| [When is a forced cast acceptable?](#q2-forced-cast-policy) | Senior | Invariant strength |
| [What does repeated downcasting indicate?](#q3-downcast-architecture) | Staff | Missing abstraction |

---

<a id="q1-cast-operators"></a>
## Q1: How Do is, as, as?, and as! Differ?

### Short Answer

`is` tests whether a value can be treated as a type. `as` performs a compiler-proven
upcast or conversion. `as?` attempts a conditional downcast and returns an optional.
`as!` forces the downcast and traps on mismatch. Prefer `as?` when runtime failure is possible.

### Expanded Answer

A cast changes the static view of the same value; it is not arbitrary conversion.
Class-reference identity is preserved. Cast patterns combine proof and binding cleanly.

### Trade-offs

- Conditional casts make failure explicit.
- Forced casts reduce branches but turn schema drift into crashes.
- Static generic/protocol constraints remove runtime checks entirely.

### Example

A plugin registry returns a base protocol existential. The boundary conditionally casts
an optional capability and reports unsupported plugins instead of trapping.

---

<a id="q2-forced-cast-policy"></a>
## Q2: When Is a Forced Cast Acceptable?

### Short Answer

Use `as!` only when a narrow invariant proves the dynamic type and failure represents
an unrecoverable programmer defect, not external data or normal evolution. Keep proof
adjacent, document it, and test it. Prefer conditional cast with explicit failure at
registries, decoding, interoperability, and plugin boundaries.

### Expanded Answer

Framework callbacks can sometimes guarantee types, but string identifiers, remote
payloads, and mutable registrations are weak proof. A prior separate `is` check is
usually inferior to one `as?` binding.

### Trade-offs

- Forced casts make invariant violations immediate.
- Conditional casts support recovery and telemetry.
- Refactoring types can remove the cast and encode the invariant statically.

### Example

A storyboard cast was once guaranteed but reuse identifiers diverge across targets.
Typed construction replaces the runtime cast; meanwhile a guarded failure supplies diagnostics.

---

<a id="q3-downcast-architecture"></a>
## Q3: What Does Repeated Downcasting Indicate?

### Short Answer

Repeated subtype switches often mean behavior belongs in a virtual/protocol requirement,
a visitor/strategy, or a closed enum. If each consumer knows every subtype, the base
abstraction is not providing useful polymorphism and every new subtype creates migration work.

### Expanded Answer

Casting can remain appropriate at one erased boundary. Convert there into a typed
capability or domain state so business code does not repeat the switch.

### Trade-offs

- Protocol dispatch supports open implementations.
- Enums provide exhaustive closed alternatives.
- Central casting adapters contain legacy or framework erasure.

### Example

Five screens cast notification subclasses to render them. A closed notification enum
with associated payloads centralizes decoding and makes new cases compiler-visible.
