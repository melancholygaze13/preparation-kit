---
title: "Controls, Forms, Focus, and Keyboard"
domain: "SwiftUI"
topic: "Component Design and Styling"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - controls
  - focus-state
  - forms
---

# Controls, Forms, Focus, and Keyboard

> A control accepts or displays user input. A form groups related controls. Focus
> identifies the active input target, and the keyboard is one possible input device.
> Bind them to one source of truth and make submission explicit.

## Quick Recall

- Prefer `Button`, `Toggle`, `Picker`, and `TextField` over gesture-built equivalents.
- Bind numeric input to numeric values with a `FormatStyle`.
- Use optional focus enums for multi-field forms.
- Focus identity must be unique; avoid binding multiple fields to one ambiguous value.
- Keyboard configuration improves input but does not validate or secure it.
- On 2027 platforms, bind `TextSelection` when a feature needs the current range.

Use `@FocusState` for SwiftUI focus coordination, not as saved domain data. A keyboard
type, content type, or submit label is a platform hint. Pasted text, dictation, and
hardware keyboards can still provide other input.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
