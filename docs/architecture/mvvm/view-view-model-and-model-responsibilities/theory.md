---
title: "View, View Model, and Model Responsibilities: Theory"
domain: "Architecture"
topic: "MVVM"
concept: "View, View Model, and Model Responsibilities"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - mvvm
  - responsibilities
  - presentation
---

# View, View Model, and Model Responsibilities: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

MVVM adds a presentation boundary between a view and the rest of the application.
The **view model** exposes state in a form the view can render and accepts inputs in
terms of user intent. It coordinates model or service dependencies but should not
become their replacement.

MVVM is useful when presentation has enough behavior to own. It is overhead when the
view model only repeats a model's properties and methods.

## Divide Responsibilities

| Role | Owns | Should avoid |
|---|---|---|
| View | Layout, local visual state, focus, gestures, input delivery | Business policy, data-source coordination, hidden tasks |
| View model | Presentation state, display transformation, input coordination, request phases | UIKit or SwiftUI view instances, durable storage details, unrelated workflows |
| Model or use case | Product rules and reusable operations | Screen wording, color, focus, presentation lifetime |
| Repository or service | Data-source policy and system or vendor integration | View presentation decisions |
| Coordinator | Flow navigation, route interpretation, child-flow lifetime | Feature business rules |

These are decision boundaries, not required type names. A small app may combine a
use case with its model. A complex flow may need all of them. Judge whether one
responsibility changes independently and has tests that belong at its boundary.

## Design a Presentation Contract

Expose what the screen can show and what the user can do:

```swift
@Observable
@MainActor
final class ProductViewModel {
    enum State {
        case loading
        case content(title: String, price: String, canBuy: Bool)
        case failed(message: String)
    }

    private(set) var state: State = .loading
    private let product: ProductLoading
    private let formatter: PriceFormatting

    func appeared() async { /* load and map */ }
    func buyTapped() { /* validate intent and delegate */ }
}
```

The state describes presentation outcomes rather than exposing transport responses.
Inputs such as `buyTapped()` preserve intent. A public mutable `isLoading`, `error`,
`product`, and `priceText` would allow invalid combinations and uncontrolled writes.

Keep display-only decisions here when they need tests or combine several facts:
localized text, validation messages, button availability, and loading phases. Small
formatting close to one `Text` can remain in the view. Product rules such as purchase
eligibility belong below presentation if other clients or flows use them.

## Maintain One Source of Truth

Avoid copying a full domain model into mutable view-model properties. Store the
minimum facts and derive outputs. A view model can intentionally hold a draft that
differs from the saved model, but it needs explicit save, cancel, and conflict rules.

Do not make two-way bindings the default interface to shared state. A binding is
appropriate for simple editable presentation state. For policy-sensitive changes,
expose an intent so the view model can validate and update related state together.

## Keep Framework Boundaries Deliberate

A SwiftUI view model commonly uses Observation and `@MainActor`. That is acceptable
when it is explicitly a SwiftUI presentation component. A reusable domain model
should not import SwiftUI merely to become observable.

Avoid storing a `View`, `UIViewController`, alert, or navigation controller in the
view model. Expose presentation state or a route intent instead. This keeps rendering
replaceable and tests independent of view hierarchy details.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Presentation behavior has a focused test boundary | Adds state mapping and observation |
| Views become smaller and mostly declarative | View models can become screen-sized containers |
| Inputs and outputs make UI behavior explicit | Broad bindings can hide mutation paths |
| Framework and transport details can stay out of views | A forwarding view model adds no value |
| Works with UIKit and SwiftUI | Navigation and lifetime ownership still need decisions |

MVVM fits screens with validation, derived display state, multiple dependencies, or
meaningful async phases. Model-View often fits a small SwiftUI surface whose model
already exposes exactly the state and actions it needs.

## Engineering Decisions

Review a view model with these questions:

1. Which presentation behavior does it own?
2. Is each output derived from one authoritative state?
3. Are inputs user intents or unrestricted property writes?
4. Which rules belong to a reusable model or use case?
5. Who owns navigation, dependencies, async lifetime, and persistence?
6. Would removing this type make the view own meaningful policy?

At Staff scope, standardize these responsibility tests, not a mandatory class per
screen. Provide examples showing when Model-View, MVVM, a coordinator, or a reducer
fits. Measure whether the convention improves change safety rather than counting
view models.

## References

- [Model data — SwiftUI](https://developer.apple.com/documentation/swiftui/model-data)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Discover Observation in SwiftUI — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [SwiftUI Group Lab — WWDC26](https://developer.apple.com/videos/play/wwdc2026/8006/)
