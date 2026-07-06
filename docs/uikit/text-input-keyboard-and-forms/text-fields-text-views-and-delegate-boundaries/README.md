---
title: "Text Fields, Text Views, and Delegate Boundaries"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-06
---

# Text Fields, Text Views, and Delegate Boundaries

> Text fields and text views collect editing intent. Delegates should validate,
> coordinate, and translate text changes without owning unrelated form or domain
> behavior.

## Quick Recall

- Use `UITextField` for short single-line input and `UITextView` for longer or
  rich text input.
- Delegate callbacks are editing boundaries, not business logic containers.
- `shouldChangeCharactersIn` can prevent a change, but it runs before UIKit
  applies that change.
- Store committed form state outside reusable cells and reusable input views.
- For multi-step forms, make input components report semantic changes to a
  screen owner or view model.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
