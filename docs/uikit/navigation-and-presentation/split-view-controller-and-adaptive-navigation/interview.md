---
title: "Split View Controller and Adaptive Navigation: Interview Questions"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Split View Controller and Adaptive Navigation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Split View Controller and Adaptive Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is split navigation a good fit?](#q1-split-navigation-fit) | Senior | Product fit |
| [How should split navigation handle compact widths?](#q2-compact-width-collapse) | Senior | Adaptation |
| [How would you model state for split navigation?](#q3-split-navigation-state) | Staff | State ownership |

---

<a id="q1-split-navigation-fit"></a>
## Q1: When is split navigation a good fit?

### Short Answer

Split navigation fits workflows where persistent context helps the user, such as
sidebar-detail, mailbox-message, or document-list-detail screens. It is weaker
for short linear tasks.

### Expanded Answer

The benefit is seeing or quickly switching context while reading or editing
detail. If the user only moves forward through a task, a navigation stack or
modal flow is usually simpler.

---

<a id="q2-compact-width-collapse"></a>
## Q2: How should split navigation handle compact widths?

### Short Answer

It should preserve the selected item and path while changing presentation. In compact
width, columns may collapse into a stack, but selected IDs and detail route state
should remain consistent.

### Expanded Answer

I would not treat collapse as losing the sidebar or recreating business state.
The UI can change from columns to a stack, but the route should still know which
section and detail are selected. When width expands again, the split view can
show the same context in columns.

---

<a id="q3-split-navigation-state"></a>
## Q3: How would you model state for split navigation?

### Short Answer

I would model route state explicitly: selected sidebar item, selected content
item, detail identity, and any modal state. The visible controllers render that
state instead of owning it implicitly.

### Expanded Answer

This makes deep links, restoration, deletion, and resizing easier. A deep link
sets route state. Scene restoration saves route state. Deleting the selected item
updates route state to a placeholder or next valid item.

### Trade-offs

Explicit route state adds structure, but it prevents navigation behavior from
depending on whichever controller instance happens to be visible.
