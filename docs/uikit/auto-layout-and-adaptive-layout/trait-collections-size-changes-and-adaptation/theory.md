---
title: "Trait Collections, Size Changes, and Adaptation: Theory"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Trait Collections, Size Changes, and Adaptation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-26
---

# Trait Collections, Size Changes, and Adaptation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit adaptation is environment-driven. A view controller should not assume that
"iPad" means wide or that "iPhone" means compact. Multitasking, Stage Manager,
external displays, Dynamic Type, and presentation style can all change the space
and traits available to the interface.

Traits describe the current environment. Layout code decides how the interface
responds.

## What Traits Represent

`UITraitCollection` groups information such as horizontal and vertical size
class, display scale, user interface style, accessibility contrast, and content
size category. Different parts of an app can have different traits depending on
where they are presented.

Size classes are useful, but they are not exact measurements. A regular
horizontal size class does not tell you the final width of a specific view. Use
size classes for broad structure, and use actual bounds or constraints for exact
layout.

## Responding to Changes

UIKit can change layout context while the app is running. Common triggers
include rotation, Split View resizing, Dynamic Type changes, sheet detents, and
appearance changes.

For size transitions, view controllers can coordinate updates with the
transition coordinator:

```swift
override func viewWillTransition(
    to size: CGSize,
    with coordinator: UIViewControllerTransitionCoordinator
) {
    super.viewWillTransition(to: size, with: coordinator)

    coordinator.animate { _ in
        self.updateLayoutMode(for: size)
        self.view.layoutIfNeeded()
    }
}
```

For trait-specific changes, register for only the traits that change the component:

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    updateLayoutMode()

    registerForTraitChanges([
        UITraitHorizontalSizeClass.self,
        UITraitPreferredContentSizeCategory.self
    ]) { (self: Self, _: UITraitCollection) in
        self.updateLayoutMode()
    }
}
```

Registration is available on iOS 17 and later. It observes later changes but does
not call the handler for the current value, so perform initial configuration
separately. UIKit removes registrations with the observing object; manual
unregistering is normally unnecessary.

Keep the handler cheap and focused. Traits can change more than once before UIKit
updates the view. Change state, constraints, or invalidation flags there, then let
the normal layout and display cycle do the work. On iOS 18 and later, UIKit can also
track traits read from supported update methods, such as `layoutSubviews()`, and
invalidate that work when the value changes.

`traitCollectionDidChange(_:)` is deprecated starting in iOS 17 because it runs for
every trait change. Code that still supports older deployment targets can keep a
fallback override, compare the previous collection, and use registration on newer
systems. New iOS 17-or-later code should use automatic tracking or register for the
specific traits it needs.

## Adaptation Strategies

Good adaptation changes structure only when needed. It does not rewrite the
whole screen for every size.

| Change | Possible response |
|---|---|
| Narrow width | Stack controls vertically or hide secondary text |
| Wide width | Use readable width, side-by-side panes, or larger margins |
| Larger Dynamic Type | Allow wrapping, increase row height, reduce decoration |
| Dark mode | Use semantic colors instead of fixed color values |
| Higher contrast | Preserve affordances and avoid color-only meaning |

Auto Layout should carry most of the mechanical resizing. Code should handle
meaningful mode changes, such as switching from a compact action row to a menu.

## Engineering Decisions

Avoid device checks as the main adaptation rule. Device checks age poorly when
windowing modes change. Prefer decisions based on available size, traits, and
content.

For Staff and Principal roles, the deeper issue is consistency. A product should
have shared breakpoints, component behavior, and accessibility rules. Without
that, each feature invents its own adaptation and the app feels inconsistent.

## Production Application

Adaptive bugs often appear only in combinations:

- iPad Split View plus large Dynamic Type.
- A sheet presented over a compact-width controller.
- External display with a different scale.
- Right-to-left language plus a custom layout mode.

Test the layout by changing width, text size, language direction, and appearance.
If a screen cannot support every combination, make the limitation explicit in the
component contract and choose a predictable fallback.

## References

- [UITraitCollection](https://developer.apple.com/documentation/uikit/uitraitcollection)
- [UITraitChangeObservable](https://developer.apple.com/documentation/uikit/uitraitchangeobservable-7qoet)
- [Adapting Your App When Traits Change](https://developer.apple.com/documentation/uikit/adapting-your-app-when-traits-change)
- [UIViewController viewWillTransition(to:with:)](https://developer.apple.com/documentation/uikit/uiviewcontroller/viewwilltransition%28to%3Awith%3A%29)
- [Auto Layout Guide: Size-Class-Specific Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/Size-ClassSpecificLayout.html)
