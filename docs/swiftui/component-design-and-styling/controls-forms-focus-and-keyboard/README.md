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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - controls
  - focus-state
  - forms
---

# Controls, Forms, Focus, and Keyboard

> Use semantic controls bound to one source of truth. Model focus as temporary
> presentation state and make validation, submission, and keyboard navigation explicit.

## Quick Recall

- Prefer `Button`, `Toggle`, `Picker`, and `TextField` over gesture-built equivalents.
- Bind numeric input to numeric values with a `FormatStyle`.
- Use optional focus enums for multi-field forms.
- Focus identity must be unique; avoid binding multiple fields to one ambiguous value.
- Keyboard configuration improves input but does not validate or secure it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
