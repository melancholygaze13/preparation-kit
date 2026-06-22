---
title: "Dependency Tracking and Update Propagation: Theory"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "Dependency Tracking and Update Propagation"
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
  - observation
  - invalidation
  - dependency-tracking
---

# Dependency Tracking and Update Propagation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Treat a SwiftUI interface as a dependency graph. A view description depends on
inputs from its parent and on framework-managed values it reads. When a dependency
changes, SwiftUI invalidates affected work and evaluates enough of the graph to
produce the next interface.

```text
dependency changes -> affected view invalidated -> body may run -> children update
```

Invalidation, `body` evaluation, layout, and drawing are different stages. A
mutation does not imply an immediate full-screen redraw.

## How It Works

### Where Dependencies Come From

A child view depends on the value its parent produces for it:

```swift
struct Avatar: View {
    let image: Image
    let isOnline: Bool

    var body: some View {
        image
            .overlay(alignment: .bottomTrailing) {
                if isOnline {
                    OnlineIndicator()
                }
            }
    }
}
```

`image` and `isOnline` are explicit inputs. Passing an entire `User` value instead
would make the view value carry fields it does not use and can broaden update work.
Prefer the smallest meaningful input boundary, while avoiding expensive copying of
very large values without measurement.

Dynamic properties provide another source of dependencies. Examples include
`@State`, `@Binding`, `@Environment`, and storage or query wrappers supplied by
SwiftUI frameworks. Before evaluating `body`, SwiftUI refreshes their values from
its graph. Reading an environment value makes the relevant view depend on that
value, so changing the locale or color scheme can update the affected hierarchy.

### Observation Tracks Property Access

For a type marked `@Observable`, SwiftUI tracks observable property access while
evaluating `body`:

```swift
@MainActor
@Observable
final class ProfileModel {
    var displayName = ""
    var unreadCount = 0
}

struct ProfileName: View {
    let model: ProfileModel

    var body: some View {
        Text(model.displayName)
    }
}
```

`ProfileName` depends on `displayName` from that model instance. Changing only
`unreadCount` does not invalidate this view through that property access. No
property wrapper is required merely to read the observable model. Use `@State`
when the view owns it, `@Environment` when it is supplied through the environment,
and `@Bindable` when the view needs bindings to its properties.

Tracking follows reads. If `body` reads a computed property, the observable stored
properties reached by that computation become dependencies. If a conditional path
does not read a property in the current evaluation, that property is not a current
dependency through that path. The next evaluation records the dependencies for the
new path.

Collections can contain observable element instances. A row that reads one
element's `title` can track that property on that specific instance. Stable element
identity remains necessary so the correct row and its state stay associated with
the model.

### The Update Path

Apple describes a recursive update process:

1. A state or observed value changes.
2. SwiftUI schedules affected graph work.
3. It produces updated view values and refreshes dynamic properties.
4. It evaluates affected `body` properties to produce children.
5. Updates continue through affected descendants until leaf views can render.

SwiftUI controls scheduling and can combine work. Do not assume one `body`
evaluation per mutation, synchronous execution after assignment, or a fixed
parent-to-child callback sequence. Derive output from current state rather than
using `body` evaluation count as an event mechanism.

A `body` evaluation also does not prove that pixels changed. SwiftUI can evaluate a
description, reconcile it with existing graph state, and determine that later
layout or rendering work is unnecessary.

### Narrowing Update Scope

Split a view when the new type creates a useful dependency boundary:

```swift
struct ProfileScreen: View {
    let model: ProfileModel

    var body: some View {
        VStack {
            ProfileName(model: model)
            UnreadBadge(count: model.unreadCount)
        }
    }
}
```

The name and count now have focused inputs and separate bodies. With Observation,
each extracted view records only the properties it reads. This can reduce work, but
do not create a component for every property. Boundaries should also improve
ownership, readability, reuse, or testability.

Derived values need the same discipline. Filtering or sorting a large collection
inside `body` can make every valid update expensive. Move substantial transforms
to a model or cached derivation with an explicit invalidation policy. Avoid copying
derived data into `@State` unless the view intentionally owns a separate value and
defines how it stays consistent.

### Why Updates Go Missing

A reference changing in memory is not enough. SwiftUI needs a dependency it knows
how to track. Common causes of stale UI include:

- mutating a plain reference type that is not observable;
- changing external storage behind a computed property without reporting access
  and mutation through Observation;
- copying model data into local state and expecting automatic synchronization;
- observing one instance while mutating another;
- performing unsupported cross-actor mutation or publishing from the wrong owner;
- breaking identity so the expected state and dependency graph are replaced.

Fix the ownership or observation boundary. Randomizing `.id` forces replacement and
masks the defect while resetting state, focus, tasks, and animation continuity.

### Observation Is Not Synchronization

`@Observable` generates change-tracking behavior. It does not make a mutable model
thread-safe, prevent data races, or choose an actor for domain work. UI-owned models
should use main-actor isolation unless the project applies Main Actor isolation by
default. Keep heavy work off the actor, then publish the result through a defined
isolated boundary.

Legacy `ObservableObject` remains relevant for older deployment targets and
integration code. Its `objectWillChange` model is generally broader than
property-access tracking. Migrate when the ownership and compatibility benefits
justify it; do not mix systems without defining which mechanism drives each view.

## Constraints and Guarantees

- SwiftUI updates views that depend on changed state or environment values.
- Observation tracks properties accessed during the tracked evaluation, including
  observable properties reached by computed properties.
- Observation tracks instances as well as properties.
- Mutations not exposed through a supported dependency mechanism do not gain
  automatic UI propagation.
- Update timing, coalescing, evaluation count, and internal diffing are not stable
  application contracts.
- Observation supplies notifications, not concurrency isolation.

## Engineering Decisions

| Need | Prefer |
|---|---|
| View owns an observable model | Private `@State` |
| View only reads an injected model | Plain property or `@Environment` |
| View creates bindings to observable properties | `@Bindable` |
| Subview needs two fields from a large value | Focused value inputs |
| Expensive derived collection | Model derivation or cache with clear invalidation |
| Stale UI after mutation | Trace instance, ownership, identity, and observation |
| Excessive updates | Measure, then narrow dependencies or extract a boundary |

At Staff and Principal scope, define ownership and observation conventions across
feature boundaries. Shared models that expose unrelated mutable state make update
scope and actor policy hard to review. Prefer focused capabilities, stable model
identity, and metrics that distinguish model latency from view-update cost.

## Production Application

Start diagnosis from a visible symptom, then measure. Instruments can locate hangs
and hitches caused by slow updates. Apple demonstrates `Self._printChanges()` as a
debugging aid for why a body was evaluated, but the underscore marks it as an
unsupported API. Remove it from shipping code and do not make tests depend on its
output.

Test state propagation at the model boundary and use focused UI tests for wiring.
Include changes to read and unread properties, conditional dependency paths,
instance replacement, environment overrides, and rapid mutations. During an
Observation migration, compare update scope and responsiveness, retain adapters
where needed, and roll out by owned feature rather than replacing every model at
once.

## References

- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
- [Observation](https://developer.apple.com/documentation/observation)
- [`withObservationTracking(_:onChange:)`](https://developer.apple.com/documentation/observation/withobservationtracking%28_%3Aonchange%3A%29)
- [`Environment`](https://developer.apple.com/documentation/swiftui/environment)
- [`EnvironmentValues`](https://developer.apple.com/documentation/swiftui/environmentvalues)
