---
title: "Dependency Injection and Feature Modularization: Interview Questions"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
concept: "Dependency Injection and Feature Modularization"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Dependency Injection and Feature Modularization: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What problem does dependency injection solve in UIKit?](#q1-di-purpose) | Senior | Testability and construction |
| [Where should dependencies be assembled?](#q2-composition-root) | Senior | Ownership |
| [When would you introduce a protocol?](#q3-protocol-boundary) | Staff | Abstraction cost |
| [How do you decide whether to modularize a feature?](#q4-modularization-decision) | Principal | Scale and rollout |

---

<a id="q1-di-purpose"></a>
## Q1: What problem does dependency injection solve in UIKit?

### Short Answer

Dependency injection makes a screen's required services explicit. Instead of a view
controller creating or finding services globally, it receives the services it
needs. That improves testing, replacement, and ownership.

### Expanded Answer

For example, a view controller that receives an `ImageLoading` dependency can be
tested with a fake loader. If it creates a concrete loader internally or reads a
global singleton, tests become slower and shared state can leak between cases.

---

<a id="q2-composition-root"></a>
## Q2: Where should dependencies be assembled?

### Short Answer

Assemble dependencies where the app or feature is created: app setup, scene setup, coordinator,
or feature factory. Feature code should receive dependencies, not look them up
from a global container.

### Expanded Answer

A container can be useful for app assembly, but service location inside view
controllers hides requirements. In UIKit, coordinators and feature factories are
often natural places to create controllers and pass their collaborators.

---

<a id="q3-protocol-boundary"></a>
## Q3: When would you introduce a protocol?

### Short Answer

I introduce a protocol when the caller needs a smaller contract than the
concrete type, when tests need a substitute, or when a module boundary should
hide implementation details.

### Expanded Answer

I avoid creating protocols automatically for every service. A protocol should
express the need of the feature that consumes it. If there is one private helper
with no substitute and no module boundary, a concrete type is simpler.

### Trade-offs

Protocols reduce coupling when they are narrow and owned by the right boundary.
They add cost when they mirror concrete types and create extra names without
changing dependencies.

---

<a id="q4-modularization-decision"></a>
## Q4: How do you decide whether to modularize a feature?

### Short Answer

I modularize when there is real pressure: build time, team ownership, reuse,
test isolation, or migration risk. I avoid splitting code only because a module
diagram looks cleaner.

### Expanded Answer

For a large UIKit app, I would start with a feature that has clear ownership and
few dependency cycles. I would define allowed dependencies, move tests with the
feature, and measure whether the split improves build time or reduces coupling.

### Trade-offs

Modules create API and dependency-graph cost. They are valuable when that cost
buys isolation, safer ownership, or faster iteration. They are wasteful when
the boundaries are unstable and every change crosses several modules.
