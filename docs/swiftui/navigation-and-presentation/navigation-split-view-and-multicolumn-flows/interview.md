---
title: "NavigationSplitView and Multicolumn Flows: Interview Questions"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "NavigationSplitView and Multicolumn Flows"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - navigation-split-view
  - adaptive-navigation
  - selection
---

# NavigationSplitView and Multicolumn Flows: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you model a two-column split view?](#q1-how-do-you-model-a-two-column-split-view) | Senior | Selection-driven detail |
| [What happens when a split view collapses?](#q2-what-happens-when-a-split-view-collapses) | Senior | Adaptive state |
| [When should a column contain its own NavigationStack?](#q3-when-should-a-column-contain-its-own-navigationstack) | Senior | Nested flow ownership |
| [How would you design and test a three-column flow?](#q4-how-would-you-design-and-test-a-three-column-flow) | Staff | Consistency and production coverage |

---

<a id="q1-how-do-you-model-a-two-column-split-view"></a>
## Q1: How do you model a two-column split view?

### Short Answer

I bind the leading list to an optional stable ID and derive detail from that
selection. No selection shows an intentional empty detail. The detail resolves
current data for the ID rather than storing a model snapshot in navigation state.

### Expanded Answer

The split-view root owns the relationship between sidebar and detail. A row changes
selection through a value-based link or binding. If the selected entity disappears,
the owner clears the ID or shows an unavailable state according to product policy.

This model works in expanded and compact presentations. It also gives deep linking
and restoration one value to set and validate.

### Example

`List(projects, selection: $projectID)` controls `ProjectDetail(id: projectID)`;
`nil` renders a “Select a project” state.

<a id="q2-what-happens-when-a-split-view-collapses"></a>
## Q2: What happens when a split view collapses?

### Short Answer

SwiftUI represents the columns as a single compact stack and chooses an appropriate
top column. The application should keep the same selection model. I test back
navigation because it can clear bindings, and I avoid code that immediately
reselects the detail.

### Expanded Answer

`preferredCompactColumn` can express which column should be on top, especially for
a deep link, but it is a preference and changes as navigation occurs. Expanded
column visibility is separate and is ignored when the split view is collapsed.

The important design rule is that compact and expanded UI are projections of one
state. Separate phone and tablet routers easily drift and make restoration
inconsistent.

### Trade-offs

One adaptive state model reduces duplication but requires careful dependent
selection rules. Completely separate layouts can be justified for different
workflows, but they need an explicit shared route translation layer.

<a id="q3-when-should-a-column-contain-its-own-navigationstack"></a>
## Q3: When should a column contain its own NavigationStack?

### Short Answer

When that column has a real independent drill-down sequence. I scope the nested
path to the column and keep primary split navigation selection-driven. I do not add
stacks around every column by default.

### Expanded Answer

A detail might push audit history and then an event. That history belongs to the
detail column and can reset when the primary selection changes. Wrapping the whole
split view in another stack often makes toolbar and title ownership unclear.

I define how a deep link sets both the leading selections and the nested detail
path. The complete state changes together to avoid briefly displaying an unrelated
detail.

<a id="q4-how-would-you-design-and-test-a-three-column-flow"></a>
## Q4: How would you design and test a three-column flow?

### Short Answer

I model sidebar and content selections as stable IDs, make their dependency
explicit, and derive detail from the valid chain. Changing a parent clears or
revalidates descendants atomically. Tests cover expanded, collapsed, deep-linked,
restored, and invalidated states.

### Expanded Answer

The state transition API prevents impossible combinations, such as an item selected
under the wrong project. Routes store IDs and restoration keeps the longest valid
prefix after current data loads. Each scene owns an independent state instance.

UI tests cover narrow and wide windows, live resizing, back gestures, keyboard and
pointer selection, deletion of selected data, and toolbar ownership. Model tests
cover selection transitions and route translation without rendering views.

### Trade-offs

Keeping a stale child selection can restore context when the parent returns, but it
can also expose invalid data. Clearing descendants is safer; caching per-parent
selection is useful only when the product explicitly values that behavior and tests
its authorization boundaries.
