---
title: "Observation and Model Ownership: Interview Questions"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Observation and Model Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - observation
  - model-ownership
  - observable
---

# Observation and Model Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Does `@Observable` make SwiftUI own a model?](#q1-does-observable-make-swiftui-own-a-model) | Senior | Observation versus ownership |
| [Which wrapper should a view use for an observable model?](#q2-which-wrapper-should-a-view-use-for-an-observable-model) | Senior | State, plain access, and Bindable |
| [Why should UI models have explicit actor isolation?](#q3-why-should-ui-models-have-explicit-actor-isolation) | Senior | Concurrency correctness |
| [How would you migrate from `ObservableObject`?](#q4-how-would-you-migrate-from-observableobject) | Staff | Incremental ownership migration |

---

<a id="q1-does-observable-make-swiftui-own-a-model"></a>
## Q1: Does `@Observable` make SwiftUI own a model?

### Short Answer

No. `@Observable` adds property-access tracking. Ownership still belongs to the
view, parent, environment, or another composition root that creates and retains the
instance. A complete design defines observation, ownership, and actor isolation
separately.

### Expanded Answer

When a view reads an observable property during `body`, SwiftUI can invalidate that
view when the property changes. The macro says nothing about when the model is
created, replaced, or destroyed.

If a feature root creates the model, I store it in private `@State` so the reference
survives repeated view values for that identity. A child receives the same instance
as a plain property. Creating the model inside `body` would produce unstable
identity, repeated allocation, and lost in-flight state.

### Example

```swift
struct FeatureScreen: View {
    @State private var model = FeatureModel()

    var body: some View {
        FeatureContent(model: model)
    }
}
```

The screen owns the instance; `@Observable` makes the model's properties trackable.

<a id="q2-which-wrapper-should-a-view-use-for-an-observable-model"></a>
## Q2: Which wrapper should a view use for an observable model?

### Short Answer

Use private `@State` when the view creates and owns the model. Use a plain property
when an injected model is only read or receives method calls. Use `@Bindable` when
the consumer must create bindings to mutable model properties. Use typed
`@Environment` only for intentionally shared subtree context.

### Expanded Answer

The choice communicates authority. A plain property still participates in
Observation because SwiftUI tracks the properties read in `body`. `@Bindable` does
not improve observation or lifetime; it only enables projections such as
`$book.title`.

I avoid passing a broad model through the environment merely to remove initializer
parameters. Explicit feature injection is easier to reason about and test. I also
prefer model methods over writable bindings when a transition has validation,
persistence, authorization, or failure behavior.

### Trade-offs

Environment access is convenient for genuine ambient context, but it hides the
dependency at the initializer. Explicit injection adds wiring while making
ownership and replacement visible.

<a id="q3-why-should-ui-models-have-explicit-actor-isolation"></a>
## Q3: Why should UI models have explicit actor isolation?

### Short Answer

Observation reports changes but does not serialize mutation. A mutable UI-facing
model should be `@MainActor`, unless Main Actor default isolation already applies,
so its state has one clear concurrency domain. Heavy work should run in an
appropriate collaborator and return results for main-actor publication.

### Expanded Answer

Without isolation, callbacks and tasks can mutate shared model state concurrently,
creating data races or ordering bugs even though the UI appears to update. Marking
the model `@MainActor` also makes construction and test access explicit under strict
concurrency checking.

I do not mark every repository and parser `@MainActor`. Network suspension is not
the same as CPU work, and parsing or database operations can still block. The model
coordinates asynchronous services, then applies results on its isolation domain.

### Example

The screen's `.task` can await `model.load()`. The main-actor model awaits a service,
checks cancellation or request identity, and then assigns the resulting view state.

<a id="q4-how-would-you-migrate-from-observableobject"></a>
## Q4: How would you migrate from `ObservableObject`?

### Short Answer

I migrate one owned feature at a time. I replace `ObservableObject` and `@Published`
with `@Observable`, map `@StateObject` ownership to `@State`, remove borrowed
`@ObservedObject` wrappers, add `@Bindable` only where bindings are needed, and use
typed environment injection where appropriate.

### Expanded Answer

Before editing syntax, I document who owns each instance, which views mutate it,
its actor isolation, and its deployment constraints. Observation invalidates views
based on properties read by `body`, unlike the broader published-object model, so I
test flows that depended on manual `objectWillChange` or incidental refreshes.

Incremental coexistence is supported and is often safer for large applications.
I keep `ObservableObject` around Combine-heavy or older-platform boundaries and
avoid dual-publishing from one model unless an adapter requires it. I measure update
scope and memory lifetime before and after rollout.

### Trade-offs

A broad rewrite removes legacy syntax quickly but can hide ownership regressions.
Feature-by-feature migration requires adapters for longer, but provides clearer
rollback, performance comparison, and team ownership.
