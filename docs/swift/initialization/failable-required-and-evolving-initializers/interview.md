---
title: "Failable, Required, and Evolving Initializers: Interview Questions"
domain: "Swift"
topic: "Initialization"
concept: "Failable, Required, and Evolving Initializers"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Failable, Required, and Evolving Initializers: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should initialization be failable, throwing, or a factory?](#q1-failure-shape) | Senior | Recovery and effects |
| [When should an initializer be required?](#q2-required-contract) | Staff | Subclass construction contract |
| [How should initializer invariants evolve across a system?](#q3-invariant-evolution) | Principal | Schema migration and rollout |

---

<a id="q1-failure-shape"></a>
## Q1: When Should Initialization Be Failable, Throwing, or a Factory?

### Short Answer

Use `init?` when callers only need valid-or-absent, `throws` when they need diagnostic
recovery, and a factory when construction is asynchronous, cached, chooses a subtype,
or owns external effects. Avoid `init!` for ordinary untrusted input.

### Expanded Answer

Construction should expose no partial instance. Factories make cancellation, I/O, and
sharing visible instead of forcing them behind synchronous syntax.

### Trade-offs

- Optionals are simple but collapse reasons.
- Errors support recovery but expand contracts.
- Factories express effects but add indirection.

### Example

Configuration loading moves from a blocking failable initializer to `load() async throws`,
preserving parsing diagnostics and cancellation.

---

<a id="q2-required-contract"></a>
## Q2: When Should an Initializer Be required?

### Short Answer

Use `required` only when framework or generic code must construct every subclass
through that initializer. Each subclass must implement or inherit it, so the inputs
must be meaningful for all supported subtypes. Do not impose it for hypothetical uniformity.

### Expanded Answer

A required initializer becomes a long-lived extension constraint. New subclass storage
must still be establishable from the required inputs or valid defaults.

### Trade-offs

- Required construction enables uniform factories.
- It constrains future subtype invariants.
- Protocol factories or composition may provide looser extension.

### Example

A plugin base requires `init()` but new plugins need credentials. Replacing universal
construction with an injected factory avoids meaningless defaults.

---

<a id="q3-invariant-evolution"></a>
## Q3: How Should Initializer Invariants Evolve Across a System?

### Short Answer

Treat stricter construction as a schema migration. Inventory callers, persisted data,
decoders, factories, and subclasses; add version-aware tolerant readers and migration
tooling before enforcing new inputs. Instrument failure categories, coordinate producers,
preserve rollback, and deprecate old construction only after usage and old data decline.

### Expanded Answer

Compile-time callers are only part of the surface. Old archives and deployed producers
can still create now-invalid inputs. Defaults must have explicit version semantics.

### Trade-offs

- Strict invariants improve correctness.
- Compatibility windows add temporary complexity.
- Automatic repair preserves availability but must not invent unsafe meaning.

### Example

A formerly optional tenant ID becomes required. Readers first infer or quarantine old
records with telemetry; writers then emit IDs; enforcement follows after backfill.
