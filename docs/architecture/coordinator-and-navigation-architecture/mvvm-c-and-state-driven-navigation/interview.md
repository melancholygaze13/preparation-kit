---
title: "MVVM-C and State-Driven Navigation: Interview Questions"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "MVVM-C and State-Driven Navigation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - mvvm-c
  - state-driven-navigation
  - swiftui
---

# MVVM-C and State-Driven Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does MVVM-C handle navigation?](#q1-how-does-mvvm-c-handle-navigation) | Senior | Typed route intent |
| [How does state-driven navigation differ?](#q2-how-does-state-driven-navigation-differ) | Senior | Route as state |
| [How would you mix UIKit and SwiftUI navigation?](#q3-how-would-you-mix-uikit-and-swiftui-navigation) | Senior | Hybrid ownership |

---

<a id="q1-how-does-mvvm-c-handle-navigation"></a>
## Q1: How does MVVM-C handle navigation?

### Short Answer

The view model emits a typed route intent without knowing UIKit. The coordinator
interprets it, constructs dependencies and destinations, performs navigation, and owns
child-flow lifetime. It also observes back gestures and dismissals to keep ownership
aligned with the visible hierarchy.

### Expanded Answer

I avoid passing view controllers or a generic router into the view model. Route values
use domain identifiers and meaningful outcomes. Product authorization remains in a
use case; the coordinator chooses presentation from its result.

<a id="q2-how-does-state-driven-navigation-differ"></a>
## Q2: How does state-driven navigation differ?

### Short Answer

Navigation is represented by typed path, selection, or optional destination state.
The UI renders that state, and user back navigation updates the binding. This improves
inspection, deep links, restoration, and transition tests, but still needs a clear
flow owner.

### Expanded Answer

The path stores identifiers and route data, not views. I keep local destinations in
the feature and cross-feature routes higher. A global path exposed everywhere would
recreate broad coupling.

<a id="q3-how-would-you-mix-uikit-and-swiftui-navigation"></a>
## Q3: How would you mix UIKit and SwiftUI navigation?

### Short Answer

I choose one authority at each boundary. A UIKit coordinator can host SwiftUI and own
the outer flow, while a SwiftUI router owns an internal typed path. An adapter translates
completion and dismissal; both sides do not independently control the same destination.

### Expanded Answer

I define which side creates and removes the hosted feature, how route values cross, and
how interactive dismissal is reported back. The inner framework may own local navigation
without gaining authority over the outer journey. Integration tests exercise push, back,
dismissal, and state restoration across the boundary.

### Trade-offs

A hybrid supports incremental migration and custom UIKit transitions. It adds lifecycle
translation and a risk of two sources of truth, so ownership and dismissal callbacks
must be explicit and tested.
