---
title: "Text Fields, Text Views, and Delegate Boundaries: Interview Questions"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Text Fields, Text Views, and Delegate Boundaries"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Text Fields, Text Views, and Delegate Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use `UITextField` instead of `UITextView`?](#q1-text-field-vs-text-view) | Senior | Control selection |
| [What belongs in a text input delegate?](#q2-delegate-boundary) | Senior | Editing boundaries |
| [How do you keep text input state correct in reusable cells?](#q3-reusable-cell-state) | Staff | State ownership |

---

<a id="q1-text-field-vs-text-view"></a>
## Q1: When would you use `UITextField` instead of `UITextView`?

### Short Answer

Use `UITextField` for short single-line values. Use `UITextView` for longer,
multi-line, scrollable, or attributed text input.

### Expanded Answer

The choice is mostly about interaction shape. A text field fits names, email,
search, one-time codes, and other focused values. It has common field behavior
such as return-key handling, placeholder text, and secure entry.

A text view fits comments, notes, or message drafts. It has more layout and
scrolling concerns, especially inside a cell or another scroll view.

---

<a id="q2-delegate-boundary"></a>
## Q2: What belongs in a text input delegate?

### Short Answer

A delegate should accept or reject edits and respond when editing begins or ends. It
should not become the place for unrelated business logic.

### Expanded Answer

For example, a delegate can decide whether a proposed edit is allowed, move
focus when Return is pressed, or report that editing ended.

I avoid putting navigation, persistence, analytics, and request building inside
the delegate callback. The callback should translate UI events into form intent,
then pass that intent to the screen owner or view model.

---

<a id="q3-reusable-cell-state"></a>
## Q3: How do you keep text input state correct in reusable cells?

### Short Answer

Store text outside the cell using stable item identity. The cell should display
current state and report edits back to the owner.

### Expanded Answer

Cells are reused, so they cannot be the durable owner of draft form values. A
cell-hosted text field should be configured from an external form model and send
changes with the current item identifier.

This avoids losing text when the cell scrolls offscreen. It also prevents edits
from being applied to the wrong row after reuse.
