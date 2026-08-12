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
last_reviewed: 2026-08-12
---

# Presentation Context, Popovers, and Sheets

> Presentation context decides which controller and screen area contain a
> presentation. A popover points to a source item. A sheet rises from an edge and
> may support several heights. Both can adapt on compact screens, so dismissal
> and layout must work in every resulting style.

## Quick Recall

- UIKit can route presentation to a suitable ancestor or container.
- `definesPresentationContext` controls current-context presentations.
- Contextual presentations need a source item or source view even when the current
  device renders them inline rather than as a popover.
- Popovers and sheets can adapt when width or traits change.
- Choose presentation style by task meaning, not only by appearance.
- Interactive dismissal needs a policy for drafts and other unsaved state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
