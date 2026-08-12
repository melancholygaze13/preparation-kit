---
title: "MVVM-C and State-Driven Navigation: Theory"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "MVVM-C and State-Driven Navigation"
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
  - mvvm-c
  - state-driven-navigation
  - swiftui
---

# MVVM-C and State-Driven Navigation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

MVVM-C and state-driven navigation separate screen presentation from flow ownership
in different ways:

- **MVVM-C:** a view model emits route intent; a coordinator imperatively pushes,
  presents, or replaces controllers.
- **State-driven navigation:** a flow owner mutates route state; the UI hierarchy is a
  rendering of paths, optional destinations, selections, and sheets.

Neither style decides business rules. Both need dependency composition, child lifetime,
deep-link interpretation, and user-driven dismissal handling.

## Use MVVM-C for Imperative Navigation

MVVM-C fits UIKit and mixed apps where a navigation controller is the presentation
mechanism:

```swift
enum ProfileRoute {
    case edit(Profile.ID)
    case signInRequired
}

@MainActor
final class ProfileViewModel {
    let profileID: Profile.ID
    var onRoute: ((ProfileRoute) -> Void)?

    func editTapped() {
        onRoute?(.edit(profileID))
    }
}
```

The coordinator receives the value, constructs the destination, and owns its flow.
Avoid a generic `navigate(to: Any)` or view-model reference to `UINavigationController`.
Typed routes keep dependencies visible.

Imperative coordination is direct for custom transitions and existing UIKit. Its risk
is invisible navigation state: the coordinator's assumed route can diverge from the
actual controller hierarchy after gestures, dismissals, or restoration.

## Use State-Driven Navigation for Declarative UI

SwiftUI's `NavigationStack` can bind to a typed collection:

```swift
enum AppDestination: Hashable {
    case product(Product.ID)
    case cart
}

@Observable
@MainActor
final class AppRouter {
    var path: [AppDestination] = []
    var sheet: SheetDestination?

    func productSelected(_ id: Product.ID) {
        path.append(.product(id))
    }
}
```

The view registers destination builders and binds to `path`. Back navigation updates
the binding, so route state can remain aligned with presentation. Typed route state is
testable and can support deep links and restoration.

Do not store destination views in the path. Store product identifiers and route data;
the composition layer builds views and dependencies.

## Avoid Two Sources of Navigation Truth

A common hybrid bug occurs when a coordinator pushes imperatively while a separate
view model also maintains `isShowingDetail`. Dismissal changes one but not the other.

Choose one authority per presentation:

- UIKit hierarchy owned and observed by the coordinator;
- typed route state rendered by SwiftUI;
- a compatibility adapter that translates between them during migration.

For a hybrid app, the coordinator may own a SwiftUI route model, or SwiftUI may emit a
route that the UIKit parent owns. Document which side confirms dismissal and completion.

## Place Navigation State at the Right Scope

Local sheet state can remain in a feature. A checkout path belongs to its flow owner.
Cross-feature and scene routes belong higher. A global router is not automatically the
answer; it can expose all destinations to every view and become a service locator.

Model presentation using the smallest meaningful state. Several unrelated booleans
can request impossible combinations. Optional identified destinations or an enum make
mutual exclusion clear when only one presentation is valid.

## Pros and Cons

| Approach | Benefits | Costs and risks |
|---|---|---|
| Imperative MVVM-C | Natural UIKit integration; direct custom transitions | Hidden hierarchy state; delegate synchronization; callback cycles |
| State-driven navigation | Inspectable, testable, deep-linkable, restorable | Route modeling; binding edge cases; state can become global |
| Hybrid adapter | Incremental migration and framework interoperability | Two mechanisms require one explicit authority |

Choose imperative coordination for established UIKit flows and presentation-heavy
transitions. Choose state-driven navigation when route inspection, restoration, and
declarative composition are important. Mixing is reasonable at an ownership boundary,
not within one destination.

## Engineering Decisions

Tests for MVVM-C assert route intent and coordinator decisions, with integration tests
for controller hierarchy and gestures. State-driven tests assert route transitions,
invalid combinations, deep-link construction, and dismissal updates.

At Staff scope, publish typed route conventions and migration adapters rather than one
global navigation framework. Define feature route ownership, scene scope, restoration,
analytics, and compatibility across UIKit and SwiftUI.

## References

- [Migrating to new navigation types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types)
- [NavigationStack — SwiftUI](https://developer.apple.com/documentation/swiftui/navigationstack)
- [NavigationPath — SwiftUI](https://developer.apple.com/documentation/swiftui/navigationpath)
