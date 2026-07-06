---
title: "Focus, Validation, and Form State: Theory"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Focus, Validation, and Form State"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-06
---

# Focus, Validation, and Form State: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit manages the active editing control through the first responder system.
Your app manages form meaning: which field should be next, when errors appear,
whether submit is enabled, and what state should survive reloads.

The interview answer is: make focus a screen-level decision, make validation
timing explicit, and store form state outside individual controls.

## How It Works

A text input becomes active by becoming first responder:

```swift
func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    switch textField {
    case emailField:
        passwordField.becomeFirstResponder()
    case passwordField:
        passwordField.resignFirstResponder()
        submit()
    default:
        textField.resignFirstResponder()
    }
    return true
}
```

This code is simple, but it should not be the only form model. The screen owner
should also know current values, touched fields, validation errors, and submit
readiness.

Validation has timing:

| Moment | Good use | Risk |
|---|---|---|
| While typing | Format hints, length counters, enabling submit | Noisy errors |
| On focus loss | Field-level required checks | Missing cross-field context |
| On submit | Complete validation and server-ready checks | Late feedback |
| After server response | Account or policy errors | Must map errors back to fields |

The goal is not to show errors as early as possible. The goal is to guide the
user without blocking normal editing.

## Constraints and Guarantees

First responder status is a UIKit interaction state. It can change because the
user taps another field, presses Tab on a hardware keyboard, dismisses the
keyboard, opens a menu, or because the view leaves the window.

Treat `becomeFirstResponder()` as a request that may fail if the view is not in
a valid state to accept focus. Avoid storing "focused field" as the only source
of truth for form progress.

Validation rules also have different lifetimes. A local rule such as "required"
can run immediately. A server rule such as "email already registered" is
asynchronous and can become stale if the user edits the field before the result
returns.

## Engineering Decisions

A practical form model usually separates:

| State | Owner | Example |
|---|---|---|
| Raw input | Form model or view model | `email`, `password` |
| Touched state | Form model or screen owner | `didEditEmail` |
| Validation errors | Form model or validation service | `emailError` |
| Focus order | Screen owner | email -> password -> submit |
| Control appearance | View or cell | border, label, message |

This keeps reusable fields simple. A field can show an error message and emit
text changes. It should not decide whether the entire sign-up flow can proceed.

For Staff and Principal roles, consistency matters across screens. Teams often
need standard rules for touched-state, error wording, server error mapping, and
accessibility announcements. Those rules reduce inconsistent form behavior and
make automated tests more stable.

## Production Application

Common bugs come from mixing focus and validation policy:

| Bug | Cause | Fix |
|---|---|---|
| Error flashes while typing | Validation runs too aggressively | Delay visible errors until blur or submit |
| Submit enables incorrectly | UI control owns partial state | Derive readiness from the form model |
| Server error sticks after edit | Async result is not tied to input version | Clear or version errors when input changes |
| Hardware keyboard flow breaks | Only touch behavior was tested | Support return, Tab, and accessibility focus paths |

When showing validation errors, update both visual and accessibility output.
For example, the field's label, hint, or error text should make the problem
available to VoiceOver users.

## References

- [UIResponder.becomeFirstResponder()](https://developer.apple.com/documentation/uikit/uiresponder/becomefirstresponder())
- [UIResponder.resignFirstResponder()](https://developer.apple.com/documentation/uikit/uiresponder/resignfirstresponder())
- [UITextFieldDelegate](https://developer.apple.com/documentation/uikit/uitextfielddelegate)
- [UIAccessibility.post(notification:argument:)](https://developer.apple.com/documentation/uikit/uiaccessibility/post(notification:argument:))
