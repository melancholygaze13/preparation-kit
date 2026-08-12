---
title: "Boundaries, Dependency Direction, and Coupling: Interview Questions"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Boundaries, Dependency Direction, and Coupling"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
tags:
  - boundaries
  - dependency-direction
  - coupling
---

# Boundaries, Dependency Direction, and Coupling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What makes an architectural boundary useful?](#q1-what-makes-an-architectural-boundary-useful) | Senior | Change isolation and cost |
| [How do you decide dependency direction?](#q2-how-do-you-decide-dependency-direction) | Senior | Contract ownership |
| [When would you introduce a protocol or module?](#q3-when-would-you-introduce-a-protocol-or-module) | Senior | Proportional enforcement |
| [How would you improve coupling in a large codebase?](#q4-how-would-you-improve-coupling-in-a-large-codebase) | Staff | Measurement and migration |

---

<a id="q1-what-makes-an-architectural-boundary-useful"></a>
## Q1: What makes an architectural boundary useful?

### Short Answer

A useful boundary keeps an important change local and exposes a small, stable
contract. I look for different reasons to change, ownership, lifetime, or trust.
The boundary must save more change and coordination cost than it adds through APIs,
mapping, construction, and debugging.

### Expanded Answer

I start with a change scenario, not a layer name. If an API response change reaches
the UI, transport details have crossed too far. If a copy change moves through five
mapping layers, the separation is probably too fine.

I also inspect hidden coupling: call order, actor or queue requirements, shared
mutable state, object lifetime, and release coordination. A contract is strong only
when these expectations are explicit and owned.

<a id="q2-how-do-you-decide-dependency-direction"></a>
## Q2: How do you decide dependency direction?

### Short Answer

I point dependencies toward the policy I want to protect. The consumer normally
owns a small contract in its own terms, while an adapter translates infrastructure
details. This keeps UI, transport, persistence, and vendors replaceable when their
rate of change justifies the boundary.

### Expanded Answer

For example, an order feature can own `OrderLoading`, which returns a domain `Order`.
An API adapter implements it and maps an HTTP response. The feature knows neither the
endpoint nor the response type.

Direction is not a rule that every inner type needs a protocol. I can depend directly
on a stable concrete type. I use inversion when there is real volatility, more than
one implementation, a trust boundary, or independent ownership.

<a id="q3-when-would-you-introduce-a-protocol-or-module"></a>
## Q3: When would you introduce a protocol or module?

### Short Answer

I introduce a protocol when a consumer needs a narrow capability that should not
expose a concrete dependency. I introduce a module when compiler-enforced visibility
and dependency direction are worth the build and API cost. Neither is an automatic
requirement for testability.

### Expanded Answer

A protocol earns its place when it expresses product behavior, supports meaningful
replacement, or creates a controlled test seam. A mirror of one large concrete API
adds indirection without reducing knowledge.

I start with source separation and access control when one team owns the code. I move
to targets or packages when accidental dependencies recur, ownership splits, or the
contract needs compatibility rules. Tests should use the narrowest useful replacement;
not every concrete value needs a mock.

### Trade-offs

Modules enforce rules and can clarify ownership, but they add public API design,
mapping, build graph, resource, and migration work. The strongest boundary is not
always the most economical one.

<a id="q4-how-would-you-improve-coupling-in-a-large-codebase"></a>
## Q4: How would you improve coupling in a large codebase?

### Short Answer

I would map the current dependency and change graph, find edges that cause repeated
cross-team changes or incidents, and improve one path at a time. I would define an
owned contract, add an adapter, migrate callers, then enforce the new direction.
Metrics and an exception process keep the program tied to outcomes.

### Expanded Answer

I would not begin with a full module rewrite. Import graphs show structural coupling;
version-control history and incident reviews show actual change coupling. Together
they identify high-cost edges, cycles, unstable shared models, and unclear ownership.

For a selected edge, I would add a compatibility boundary around current behavior,
move consumers in stages, and measure build time, change lead time, defect rate, and
cross-team coordination. Once migration is practical, a dependency check prevents
regression. Every shared API needs an owner and a deprecation path.

### Trade-offs

Temporary adapters and duplicate models add short-term cost. They reduce rollout
risk and let teams reverse the change if the proposed boundary does not improve the
measured problem.
