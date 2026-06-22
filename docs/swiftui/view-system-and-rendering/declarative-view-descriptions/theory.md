---
title: "Declarative View Descriptions: Theory"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "Declarative View Descriptions"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - declarative-ui
  - view-builder
  - view-composition
---

# Declarative View Descriptions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A SwiftUI view is a value that describes part of the interface for its current
inputs. The value is temporary. SwiftUI owns the persistent machinery that tracks
dependencies, preserves eligible state, lays out content, and renders platform UI.

```text
state and inputs -> body -> new view description -> SwiftUI update
```

When an input changes, SwiftUI may evaluate `body` again. It compares and applies
the new description within its internal graph. Do not treat the view structure as
a retained screen object or `body` as a one-time construction callback.

## How It Works

### The View Protocol

A custom view conforms to `View` and provides a computed `body`:

```swift
struct ProfileHeader: View {
    let name: String
    let isVerified: Bool

    var body: some View {
        HStack {
            Text(name)

            if isVerified {
                Image(systemName: "checkmark.seal.fill")
                    .accessibilityLabel("Verified")
            }
        }
    }
}
```

`some View` hides the concrete return type while preserving it for the compiler.
The concrete type still captures the structure of the `HStack`, its children, and
the conditional content. This static type information supports composition and
optimization without exposing a long generated type in the API.

Leaf views eventually hand rendering work to SwiftUI. Custom views normally
describe other views rather than drawing or retaining subviews directly.

### View Builders and Branches

The `body` requirement uses `@ViewBuilder`, a result builder. It combines several
view expressions and supported control flow into one value conforming to `View`.
This is why `body` can contain multiple children and an `if` statement without an
explicit `return` or manual type erasure.

Branches are structure, not imperative commands. A branch describes one concrete
subtree or another for the current evaluation. Changing branches can affect
identity and state lifetime; that consequence belongs to the separate view
identity concept.

Keep builder logic about presentation. Compute business decisions before they
reach the view when doing so makes policy independently testable.

### Modifiers Produce New Values

View modifiers do not mutate a retained view. Each modifier returns a new value
that wraps or transforms the previous value:

```swift
Text("Saved")
    .padding(8)
    .background(.green)
```

This describes padded text with a background around the padded result. Reversing
the modifiers applies padding outside the background, so modifier order can change
layout, drawing, environment, accessibility, and event behavior.

The exact generated types are usually an implementation detail. The semantic
nesting is not: read a modifier chain as a sequence of wrappers from top to bottom.

### Stored Properties Define Inputs

A view's ordinary stored properties are inputs to its description. They do not
turn the value into a persistent controller:

```swift
struct StatusBadge: View {
    let title: String
    let color: Color

    var body: some View {
        Text(title)
            .padding(.horizontal, 8)
            .background(color, in: .capsule)
    }
}
```

The parent supplies a new `title` or `color` by producing a new `StatusBadge`
value. A view generally does not mutate those inputs to keep them synchronized
with a separate model.

Property wrappers such as `@State` look like stored properties in source, but
SwiftUI manages their persistent storage and connects it to the view description.
Environment values and observable models also establish framework-managed
dependencies. Their ownership rules are covered in the state and data-flow topic.

A `View` can contain reference-typed inputs, so declaring it as a struct does not
automatically make the whole dependency graph immutable or concurrency-safe. If a
reference changes without participating in SwiftUI's observation mechanisms, the
framework has no general guarantee that the view will update. Prefer explicit
observable inputs and clear ownership over relying on hidden mutation.

### Evaluation Is Not Lifetime

SwiftUI may create view values and evaluate `body` many times. That does not mean
the visible platform control is destroyed and recreated each time. Persistent
state and rendered UI are managed separately and associated with identity in the
view graph.

Initializers and `body` therefore cannot serve as reliable lifecycle callbacks.
Use the framework's state, task, event, and presentation APIs for work tied to a
view's behavior. Even those APIs need explicit cancellation and idempotency when
work can restart.

### Keep body Cheap and Predictable

`body` can run during updates, so it should describe UI without unexpected effects:

```swift
struct OrderList: View {
    let visibleOrders: [Order]

    var body: some View {
        List(visibleOrders) { order in
            OrderRow(order: order)
        }
    }
}
```

Prefer passing already selected data over repeatedly sorting a large collection,
decoding files, querying a database, allocating service objects, or starting
network work in `body`. Small formatting and derived presentation values are fine
when their cost is bounded and their result depends only on current inputs.

Avoid model mutation while producing the description. Mutation can create update
loops, ordering bugs, and work whose execution count depends on framework
evaluation. User actions belong in control actions; asynchronous loading normally
belongs in `.task` or a model with a defined owner.

### Extract Boundaries for a Reason

Extract a dedicated `View` when it creates a meaningful boundary:

- it narrows the data on which a subtree depends;
- it owns local state or lifecycle behavior;
- it represents a reusable UI concept;
- it makes a large `body` understandable;
- it provides a stable place for previewing or accessibility behavior.

A computed property returning `some View` can improve local reading, but it does
not create the same explicit input boundary as a separate view type. Avoid
fragmenting a short, cohesive body into many helpers only to reduce line count.

## Constraints and Guarantees

- SwiftUI documents that it reads `body` whenever it needs to update a view, and
  this can happen repeatedly.
- `View.body` has one concrete associated type, even when exposed as `some View`.
- View modifiers return new view values rather than mutating the receiver.
- `@ViewBuilder` supports specific language constructs; it is not a general
  imperative execution environment.
- The timing and number of `body` evaluations are framework decisions. Code must
  not depend on a particular count.
- Internal graph nodes, diffing strategies, and platform-view reuse are
  implementation details unless Apple documents a guarantee.

## Engineering Decisions

| Decision | Prefer | Reason |
|---|---|---|
| Derive cheap display text | Local expression or computed value | Keeps presentation close to use |
| Transform a large collection | Model or cached derived state with invalidation | Avoids repeated update cost |
| Start asynchronous loading | `.task` or an owned model operation | Gives work a lifecycle and cancellation path |
| Share a visual fragment | Dedicated `View` with explicit inputs | Clarifies dependencies and API |
| Hide incompatible concrete view types | Builder, generic composition, or `Group` first | Preserves structural information |
| Erase a type | `AnyView` only at a boundary that truly requires it | Erasure can hide structure and add cost |

At Staff and Principal scope, treat shared views as APIs. Define which data they
own, which dependencies they read, which actions they emit, and which platform
assumptions they make. A design system should standardize semantic components and
styles, not expose one monolithic view that observes an entire application model.

## Production Application

When a screen hitches, first measure. Then inspect expensive initialization,
formatting, filtering, and allocation reached from `body`. Narrow a subview's
inputs when unrelated model changes cause reevaluation. Instruments and SwiftUI's
debug-only change diagnostics can help locate unnecessary work, but underscore
APIs are not production contracts.

Test business decisions below the view layer. Use previews and focused UI tests
for composition, environment variants, Dynamic Type, localization, and
accessibility. Code review should reject network access, persistence queries, and
hidden model mutation in view construction because their behavior depends on an
evaluation schedule the application does not control.

## References

- [View](https://developer.apple.com/documentation/swiftui/view)
- [Declaring a custom view](https://developer.apple.com/documentation/swiftui/declaring-a-custom-view)
- [ViewBuilder](https://developer.apple.com/documentation/swiftui/viewbuilder)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
