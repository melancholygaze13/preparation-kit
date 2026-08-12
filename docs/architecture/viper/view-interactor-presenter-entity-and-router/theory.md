---
title: "View, Interactor, Presenter, Entity, and Router: Theory"
domain: "Architecture"
topic: "VIPER"
concept: "View, Interactor, Presenter, Entity, and Router"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - viper
  - presentation
  - use-cases
---

# View, Interactor, Presenter, Entity, and Router: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

VIPER applies strong responsibility separation to an iOS feature. The view owns framework
rendering, the presenter owns presentation decisions, the interactor runs use cases, the
router performs navigation, and entities carry domain data.

The pattern is useful only when dependency direction keeps those roles real. Five files
that call each other freely are not meaningful separation.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="View, Interactor, Presenter, Entity, and Router" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the View, Interactor, Presenter, Entity, and Router diagram</a></figcaption>
</figure>

The arrows describe common roles, not one mandatory protocol shape. Some implementations
send interactor results through an output protocol; modern Swift can also use async return
values when that keeps ownership clearer.

## Responsibilities

| Part | Owns | Should avoid |
|---|---|---|
| View | UIKit or SwiftUI rendering and input forwarding | Use-case and navigation policy |
| Presenter | Display state, formatting, and user-event coordination | Database and transport details |
| Interactor | Feature business rules and dependency coordination | UIKit types and transition mechanics |
| Entity | Domain values used by the use case | Framework-managed persistence behavior leaking upward |
| Router | Navigation mechanics and destination construction request | Business decisions unrelated to flow |

Assembly is commonly discussed beside VIPER even though it is not in the acronym. A
builder, wireframe, or composition root creates the parts and connects their interfaces.

## Keep Boundaries Practical

A passive view exposes intent-level rendering such as `showLoading()` or
`render(ProfileViewState)`. It should not make the presenter control individual labels.
The presenter converts domain results into display-ready state and decides which use case
to request for a UI event.

The interactor should represent a coherent use case, not become a general service bag. It
calls repositories or clients through injected dependencies and returns domain outcomes.
If business rules already live in reusable domain services, the interactor can stay thin
without duplicating them.

Entity does not mean Core Data entity. Passing `NSManagedObject` through all roles leaks
persistence lifecycle and concurrency constraints. Prefer domain values or explicit
mapping at the data boundary.

The router knows how to present, push, dismiss, or assemble a destination. The presenter
may decide that a successful action should navigate, but it should express a route intent
without importing UIKit transition details.

## State and Concurrency

Choose one presentation-state owner. If both view and presenter independently mutate
loading, content, and error state, they can disagree. In a UIKit VIPER module, the
presenter is often the decision owner and the view renders commands or a state value.

UI-facing calls belong on the main actor. Async work needs explicit lifetime,
cancellation, stale-result, and error policies. VIPER names do not solve those concerns.
An interactor that starts unowned tasks is still unsafe architecture.

## Benefits and Costs

| Benefits | Costs and risks |
|---|---|
| Clear location for presentation, use-case, and navigation logic | Many interfaces and files for simple features |
| Presenter and interactor can be tested without UIKit | Behavior can become hard to trace across callbacks |
| Module boundary can support team ownership | Boilerplate and assembly mistakes |
| Router removes transition mechanics from view controllers | Presenter-router split can overlap with coordinators |

VIPER fits a large, interaction-heavy UIKit feature when a team benefits from strict role
ownership and has conventions or tooling for assembly. It fits poorly for a small screen,
a simple SwiftUI state flow, or a team that does not need five independently changing
roles.

## References

- [objc.io: Architecting iOS Apps with VIPER](https://www.objc.io/issues/13-architecture/viper/)
- [Clean Coder Blog: The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
