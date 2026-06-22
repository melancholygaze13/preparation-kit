---
title: "Module, Package, Testing, and API Evolution: Interview Questions"
domain: "Swift"
topic: "Access Control"
concept: "Module, Package, Testing, and API Evolution"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Module, Package, Testing, and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does `@testable import` expose?](#q1-testable) | Senior | Test visibility |
| [How do `@inlinable` and `@usableFromInline` affect access?](#q2-inlinable-access) | Staff | Optimization interface |
| [How would you migrate access while splitting a module?](#q3-module-split) | Principal | Architecture rollout |

---

<a id="q1-testable"></a>
## Q1: What Does `@testable import` Expose?

### Short Answer

It lets a test module access internal declarations of a module compiled with testing enabled. It does
not expose private or fileprivate declarations and does not make internal symbols production-public.

### Expanded Answer

Use it selectively; tests tightly coupled to internals make refactoring expensive. Prefer public
behavior and owned collaborators, while testing complex internal algorithms directly when valuable.

### Trade-offs

- Testable access improves focused coverage.
- Excessive use couples tests to representation.

### Example

A parser's internal state machine is tested with `@testable`; feature tests use only the public parser
API so representation changes do not rewrite the whole suite.

---

<a id="q2-inlinable-access"></a>
## Q2: How Do `@inlinable` and `@usableFromInline` Affect Access?

### Short Answer

`@inlinable` serializes a body for client optimization, so it can reference public or eligible
`@usableFromInline` internal declarations. Those internal declarations remain unavailable to ordinary
client source but become ABI-relevant. Neither attribute guarantees optimization.

### Expanded Answer

The attributes restrict refactoring and can increase client compile/code-size cost. Use them for
measured cross-module hot paths, with compatibility review and downstream benchmarks.

### Trade-offs

- More body visibility can unlock optimization.
- It publishes implementation into a stronger compatibility interface.

### Example

A tiny numeric primitive is annotated only after representative client profiling. Helpers become
usable-from-inline and are tracked by binary compatibility tooling.

---

<a id="q3-module-split"></a>
## Q3: How Would You Migrate Access While Splitting a Module?

### Short Answer

First inventory consumers and define the new owners. Add a facade or forwarding
shim, then compile supported clients. Migrate dependencies in stages and measure
build and binary effects. Keep rollback until the old surface is removed.

### Expanded Answer

Internal references become cross-module and may need package/public visibility, but blindly widening
everything recreates a monolith. Move semantic contracts to stable modules and keep implementation
details behind package or private adapters.

### Trade-offs

- Package access enables staged decomposition.
- Too much package/public access preserves old coupling under new targets.

### Example

A networking monolith splits transport, authentication, and public SDK targets. Package interfaces
connect implementation modules; only domain requests/results remain public externally.
