---
title: "Secure Input, AutoFill, and Content Types"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-06
---

# Secure Input, AutoFill, and Content Types

> Secure input is not only hidden characters. It is the combination of secure
> text entry, correct text content types, appropriate keyboard traits, and
> careful handling of sensitive values.

## Quick Recall

- Use `isSecureTextEntry` for passwords, tokens, and other sensitive visible
  input.
- Set `textContentType` so AutoFill and password managers understand the field.
- Set keyboard and autocorrection traits to match the data type.
- Avoid logging, analytics, screenshots, or crash metadata that contain secrets.
- AutoFill is a platform contract; custom fields should preserve expected UIKit
  text input behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
