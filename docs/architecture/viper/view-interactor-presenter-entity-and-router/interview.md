---
title: "View, Interactor, Presenter, Entity, and Router: Interview Questions"
domain: "Architecture"
topic: "VIPER"
concept: "View, Interactor, Presenter, Entity, and Router"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - viper
  - presentation
  - use-cases
---

# View, Interactor, Presenter, Entity, and Router: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What are the VIPER responsibilities?](#q1-what-are-the-viper-responsibilities) | Senior | Role separation |
| [Where should async state live in VIPER?](#q2-where-should-async-state-live-in-viper) | Senior | State ownership |
| [When does VIPER fit an iOS feature?](#q3-when-does-viper-fit-an-ios-feature) | Senior | Selection judgment |

---

<a id="q1-what-are-the-viper-responsibilities"></a>
## Q1: What are the VIPER responsibilities?

### Short Answer

The view renders and forwards input. The presenter owns presentation decisions. The
interactor runs feature use cases through injected dependencies. Entities carry domain
data. The router performs navigation. An external builder assembles the module.

### Expanded Answer

The dependencies matter more than the names. UIKit should stay in the view and router,
while business policy stays in the interactor or domain layer. The presenter receives
domain outcomes and produces display state and route intent.

<a id="q2-where-should-async-state-live-in-viper"></a>
## Q2: Where should async state live in VIPER?

### Short Answer

One UI-facing owner should decide loading, content, and failure state, commonly the
main-actor presenter. The interactor performs an async use case and returns a domain
outcome. Task lifetime, cancellation, stale-result checks, and error mapping remain
explicit responsibilities.

### Trade-offs

Storing independent state in both view and presenter creates disagreement. Moving all
state to the interactor mixes presentation policy with business work. VIPER does not
remove the need for a clear concurrency owner.

<a id="q3-when-does-viper-fit-an-ios-feature"></a>
## Q3: When does VIPER fit an iOS feature?

### Short Answer

When a large or interaction-heavy feature benefits from strict separation of UI,
presentation, use cases, and routing, especially on a team with established conventions.
For a small screen or direct SwiftUI state flow, the object and protocol cost is often
higher than the benefit.
