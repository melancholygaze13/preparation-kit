---
title: "Modularization, Migration, and Ownership: Interview Questions"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Modularization, Migration, and Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - modularization
  - migration
  - ownership
---

# Modularization, Migration, and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should a feature become a module?](#q1-when-should-a-feature-become-a-module) | Senior | Granularity and evidence |
| [How should feature modules depend on each other?](#q2-how-should-feature-modules-depend-on-each-other) | Senior | Dependency direction |
| [How would you migrate a large feature to SwiftUI?](#q3-how-would-you-migrate-a-large-feature-to-swiftui) | Staff | Sequencing and rollback |
| [How do you make modular architecture work across teams?](#q4-how-do-you-make-modular-architecture-work-across-teams) | Principal | Governance and ownership |

---

<a id="q1-when-should-a-feature-become-a-module"></a>
## Q1: When should a feature become a module?

### Short Answer

When a cohesive capability needs enforced dependency direction, independent testing,
build isolation, distribution, or clear team ownership, and those benefits exceed
public API and graph overhead. I use change and build measurements, not target count.

### Expanded Answer

I examine files that change together, dependency fan-out, incremental build impact,
and review ownership. A source folder with internal access may be enough while the
boundary is still evolving.

Tiny targets can increase manifest, linking, test, and API maintenance cost. A
volatile low-level module can also invalidate the entire graph, so module placement
matters more than quantity.

<a id="q2-how-should-feature-modules-depend-on-each-other"></a>
## Q2: How should feature modules depend on each other?

### Short Answer

Features expose small entry contracts and output intents. The app composition layer
wires features and adapters. A feature should not import another feature's internal
views, model, or router to navigate.

### Expanded Answer

Dependencies point toward stable domain or capability contracts. Cross-feature
navigation targets an entry intent; composition chooses presentation. Shared modules
have strict inclusion rules so they do not become utility dumping grounds.

I enforce cycles and forbidden imports in CI. A cycle often means policy is misplaced
or the proposed features are not independently owned.

<a id="q3-how-would-you-migrate-a-large-feature-to-swiftui"></a>
## Q3: How would you migrate a large feature to SwiftUI?

### Short Answer

I preserve behavior behind a stable contract, add tests and observability, replace
one vertical slice, and roll it out gradually with a tested fallback. I separate UI,
state, navigation, and data migrations where possible.

### Expanded Answer

One system owns each state value during coexistence. The new SwiftUI surface can emit
route intents while the old flow initially owns navigation. A shared repository
prevents duplicate UI models from synchronizing domain data.

Flags identify cohorts and metrics compare outcomes, latency, crashes, and errors.
Rollback includes persistence and server-schema compatibility. Temporary adapters
have an owner and deletion condition.

### Trade-offs

Incremental migration carries temporary complexity but reduces release risk and
provides evidence. A full rewrite can remove compatibility code sooner but combines
unknowns and delays production feedback.

<a id="q4-how-do-you-make-modular-architecture-work-across-teams"></a>
## Q4: How do you make modular architecture work across teams?

### Short Answer

Every boundary has an accountable owner, documented API and compatibility policy,
dependency rules, operational metrics, and an exception process. Architecture is
successful when teams can change and ship safely with less coordination.

### Expanded Answer

I automate graph checks, cycle detection, and API validation. I track build times,
cross-team review latency, incident ownership, and dependency upgrades. Shared
modules have service expectations and funded maintenance.

The target architecture includes a sequenced migration plan and removal work, not
only diagrams. Exceptions are time-bounded and visible so teams can deliver without
silently eroding boundaries.

### Trade-offs

Strong central standards reduce fragmentation but can become a platform bottleneck.
Fully federated ownership improves local speed but duplicates infrastructure and
weakens compatibility. Standardize cross-team invariants and leave feature-local
implementation choices local.
