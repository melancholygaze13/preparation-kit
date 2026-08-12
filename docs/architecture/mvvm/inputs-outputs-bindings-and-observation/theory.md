---
title: "Inputs, Outputs, Bindings, and Observation: Theory"
domain: "Architecture"
topic: "MVVM"
concept: "Inputs, Outputs, Bindings, and Observation"
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
  - mvvm
  - observation
  - bindings
---

# Inputs, Outputs, Bindings, and Observation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The view-model boundary has two directions. **Inputs** describe user or lifecycle
intent. **Outputs** describe current presentation state. Observation tells a view
when an output it depends on changes; it does not define the owner, transitions, or
meaning of that state.

An explicit contract makes UI behavior reviewable and testable:

```swift
@Observable
@MainActor
final class SignInViewModel {
    struct Form {
        var email = ""
        var password = ""
    }

    enum Phase { case editing, submitting, failed(String), succeeded }

    var form = Form()
    private(set) var phase: Phase = .editing
    var canSubmit: Bool { form.email.contains("@") && !form.password.isEmpty }

    func submitTapped() async { /* validate, submit, transition */ }
}
```

The form supports ordinary field bindings. Submission remains an intent because it
has validation, async work, and state transitions.

## Shape Outputs as Valid Presentation State

Many writable properties can represent impossible combinations. Prefer a state type
when phases are mutually exclusive or affect behavior:

```swift
enum ScreenState {
    case initial
    case loading
    case content([Row], isRefreshing: Bool)
    case failed(message: String, previous: [Row]?)
}
```

The cases should match meaningful UI and retry behavior. Do not create a complex enum
for independent values that can validly coexist. Derived properties such as button
availability can remain computed so they cannot drift from their inputs.

Expose setters narrowly. `private(set)` makes the view model the transition owner.
If a child needs one value, pass that value rather than the entire view model. This
reduces observation and mutation coupling.

## Use Bindings Deliberately

A binding is a two-way connection to storage owned elsewhere. It is useful for a text
field editing a draft or a toggle changing presentation preference. It is weaker for
domain operations because it lets the control write without expressing why.

Use a value plus action when mutation needs policy:

```swift
Toggle(
    "Auto-renew",
    isOn: Binding(
        get: { viewModel.isAutoRenewEnabled },
        set: { viewModel.autoRenewChanged(to: $0) }
    )
)
```

This preserves a normal SwiftUI control API while keeping validation and side effects
in one input method. Avoid custom bindings with surprising writes or expensive work
in getters; SwiftUI may read them often.

## Understand Observation Ownership

For `@Observable` reference models:

- Use `@State` when the view creates and owns the model's lifetime.
- Pass an existing model as a normal property when an ancestor owns it.
- Use `@Bindable` when that view needs bindings to mutable observable properties.
- Use `@Environment` for a dependency intentionally shared through a hierarchy.

During `body`, SwiftUI tracks access to observable properties and updates a view when
those properties change. This can reduce broad invalidation compared with an
`ObservableObject` that announces object-level changes.

Observation is not dependency injection. Pulling every feature model from the
environment hides required inputs and makes previews and tests harder to configure.
Use the environment for genuinely ambient or widely shared scope, and pass required
feature dependencies explicitly.

On older deployment targets, `ObservableObject`, `@StateObject`, `@ObservedObject`,
and `@EnvironmentObject` remain valid. The same ownership rule applies: `StateObject`
is for view-created object lifetime; `ObservedObject` observes an instance owned
elsewhere. Migration to Observation should preserve ownership before changing wrappers.

## Distinguish State from Events

State is true until a transition changes it. An event is something that happened.
Treating an event as `showError = true` can repeat after a new observer, view rebuild,
or restoration.

For presentation with a lifecycle, model it as identified state:

```swift
struct AlertState: Identifiable {
    let id: UUID
    let message: String
}

private(set) var alert: AlertState?
func alertDismissed() { alert = nil }
```

For a true stream event such as analytics or an external callback, define whether
delivery is once, buffered, replayed, or allowed to drop. `AsyncStream` or Combine
can transport events, but the architecture still owns subscription lifetime and
delivery rules.

## Engineering Decisions

Test outputs after inputs rather than testing notification mechanics. Verify initial
state, transitions, derived values, invalid input, repeated actions, and restoration.
For observation performance, keep view dependencies narrow before reaching for manual
notification code.

At team scale, agree on contract conventions: immutable output where practical,
intent inputs for side effects, binding limits, event delivery, and ownership of
environment dependencies. Do not require one universal `Input` and `Output` struct
if direct methods and state are clearer.

## References

- [Model data — SwiftUI](https://developer.apple.com/documentation/swiftui/model-data)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Discover Observation in SwiftUI — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Data Flow Through SwiftUI — WWDC19](https://developer.apple.com/videos/play/wwdc2019/226/)
