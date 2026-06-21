---
title: "Generic API Design and Evolution: Interview Questions"
domain: "Swift"
topic: "Generics"
concept: "Generic API Design and Evolution"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Generic API Design and Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Does Swift generic code have zero-cost abstraction?](#q1-zero-cost-claim) | Senior | Optimization guarantees and measurement |
| [How do you keep generics from coupling an entire architecture?](#q2-generic-containment) | Principal | Boundaries, ownership, and evolution |

---

<a id="q1-zero-cost-claim"></a>
## Q1: Does Swift Generic Code Have Zero-Cost Abstraction?

### What It Evaluates

Performance reasoning without unsupported compiler guarantees.

### Short Answer

Generics create optimization opportunities such as specialization and inlining, but Swift
does not guarantee every call has zero overhead or a particular machine-code form. Module
boundaries, resilience, visibility, build mode, and compiler decisions matter, so measure
runtime and code size in the shipped configuration.

### Detailed Answer

Some generic calls specialize to concrete operations; others use shared code or witness
dispatch. `@inlinable` can expose implementation for cross-module optimization but enlarges
the public optimization interface and still does not guarantee inlining. Specializing many
substitutions can increase binary size and instruction-cache pressure.

### Engineering Trade-offs

- Specialization can improve hot loops and remove abstraction overhead.
- Shared implementations can reduce code size; exposed bodies constrain evolution.

### Production Scenario

A generic decoding pipeline wins a microbenchmark after specialization but increases app
size across hundreds of models. The team evaluates startup and end-to-end profiles before
choosing targeted optimization rather than blanket `@inlinable`.

### Follow-up Questions

- What does library evolution change?
- Which release-build evidence would you collect?

### Strong Answer Signals

- Separates semantic guarantees from optimizer behavior.
- Measures runtime, code size, and boundaries.

### Weak Answer Signals

- Says all generics are monomorphized.
- Uses `@inlinable` as a guaranteed speed annotation.

### Related Theory

- [Performance](theory.md#performance)

---

<a id="q2-generic-containment"></a>
## Q2: How Do You Keep Generics from Coupling an Entire Architecture?

### What It Evaluates

Principal-level module and API-boundary judgment.

### Short Answer

Keep generic cores within aligned ownership boundaries, expose only domain-relevant type
relationships, and use concrete facades, closures, or existentials where runtime substitution
or release independence matters. Govern public constraints, conformances, and inlinable code
as compatibility surface.

### Detailed Answer

Generics can push concrete types and constraints through feature, package, and build seams.
Contain them behind stable facades when downstream teams should not recompile or migrate for
implementation changes. Use client compile fixtures and performance budgets to ensure the
chosen boundary remains usable.

### Engineering Trade-offs

- End-to-end generics maximize static composition but increase build and source coupling.
- Erased or concrete seams reduce propagation but may add adapters and runtime indirection.

### Production Scenario

A platform networking package keeps serializers and transports generic internally but
exposes a concrete request facade to independently released feature teams. Extension points
use a small existential protocol with explicit sendability and lifecycle rules.

### Follow-up Questions

- When should a public facade itself remain generic?
- How would you migrate an already-propagated generic type?

### Strong Answer Signals

- Connects design to team ownership, release cadence, and build graph.
- Offers staged adapters and measurable policies.

### Weak Answer Signals

- Optimizes only call performance.
- Treats type erasure as inherently poor design.

### Related Theory

- [System Impact](theory.md#system-impact)
