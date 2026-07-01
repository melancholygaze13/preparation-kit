---
title: "Layout Guides, Safe Areas, and Margins: Theory"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Layout Guides, Safe Areas, and Margins"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-01
---

# Layout Guides, Safe Areas, and Margins: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Layout guides are invisible layout objects. They let you constrain views to a
meaningful area without creating wrapper views only for geometry.

The key distinction is purpose:

| Guide | Purpose |
|---|---|
| `safeAreaLayoutGuide` | Keep important content away from system UI and screen cutouts |
| `layoutMarginsGuide` | Apply a container's internal spacing |
| `readableContentGuide` | Limit long text to a readable width |

## Safe Areas

The safe area changes with device shape, bars, call status, multitasking, and
presentation context. Use it when content should remain visible and reachable.

```swift
NSLayoutConstraint.activate([
    toolbar.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
    listView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor)
])
```

Do not treat the safe area as a universal padding rule. Backgrounds often extend
to the view's edges, while controls and readable content respect the safe area.

## Margins and Readable Content

Margins express spacing inside a container. They are useful for cells, cards,
forms, and reusable views because the component can own its spacing policy.

```swift
contentView.directionalLayoutMargins = NSDirectionalEdgeInsets(
    top: 12,
    leading: 16,
    bottom: 12,
    trailing: 16
)
```

Use directional margins so leading and trailing adapt to right-to-left
languages. Use the readable content guide for long text on wide screens. It
keeps line length comfortable without forcing the whole layout into a narrow
column.

## Scroll Views

Scroll views expose two important layout areas. The frame layout guide describes
the visible viewport. The content layout guide describes the scrollable content.

A common vertical form pattern is:

- Pin the scroll view to the view's safe area.
- Pin the content container to the scroll view's content layout guide.
- Match the content container width to the scroll view's frame layout guide.
- Let the content container's height come from its subviews.

This avoids ambiguous content size and prevents accidental horizontal scrolling.

## Engineering Decisions

Use safe areas for system avoidance. Use margins for component spacing. Use
readable content for text-heavy layouts. If a team encodes those choices in
shared components, feature code becomes less dependent on device-specific
constants.

For complex screens, decide which layers own which spacing. The screen may own
safe-area placement. A section view may own margins. A row may own spacing
between label and accessory.

## Production Application

Hard-coded geometry fails when system UI changes. Examples include a bottom
button hidden by the home indicator, content under a navigation bar, or a form
that looks too wide on iPad.

Debug by naming the boundary first. If the bug is "content under system chrome,"
check safe areas. If it is "content too close to the card edge," check margins.
If it is "paragraphs are hard to read on iPad," check readable width.

## References

- [UIView safeAreaLayoutGuide](https://developer.apple.com/documentation/uikit/uiview/safearealayoutguide)
- [UIView layoutMarginsGuide](https://developer.apple.com/documentation/uikit/uiview/layoutmarginsguide)
- [UIScrollView frameLayoutGuide](https://developer.apple.com/documentation/uikit/uiscrollview/framelayoutguide)
- [UIScrollView contentLayoutGuide](https://developer.apple.com/documentation/uikit/uiscrollview/contentlayoutguide)
