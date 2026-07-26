---
title: "Focus, Validation, and Form State: Interview Questions"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Focus, Validation, and Form State"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Focus, Validation, and Form State: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you coordinate focus across multiple text fields?](#q1-focus-order) | Senior | First responder flow |
| [When should a form show validation errors?](#q2-validation-timing) | Senior | Error timing |
| [Where should form state live in a UIKit screen?](#q3-form-state-owner) | Staff | State ownership |

---

<a id="q1-focus-order"></a>
## Q1: How do you coordinate focus across multiple text fields?

### Short Answer

The screen owner should define focus order and use first responder calls to move
between fields.

### Expanded Answer

For example, Return on the email field can call `becomeFirstResponder()` on the
password field. Return on the final field can resign focus and submit.

I would keep that policy at the screen or form coordinator level. Individual
reusable fields should not decide the whole form's navigation order.

---

<a id="q2-validation-timing"></a>
## Q2: When should a form show validation errors?

### Short Answer

Allow normal incomplete input while the user types. Show clear errors after the
user leaves the field or submits the form.

### Expanded Answer

Some rules can guide the user immediately, such as a character counter. But
showing a full error on every keystroke can be noisy because many valid values
are invalid while partially typed.

On submit, validation should be complete. Server errors need extra care because
they can become stale if the user edits the field after the request starts.

---

<a id="q3-form-state-owner"></a>
## Q3: Where should form state live in a UIKit screen?

### Short Answer

Durable form state should live in a form model, view model, or screen owner, not
inside the text field or reusable cell.

### Expanded Answer

The controls display current values and report edits. The form model owns values,
touched state, validation errors, and submit readiness.

This matters for cell reuse, rotation, reloads, and async validation. The UI can
be recreated without losing the user's draft or applying errors to the wrong
field.
