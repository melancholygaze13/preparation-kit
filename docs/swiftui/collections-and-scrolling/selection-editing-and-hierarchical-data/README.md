---
title: "Selection, Editing, and Hierarchical Data"
domain: "SwiftUI"
topic: "Collections and Scrolling"
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
  - selection
  - editing
  - outline-group
---

# Selection, Editing, and Hierarchical Data

> Selection and editing state store stable IDs. Mutations update the collection and
> every dependent selection or expansion value as one coherent transition.

## Quick Recall

- Use an optional ID for single selection and a set of IDs for multiple selection.
- Revalidate selection after deletion, filtering, permission, and parent changes.
- Translate index-based move/delete callbacks into stable model operations immediately.
- Hierarchical nodes need unique identity and explicit child-loading policy.
- Preserve accessibility actions and keyboard behavior when customizing rows.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
