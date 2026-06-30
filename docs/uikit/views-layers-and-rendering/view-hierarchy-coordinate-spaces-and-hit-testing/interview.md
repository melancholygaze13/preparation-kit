---
title: "View Hierarchy, Coordinate Spaces, and Hit Testing: Interview Questions"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
concept: "View Hierarchy, Coordinate Spaces, and Hit Testing"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-01
---

# View Hierarchy, Coordinate Spaces, and Hit Testing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do `frame` and `bounds` relate to coordinate spaces?](#q1-coordinate-spaces) | Senior | Geometry basics |
| [How does UIKit decide which view receives a touch?](#q2-hit-testing) | Senior | Event targeting |
| [How would you debug a button that is visible but not tappable?](#q3-visible-not-tappable) | Senior | Practical diagnosis |
| [When would you customize hit testing?](#q4-custom-hit-testing) | Staff | Design trade-offs |

---

<a id="q1-coordinate-spaces"></a>
## Q1: How do `frame` and `bounds` relate to coordinate spaces?

### Short Answer

`frame` describes a view in its superview's coordinate space. `bounds` describes
the view's own local coordinate space. When comparing views from different parts
of the hierarchy, use UIKit's conversion APIs instead of manual offset math.

### Expanded Answer

The same visual point can have different coordinates depending on the view asking
the question. A button's origin inside a cell is not the same as that button's
position in the table view or window.

Conversion matters for popovers, overlays, drag previews, transitions, and custom
drawing. It also avoids bugs caused by scroll views, transforms, safe areas, or
intermediate container views.

<a id="q2-hit-testing"></a>
## Q2: How does UIKit decide which view receives a touch?

### Short Answer

UIKit starts at the window and walks down the view hierarchy, checking whether
the touch is inside eligible views. It searches frontmost subviews first and
returns the deepest eligible view that contains the point.

### Expanded Answer

A view is skipped if it is hidden, interaction is disabled, it is effectively
transparent, or `point(inside:with:)` returns false. By default, that point check
uses the view's bounds.

This means visual appearance is not the only factor. A child that draws outside
its parent may still fail hit testing if the parent rejects the point. A view
behind another view may not receive touches even if both are visible.

<a id="q3-visible-not-tappable"></a>
## Q3: How would you debug a button that is visible but not tappable?

### Short Answer

I would check whether the button and all ancestors are visible, interactive, and
have bounds containing the touch. Then I would check z-order, overlays, gesture
recognizers, and coordinate conversion.

### Expanded Answer

Visible does not always mean hittable. The button may be outside an ancestor's
bounds, covered by a transparent overlay, inside a disabled container, or smaller
than it looks because of transforms or content insets.

I would use the view debugger and temporary logging of `hitTest(_:with:)` or
converted frames. I would avoid guessing with hard-coded offsets until I know
which coordinate space is wrong.

<a id="q4-custom-hit-testing"></a>
## Q4: When would you customize hit testing?

### Short Answer

I customize hit testing when the default bounds-based behavior does not match the
intended interaction, such as enlarging a small target or forwarding touches
through an overlay. I keep the override narrow because it can affect gestures and
accessibility.

### Expanded Answer

Custom hit testing is a tool for interaction design, not a general layout fix. If
a control is hard to tap, increasing its layout bounds is often better than
special-casing hit tests.

When an override is needed, I make the behavior easy to reason about and test
with overlapping views, disabled states, and accessibility enabled.
