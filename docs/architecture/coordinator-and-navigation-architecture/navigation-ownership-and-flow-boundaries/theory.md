---
title: "Navigation Ownership and Flow Boundaries: Theory"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Navigation Ownership and Flow Boundaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - coordinators
  - navigation
  - ownership
---

# Navigation Ownership and Flow Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Navigation contains two decisions:

1. **Route policy:** Given current flow state and user intent, what should happen?
2. **Presentation mechanism:** Push, present, select a column, replace a root, or update
   a SwiftUI path.

A coordinator or flow owner keeps route policy and feature construction outside an
individual screen. The screen reports intent such as `checkoutTapped`; the flow owner
checks prerequisites, creates dependencies, and performs or describes the transition.

## Choose the Owner by Journey Scope

| Navigation | Suitable owner |
|---|---|
| Toggle, popover, local sheet | View or feature presentation state |
| Push within one simple feature | Feature model or local coordinator |
| Authentication, checkout, onboarding | Flow coordinator or route reducer |
| Cross-feature deep link | App or scene router delegating to feature owners |
| Multiple windows or scenes | Per-scene navigation owner plus app-level routing |

Do not centralize every presentation in one app coordinator. It becomes a switch over
all features and a cross-team bottleneck. Delegate each coherent journey to a feature
flow while the parent owns transitions between flows.

### Treat Tabs as Sibling Flows

A tab container usually owns selection among peer flows. Each tab can own an independent
navigation stack, selection, and restoration state. The tab owner should not flatten
those histories into one global path.

For a cross-tab deep link, the app or scene router selects the tab by stable route
identity, then delegates the remaining destination to that tab's flow owner. This keeps
feature construction and Back behavior inside the correct boundary. Do not encode a tab
as an array index in durable routes because rollout, customization, or platform
adaptation can reorder the visible tabs.

Reselecting the active tab may pop to root, scroll to top, or do nothing. That is product
policy owned by the tab flow, not an automatic side effect of every selection callback.
The policy must protect drafts and other unsaved state.

## Design Narrow Route Contracts

Views should express outcomes, not construct destinations:

```swift
enum ProductRoute {
    case reviews(productID: Product.ID)
    case checkout(cartID: Cart.ID)
}

protocol ProductRouting: AnyObject {
    func handle(_ route: ProductRoute)
}
```

The route carries stable identifiers and required context. The coordinator resolves
current data through dependencies. Passing a live managed object, view controller, or
entire feature model couples destination lifetime and implementation to the source.

Route results travel back as domain outcomes such as `.completed(orderID)` or
`.cancelled`, not callbacks for every internal screen. Completion closures are fine
when ownership is clear and they do not create cycles.

## Keep Business Rules Outside the Router

A coordinator may choose a route based on an application result, but should not become
the owner of pricing, authorization, or validation rules. A use case decides whether
an operation is allowed; the coordinator maps that outcome to navigation.

Similarly, a view model owns presentation behavior. It can emit `signInRequired`, but
should not push a controller directly. This keeps its tests independent of navigation
framework details.

## Synchronize with User-Driven Navigation

Users can swipe back, dismiss a sheet, select another split-view item, or close a
scene. The flow owner must learn about these transitions so its state and child
ownership match the visible hierarchy.

UIKit coordinators can observe navigation-controller delegates, presentation-controller
delegates, or explicit callbacks. SwiftUI can bind a typed path or optional destination
state. Avoid maintaining an imperative hierarchy and a separate route model without a
single synchronization owner.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Screens do not construct or know destinations | More route and factory types |
| Flow policy becomes testable | Lifetime mistakes can retain whole flows |
| Dependencies are composed at feature entry | Back gestures and dismissals need synchronization |
| Deep links can target flow contracts | One global coordinator can become oversized |
| UIKit and SwiftUI mechanisms can be adapted | Simple local presentation may become over-engineered |

Use a coordinator when navigation is a workflow with policy, composition, or restoration.
Keep direct local navigation when the destination is simple and does not create hidden
ownership or reuse problems.

## Engineering Decisions

Define who owns route state, destination construction, child lifetime, dismissal,
results, invalid routes, and analytics. Test route decisions as values; integration
tests verify framework transitions and interactive dismissal.

At Staff scope, define route boundaries between feature teams, stable identifiers,
deep-link ownership, and migration rules. Avoid a shared router that imports every
feature implementation. Prefer app-level route parsing followed by feature-owned
interpretation.

## References

- [Navigation — SwiftUI](https://developer.apple.com/documentation/swiftui/navigation)
- [Migrating to new navigation types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types)
- [Restoring your app's state](https://developer.apple.com/documentation/uikit/restoring-your-app-s-state)
- [`UITabBarController`](https://developer.apple.com/documentation/uikit/uitabbarcontroller)
- [`TabView`](https://developer.apple.com/documentation/swiftui/tabview)
