---
title: "Failable, Required, and Evolving Initializers: Interview Questions"
domain: "Swift"
topic: "Initialization"
concept: "Failable, Required, and Evolving Initializers"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Selection of a construction API from failure and effect semantics.

### Short Answer

Use `init?` when callers only need valid-or-absent, `throws` when they need diagnostic
recovery, and a factory when construction is asynchronous, cached, chooses a subtype,
or owns external effects. Avoid `init!` for ordinary untrusted input.

### Detailed Answer

Construction should expose no partial instance. Factories make cancellation, I/O, and
sharing visible instead of forcing them behind synchronous syntax.

### Engineering Trade-offs

- Optionals are simple but collapse reasons.
- Errors support recovery but expand contracts.
- Factories express effects but add indirection.

### Production Scenario

Configuration loading moves from a blocking failable initializer to `load() async throws`,
preserving parsing diagnostics and cancellation.

### Follow-up Questions

- When is raw-value `init?` ideal?
- What risks does `init!` create?
- Can failure roll back external effects?

### Strong Answer Signals

- Matches API to recovery needs.
- Makes effects explicit.
- Prevents partial publication.

### Weak Answer Signals

- Uses nil for every failure category.
- Uses `init!` to avoid handling.
- Hides async work in construction.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)

---

<a id="q2-required-contract"></a>
## Q2: When Should an Initializer Be required?

### What It Evaluates

Judgment about subtype-wide construction obligations.

### Short Answer

Use `required` only when framework or generic code must construct every subclass
through that initializer. Each subclass must implement or inherit it, so the inputs
must be meaningful for all supported subtypes. Do not impose it for hypothetical uniformity.

### Detailed Answer

A required initializer becomes a long-lived extension constraint. New subclass storage
must still be establishable from the required inputs or valid defaults.

### Engineering Trade-offs

- Required construction enables uniform factories.
- It constrains future subtype invariants.
- Protocol factories or composition may provide looser extension.

### Production Scenario

A plugin base requires `init()` but new plugins need credentials. Replacing universal
construction with an injected factory avoids meaningless defaults.

### Follow-up Questions

- Must subclass implementations repeat `required`?
- How does initializer inheritance interact?
- Could a factory replace the contract?

### Strong Answer Signals

- Requires a real uniform construction need.
- Considers future subclass storage.
- Offers alternative factories.

### Weak Answer Signals

- Marks every initializer required.
- Forces invalid default state.
- Ignores external subclasses.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q3-invariant-evolution"></a>
## Q3: How Should Initializer Invariants Evolve Across a System?

### What It Evaluates

Principal-level schema and rollout ownership.

### Short Answer

Treat stricter construction as a schema migration. Inventory callers, persisted data,
decoders, factories, and subclasses; add version-aware tolerant readers and migration
tooling before enforcing new inputs. Instrument failure categories, coordinate producers,
preserve rollback, and deprecate old construction only after usage and old data decline.

### Detailed Answer

Compile-time callers are only part of the surface. Old archives and deployed producers
can still create now-invalid inputs. Defaults must have explicit version semantics.

### Engineering Trade-offs

- Strict invariants improve correctness.
- Compatibility windows add temporary complexity.
- Automatic repair preserves availability but must not invent unsafe meaning.

### Production Scenario

A formerly optional tenant ID becomes required. Readers first infer or quarantine old
records with telemetry; writers then emit IDs; enforcement follows after backfill.

### Follow-up Questions

- What is the rollback format?
- Which failures can be repaired?
- Who owns backfill completion?

### Strong Answer Signals

- Covers persisted and distributed inputs.
- Sequences readers before enforcement.
- Includes telemetry, ownership, and rollback.

### Weak Answer Signals

- Changes the initializer and fixes compiler errors only.
- Rejects all old data immediately.
- Has no migration owner.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
