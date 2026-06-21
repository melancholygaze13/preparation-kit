---
title: "Abstraction Boundary Design and Evolution: Interview Questions"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
concept: "Abstraction Boundary Design and Evolution"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Selection based on semantics rather than syntax preference.

### Short Answer

Use a generic when the caller selects a type and relationships must remain visible. Use an opaque
result when the implementation selects one fixed hidden type. Use an existential when a runtime
owner must store or replace different conforming types and erased identity is acceptable.

### Detailed Answer

Check who owns selection, whether it changes at runtime, which associated-type or `Self` equalities
downstream code needs, and where configuration/lifecycle live. Performance is a measured secondary
criterion because each form has different runtime, code-size, and compilation trade-offs.

### Engineering Trade-offs

- Static forms preserve relationships but propagate types.
- Existentials localize runtime substitution but erase relationships.

### Production Scenario

A generic transformation pipeline returns one hidden opaque composition from its package. The app
erases it to `any Pipeline` only at the runtime feature registry that owns replacement.

### Follow-up Questions

- Who should own the erasure boundary?
- When is a concrete facade better than all three?

### Strong Answer Signals

- Uses chooser, variability, and relationships as criteria.
- Measures performance rather than assuming it.

### Weak Answer Signals

- Says `some` is always faster or `any` is always more flexible.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-manual-erasure"></a>
## Q2: When Is Manual Type Erasure Still Useful?

### What It Evaluates

Judgment about language existentials versus explicit wrappers.

### Short Answer

Use a manual eraser when the raw existential cannot expose required operations or relationships,
when the public surface must be narrower/stabler, or when the wrapper must define identity, value
semantics, ownership, or compatibility behavior explicitly.

### Detailed Answer

The wrapper may capture closures or hold a private box and publish only supported operations. It owns
semantic laws that the compiler cannot synthesize: copying, equality, cancellation, sendability,
lifetime, and error policy. If plain `any P<Constraint>` works, prefer the language feature.

### Engineering Trade-offs

- A custom eraser stabilizes and tailors the boundary.
- It adds forwarding code, allocations/closures, testing, and evolution obligations.

### Production Scenario

A public stream facade erases several backends but guarantees one cancellation and backpressure model.
The wrapper is retained because raw existential methods do not encode those lifecycle semantics.

### Follow-up Questions

- How would you preserve value semantics?
- What shared law tests would you require?

### Strong Answer Signals

- Justifies the wrapper with concrete missing semantics.
- Audits ownership and concurrency.

### Weak Answer Signals

- Adds `Any...` wrappers reflexively around every protocol.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-boundary-migration"></a>
## Q3: How Would You Migrate a Public Abstraction Boundary?

### What It Evaluates

Principal-level compatibility and rollout rigor.

### Short Answer

Inventory callers and retained relationships, add an adapter/facade, compile supported downstream
clients, run old and new forms in parallel where possible, measure runtime/build/binary effects,
stage deprecation, observe adoption, and retain rollback until the migration is complete.

### Detailed Answer

Changing concrete, generic, opaque, or existential spelling can alter inference, overload selection,
available operations, ABI, and performance. Test external modules and toolchains, not only unit tests.
Document conformance, lifecycle, sendability, and ownership changes explicitly.

### Engineering Trade-offs

- A direct cutover reduces temporary duplication.
- Staged adapters reduce client and operational risk at the cost of coexistence.

### Production Scenario

A platform changes a public generic transport into a concrete erased facade. It first ships adapters,
migrates two pilot apps, compares startup/build metrics, then deprecates the old type over releases.

### Follow-up Questions

- Which compatibility checks belong in CI?
- How would `@inlinable` affect an opaque migration?

### Strong Answer Signals

- Covers source, ABI, behavior, performance, and ownership.
- Defines measurable rollout and rollback.

### Weak Answer Signals

- Treats matching protocol methods as source compatibility proof.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)
