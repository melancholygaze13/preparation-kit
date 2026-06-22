---
title: "Inheritance Boundaries and Framework Evolution: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Inheritance Boundaries and Framework Evolution"
page_type: interview
interview_priority: situational
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Inheritance Boundaries and Framework Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you prefer composition?](#q1-inheritance-or-composition) | Senior | Variation and ownership |
| [What makes an open class expensive to evolve?](#q2-open-class-evolution) | Staff | Unknown subclasses |
| [How would you migrate away from a deep hierarchy?](#q3-hierarchy-migration) | Staff | Incremental decomposition |
| [How should a platform govern open hierarchies?](#q4-open-hierarchy-governance) | Principal | Ownership and compatibility |

---

<a id="q1-inheritance-or-composition"></a>
## Q1: When Should You Prefer Composition?

### Short Answer

Prefer composition when behaviors vary independently, need runtime replacement, have
separate lifecycles, or share implementation without a true substitutable is-a
relationship. Use inheritance for a shallow, stable base contract whose algorithm
intentionally delegates narrow hooks, or when a framework requires subclass integration.

### Expanded Answer

Composition exposes dependencies and avoids combinatorial subclasses. Inheritance can
be clearer when identity and lifecycle are genuinely shared and the base controls sequencing.

### Trade-offs

- Composition localizes variation and testing.
- Inheritance provides dynamic customization inside base control flow.
- Protocol strategies add indirection but reduce lifecycle coupling.

### Example

Caching, retry, and authentication subclasses create eight combinations. Independent
decorators or strategies compose the needed policies without a hierarchy explosion.

---

<a id="q2-open-class-evolution"></a>
## Q2: What Makes an Open Class Expensive to Evolve?

### Short Answer

Unknown external subclasses run inside base control flow and may depend on documented
or accidental call ordering, hook counts, representation, isolation, and lifecycle.
A new virtual call or invariant can break old subclasses without a signature error.
Therefore open hooks need stable contracts, safe defaults, downstream fixtures, and deprecation windows.

### Expanded Answer

ABI and source compatibility do not ensure behavior. Framework testing should include
adversarial and older representative subclasses, especially around reentrancy and lifecycle phases.

### Trade-offs

- Open classes enable external customization.
- Every hook restricts future implementation changes.
- Narrow template hooks preserve more base control.

### Example

A framework release calls an existing override during startup instead of after setup.
Old subclasses access uninitialized state. A new opt-in hook with a safe default enables migration.

---

<a id="q3-hierarchy-migration"></a>
## Q3: How Would You Migrate Away from a Deep Hierarchy?

### Short Answer

Inventory subtype differences and base lifecycle dependencies, extract one orthogonal
behavior at a time into a strategy or contained component, and adapt existing subclasses
to delegate to it. Add contract tests and telemetry, migrate construction at composition
roots, then flatten or finalise classes only after old override use reaches zero.

### Expanded Answer

Preserve identity and lifecycle during mixed operation. Avoid rewriting all dimensions
simultaneously; each extraction needs fallback and parity checks against old behavior.

### Trade-offs

- Adapters reduce rollout risk but temporarily duplicate paths.
- Incremental extraction preserves behavior while extending migration time.
- A clean rewrite is viable only with a small, fully owned dependency surface.

### Example

A five-level client hierarchy extracts retry policy first, then authentication and
caching, while legacy subclasses delegate through adapters until no direct overrides remain.

---

<a id="q4-open-hierarchy-governance"></a>
## Q4: How Should a Platform Govern Open Hierarchies?

### Short Answer

Require a named owner, extension-point design, substitutability contract, isolation
and lifecycle rules, override matrix, downstream CI, telemetry, versioning, and
retirement process. Default classes and members closed. Approve open hooks only for
demonstrated external variation, with safe defaults and supported examples.

### Expanded Answer

Tooling can detect `open` surfaces and override growth; architecture review judges
semantics. Exceptions for framework integration should be wrapped so platform-specific
lifecycle does not spread through domain code.

### Trade-offs

- Governance protects evolution but adds review cost.
- Closed defaults reduce accidental contracts.
- Supported openness can build ecosystems when ownership is funded.

### Example

Several teams publish open base controllers with incompatible lifecycle rules. A
platform standard narrows hooks, supplies contract fixtures, and assigns hierarchy owners.
