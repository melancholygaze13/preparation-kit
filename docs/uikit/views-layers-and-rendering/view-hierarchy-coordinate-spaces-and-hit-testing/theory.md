---
title: "View Hierarchy, Coordinate Spaces, and Hit Testing: Theory"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
concept: "View Hierarchy, Coordinate Spaces, and Hit Testing"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
---

# View Hierarchy, Coordinate Spaces, and Hit Testing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit views form a tree. That tree controls ownership of subviews, coordinate
conversion, event routing, drawing order, layout propagation, and accessibility
grouping. A view can only be understood relative to its superview, its own bounds,
and the window it belongs to.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 540" title="View Hierarchy, Coordinate Spaces, and Hit Testing" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the View Hierarchy, Coordinate Spaces, and Hit Testing diagram</a></figcaption>
</figure>

In this tree, the button's `frame` is described in the content view's coordinate
space. The button's `bounds` describes its own local coordinate space. A touch
from the window must be converted through the hierarchy before UIKit can ask
whether it lands inside the button.

## Coordinate Spaces

UIKit geometry has several coordinate spaces:

| Property or API | Coordinate space |
|---|---|
| `frame` | Superview coordinates |
| `bounds` | The view's own coordinates |
| `center` | Superview coordinates |
| `convert(_:to:)` / `convert(_:from:)` | Explicit conversion between views |
| Window coordinates | Shared space for views in the same window |

Use conversion APIs when comparing views from different branches of the tree.
Manual offset math is fragile because scrolling, transforms, safe areas, and
intermediate containers can change the relationship.

```swift
let buttonRectInOverlay = button.convert(button.bounds, to: overlayView)
```

This converts the button's local bounds into the overlay's coordinate space.

Coordinate conversions are also important for popovers, custom transitions,
drag-and-drop previews, tooltips, and drawing overlays. If the source rect is in
the wrong coordinate space, the UI may appear in the wrong place even though each
individual view has valid geometry.

## Hit Testing

Hit testing selects the view that should receive a touch. UIKit starts at the
window and asks whether the point is inside each candidate view. It searches
subviews from front to back, because later subviews normally draw on top of
earlier ones.

A view is normally skipped when:

- `isHidden` is true
- `isUserInteractionEnabled` is false
- `alpha` is less than `0.01`
- `point(inside:with:)` returns false

The default `point(inside:with:)` checks the view's bounds. If the point is
outside a parent, UIKit does not search that parent's children. This remains true
when `clipsToBounds` is `false` and a child is visibly drawn outside the parent.
If a design needs a larger touch target, override hit testing carefully or give
the control an adequate bounds size.

## Engineering Decisions

Use view hierarchy changes for real ownership and event-routing changes. Use
visual effects, transforms, or layers when the relationship is only visual.
Moving a view to a different parent can change coordinate conversion, safe areas,
trait propagation, accessibility order, and gesture behavior.

Custom hit testing is sometimes justified:

- increasing a small control's tappable area
- forwarding touches through an overlay
- building a custom control composed from several subviews
- letting a visual element outside parent bounds remain interactive

Keep custom hit testing local and predictable. A broad override in a container
can make gestures and accessibility hard to debug.

## Production Application

When a touch goes to the wrong view, debug in this order:

1. Is the view in the expected window and hierarchy?
2. Is the point inside each ancestor's bounds?
3. Are `isHidden`, `alpha`, and `isUserInteractionEnabled` correct?
4. Is another view visually or hierarchically above it?
5. Are gestures cancelling or delaying delivery?

For rendering or overlay bugs, print converted rects or use Xcode's view
debugger. The fix is usually to convert from the source view to the destination
view, not to add another hard-coded offset.

## References

- [View Programming Guide for iOS](https://developer.apple.com/library/archive/documentation/WindowsViews/Conceptual/ViewPG_iPhoneOS/)
- [UIView](https://developer.apple.com/documentation/uikit/uiview)
- [`hitTest(_:with:)`](https://developer.apple.com/documentation/uikit/uiview/hittest(_:with:))
- [Handling Touches in Your View](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/handling_touches_in_your_view)
