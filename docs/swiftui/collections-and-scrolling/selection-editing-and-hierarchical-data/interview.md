---
title: "Selection, Editing, and Hierarchical Data: Interview Questions"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Selection, Editing, and Hierarchical Data"
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
  - selection
  - editing
  - outline-group
---

# Selection, Editing, and Hierarchical Data: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Where should list selection live?](#q1-where-should-list-selection-live) | Senior | State ownership |
| [How do you safely delete from a filtered list?](#q2-how-do-you-safely-delete-from-a-filtered-list) | Senior | Indices versus identity |
| [How would you model a large hierarchical list?](#q3-how-would-you-model-a-large-hierarchical-list) | Staff | Tree state and loading |

---

<a id="q1-where-should-list-selection-live"></a>
## Q1: Where should list selection live?

### Short Answer

At the lowest flow that coordinates the selection with detail, navigation, or commands.
I store an optional stable ID for single selection or a set for multiple selection and
revalidate it whenever the collection changes.

### Expanded Answer

The row does not own domain selection. Deletion, filtering, permission changes, and
parent selection can invalidate it, so the flow chooses whether to clear, select a
neighbor, or show unavailable content.

Scene-specific selection stays scene-scoped in multiwindow apps.

<a id="q2-how-do-you-safely-delete-from-a-filtered-list"></a>
## Q2: How do you safely delete from a filtered list?

### Short Answer

I map callback offsets through the exact displayed projection to stable IDs immediately,
then ask the model to delete those IDs. I never apply filtered offsets directly to the
source array or retain them across `await`.

### Expanded Answer

The model handles authorization, persistence, optimistic rollback, and selection repair.
For moves, it also defines whether order applies globally, within the current filter,
or under one parent.

Every entry point—swipe, menu, keyboard, or accessibility action—uses the same operation.

<a id="q3-how-would-you-model-a-large-hierarchical-list"></a>
## Q3: How would you model a large hierarchical list?

### Short Answer

Nodes have stable unique IDs, explicit child-loading state, and expansion stored by ID
when it must persist. I load branches on demand, avoid flattening the entire tree in
every `body`, and validate descendant state when a parent changes.

### Expanded Answer

I distinguish a leaf, unloaded children, loading, loaded-empty, and failure. The model
computes or incrementally maintains the visible projection. Deep links set the full
ancestor chain, and restoration keeps the longest valid prefix.

Performance tests use realistic breadth and depth, while interaction tests cover
keyboard, accessibility, deletion, and compact multicolumn collapse.
