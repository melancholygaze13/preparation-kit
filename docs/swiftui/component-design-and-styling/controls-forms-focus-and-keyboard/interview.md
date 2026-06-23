---
title: "Controls, Forms, Focus, and Keyboard: Interview Questions"
domain: "SwiftUI"
topic: "Component Design and Styling"
concept: "Controls, Forms, Focus, and Keyboard"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - controls
  - focus-state
  - forms
---

# Controls, Forms, Focus, and Keyboard: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you manage focus in a multi-field form?](#q1-how-do-you-manage-focus-in-a-multi-field-form) | Senior | Focus identity |
| [How should a form validate input?](#q2-how-should-a-form-validate-input) | Senior | State and policy |
| [Why prefer standard controls over gesture-built controls?](#q3-why-prefer-standard-controls-over-gesture-built-controls) | Senior | Semantics and adaptation |

---

<a id="q1-how-do-you-manage-focus-in-a-multi-field-form"></a>
## Q1: How do you manage focus in a multi-field form?

### Short Answer

I use an optional `@FocusState` enum with one unique case per field. Submit actions
advance or clear focus, and failed validation moves focus to the first invalid field.

### Expanded Answer

Focus stays local unless a parent coordinates the whole form. I avoid binding multiple
fields to the same Boolean or case because programmatic focus becomes ambiguous. I
also test hardware keyboard order and accessibility focus, not only the software keyboard.

<a id="q2-how-should-a-form-validate-input"></a>
## Q2: How should a form validate input?

### Short Answer

The feature model owns validation rules and submit state. The view binds fields and
renders errors. Keyboard configuration improves entry but never replaces validation.

### Expanded Answer

I distinguish local syntax, domain rules, and server validation. Timing depends on
the product: immediate, after leaving a field, or on submit. Async checks cancel old
requests and validate the current value before commit.

Errors use text and accessibility semantics, not color alone. Sensitive values are
not logged or stored insecurely.

<a id="q3-why-prefer-standard-controls-over-gesture-built-controls"></a>
## Q3: Why prefer standard controls over gesture-built controls?

### Short Answer

Standard controls provide activation semantics, roles, disabled state, focus, keyboard,
pointer, and accessibility behavior. A gesture with custom drawing does not inherit
those contracts automatically.

### Expanded Answer

I style a `Button` or `Toggle` to meet the design instead of rebuilding its behavior.
This also allows platform adaptation and assistive technologies to work consistently.
Custom interaction is justified only when the product is not semantically a standard control.
