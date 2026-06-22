---
title: "Observation and Model Ownership: Theory"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Observation and Model Ownership"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 9
status: reviewed
last_reviewed: 2026-06-23
tags:
  - observation
  - model-ownership
  - observable
---

# Observation and Model Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Observation and ownership answer different questions:

```text
@Observable -> which property changes can invalidate readers?
ownership   -> who creates, retains, replaces, and destroys this instance?
isolation   -> where may this mutable model be accessed?
```

A correct design states all three. Adding `@Observable` alone does not define a
model's lifetime or make its mutation concurrency-safe.

## How It Works

### What Observable Adds

The `@Observable` macro adds Observation support to a model:

```swift
@MainActor
@Observable
final class LibraryModel {
    var books: [Book] = []
    var selectedBookID: Book.ID?
    var isLoading = false
}
```

When SwiftUI evaluates a view's `body`, it tracks the observable properties read
from specific instances. A view that reads only `isLoading` is not invalidated
through Observation when `selectedBookID` changes. A computed property participates
when it reads observable stored properties.

By default, accessible stored properties participate in observation. Mark internal
state with `@ObservationIgnored` when changes should not notify observers, such as
a stable service dependency or instrumentation detail. Do not ignore a property
merely to hide excessive updates; first correct the view's dependency boundary.

Observation reports mutation. It does not save values, validate transitions,
serialize access, or make a model a good feature boundary. Those remain application
design responsibilities.

### A View-Owned Model

When a view identity creates and owns an observable instance, store it in private
state:

```swift
struct LibraryScreen: View {
    @State private var model = LibraryModel()

    var body: some View {
        LibraryContent(model: model)
            .task {
                await model.load()
            }
    }
}
```

SwiftUI preserves the reference for that view identity. Re-evaluating `body` does
not create a new model. When the identity ends, SwiftUI releases its ownership;
other references can still extend the object's memory lifetime.

Do not create a model inside `body`, a computed view property, or a frequently
evaluated helper. That produces new identities, loses in-flight state, repeats
allocation, and can restart work. A plain stored default such as `let model =
LibraryModel()` is also evaluated with each new view value; `@State` expresses that
the reference belongs to the persistent view identity.

The model initializer should remain cheap. Start lifecycle-bound asynchronous work
from `.task` or another explicit owner, and make loading idempotent and
cancellation-aware. A model that launches unstructured work from `init` can outlive
the screen, duplicate requests, or retain itself unexpectedly.

### An Injected Model

A child that receives an observable model can use a plain property:

```swift
struct LibraryContent: View {
    let model: LibraryModel

    var body: some View {
        List(model.books) { book in
            Text(book.title)
        }
    }
}
```

Reading `model.books` establishes the Observation dependency. The child does not
need an ownership wrapper simply to update. Its parent or another composition root
owns the model.

This distinction makes replacement explicit. If the parent passes a different
model instance, the child starts reading the new instance. The owner must decide
whether replacement represents a new feature session and what happens to tasks,
drafts, navigation, and cached state associated with the previous instance.

Use the environment for values that are intentionally shared through a broad
subtree. Do not put every feature model in a global environment to avoid initializer
parameters; explicit injection makes ownership and tests easier to understand.

### Bindable Adds Writable Projection

A consumer needs `@Bindable` only to create bindings to properties of an observable
model:

```swift
struct BookEditor: View {
    @Bindable var book: Book

    var body: some View {
        TextField("Title", text: $book.title)
    }
}
```

`@Bindable` does not create or retain an independent source of truth. It wraps the
injected observable reference and provides dynamic-member binding projection. Use a
plain property if the view only reads or calls model methods.

Before exposing bindings, decide whether unrestricted property mutation is valid.
A named method such as `renameBook(to:)` is a better boundary when validation,
authorization, persistence, logging, or failure handling belongs to the transition.

### Ownership Belongs at a Composition Boundary

Choose the smallest owner that matches the model's real lifecycle:

- a reusable control usually owns only local value state;
- a feature root can own one feature model;
- a scene or app root can own session-wide state;
- a repository or persistence layer owns durable data independently of views.

Avoid both extremes. Per-row models created during rendering produce unstable
lifetime and unnecessary allocation. One application-wide model creates broad
coupling, unclear actor rules, and difficult reset behavior. Split by coherent
feature lifetime and responsibility, not by the number of properties.

Reference semantics mean multiple consumers can mutate the same instance. Model
methods should preserve invariants, and the architecture should define whether
simultaneous editors share live state or work on independent drafts.

### Actor Isolation Is Separate

Observation is not a synchronization mechanism. A UI-facing mutable model should
be isolated to `@MainActor` unless the project uses Main Actor default isolation.
This makes mutations and reads part of one explicit UI isolation domain.

Do expensive network, parsing, image, or database work through asynchronous
collaborators that do not block the main actor. Return results, then update the
main-actor model. Do not mark the whole data layer `@MainActor` merely because a
view consumes its result.

Strict isolation also affects construction. Creating a main-actor model must occur
from a main-actor context. Tests should run model interactions on the same actor
rather than disabling checks with unchecked sendability.

### Observation Is Not Persistence

An observable property exists in memory. Process termination, scene destruction,
or model replacement can discard it. Persist durable values through a repository,
document, SwiftData/Core Data context, file, or other explicit storage boundary.

Property wrappers designed for view-managed storage should not be hidden inside an
observable model and expected to drive Observation. Adapt external changes into
ordinary observable properties or expose the storage through a dedicated service
with a defined update stream.

### Migrating from ObservableObject

For supported deployment targets, the modern mapping is:

| Legacy ownership or access | Observation equivalent |
|---|---|
| `ObservableObject` with `@Published` | `@Observable` properties |
| View owns `@StateObject` | View owns `@State` observable instance |
| Child borrows `@ObservedObject` | Plain property, or `@Bindable` for bindings |
| Shared `@EnvironmentObject` | Typed `@Environment` observable instance |

This is an ownership migration, not a search-and-replace. `ObservableObject`
typically invalidates subscribed views for any published change, while Observation
tracks properties read by `body`. Test flows that relied on broad notifications or
manual `objectWillChange` calls.

Incremental migration is valid. Keep legacy wrappers where older deployment
targets, Combine pipelines, or framework integrations require them. Define the
bridge clearly and avoid making one model publish through two mechanisms without a
specific compatibility reason.

## Constraints and Guarantees

- Applying the `Observable` protocol alone is insufficient; use the macro to add
  observation support.
- SwiftUI tracks observable properties that a view reads from specific instances.
- `@State` preserves a view-owned model reference for the view identity.
- A plain property can observe an injected observable model through reads in body.
- `@Bindable` creates bindings but does not own the model.
- `@ObservationIgnored` excludes a property from Observation tracking.
- Observation does not provide actor isolation, persistence, validation, or
  cancellation.

## Engineering Decisions

| Need | Prefer |
|---|---|
| View creates and owns model | `@State private var model` |
| Child reads injected model | Plain `let` property |
| Child needs property bindings | `@Bindable` |
| Broad subtree shares intentional context | Typed `@Environment` |
| Property is internal and should not invalidate UI | `@ObservationIgnored` |
| Older platform or Combine integration | `ObservableObject` with explicit ownership |

## Production Application

Test initial load, repeated appearance, cancellation, model replacement, multiple
consumers, and deallocation after the feature closes. Record model/session IDs in
logs so duplicate owners and stale results are visible. Use memory tools to find
tasks or callbacks that retain obsolete models.

At Staff and Principal scope, establish feature ownership, actor isolation, and
migration rules across modules. Require shared models to expose coherent domain
operations instead of public writable state for every field. Roll out Observation
by feature, measure update scope, and preserve adapters for teams or frameworks
that cannot migrate simultaneously.

## References

- [`Observable`](https://developer.apple.com/documentation/observation/observable)
- [`Observable()`](https://developer.apple.com/documentation/observation/observable%28%29)
- [`ObservationIgnored()`](https://developer.apple.com/documentation/observation/observationignored%28%29)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Migrating from ObservableObject to Observable](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro)
