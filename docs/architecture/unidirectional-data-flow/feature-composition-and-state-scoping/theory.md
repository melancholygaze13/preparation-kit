---
title: "Feature Composition and State Scoping: Theory"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "Feature Composition and State Scoping"
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
  - unidirectional-data-flow
  - composition
  - state-scoping
---

# Feature Composition and State Scoping: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UDF scales by composing domains, not by placing all application state and actions in
one type. A feature domain contains the state, action vocabulary, transition logic,
effects, and lifetime for one capability.

A parent owns child existence and routes child actions. A child owns its internal
presentation behavior and reports only meaningful outcomes upward.

## Compose Parent and Child Domains

```swift
struct CheckoutState {
    var cart: CartState
    var payment: PaymentState?
}

enum CheckoutAction {
    case cart(CartAction)
    case payment(PaymentAction)
    case paymentButtonTapped
    case orderSubmitted(Order.ID)
}
```

The parent reducer delegates `.cart` and `.payment` to child reducers, then handles
cross-feature coordination. The precise composition API depends on the store library.

Do not let the parent switch over every private child action. A child can emit a
delegate outcome such as `.delegate(.paymentConfirmed(token))`. This preserves the
child's freedom to change its internal steps while keeping the parent contract small.

## Scope Views Narrowly

A view should observe the smallest state it renders and send only actions in its
domain. Narrow scoping improves readability and can reduce broad updates.

Avoid creating a new copied child state only for convenience. Scoping should provide
a projection into authoritative state. If a child needs an editable draft, name it as
a distinct value and define save, cancel, and conflict behavior.

Passing the entire app store to every view defeats feature boundaries. Any view can
then observe or mutate unrelated state, and module dependencies spread with the root
domain.

## Own Shared State Once

Several features may need account, cart, playback, or connectivity state. Options
include:

| Need | Suitable ownership |
|---|---|
| Parent coordinates a short flow | Parent state projected to children |
| App-wide session fact | Session model or root-owned shared state |
| Durable remote/local data | Repository observed by feature effects |
| Independent form edits | Child draft with explicit commit |

Copying a shared cart into each feature store creates reconciliation work. Putting all
feature-local state in a root store creates global coupling. Choose the narrowest
common owner that matches lifetime and mutation policy.

When two children need to coordinate, prefer a parent action or shared capability.
Direct child-to-child dispatch makes ownership and ordering unclear.

## Tie State Presence to Lifetime

Optional child state can represent presentation:

- setting state creates the child scope;
- child actions are valid only while state exists;
- dismissing removes state and cancels child effects;
- late actions from removed children must not recreate or mutate the feature.

Collections need stable domain identifiers. Cancellation IDs include the element ID,
and removal cancels element work. Index-based identity breaks when rows reorder or
delete.

Navigation paths can be modeled as state when deep links, restoration, and testable
flow transitions matter. Keep route state minimal and restorable—usually identifiers
and route-specific drafts, not live service objects.

## Define Module Boundaries

A feature can expose its state and action contract while hiding reducer helpers,
dependencies, and internal actions. If the parent must know every internal type, the
module boundary is too broad.

Separate modules are useful when teams own features independently or forbidden
dependencies need compiler enforcement. They add API evolution and build-graph cost,
so source-level domains can be enough for a smaller team.

## Engineering Decisions

Test child reducers independently. Parent tests cover integration outcomes and child
lifetime: creation, dismissal, late actions, collection removal, and shared-state
coordination. A few store tests verify that scoped observation and effect cancellation
match the runtime.

At Staff scope, define feature contract ownership, dependency direction, route and
identifier standards, and shared-state boundaries. Avoid one root reducer becoming a
central merge bottleneck. Teams should evolve internal actions without coordinated
changes when their public outcomes remain stable.

## References

- [Redux Fundamentals: Concepts and Data Flow](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- [Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
