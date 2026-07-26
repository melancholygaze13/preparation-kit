---
title: "Secure Input, AutoFill, and Content Types: Theory"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Secure Input, AutoFill, and Content Types"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Secure Input, AutoFill, and Content Types: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit secure input is a set of platform hints and privacy practices. The field
must hide sensitive text, describe the meaning of the input, use the right
keyboard behavior, and keep secrets out of logs and analytics.

The interview answer is: configure `isSecureTextEntry`, `textContentType`, and
text input traits together, then treat the captured value as sensitive data
after it leaves the control.

## How It Works

A typical sign-in form configures fields by meaning:

```swift
emailField.textContentType = .username
emailField.keyboardType = .emailAddress
emailField.autocapitalizationType = .none
emailField.autocorrectionType = .no

passwordField.textContentType = .password
passwordField.isSecureTextEntry = true
passwordField.autocapitalizationType = .none
passwordField.autocorrectionType = .no
```

For account creation, use the content type that matches the job of the field,
such as `.newPassword` for a new password. For one-time codes, use the
appropriate one-time code content type so the system can offer the code when it
is available.

These settings are not decoration. They let the system choose better keyboards,
disable inappropriate text transformations, and support AutoFill.

## Constraints and Guarantees

`isSecureTextEntry` changes how text is displayed. It does not make the value
safe after your code reads it. Once the string is in your app, your code must
avoid sending it to logs, crash metadata, analytics, debug overlays, or
unnecessary long-lived state.

Secure text entry also does not promise to block screenshots, screen capture, or
external keyboards. If the product has a capture policy, handle it separately and
explain the limits. Do not claim that a secure field protects pixels outside the
field or erases every in-memory copy of its `String` value.

`textContentType` is a semantic hint. It helps the system understand what kind
of input the field expects. It does not validate the value and does not replace
server-side authentication rules.

Custom text controls are risky for sign-in and payment flows. If a custom field
does not behave like a standard UIKit text input, it may break AutoFill,
password manager integration, selection, dictation, hardware keyboard input, or
accessibility behavior.

## Engineering Decisions

Choose traits by data type:

| Field | Typical configuration | Why |
|---|---|---|
| Email or username | `.username`, email keyboard when appropriate | Helps AutoFill and typing |
| Existing password | `.password`, secure entry | Hides sensitive input |
| New password | `.newPassword`, secure entry | Supports password generation |
| One-time code | `.oneTimeCode` | Supports code suggestions |
| Search | search keyboard, no secure entry | Optimized for query input |

Avoid overusing secure entry. A field should be secure because the visible text
is sensitive, not because the backend treats the value as important. For
example, an email address may be private in your data model, but it is normally
not entered with secure bullets.

For Staff and Principal roles, account flows need shared standards. Decide how
the app configures passwords, one-time codes, paste behavior, screenshot
policy, analytics redaction, and accessibility labels. Inconsistent security UI
creates real support and compliance risk.

## Production Application

Common failures include:

| Failure | Cause | Fix |
|---|---|---|
| AutoFill does not appear | Missing or wrong content type | Set semantic `textContentType` |
| Password gets autocorrected | Default text traits | Disable autocorrection and capitalization |
| Secret appears in logs | Debug output includes field text | Redact sensitive values at boundaries |
| Custom code field blocks paste | Over-specialized input view | Support paste and standard editing paths |

For one-time codes, support paste and AutoFill. Many users copy a code from
another app or receive a system suggestion. Blocking those paths makes the
security flow slower without improving security.

## References

- [UITextInputTraits](https://developer.apple.com/documentation/uikit/uitextinputtraits)
- [UITextContentType](https://developer.apple.com/documentation/uikit/uitextcontenttype)
- [UITextField.isSecureTextEntry](https://developer.apple.com/documentation/uikit/uitextinputtraits/1624427-issecuretextentry)
- [Supporting associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
