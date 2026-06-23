---
title: "Feature Boundaries and View Modeling: Theory"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Feature Boundaries and View Modeling"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - feature-boundaries
  - view-modeling
  - observation
---

# Feature Boundaries and View Modeling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A feature boundary groups one user outcome, the state and rules required to produce
it, and the capabilities it uses. SwiftUI views describe the current presentation
and send user intent back to the owner of that state.

Do not create a view model for every view. Add a model when state or policy needs an
identity and lifetime beyond a small value-typed view.

## How It Works

### Start from Ownership

For each value, ask who creates it, who may mutate it, and how long it must live.
Transient disclosure, focus, and local selection can remain private `@State` in the
view. Shared loading state, validation rules, async coordination, and multi-screen
workflow state usually belong to a feature model.

```swift
@MainActor
@Observable
final class CheckoutModel {
    private(set) var phase: Phase = .review
    private(set) var cart: Cart

    private let submitOrder: SubmitOrder

    init(cart: Cart, submitOrder: SubmitOrder) {
        self.cart = cart
        self.submitOrder = submitOrder
    }
}
```

The view that creates this model stores it in `@State`. Descendants receive the
model when they need coordinated access, `@Bindable` when they need bindings, or
smaller values and actions when they are reusable presentation components.

### Views versus Models

A view should contain presentation composition and simple derived display values.
It can choose layout, formatting, animation, and which controls appear. It should
not own networking, persistence policy, cross-screen coordination, or business
rules whose correctness must be tested independently.

A feature model is not a dumping ground for all view code. Moving every computed
label, color, and one-line action into a class creates indirection without a useful
boundary. Keep pure presentation close to the view unless several surfaces require
the same domain rule.

Prefer domain language in model APIs:

```swift
await model.placeOrder()
model.removeItem(id)
model.applyPromotion(code)
```

Avoid exposing writable properties that let views assemble invalid transitions:

```swift
model.isSubmitting = true
model.error = nil
model.orderID = nil
```

One operation can preserve invariants and define cancellation, analytics, and error
policy once.

### Shape State around Legal UI States

Several Booleans can represent impossible combinations. An enum or structured state
often communicates the feature better:

```swift
enum CheckoutPhase {
    case review
    case submitting
    case failed(DisplayError)
    case completed(Order.ID)
}
```

Do not force every independent concern into one large enum. A form can have a phase,
field values, focus, and a presentation route. Group values that share transition
rules; keep orthogonal state separate.

Derived values should usually be computed from source state. Storing both `items`
and `isEmpty`, or both a selected ID and a copied selected model, creates
synchronization work. Store the minimal source of truth and resolve current data.

### Component Boundaries

Extract a view when it has a meaningful visual responsibility, reuse value, complex
layout, or independent invalidation boundary. A child should receive what it needs:

```swift
OrderSummary(
    items: model.cart.items,
    total: model.cart.total,
    onRemove: model.removeItem
)
```

Passing the whole model is reasonable for a feature-specific child that participates
in the same state machine. Passing it to generic rows and controls couples them to
unrelated state and makes previews harder.

Bindings expose mutation authority. Give a child a binding only when two-way editing
is the intended API. For semantic events such as submit, delete, or retry, an action
closure communicates intent better than a binding to internal flags.

### Feature Composition

A parent flow creates feature models and supplies dependencies from the composition
root. Children should not discover concrete services through process-wide
singletons. The parent also owns coordination between sibling features, such as
translating a catalog selection into navigation or checkout state.

Keep navigation ownership at the lowest flow that coordinates its destinations. A
leaf emits `onOpenProduct(id)` rather than importing the app router. This allows the
same view to appear in a stack, split view, sheet, or preview.

### Lifetime and Identity

Creating a model in `body` can reconstruct it whenever the view description is
evaluated. Store an owned observable model in `@State`, or let a stable ancestor
create and pass it. Do not hide model construction behind a computed property whose
identity changes unexpectedly.

Scope models narrowly. An app-wide model containing authentication, navigation,
every feature state, and all services becomes a high-contention global dependency.
Use scene scope for scene state, flow scope for navigation workflows, and feature
scope for feature policy.

### Avoid One Model per Screen by Rule

A screen boundary and a state-owner boundary are not always the same. Several screens
in one checkout flow may share one model because they participate in one transaction.
One dashboard screen may compose several independently loaded feature models because
its cards have different owners and refresh policies.

Creating a model for every extracted subview fragments transitions and creates
synchronization between parent and child copies. Using one giant model for an entire
tab has the opposite problem: unrelated changes and dependencies accumulate. Follow
the lifetime of the state machine, not the shape of the view tree.

When a child needs only one operation, pass the action instead of forwarding a model
through several layers. When many descendants need the same coordinated state, pass
the feature model or inject it at that feature root rather than creating proxy models.

### Persistence and Restoration

Feature state is not automatically durable state. Persist stable domain data in a
repository and restore compact user intent such as selected IDs or draft identifiers.
Do not encode an observable model graph or destination views.

On restoration, the feature recreates its model from dependencies, resolves current
data, and validates saved intent. This keeps schema migration and authorization at
the data boundary instead of coupling them to view implementation details.

### Testing and Previews

Test feature transitions against injected dependencies without rendering SwiftUI.
View tests then cover integration, accessibility, and key layouts. A preview can
construct the feature with representative state and deterministic dependencies.

Avoid adding public setters or test-only branches to make a model testable. Inject
the operation or repository and expose behavior through the same actions production
uses.

Preview scenarios should cover loading, long content, empty, error, and completed
states without starting real networking. If constructing a preview requires the
whole application container, the feature boundary is probably importing too much.

## Constraints and Guarantees

- `@State` preserves storage for the lifetime of a stable SwiftUI view identity.
- Observation tracks property access, but it does not decide architectural ownership.
- A binding shares mutation access to a source of truth; it does not create ownership.
- Environment injection is hierarchy-scoped and appropriate only when descendants
  legitimately share the dependency.
- View reconstruction is normal, so reference model lifetime must be explicit.

## Engineering Decisions

| Situation | Prefer |
|---|---|
| Local toggle or focus | Private view `@State` |
| Coordinated async feature state | Main-actor observable feature model |
| Reusable leaf component | Values and semantic action closures |
| Feature-specific editing child | Model reference or narrow bindings |
| Sibling feature coordination | Parent flow model or coordinator |
| Shared domain rule | Domain or use-case layer, not duplicated view logic |

## Production Application

Architecture problems appear as change amplification: a simple feature change edits
many unrelated files, a view imports infrastructure, or tests require a full app
graph. Track dependency direction and ownership before adding a framework.

At Staff scope, define feature entry APIs, state ownership, route intents, and
dependency contracts. Use code review and templates to make the common path easy,
but permit smaller features to stay simple. The goal is predictable change, not a
uniform count of layers.

## References

- [Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Data essentials in SwiftUI](https://developer.apple.com/videos/play/wwdc2020/10040/)
