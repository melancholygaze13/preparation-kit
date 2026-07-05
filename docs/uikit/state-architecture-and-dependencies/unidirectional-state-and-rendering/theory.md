---
title: "Unidirectional State and Rendering: Theory"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
concept: "Unidirectional State and Rendering"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-05
---

# Unidirectional State and Rendering: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit does not require a unidirectional architecture, but many UIKit screens
benefit from one simple rule:

```text
Event -> State update -> Render UI
```

The view controller receives user actions, lifecycle callbacks, delegate events,
and async results. Those inputs update one owned state value. The controller then
renders labels, buttons, lists, errors, and loading indicators from that state.

This replaces scattered mutation with a repeatable flow. It is most useful when
a screen has loading, editing, validation, pagination, selection, permission, or
error states that interact.

## How It Works

A small UIKit implementation can be plain Swift:

```swift
struct ProfileState: Equatable {
    var name: String
    var isSaving: Bool
    var errorMessage: String?

    var canSave: Bool {
        !name.isEmpty && !isSaving
    }
}

enum ProfileEvent {
    case nameChanged(String)
    case saveTapped
    case saveFinished(Result<Void, Error>)
}
```

The controller or view model handles events and produces a new state:

```swift
func handle(_ event: ProfileEvent) {
    switch event {
    case .nameChanged(let name):
        state.name = name
    case .saveTapped:
        state.isSaving = true
        state.errorMessage = nil
        save()
    case .saveFinished(.success):
        state.isSaving = false
    case .saveFinished(.failure):
        state.isSaving = false
        state.errorMessage = "Could not save changes."
    }

    render(state)
}
```

`render(_:)` should apply the full visible state, not only the property that
changed:

```swift
func render(_ state: ProfileState) {
    nameField.text = state.name
    saveButton.isEnabled = state.canSave
    activityIndicator.isHidden = !state.isSaving
    errorLabel.text = state.errorMessage
    errorLabel.isHidden = state.errorMessage == nil
}
```

This makes updates easier to audit. If the save button is wrong, the answer is
in state derivation or rendering, not in an old callback that happened to mutate
the button.

## Constraints and Guarantees

UIKit views must still be updated on the main thread. A unidirectional flow does
not remove that rule. It only gives you a clearer place to accept async results
and decide whether they still apply.

Rendering should be idempotent. Calling `render(state)` twice should not create
duplicate work, duplicate observers, or repeated navigation. Navigation,
analytics, and one-time alerts are side effects. Model them separately from
stable view state or gate them with explicit events.

Cells need extra care. A cell should render from a cell view state or
configuration. It should not own the list state, start shared requests without an
owner, or decide whether a page has loaded.

## Benefits and Costs

Unidirectional state fits UIKit screens when update order matters. It helps with
async work, validation, list updates, and testing. It also creates a useful path
for later SwiftUI migration because UIKit-specific code stays near rendering.

The cost is structure. Simple screens can become harder to read if every label
change needs an event type, reducer, and store. Use the pattern where it reduces
real state complexity.

## Engineering Decisions

A practical boundary is to keep the state and transition logic outside the
controller when it needs direct unit tests. The controller can still own UIKit
lifecycle and call `render`.

For Staff and Principal roles, the important question is not whether the team
uses a specific framework. It is whether the state model is consistent across
features. Shared rules for event naming, side effects, cancellation, and
observation can prevent every feature from inventing a different local store.

## Production Application

Unidirectional flow is valuable for stale results. If a search request for
`"ap"` finishes after a newer request for `"apple"`, the old result should be
ignored. The state owner can compare the request token, query, or generation
before accepting the result.

It also improves tests. You can test that a sequence of events produces the
expected states without loading a view controller:

| Scenario | State assertion |
|---|---|
| User clears required text | Save action becomes disabled |
| Save starts | Loading is true and old error is cleared |
| Save fails | Loading is false and error is visible |
| Old response arrives | Current state is unchanged |

Keep UI tests for wiring, lifecycle, and accessibility. Use state tests for the
rules that decide what the UI should show.

## References

- [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller)
- [UIControl](https://developer.apple.com/documentation/uikit/uicontrol)
- [ObservableObject](https://developer.apple.com/documentation/combine/observableobject)
