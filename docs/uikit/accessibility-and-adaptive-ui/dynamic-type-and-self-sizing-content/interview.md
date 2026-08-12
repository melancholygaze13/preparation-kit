---
title: "Dynamic Type and Self-Sizing Content: Interview Questions"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Dynamic Type and Self-Sizing Content"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Dynamic Type and Self-Sizing Content: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you support Dynamic Type in UIKit?](#q1-support-dynamic-type) | Senior | Font scaling |
| [Why do Dynamic Type bugs often appear in cells?](#q2-cell-sizing) | Senior | Self-sizing content |
| [How do you decide what can truncate at large text sizes?](#q3-truncation-policy) | Staff | Content priority |

---

<a id="q1-support-dynamic-type"></a>
## Q1: How do you support Dynamic Type in UIKit?

### Short Answer

Use Dynamic Type text styles or `UIFontMetrics`, enable automatic content-size
adjustment, and build constraints that allow text to grow.

### Expanded Answer

For system styles, I use `preferredFont(forTextStyle:)` and set
`adjustsFontForContentSizeCategory`. For custom fonts, I scale the font with
`UIFontMetrics`.

Then I test the layout at accessibility sizes. Font scaling alone is not enough
if labels clip or controls overlap.

---

<a id="q2-cell-sizing"></a>
## Q2: Why do Dynamic Type bugs often appear in cells?

### Short Answer

Cells are reused and measured. If the cell uses fixed heights or stale cached
sizes, larger text can clip or overlap.

### Expanded Answer

A self-sizing cell should be constrained from top to bottom and allow labels to
wrap. If the app caches measured heights, the content size category must be part
of invalidation.

Reuse also matters. A reused cell must not keep an old line limit, hidden error
state, or layout configuration from another item.

---

<a id="q3-truncation-policy"></a>
## Q3: How do you decide what can truncate at large text sizes?

### Short Answer

Keep task-critical content readable. Let lower-priority metadata truncate, move,
or collapse first.

### Expanded Answer

Form labels, error messages, primary actions, and content needed to make a
decision should remain understandable. Secondary timestamps, badges, and
decorative text can often truncate or move into a detail view.

At Staff scope, I would define this as part of the component system so each
screen does not make inconsistent trade-offs.
