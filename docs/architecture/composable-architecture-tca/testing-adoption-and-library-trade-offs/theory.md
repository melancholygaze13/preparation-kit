---
title: "Testing, Adoption, and Library Trade-offs: Theory"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Testing, Adoption, and Library Trade-offs"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tca
  - test-store
  - architecture-adoption
---

# Testing, Adoption, and Library Trade-offs: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

TCA makes a feature's transition protocol explicit, so its testing tool can drive the
same reducer and effect runtime as production. `TestStore` starts from chosen state,
sends actions, overrides dependencies, and checks state changes plus actions received
from effects.

This is a strong reason to choose TCA, but it is not free. Exhaustive tests can couple
to every internal step, and the application takes a source and migration dependency on
a fast-moving third-party library. Adoption should solve observed coordination or
correctness problems.

## Test Transitions and Effects

Current TCA recommends async tests for `TestStore`. The type is main-actor isolated, so
annotating its tests or suite with `@MainActor` avoids repeated actor hops and isolation
errors.

```swift
@MainActor
@Test
func loadingItems() async {
    let store = TestStore(initialState: Items.State()) {
        Items()
    } withDependencies: {
        $0.itemsClient.load = { _ in [.fixture] }
    }

    await store.send(.loadButtonTapped) {
        $0.isLoading = true
    }
    await store.receive(\.loadResponse.success) {
        $0.isLoading = false
        $0.items = [.fixture]
    }
}
```

The important point is the script, not the fixture syntax. The test proves the initiating
action, immediate state, effect output, and final state. Failure, cancellation, and
out-of-order completion need their own scenarios when they change product behavior.

Override only dependencies relevant to the case. Use a controlled clock for debounce,
timers, and retry policy. Advance it explicitly instead of waiting for wall time. Create
a fresh test store per test so state, effects, and dependency overrides cannot leak.

## Choose Exhaustivity Deliberately

An exhaustive test store expects all asserted state changes, received actions, and
effect completion to be accounted for. This gives high confidence in a leaf feature and
catches new behavior that a test did not consider. It can also make refactoring noisy
when the user-visible outcome stays the same but internal actions change.

Non-exhaustive mode lets a composed-flow test focus on selected state or delegate
actions. Use it for parent integration where repeating every child's internal assertion
would duplicate leaf tests. Its cost is that skipped behavior can hide a regression.

| Test | Suggested style | Why |
|---|---|---|
| Leaf reducer policy | Exhaustive | Every transition is part of the small contract |
| Effect cancellation race | Exhaustive | Ordering and completion are the behavior |
| Parent flow across tested children | Selective | Focus on integration outcomes |
| UI framework wiring | Integration or UI test | `TestStore` does not render the interface |

If a test store outlives the test, deinitialization checks may not run. Keep it local.
When longer lifetime is unavoidable, explicitly finish the store as documented.

## Evaluate Adoption Fit

TCA tends to fit when the application has several of these conditions:

- complex state transitions and asynchronous effects;
- navigation that benefits from explicit state and restoration;
- many teams that need a shared feature composition model;
- high value from deterministic effect tests;
- SwiftUI and UIKit features that need one common runtime.

It may not fit when most screens have local state, effects are rare, delivery time is
short, or the team cannot invest in learning and upgrades. Plain Swift observation,
focused view models, or a smaller unidirectional loop may supply enough structure.

Do not compare a disciplined TCA design with an undisciplined alternative. Compare the
same domain boundaries, tests, and ownership under both approaches. TCA can still contain
one giant state value, an oversized reducer, hidden dependency coupling, or poor module
boundaries.

## Adopt Incrementally

Pilot one vertical feature with real navigation and one meaningful effect. Measure:

- implementation and review time;
- test clarity and runtime;
- defect and race detection;
- build and macro-expansion cost;
- onboarding questions and maintenance effort.

Keep one source of truth during migration. At the boundary, adapt legacy delegates,
callbacks, or observable models to explicit actions and dependencies. Do not mirror the
same mutable state in TCA and a legacy view model with two-way synchronization.

Define team conventions only after the pilot exposes repeated decisions: action naming,
delegate events, dependency ownership, cancellation identity, reducer size, and module
placement. Templates can help, but generated ceremony should not replace design review.

## Manage Library and Performance Cost

Pin a compatible TCA version and read migration guides before broad upgrades. Releases
1.24 through 1.26 deprecated older binding, observation, effect, and scoping forms while
preparing for 2.0. TCA 1.26.1 is the reviewed baseline for this page. Keep warnings at
zero so migration work does not accumulate across many feature modules.

Avoid wrapping every TCA type behind a custom framework; that often creates a second API
to maintain. Instead, keep domain-specific models and capability contracts clean, and
confine version-sensitive syntax to feature composition and integration points where
practical.

Observation tracks accessed state, but architecture still affects performance. Scope
views to the data and actions they need, avoid high-frequency actions with no product
value, and profile reducer work, state copying, view invalidation, and effect volume.
Do not assume a reducer tree is fast or slow without measurement.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Deterministic state and effect testing | Library concepts and action ceremony |
| Consistent composition across features | Upgrade and deprecation work |
| State-driven navigation and lifetime | Exhaustive tests can over-couple to internals |
| Strong dependency override model | Team needs shared conventions and training |
| SwiftUI and UIKit support | Third-party runtime becomes widely referenced |

At Staff scope, adoption includes an owner, supported version, migration policy,
examples, build telemetry, and an exit strategy. Success means safer and faster product
change, not the percentage of screens converted.

## References

- [Testing TCA on `main`](https://swiftpackageindex.com/pointfreeco/swift-composable-architecture/main/documentation/composablearchitecture/testingtca)
- [TCA 1.26.1 release notes](https://github.com/pointfreeco/swift-composable-architecture/releases/tag/1.26.1)
- [TCA 1.26.0 release notes](https://github.com/pointfreeco/swift-composable-architecture/releases/tag/1.26.0)
- [TCA releases](https://github.com/pointfreeco/swift-composable-architecture/releases)
- [The Composable Architecture README](https://github.com/pointfreeco/swift-composable-architecture)
