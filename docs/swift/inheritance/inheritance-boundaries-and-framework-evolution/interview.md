---
title: "Inheritance Boundaries and Framework Evolution: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Inheritance Boundaries and Framework Evolution"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Selection based on substitutability and independent variation.

### Short Answer

Prefer composition when behaviors vary independently, need runtime replacement, have
separate lifecycles, or share implementation without a true substitutable is-a
relationship. Use inheritance for a shallow, stable base contract whose algorithm
intentionally delegates narrow hooks, or when a framework requires subclass integration.

### Detailed Answer

Composition exposes dependencies and avoids combinatorial subclasses. Inheritance can
be clearer when identity and lifecycle are genuinely shared and the base controls sequencing.

### Engineering Trade-offs

- Composition localizes variation and testing.
- Inheritance provides dynamic customization inside base control flow.
- Protocol strategies add indirection but reduce lifecycle coupling.

### Production Scenario

Caching, retry, and authentication subclasses create eight combinations. Independent
decorators or strategies compose the needed policies without a hierarchy explosion.

### Follow-up Questions

- What indicates a true is-a relationship?
- When is a template method appropriate?
- How does framework lifecycle affect the decision?

### Strong Answer Signals

- Analyzes variation dimensions and lifecycle.
- Allows justified inheritance.
- Avoids absolute rules.

### Weak Answer Signals

- Uses inheritance solely for code reuse.
- Says composition is always superior.
- Ignores framework constraints.

### Related Theory

- [Inheritance Versus Composition](theory.md#inheritance-versus-composition)

---

<a id="q2-open-class-evolution"></a>
## Q2: What Makes an Open Class Expensive to Evolve?

### What It Evaluates

Understanding of external subclass compatibility.

### Short Answer

Unknown external subclasses run inside base control flow and may depend on documented
or accidental call ordering, hook counts, representation, isolation, and lifecycle.
A new virtual call or invariant can break old subclasses without a signature error.
Therefore open hooks need stable contracts, safe defaults, downstream fixtures, and deprecation windows.

### Detailed Answer

ABI and source compatibility do not ensure behavior. Framework testing should include
adversarial and older representative subclasses, especially around reentrancy and lifecycle phases.

### Engineering Trade-offs

- Open classes enable external customization.
- Every hook restricts future implementation changes.
- Narrow template hooks preserve more base control.

### Production Scenario

A framework release calls an existing override during startup instead of after setup.
Old subclasses access uninitialized state. A new opt-in hook with a safe default enables migration.

### Follow-up Questions

- Why are new abstract requirements risky?
- What should hook documentation include?
- How do you test unknown subclasses?

### Strong Answer Signals

- Covers behavioral compatibility.
- Identifies call ordering and lifecycle.
- Proposes additive migration.

### Weak Answer Signals

- Equates ABI stability with safety.
- Adds callbacks in constructors casually.
- Has no downstream fixtures.

### Related Theory

- [Resilient Evolution](theory.md#resilient-evolution)

---

<a id="q3-hierarchy-migration"></a>
## Q3: How Would You Migrate Away from a Deep Hierarchy?

### What It Evaluates

Staff-level incremental architectural migration.

### Short Answer

Inventory subtype differences and base lifecycle dependencies, extract one orthogonal
behavior at a time into a strategy or contained component, and adapt existing subclasses
to delegate to it. Add contract tests and telemetry, migrate construction at composition
roots, then flatten or finalise classes only after old override use reaches zero.

### Detailed Answer

Preserve identity and lifecycle during mixed operation. Avoid rewriting all dimensions
simultaneously; each extraction needs fallback and parity checks against old behavior.

### Engineering Trade-offs

- Adapters reduce rollout risk but temporarily duplicate paths.
- Incremental extraction preserves behavior while extending migration time.
- A clean rewrite is viable only with a small, fully owned dependency surface.

### Production Scenario

A five-level client hierarchy extracts retry policy first, then authentication and
caching, while legacy subclasses delegate through adapters until no direct overrides remain.

### Follow-up Questions

- Which behavior should be extracted first?
- How do you prove parity?
- What is the rollback boundary?

### Strong Answer Signals

- Inventories lifecycle and overrides.
- Uses contracts, adapters, and telemetry.
- Migrates by independent dimension.

### Weak Answer Signals

- Rewrites the whole hierarchy in one release.
- Extracts interfaces without moving ownership.
- Removes hooks before measuring consumers.

### Related Theory

- [Resilient Evolution](theory.md#resilient-evolution)

---

<a id="q4-open-hierarchy-governance"></a>
## Q4: How Should a Platform Govern Open Hierarchies?

### What It Evaluates

Principal-level control of long-lived extension contracts.

### Short Answer

Require a named owner, extension-point design, substitutability contract, isolation
and lifecycle rules, override matrix, downstream CI, telemetry, versioning, and
retirement process. Default classes and members closed. Approve open hooks only for
demonstrated external variation, with safe defaults and supported examples.

### Detailed Answer

Tooling can detect `open` surfaces and override growth; architecture review judges
semantics. Exceptions for framework integration should be wrapped so platform-specific
lifecycle does not spread through domain code.

### Engineering Trade-offs

- Governance protects evolution but adds review cost.
- Closed defaults reduce accidental contracts.
- Supported openness can build ecosystems when ownership is funded.

### Production Scenario

Several teams publish open base controllers with incompatible lifecycle rules. A
platform standard narrows hooks, supplies contract fixtures, and assigns hierarchy owners.

### Follow-up Questions

- Which checks can be automated?
- How are external subclasses represented in CI?
- Who funds long-term compatibility?

### Strong Answer Signals

- Combines technical contract, ownership, and enforcement.
- Includes evolution and retirement.
- Supports justified exceptions.

### Weak Answer Signals

- Relies on documentation alone.
- Opens APIs without a responsible team.
- Has no downstream compatibility testing.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
