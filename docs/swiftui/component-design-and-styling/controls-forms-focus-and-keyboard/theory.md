---
title: "Controls, Forms, Focus, and Keyboard: Theory"
domain: "SwiftUI"
topic: "Component Design and Styling"
concept: "Controls, Forms, Focus, and Keyboard"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - controls
  - focus-state
  - forms
---

# Controls, Forms, Focus, and Keyboard: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Semantic controls connect user input to one source of truth while supplying platform
interaction, focus, keyboard, and accessibility behavior. Focus is temporary UI state;
validation and submission are feature policy.

Use keyboard configuration to improve input, never as proof that input is valid or secure.

## How It Works

### Prefer Semantic Controls

Use `Button`, `Toggle`, `Picker`, `Slider`, `Stepper`, `TextField`, and `SecureField`
instead of reconstructing them with gestures. A standard control understands roles,
disabled state, keyboard activation, focus, pointer, and accessibility.

Use `Label` for icon-and-text controls. An icon-only control still needs an accessible
label and adequate target. Apply styles to customize appearance without discarding semantics.

### Forms and Labeled Content

`Form` adapts grouped input to the platform. Use sections for meaningful groups and
`LabeledContent` when a control or value needs a clear label layout, including sliders
and custom value displays.

Avoid fixed row heights that clip Dynamic Type or validation messages. Long labels,
localization, right-to-left layout, and keyboard navigation must remain usable.

### Text and Numeric Input

Bind text directly to one owned value. For numeric values, use a typed binding and a
format:

```swift
TextField("Quantity", value: $quantity, format: .number)
    .keyboardType(.numberPad)
```

The keyboard type only suggests an input layout and can be bypassed by paste, hardware
keyboard, dictation, or other input. Validate range and business rules in the model.

For multiline text that benefits from placeholder behavior, prefer a vertical-axis
`TextField` with a line limit. Use `TextEditor` when a larger document-like editing
surface is genuinely required.

Set text content types, capitalization, submit labels, and privacy behavior according
to the field. Never log passwords or sensitive form contents.

### Focus State

Model multiple fields with an optional enum:

```swift
enum Field: Hashable {
    case email
    case password
}

@FocusState private var focusedField: Field?
```

Bind each field to one unique case. Binding several fields to the same Boolean or case
creates ambiguous programmatic focus. Set focus in response to a deliberate event,
not repeatedly from `body` or every appearance.

Focus should normally remain local to the form or flow. Lift it only when a parent
coordinates navigation, restoration, or validation across subviews.

### Submit and Validation

Use `onSubmit` and submit labels to express keyboard flow. A form model validates
fields and exposes semantic operations. On submit, focus the first invalid field and
present an accessible error summary when several problems exist.

Validation timing is a product choice. Immediate validation can help or distract;
validation after field exit or submit may be calmer. Keep server validation and local
syntax validation distinct.

Do not store separate `isValid` flags when validity can be derived cheaply. For async
validation, cancel obsolete requests and check the field value before committing.

### Keyboard and Layout

SwiftUI containers and presentations usually adapt to the keyboard. Design scrollable
forms so focused fields and actions remain reachable. Avoid manual screen-height math
or global keyboard notifications unless a specific unsupported layout requires it.

Toolbar actions can provide Done, Previous, and Next when the keyboard lacks them.
Hardware keyboard users still need logical tab order and command behavior.

### Drafts and Persistence

A form draft can be local state separate from the saved model. That is intentional
duplication with explicit save, cancel, dirty-state, and external-update policy.

Do not persist each keystroke to a remote service from a binding setter. Use deliberate
save, debounced model effects, or local durable drafts according to data-loss risk.

### Accessibility and Testing

Labels, hints, errors, required state, and control roles must be exposed semantically.
Color alone cannot communicate validation. Test large text, VoiceOver, Switch Control,
hardware keyboards, autofill, paste, and localization.

Unit-test validation and submit transitions without rendering the form. UI tests cover
focus sequence, keyboard actions, accessibility, and the final integration.

## Constraints and Guarantees

- `FocusState` represents framework focus coordination, not durable domain data.
- Keyboard type and content type are hints, not validation or security boundaries.
- Standard control appearance adapts by platform, container, and style.
- A binding grants mutation access to its source and should match the component contract.
- Programmatic focus requires a unique, currently available focus target.

## Engineering Decisions

| Need | Approach |
|---|---|
| Simple text input | `TextField` with owned binding |
| Numeric input | Typed value plus `FormatStyle` and keyboard hint |
| Several fields | Optional focus enum with unique cases |
| Multiline placeholder input | Vertical-axis `TextField` |
| Document-like editing | `TextEditor` |
| Unsaved form workflow | Explicit draft, save, cancel, dirty policy |

## References

- [Text input and output](https://developer.apple.com/documentation/swiftui/text-input-and-output)
- [`FocusState`](https://developer.apple.com/documentation/swiftui/focusstate)
- [`Form`](https://developer.apple.com/documentation/swiftui/form)
- [Focus cookbook: Supporting and enhancing focus-driven interactions](https://developer.apple.com/documentation/swiftui/focus-cookbook-sample)
