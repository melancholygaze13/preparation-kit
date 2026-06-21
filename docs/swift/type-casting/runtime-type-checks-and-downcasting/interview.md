---
title: "Runtime Type Checks and Downcasting: Interview Questions"
domain: "Swift"
topic: "Type Casting"
concept: "Runtime Type Checks and Downcasting"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Precise operator and failure semantics.

### Short Answer

`is` tests whether a value can be treated as a type. `as` performs a compiler-proven
upcast or conversion. `as?` attempts a conditional downcast and returns an optional.
`as!` forces the downcast and traps on mismatch. Prefer `as?` when runtime failure is possible.

### Detailed Answer

A cast changes the static view of the same value; it is not arbitrary conversion.
Class-reference identity is preserved. Cast patterns combine proof and binding cleanly.

### Engineering Trade-offs

- Conditional casts make failure explicit.
- Forced casts reduce branches but turn schema drift into crashes.
- Static generic/protocol constraints remove runtime checks entirely.

### Production Scenario

A plugin registry returns a base protocol existential. The boundary conditionally casts
an optional capability and reports unsupported plugins instead of trapping.

### Follow-up Questions

- Does `is` bind the value?
- Is parsing a cast?
- What happens to object identity?

### Strong Answer Signals

- Defines all four forms accurately.
- Separates casting from conversion.
- Chooses conditional failure by default.

### Weak Answer Signals

- Calls `as!` a faster `as?`.
- Treats casts as parsing.
- Assumes successful cast copies the object.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-forced-cast-policy"></a>
## Q2: When Is a Forced Cast Acceptable?

### What It Evaluates

Judgment about proof and crash policy.

### Short Answer

Use `as!` only when a narrow invariant proves the dynamic type and failure represents
an unrecoverable programmer defect, not external data or normal evolution. Keep proof
adjacent, document it, and test it. Prefer conditional cast with explicit failure at
registries, decoding, interoperability, and plugin boundaries.

### Detailed Answer

Framework callbacks can sometimes guarantee types, but string identifiers, remote
payloads, and mutable registrations are weak proof. A prior separate `is` check is
usually inferior to one `as?` binding.

### Engineering Trade-offs

- Forced casts make invariant violations immediate.
- Conditional casts support recovery and telemetry.
- Refactoring types can remove the cast and encode the invariant statically.

### Production Scenario

A storyboard cast was once guaranteed but reuse identifiers diverge across targets.
Typed construction replaces the runtime cast; meanwhile a guarded failure supplies diagnostics.

### Follow-up Questions

- What makes a proof local?
- Should untrusted data ever use `as!`?
- How can static types remove the cast?

### Strong Answer Signals

- Requires a testable invariant.
- Rejects forced casts at external boundaries.
- Considers typed redesign.

### Weak Answer Signals

- Uses forced casts because failure is unlikely.
- Treats tests as proof of future schemas.
- Force-casts plugin payloads.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-downcast-architecture"></a>
## Q3: What Does Repeated Downcasting Indicate?

### What It Evaluates

Ability to recognize an abstraction failure.

### Short Answer

Repeated subtype switches often mean behavior belongs in a virtual/protocol requirement,
a visitor/strategy, or a closed enum. If each consumer knows every subtype, the base
abstraction is not providing useful polymorphism and every new subtype creates migration work.

### Detailed Answer

Casting can remain appropriate at one erased boundary. Convert there into a typed
capability or domain state so business code does not repeat the switch.

### Engineering Trade-offs

- Protocol dispatch supports open implementations.
- Enums provide exhaustive closed alternatives.
- Central casting adapters contain legacy or framework erasure.

### Production Scenario

Five screens cast notification subclasses to render them. A closed notification enum
with associated payloads centralizes decoding and makes new cases compiler-visible.

### Follow-up Questions

- When is a protocol better than an enum?
- Where should a legacy cast remain?
- How do you migrate incrementally?

### Strong Answer Signals

- Connects repeated casts to missing behavior.
- Selects open versus closed modeling deliberately.
- Contains erasure at one boundary.

### Weak Answer Signals

- Adds another default case to every switch.
- Creates one utility full of forced casts.
- Ignores subtype evolution.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
