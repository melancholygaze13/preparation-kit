---
title: "Layout, Display, and Run Loop Updates: Interview Questions"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
concept: "Layout, Display, and Run Loop Updates"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-01
---

# Layout, Display, and Run Loop Updates: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between layout and display?](#q1-layout-vs-display) | Senior | Rendering pipeline |
| [When do you use `setNeedsLayout` versus `layoutIfNeeded`?](#q2-layout-invalidation) | Senior | Deferred and forced layout |
| [How do you animate Auto Layout constraint changes?](#q3-constraint-animation) | Senior | Animation timing |
| [How would you diagnose layout-related scroll hitches?](#q4-scroll-hitches) | Staff | Performance judgment |

---

<a id="q1-layout-vs-display"></a>
## Q1: What is the difference between layout and display?

### Short Answer

Layout computes geometry: view frames, bounds, and subview positions. Display
draws content that needs pixels or layer contents updated. A constraint change
needs layout. A custom `draw(_:)` change needs display.

### Expanded Answer

UIKit batches both kinds of work. Changing a constraint does not immediately mean
every frame is final. Calling `setNeedsDisplay()` does not relayout the view. The
right invalidation depends on whether geometry or drawn content changed.

Many UIKit views handle their own display updates. You usually do not need
custom drawing for labels, image views, background colors, or common layer
properties.

<a id="q2-layout-invalidation"></a>
## Q2: When do you use `setNeedsLayout` versus `layoutIfNeeded`?

### Short Answer

Use `setNeedsLayout()` to mark layout as stale and let UIKit update it later. Use
`layoutIfNeeded()` when pending layout must be resolved immediately, such as
before measuring or inside a constraint animation.

### Expanded Answer

Deferred layout is the default because UIKit can coalesce multiple changes. It is
cheaper to mark several views as needing layout than to force layout after each
property change.

Forced layout is useful, but it has a cost. I avoid putting `layoutIfNeeded()` in
hot paths like cell configuration unless there is a measured reason.

<a id="q3-constraint-animation"></a>
## Q3: How do you animate Auto Layout constraint changes?

### Short Answer

Make sure the starting layout is current, change the constraint, then call
`layoutIfNeeded()` on the common ancestor inside the animation block.

### Expanded Answer

The common ancestor matters because it is the subtree whose constraints need to
be resolved. A typical sequence is: call `layoutIfNeeded()` before the change,
update the constraint constant, then animate a second `layoutIfNeeded()`.

If the animation jumps, I check that the starting layout was established, the
right ancestor is being laid out, and no other constraints conflict with the
animated change.

<a id="q4-scroll-hitches"></a>
## Q4: How would you diagnose layout-related scroll hitches?

### Short Answer

I would look for forced layout, expensive constraint solving, custom drawing, and
work inside layout callbacks or cell configuration. Then I would measure with
Instruments instead of guessing.

### Expanded Answer

Scrolling is sensitive because cells are configured and laid out repeatedly. A
cell that forces layout, decodes images, rebuilds constraints, or does expensive
drawing can block the main thread.

The fix depends on evidence. It may be caching sizes, simplifying constraints,
moving work off the main thread, precomputing view models, or replacing custom
drawing with cheaper layer-backed views.
