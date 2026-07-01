---
title: "Presentation Context, Popovers, and Sheets"
domain: "UIKit"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# Presentation Context, Popovers, and Sheets

> Presentation context decides what area a presented controller covers. Popovers
> and sheets are adaptive presentations, so code must handle compact widths,
> source views, dismissal, and state changes deliberately.

## Quick Recall

- UIKit can route presentation to a suitable ancestor or container.
- `definesPresentationContext` controls current-context presentations.
- Popovers need a source view, source rect, or bar button item.
- Popovers and sheets can adapt when width or traits change.
- Choose presentation style by task meaning, not only by appearance.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
