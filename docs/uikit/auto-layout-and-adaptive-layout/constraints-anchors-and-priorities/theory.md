---
title: "Constraints, Anchors, and Priorities: Theory"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Constraints, Anchors, and Priorities"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
---

# Constraints, Anchors, and Priorities: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Auto Layout is a constraint system. Instead of calculating final frames by hand,
you describe relationships that should hold between views. UIKit then computes
frames during a layout pass.

A useful interview answer starts here: constraints are the source of truth, and
frames are the result. If you set a constrained view's frame directly, that value
can be overwritten the next time layout runs.

## Constraint Relationships

A constraint relates one attribute to another value:

The relationship is easier to read as the equation the solver uses:

```text
view1.attribute = multiplier × view2.attribute + constant
```

Common attributes include leading, trailing, top, bottom, width, height, center,
and baseline. The relationship can be equal, greater-than-or-equal, or
less-than-or-equal.

Anchors are the preferred programmatic API for most UIKit code because they are
type checked:

```swift
titleLabel.translatesAutoresizingMaskIntoConstraints = false

NSLayoutConstraint.activate([
    titleLabel.leadingAnchor.constraint(equalTo: contentView.layoutMarginsGuide.leadingAnchor),
    titleLabel.trailingAnchor.constraint(lessThanOrEqualTo: accessoryView.leadingAnchor, constant: -12),
    titleLabel.centerYAnchor.constraint(equalTo: contentView.centerYAnchor)
])
```

This code describes intent: the label starts at the content margin, does not
overlap the accessory view, and stays vertically centered.

For a view created in code, set `translatesAutoresizingMaskIntoConstraints` to
`false` before adding your own constraints. Otherwise, UIKit converts the view's
old frame into constraints that can conflict with yours. Interface Builder normally
manages this setting for views that it creates.

## Priorities

Priority controls which constraints win when UIKit cannot satisfy every rule.
`1000` means required. Lower values are optional. Optional does not mean ignored;
it means the solver tries to satisfy the rule unless a higher-priority rule
needs the space.

Use priorities to express graceful failure:

| Situation | Better rule | Why |
|---|---|---|
| A label may truncate before a button disappears | Give the label lower compression resistance | The action remains usable |
| A spacer may grow before content stretches | Give the spacer lower hugging | Content keeps its natural size |
| A card has a preferred width but can shrink | Width at `999` or lower | Required outer constraints can still fit |

Avoid making every constraint required. A fully required layout often breaks
when content grows, text localizes, or the window becomes narrow.

## Ambiguous vs Unsatisfiable

Ambiguous layout means UIKit has more than one valid answer. The view may be
missing position or size information. For example, a label with only leading and
top constraints has no horizontal limit unless its intrinsic content size is
enough for the intended layout.

Unsatisfiable layout means the constraints conflict. UIKit breaks one or more
constraints at runtime and logs the conflict. The layout may look acceptable on
one device and fail on another because a different constraint becomes impossible
to satisfy.

The fix is different:

| Problem | Meaning | Fix |
|---|---|---|
| Ambiguous | Too few rules or unclear size | Add the missing relationship |
| Unsatisfiable | Rules cannot all be true | Remove a rule or lower a priority |

## Layout Passes

Changing a constraint does not immediately update every frame. UIKit marks the
layout as needing work, then updates layout later in the run loop. If you need
final geometry after constraints have changed, call `layoutIfNeeded()` at a
controlled point, often inside an animation block.

```swift
heightConstraint.constant = isExpanded ? 180 : 72

UIView.animate(withDuration: 0.25) {
    self.view.layoutIfNeeded()
}
```

Do not force layout repeatedly during scrolling or cell configuration. Set the
state and let UIKit batch the layout work.

## Engineering Decisions

Use Auto Layout when relationships matter: localization, Dynamic Type, safe
areas, size classes, self-sizing cells, or reusable components. Manual layout can
be simpler for small custom views with fully owned geometry, but that view should
still expose a clear size to its parent.

For Staff and Principal roles, the important decision is ownership. A design
system should define reusable spacing, margins, and priority patterns. Feature
teams should not copy fragile priority numbers without knowing which rule may
yield.

## Production Application

Good Auto Layout debugging is systematic:

1. Identify the view whose frame is wrong.
2. Ask whether the problem is missing information or conflicting information.
3. Check whether constraints are installed on the right common ancestor.
4. Check whether `translatesAutoresizingMaskIntoConstraints` is disabled for
   programmatic views.
5. Read priority values as product decisions, not only as technical numbers.

Constraint logs are noisy, but they usually point to the broken rule. Name
important constraints with `identifier` when debugging complex reusable views.

## References

- [Auto Layout Guide: Understanding Auto Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)
- [Auto Layout Guide: Anatomy of a Constraint](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/AnatomyofaConstraint.html)
- [Auto Layout Guide: Programmatically Creating Constraints](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/ProgrammaticallyCreatingConstraints.html)
- [UIView](https://developer.apple.com/documentation/uikit/uiview)
