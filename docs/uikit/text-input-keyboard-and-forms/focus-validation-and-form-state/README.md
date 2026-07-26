---
title: "Focus, Validation, and Form State"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Focus, Validation, and Form State

> UIKit controls edit values, but the screen must coordinate the whole form. It
> decides field order, when to show errors, and whether submission is ready.

## Quick Recall

- The first responder owns active keyboard focus.
- `becomeFirstResponder()` and `resignFirstResponder()` are requests, not a
  durable form state model.
- Validate at the right time: permissive while typing, stricter on blur or
  submit.
- Keep error state and submit readiness in a form model or view model.
- Do not make reusable fields decide navigation, persistence, or global form
  policy.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
