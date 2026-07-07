---
title: "Dynamic Type and Self-Sizing Content: Theory"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Dynamic Type and Self-Sizing Content"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-06
---

# Dynamic Type and Self-Sizing Content: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Dynamic Type is not only font scaling. It is a layout requirement. When text
grows, the screen must preserve meaning, tap targets, hierarchy, and task flow.

The interview answer is: use scalable fonts, avoid fixed-height assumptions,
let cells self-size, and test the largest accessibility categories where layout
pressure is real.

## How It Works

UIKit can scale fonts automatically when you use preferred text styles:

```swift
titleLabel.font = .preferredFont(forTextStyle: .headline)
titleLabel.adjustsFontForContentSizeCategory = true

bodyLabel.font = .preferredFont(forTextStyle: .body)
bodyLabel.adjustsFontForContentSizeCategory = true
bodyLabel.numberOfLines = 0
```

For a custom font, scale it through `UIFontMetrics`:

```swift
let baseFont = UIFont(name: "AvenirNext-DemiBold", size: 17)!
titleLabel.font = UIFontMetrics(forTextStyle: .headline).scaledFont(for: baseFont)
titleLabel.adjustsFontForContentSizeCategory = true
```

The layout then needs enough freedom to grow. Labels should have the right
number of lines. Stack views and constraints should allow vertical expansion.
Table and collection cells should use self-sizing when content height can
change.

## Constraints and Guarantees

Text can grow far beyond the default size. A design that works at the default
category can still fail at accessibility sizes. Common failures include clipped
labels, overlapping buttons, hidden error text, and cells that keep an old
estimated height.

Not every string needs infinite space. Some metadata can truncate if the main
task remains clear. But critical content, form errors, labels, and primary
actions should stay understandable.

Dynamic Type changes can happen while the app is running. UIKit can notify and
relayout, but custom drawing, cached sizes, and manual layout often need explicit
invalidations.

## Engineering Decisions

Decide layout behavior by content importance:

| Content | Usual behavior | Reason |
|---|---|---|
| Primary title or form label | Wrap or grow | Carries task meaning |
| Error text | Wrap and remain near field | Required for recovery |
| Metadata | Truncate or move below | Lower priority |
| Fixed icon | Keep stable size or choose larger asset | Avoids distorted UI |
| Dense toolbar | Collapse, menu, or alternate layout | Prevents overlap |

For lists, prefer content-driven cell height. If you cache cell sizes for
performance, include content size category in the cache key or invalidate when
the category changes.

For Staff and Principal roles, Dynamic Type is a component-system issue. Shared
cells, buttons, chips, banners, and error components should define scaling
behavior once so every feature does not rediscover the same clipping bugs.

## Production Application

Common failures and fixes:

| Failure | Cause | Fix |
|---|---|---|
| Text clips at large sizes | Fixed height constraint | Use flexible constraints and self-sizing |
| Custom font does not scale | Font bypasses text style metrics | Use `UIFontMetrics` |
| Cell height is stale | Cached measurement ignores content size | Invalidate on category change |
| Button text overlaps icon | Horizontal layout has no fallback | Stack vertically or move secondary content |

Snapshot tests can help catch regressions at selected content sizes. They should
not replace manual checks for scrolling, focus order, and whether the task still
feels usable.

## References

- [Scaling fonts automatically](https://developer.apple.com/documentation/uikit/scaling-fonts-automatically)
- [UIFontMetrics](https://developer.apple.com/documentation/uikit/uifontmetrics)
- [UIContentSizeCategory](https://developer.apple.com/documentation/uikit/uicontentsizecategory)
- [UITableView.automaticDimension](https://developer.apple.com/documentation/uikit/uitableview/automaticdimension)
