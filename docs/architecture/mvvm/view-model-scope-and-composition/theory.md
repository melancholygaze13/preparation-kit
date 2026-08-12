---
title: "View Model Scope and Composition: Theory"
domain: "Architecture"
topic: "MVVM"
concept: "View Model Scope and Composition"
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
  - mvvm
  - composition
  - scope
---

# View Model Scope and Composition: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A view model should own one coherent set of presentation state, inputs, dependencies,
and async lifetime. The visual screen is a useful initial scope, but navigation and
layout do not always match ownership. A long screen can use one model; a small screen
can compose several independently stateful capabilities.

Composition should preserve one owner per fact. A parent coordinates child models
and feature-level decisions. It should not mirror every child's observable state.

## Choose Scope from Behavior

Split a view model when a part has several of these properties:

- independent state transitions and inputs;
- a lifetime different from its parent;
- reusable presentation behavior;
- distinct dependencies or effect policy;
- a separate owner or release boundary;
- tests that describe a meaningful capability on their own.

Do not split merely because a SwiftUI `View` was extracted. A stateless row can accept
values and actions. Giving it a reference model adds allocation, observation, identity,
and lifecycle work without adding a responsibility.

## Compose Without Duplicating Truth

For a checkout screen, a parent might own workflow phase while child models own an
address draft and payment selection:

```swift
@Observable
@MainActor
final class CheckoutViewModel {
    let address: AddressFormViewModel
    let payment: PaymentPickerViewModel
    private(set) var phase: Phase = .editing
    private let submitOrder: SubmitOrder

    func submitTapped() async {
        guard let addressValue = address.validatedValue,
              let paymentValue = payment.selection else { return }
        // Coordinate one feature-level operation.
    }
}
```

The children own their presentation details. The parent asks for validated outputs at
the coordination boundary. It does not observe and copy `street`, `city`, and every
payment field into parallel properties.

If several siblings display the same product or session fact, inject one shared model
or repository. Do not let each child fetch and mutate its own copy unless they are
intentional drafts with a merge rule.

## Manage Collection Identity

List rows often expose the difference between view identity and model ownership.
Creating a new row view model during every `body` evaluation can lose state or repeat
work. Use stable domain identifiers and let a stable owner manage models that truly
need reference identity.

Before caching one view model per row, ask whether a value plus actions is enough.
Large lists of reference models increase memory, subscriptions, and update paths. A
row model is justified for editable drafts, independent effects, or nontrivial row
state. Remove cached row models when their domain item disappears.

## Keep Navigation and Flow at the Right Level

A feature view model can expose local presentation such as a selected item or sheet.
A coordinator or route owner fits navigation that crosses features, supports deep
links, restores paths, or owns child-flow lifetime.

Avoid each child directly mutating a shared navigation path. Prefer route intents
that a parent or coordinator interprets. This keeps feature presentation tests from
depending on concrete navigation APIs.

## Dependency and Lifetime Composition

Construct view models at a composition root or feature boundary. The parent can create
children from explicit dependencies and determine their scope. Avoid global service
lookup because it hides what each child needs and makes lifetime accidental.

Watch for reference cycles:

- parent strongly owns child;
- child callback strongly captures parent;
- coordinator owns view controller and view model while callbacks retain coordinator;
- long-running task retains its view model beyond feature teardown.

Prefer one clear ownership direction and weak callbacks where the child must not own
the parent. Cancellation and teardown should follow the same hierarchy.

## Pros and Cons

| Composition choice | Benefit | Cost or risk |
|---|---|---|
| One screen view model | Simple construction and tracing | Can mix unrelated state and lifetimes |
| Child view models | Independent behavior and tests | More identity, observation, and wiring |
| Shared model injected into siblings | One source of truth | Siblings become coupled to shared scope |
| Coordinator above view models | Clear flow ownership | Adds route contracts and lifecycle wiring |
| Value state and action closures | Lightweight and explicit | Parent may grow if the child has real behavior |

## Engineering Decisions

Test composition at two levels. Child tests cover their transitions. Parent tests use
narrow child outputs or fakes to cover workflow coordination. Keep a few integration
tests for real wiring, ownership, and navigation.

At Staff and Principal scope, align module, team, and runtime ownership where useful.
Define who owns shared models, who may create feature scopes, and how APIs evolve.
Avoid a central "app view model" that becomes a global mutable service. Use dependency
graphs, memory diagnostics, and change history to find scopes that are too broad.

## References

- [Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
