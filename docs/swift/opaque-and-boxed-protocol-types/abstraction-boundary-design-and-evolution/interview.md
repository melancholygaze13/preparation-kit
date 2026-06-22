---
title: "Abstraction Boundary Design and Evolution: Interview Questions"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
concept: "Abstraction Boundary Design and Evolution"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Abstraction Boundary Design and Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between generic, `some`, and `any`?](#q1-boundary-choice) | Senior | Type ownership |
| [When is manual type erasure still useful?](#q2-manual-erasure) | Staff | Curated runtime surface |
| [How would you migrate a public abstraction boundary?](#q3-boundary-migration) | Principal | Compatibility and rollout |

---

<a id="q1-boundary-choice"></a>
## Q1: How Do You Choose Between Generic, `some`, and `any`?

### Short Answer

Use a generic when the caller selects a type and relationships must remain visible. Use an opaque
result when the implementation selects one fixed hidden type. Use an existential when a runtime
owner must store or replace different conforming types and erased identity is acceptable.

### Expanded Answer

Check who owns selection, whether it changes at runtime, which associated-type or `Self` equalities
downstream code needs, and where configuration/lifecycle live. Performance is a measured secondary
criterion because each form has different runtime, code-size, and compilation trade-offs.

### Trade-offs

- Static forms preserve relationships but propagate types.
- Existentials localize runtime substitution but erase relationships.

### Example

A generic transformation pipeline returns one hidden opaque composition from its package. The app
erases it to `any Pipeline` only at the runtime feature registry that owns replacement.

---

<a id="q2-manual-erasure"></a>
## Q2: When Is Manual Type Erasure Still Useful?

### Short Answer

Use a manual eraser when a raw existential cannot expose required operations or
relationships. It can also provide a narrower public API or define identity,
ownership, value semantics, and compatibility behavior.

### Expanded Answer

The wrapper may capture closures or hold a private box and publish only supported operations. It owns
semantic laws that the compiler cannot synthesize: copying, equality, cancellation, sendability,
lifetime, and error policy. If plain `any P<Constraint>` works, prefer the language feature.

### Trade-offs

- A custom eraser stabilizes and tailors the boundary.
- It adds forwarding code, allocations/closures, testing, and evolution obligations.

### Example

A public stream facade erases several backends but guarantees one cancellation and backpressure model.
The wrapper is retained because raw existential methods do not encode those lifecycle semantics.

---

<a id="q3-boundary-migration"></a>
## Q3: How Would You Migrate a Public Abstraction Boundary?

### Short Answer

Inventory callers and retained relationships. Add an adapter, then compile
supported clients. Run both forms in parallel when possible and measure runtime,
build, and binary effects. Keep rollback through staged deprecation.

### Expanded Answer

Changing concrete, generic, opaque, or existential spelling can alter inference, overload selection,
available operations, ABI, and performance. Test external modules and toolchains, not only unit tests.
Document conformance, lifecycle, sendability, and ownership changes explicitly.

### Trade-offs

- A direct cutover reduces temporary duplication.
- Staged adapters reduce client and operational risk at the cost of coexistence.

### Example

A platform changes a public generic transport into a concrete erased facade. It first ships adapters,
migrates two pilot apps, compares startup/build metrics, then deprecates the old type over releases.
