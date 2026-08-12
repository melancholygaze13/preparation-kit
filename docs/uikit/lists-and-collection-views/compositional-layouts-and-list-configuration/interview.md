---
title: "Compositional Layouts and List Configuration: Interview Questions"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Compositional Layouts and List Configuration"
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

# Compositional Layouts and List Configuration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does compositional layout give you?](#q1-compositional-layout-value) | Senior | Layout model |
| [When would you use collection-view lists instead of table views?](#q2-collection-list-vs-table) | Senior | API choice |
| [How do you keep complex collection layouts maintainable?](#q3-maintainable-layouts) | Staff | Design-system judgment |

---

<a id="q1-compositional-layout-value"></a>
## Q1: What does compositional layout give you?

### Short Answer

It lets a collection view describe layouts section by section using items,
groups, and sections. Different sections can use different structures without a
custom layout for the whole screen.

### Expanded Answer

This is useful for screens that mix lists, grids, carousels, headers, or
orthogonal scrolling. The layout describes geometry while the data source
describes identity and content.

---

<a id="q2-collection-list-vs-table"></a>
## Q2: When would you use collection-view lists instead of table views?

### Short Answer

I would use collection-view lists when I want table-like rows plus modern
collection-view features, such as compositional sections, diffable data sources,
cell registrations, or mixed layouts.

### Expanded Answer

A simple settings screen can still be a table view. But if a screen may mix
grouped list sections with a grid or carousel, a collection view keeps one list
infrastructure while preserving table-like row behavior.

---

<a id="q3-maintainable-layouts"></a>
## Q3: How do you keep complex collection layouts maintainable?

### Short Answer

I give each section type its own clearly named layout function. I avoid one large
inline section provider full of unrelated layout
constants.

### Expanded Answer

For example, a design system might provide builders for a plain list, inset
grouped list, horizontal rail, and grid. Feature code chooses the section type
and supplies content. This keeps spacing, headers, and behavior consistent.

### Trade-offs

Reusable builders improve consistency, but they should not hide important layout
choices. A section should still make clear why it scrolls horizontally, self
sizes, or uses a specific column count.
