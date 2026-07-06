---
title: "Secure Input, AutoFill, and Content Types: Interview Questions"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Secure Input, AutoFill, and Content Types"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-06
---

# Secure Input, AutoFill, and Content Types: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you configure a password field in UIKit?](#q1-password-field) | Senior | Secure traits |
| [What does `textContentType` do?](#q2-text-content-type) | Senior | AutoFill semantics |
| [What security mistakes can happen after secure input is configured?](#q3-after-input) | Staff | Sensitive data handling |

---

<a id="q1-password-field"></a>
## Q1: How do you configure a password field in UIKit?

### Short Answer

Set secure text entry, use the right text content type, and disable text traits
that do not fit passwords.

### Expanded Answer

For an existing password, I would set `isSecureTextEntry = true`,
`textContentType = .password`, and turn off autocorrection and automatic
capitalization. For a new password, I would use the new-password content type so
the system can support password generation.

That configuration improves display privacy and platform integration, but it
does not replace server-side authentication or safe handling of the value.

---

<a id="q2-text-content-type"></a>
## Q2: What does `textContentType` do?

### Short Answer

`textContentType` tells the system what kind of value the field represents, such
as username, password, new password, or one-time code.

### Expanded Answer

It is a semantic hint used by system features such as AutoFill and password
managers. It does not validate the value and does not make the input secure by
itself.

Using the wrong content type can make account flows worse because the system
cannot offer the right saved value or generated password.

---

<a id="q3-after-input"></a>
## Q3: What security mistakes can happen after secure input is configured?

### Short Answer

The app can still leak the value through logs, analytics, crash metadata,
debug UI, screenshots, or long-lived state.

### Expanded Answer

`isSecureTextEntry` only changes display behavior for the text control. Once the
app reads the string, normal data-handling rules apply.

For sensitive fields, I would redact logs, avoid analytics payloads that include
raw input, keep values only as long as needed, and make sure error reporting
does not capture secrets.
