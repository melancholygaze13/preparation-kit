---
title: "Model-View and SwiftUI State Ownership: Theory"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Model-View and SwiftUI State Ownership"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-11
tags:
  - model-view
  - swiftui
  - state-ownership
---

# Model-View and SwiftUI State Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

In Model-View, a model owns data and product behavior. A view declares how current
state appears and translates user interaction into explicit model actions. SwiftUI
observes the model properties used by a view and updates affected UI when they change.

This can be enough architecture. SwiftUI is architecture-agnostic, and Observation
removes much of the controller glue that previously kept views synchronized. A type
does not become a view model merely because a view observes it.

The important question is not whether a `ViewModel` type exists. It is whether every
important responsibility has a clear owner and can be tested at the right boundary.

## Keep Ownership Explicit

Consider a small favorites feature:

```swift
@Observable
@MainActor
final class Favorites {
    private(set) var items: [Item] = []

    func toggle(_ item: Item) {
        if let index = items.firstIndex(of: item) {
            items.remove(at: index)
        } else {
            items.append(item)
        }
    }
}

struct FavoritesView: View {
    let model: Favorites

    var body: some View {
        List(model.items) { item in
            Button(item.name) { model.toggle(item) }
        }
    }
}
```

The model owns the collection and its mutation. The view renders it and sends an
action. The behavior can be tested without rendering SwiftUI. Adding a second object
that forwards `items` and `toggle` would increase indirection without separating a
new responsibility.

The view may still own local presentation state such as focus, disclosure, or a
temporary selection. Create a model in `@State` when the view owns its lifetime, or
receive it from an ancestor when the feature or application owns it. A `Binding`
passes controlled access to existing storage; it does not establish a second truth.

## Name the Missing Boundary

Model-View stops being simple when the view silently acquires other roles:

| Pressure | Boundary that may help |
|---|---|
| Display transformation and input coordination | View model or presenter |
| Several explicit state transitions and effects | Reducer or feature store |
| Multi-screen flow, deep links, restoration | Coordinator or route owner |
| Reusable business operation | Use case or domain service |
| Remote, local, cache, and retry policy | Repository |
| Vendor or system API | Adapter or capability service |

Choose the smallest boundary that owns the pressure. A formatter does not require a
feature-wide MVVM conversion. A multi-screen route does not require moving all model
state into a coordinator.

Async work is a common threshold. A simple model can own `load()` and its task state.
If work must survive the screen, coordinate across features, persist retries, or
deduplicate requests, the owner belongs outside the view and may belong outside the
presentation model.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Low ceremony and fewer forwarding types | Behavior can drift into view closures |
| Direct data dependencies are easy to trace | Broad models can expose too much mutation |
| Natural fit for SwiftUI observation and bindings | Task and navigation ownership can become hidden |
| Model behavior is testable without UI | Display policy can pollute domain models |
| Easy to grow boundary by boundary | Teams may apply inconsistent thresholds |

Model-View fits a screen that mostly displays and edits model state, with simple
actions and clear lifetimes. It fits poorly when the model would need UI-only
formatting, when a view coordinates several dependencies, or when a workflow spans
screens and must survive their replacement.

## Avoid False Simplicity

A small number of types is not necessarily a simple architecture. Warning signs are:

- network calls and retries inside button closures;
- mutable model properties exposed through broad bindings;
- navigation triggered by unrelated booleans;
- formatters, validation, and analytics mixed into `body`;
- repeated `.task` work with unclear cancellation;
- domain models importing SwiftUI for presentation concerns;
- important behavior covered only by snapshot or UI tests.

Extract pure child views to manage rendering size. Move policy into model methods.
Add a presentation model only when there is presentation behavior to own. Keep domain
models independent of SwiftUI if they are shared across non-UI contexts.

## Engineering Decisions

Use Model-View when you can answer these questions clearly:

1. Which model owns each product fact and valid mutation?
2. Which state is transient and legitimately owned by the view?
3. Who starts and cancels async work?
4. Who owns navigation and restoration?
5. Can important rules be tested without rendering UI?
6. What pressure would trigger another boundary?

At team scale, agree on decision rules rather than requiring one type per screen.
Provide examples for task ownership, navigation, dependency injection, and testing.
Review features that cross those thresholds, while allowing small Model-View screens
to remain small.

## References

- [Model data — SwiftUI](https://developer.apple.com/documentation/swiftui/model-data)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Discover Observation in SwiftUI — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [SwiftUI Group Lab — WWDC26](https://developer.apple.com/videos/play/wwdc2026/8006/)
