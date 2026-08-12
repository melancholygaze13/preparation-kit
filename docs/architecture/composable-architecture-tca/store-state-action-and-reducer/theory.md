---
title: "Store, State, Action, and Reducer: Theory"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Store, State, Action, and Reducer"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tca
  - reducers
  - unidirectional-data-flow
---

# Store, State, Action, and Reducer: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The Composable Architecture applies unidirectional data flow through a library-defined
feature model. State describes what a feature owns. Actions describe every event that
can enter the feature. A reducer handles one action, mutates state synchronously, and
returns effects that may send later actions. A store runs this loop and exposes state
to SwiftUI, UIKit, tests, or another integration layer.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Store, State, Action, and Reducer" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Store, State, Action, and Reducer diagram</a></figcaption>
</figure>

This centralizes mutation and effect decisions. It does not remove the need to choose
good boundaries, domain models, or dependency contracts.

## Model a Feature Domain

Current TCA uses macros to reduce setup. A small feature follows this shape:

```swift
import ComposableArchitecture

@Reducer
struct Counter {
    @ObservableState
    struct State: Equatable {
        var count = 0
    }

    enum Action {
        case decrementButtonTapped
        case incrementButtonTapped
    }

    var body: some Reducer<State, Action> {
        Reduce { state, action in
            switch action {
            case .decrementButtonTapped:
                state.count -= 1
                return .none

            case .incrementButtonTapped:
                state.count += 1
                return .none
            }
        }
    }
}
```

The view holds a `StoreOf<Counter>`, reads observable state, and sends actions. The app
creates the root store with initial state and the root reducer. Do not create stores
throughout the view tree without a clear ownership reason; normally a parent store is
scoped to child features.

## Design State Deliberately

State should contain the smallest data required to render and make decisions. Store
source values, not several synchronized copies. Compute a subtotal from line items
unless the subtotal has its own persistence or snapshot meaning.

State is a value, but that does not mean the entire app needs one giant value. Feature
state should follow ownership and lifetime. Local draft state belongs with the editor.
Shared account state may need an explicit shared owner. Navigation state belongs where
the flow is coordinated.

`@ObservableState` supports observation of accessed state. It improves view update
precision, but it does not fix an oversized domain. Large state still increases
composition, testing, and ownership cost.

## Make Actions Explain Events

Name actions after what happened, such as `saveButtonTapped`, `responseReceived`, or
`child(.delegate(.finished))`. This keeps policy in the reducer. An action named
`setIsLoading(true)` exposes a mutation and lets senders decide behavior they may not
own.

Useful categories include:

- view or user events;
- lifecycle events;
- effect responses;
- binding or system events;
- child actions and upward delegate events.

Do not expose every internal action across a module boundary. A parent normally needs
a small child action route and selected delegate outcomes, not knowledge of every tap.

## Keep Reducers Understandable

A reducer's synchronous transition should read as “given this state and action, make
these changes and start this work.” It must not start hidden tasks. It must also avoid
global mutable state and direct calls to live services. Return an effect and use a declared
dependency instead.

Split a reducer when a child domain has its own state, actions, lifetime, tests, or team
ownership. Do not extract a reducer merely because a view has ten lines of UI. Reducer
boundaries are behavior boundaries, not a mirror of every visual component.

Composition order can matter when parent and child logic both react to an action.
Document cross-boundary policy and prefer one clear owner for each mutation. If a parent
must observe a child outcome, use a narrow delegate action instead of reaching into the
child's internal transition.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| One visible path for state changes | State and action modeling adds ceremony |
| Effects return through explicit actions | Large action enums can become noisy |
| Feature composition has common tools | Poor scopes create a large coupled tree |
| Store observation works with SwiftUI and UIKit | The domain depends on a third-party runtime |

Use TCA when consistent state transitions, composition, and effect testing justify the
library model. A small screen with local state and little behavior may be clearer with
plain SwiftUI observation. The interview answer should separate the general transition
model from TCA's specific types and macros.

## References

- [The Composable Architecture README](https://github.com/pointfreeco/swift-composable-architecture)
- [TCA documentation on `main`](https://swiftpackageindex.com/pointfreeco/swift-composable-architecture/main/documentation/composablearchitecture)
