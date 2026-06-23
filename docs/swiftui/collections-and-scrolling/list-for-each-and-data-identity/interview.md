---
title: "List, ForEach, and Data Identity: Interview Questions"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "List, ForEach, and Data Identity"
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
  - list
  - foreach
  - identity
---

# List, ForEach, and Data Identity: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why do stable IDs matter in ForEach?](#q1-why-do-stable-ids-matter-in-foreach) | Senior | State association |
| [When would you choose List over a lazy stack?](#q2-when-would-you-choose-list-over-a-lazy-stack) | Senior | Container semantics |
| [How would you diagnose rows showing the wrong state?](#q3-how-would-you-diagnose-rows-showing-the-wrong-state) | Senior | Identity and ownership |

---

<a id="q1-why-do-stable-ids-matter-in-foreach"></a>
## Q1: Why do stable IDs matter in ForEach?

### Short Answer

SwiftUI uses IDs to associate data values with retained row state across updates.
If IDs change or collide, rows can look new, lose state, animate incorrectly, or
display state associated with another item.

### Expanded Answer

I use a stable domain ID and keep it unchanged while display fields mutate. I avoid
array offsets when the collection can reorder or insert, and never generate IDs during
rendering. If one entity appears more than once, I model stable occurrence identity.

<a id="q2-when-would-you-choose-list-over-a-lazy-stack"></a>
## Q2: When would you choose List over a lazy stack?

### Short Answer

I choose `List` for platform list semantics such as rows, sections, selection, editing,
swipe actions, keyboard behavior, and accessibility. I choose a lazy stack for a
large custom scroll composition that is not naturally a list.

### Expanded Answer

An eager stack remains reasonable for small fixed content. Laziness is not a universal
optimization, and manually recreating list semantics has accessibility and interaction
cost. I validate the chosen container with realistic data and target platforms.

<a id="q3-how-would-you-diagnose-rows-showing-the-wrong-state"></a>
## Q3: How would you diagnose rows showing the wrong state?

### Short Answer

I inspect the row IDs before and after mutation, then determine whether the state is
truly row-local or duplicated domain state. Wrong IDs, offset identity, duplicates,
and regenerated UUIDs are common causes.

### Expanded Answer

I verify filtering, sorting, pagination, and merges preserve entity IDs. Domain state
belongs in the model; temporary disclosure or focus may remain row-local. I also check
conditional row structure that may replace a subtree.

The fix establishes correct identity and one source of truth rather than copying
values into additional local state.
