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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - selection
  - editing
  - outline-group
---

# Selection, Editing, and Hierarchical Data

> Selection records chosen item IDs. Editing changes collection data. Hierarchical
> data has parent-child structure. Their state remains correct only when identity,
> collection changes, selection, and expansion are updated together.

## Quick Recall

- Use an optional ID for single selection and a set of IDs for multiple selection.
- Revalidate selection after deletion, filtering, permission, and parent changes.
- Translate index-based move/delete callbacks into stable model operations immediately.
- Hierarchical nodes need unique identity and explicit child-loading policy.
- Preserve accessibility actions and keyboard behavior when customizing rows.

Delete and move callbacks often provide indices into the displayed collection. Convert
them to stable IDs immediately. Never keep an `IndexSet` across asynchronous work,
because filtering, sorting, or another edit can change what each index means.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
