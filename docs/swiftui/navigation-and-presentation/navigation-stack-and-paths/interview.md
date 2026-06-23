---
title: "NavigationStack and Paths: Interview Questions"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "NavigationStack and Paths"
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
  - navigation-stack
  - navigation-path
  - view-identity
---

# NavigationStack and Paths: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does value-based navigation work?](#q1-how-does-value-based-navigation-work) | Senior | Path and destination mapping |
| [When would you use an array instead of NavigationPath?](#q2-when-would-you-use-an-array-instead-of-navigationpath) | Senior | Type safety and composition |
| [Where should navigation state live?](#q3-where-should-navigation-state-live) | Senior | Flow ownership |
| [How would you design navigation across feature modules?](#q4-how-would-you-design-navigation-across-feature-modules) | Staff | Boundaries and evolution |

---

<a id="q1-how-does-value-based-navigation-work"></a>
## Q1: How does value-based navigation work?

### Short Answer

The path stores `Hashable` route values above the root. A value-based link or path
mutation adds a value, and `navigationDestination(for:)` maps its type to a view.
User back navigation removes values. This makes the visible hierarchy inspectable
and controllable as state.

### Expanded Answer

I use lightweight routes, usually an enum containing stable entity IDs. I register
the destination inside the stack but outside lazy containers. The destination
loads current model data for the ID instead of receiving a large snapshot through
the path.

Direct destination links can work for local navigation, but they do not provide the
same app-visible path state. For deep links, tests, restoration, or replacing a
flow, I keep the route sequence explicit.

### Example

`path.append(.order(orderID))` expresses the desired destination. The destination
registration creates `OrderScreen(id: orderID)` when SwiftUI resolves that route.

<a id="q2-when-would-you-use-an-array-instead-of-navigationpath"></a>
## Q2: When would you use an array instead of NavigationPath?

### Short Answer

I prefer `[Route]` when one route type can model the flow. It preserves exhaustive
switching, straightforward equality, and easy tests. I use `NavigationPath` when a
single stack genuinely needs heterogeneous route types, often from independently
owned features.

### Expanded Answer

`NavigationPath` provides type erasure and codable representation when its elements
support encoding. The cost is weaker compile-time visibility into the path. A route
enum often handles heterogeneous screens without heterogeneous element types, so I
do not choose `NavigationPath` merely because the screens differ.

For either choice, route values remain small and stable. Storing mutable model
objects can make hash identity change and restoration stale.

### Trade-offs

A shared enum is easy to reason about but can become a cross-team merge and
ownership hotspot. Separate route types reduce coupling but need explicit
registration and composition rules.

<a id="q3-where-should-navigation-state-live"></a>
## Q3: Where should navigation state live?

### Short Answer

It should live at the lowest flow owner that needs to coordinate its destinations.
Leaf views emit typed navigation intents, while that owner mutates the path. App or
scene scope is justified only for events that coordinate several feature flows.

### Expanded Answer

Local ownership keeps a reusable screen independent from its container and gives
each scene its own history. I pass actions or bindings down narrowly rather than
injecting a mutable global router everywhere.

An app-level coordinator can translate a deep link into tab, split selection,
modal, and stack state. It should expose validated operations and preserve feature
boundaries, not become a bag of public mutable arrays.

### Example

A product row calls `onSelect(product.id)`. The catalog flow decides whether that
means a stack push, a detail-column selection, or another presentation on the
current platform.

<a id="q4-how-would-you-design-navigation-across-feature-modules"></a>
## Q4: How would you design navigation across feature modules?

### Short Answer

Each feature owns its internal routes and exposes a small set of entry intents. A
composition layer maps cross-feature intents to app navigation state and registers
destinations. Route payloads use stable IDs, and external URLs never construct
views directly.

### Expanded Answer

I first define ownership: which team owns route names, destination construction,
and backward compatibility. Feature code should not import another feature's
implementation only to navigate. It targets an interface or emits an intent that
the composition root handles.

I version persisted and external route schemas separately from Swift type names.
Migration tests cover supported links and restored paths. Unsupported routes fail
to a safe landing page with an observable reason rather than leaving partial state.

### Trade-offs

One app route enum gives exhaustive control but centralizes changes. Distributed
routes scale ownership but can create duplicate registrations or unclear precedence.
A registry can help, but it needs collision checks, diagnostics, and a documented
composition order.
