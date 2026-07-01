---
title: "Table, Collection, and Cell Reuse: Theory"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Table, Collection, and Cell Reuse"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-01
---

# Table, Collection, and Cell Reuse: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`UITableView` and `UICollectionView` show many logical items with a smaller
number of cell objects. As cells scroll offscreen, UIKit places them in a reuse
queue. Later, the same cell instance may be configured for a different item.

That means a cell is not the owner of the item. It is a reusable view that
renders the current item.

## Cell Configuration

Configuration should be complete. Every visible piece of state should be set for
the current item, even when the value is false, empty, or hidden.

```swift
func configure(with item: MessageRow) {
    titleLabel.text = item.title
    subtitleLabel.text = item.subtitle
    unreadBadge.isHidden = !item.isUnread
    accessoryType = item.isSelected ? .checkmark : .none
}
```

Incomplete configuration causes stale UI. A reused cell may keep a badge,
selection, image, or loading spinner from the previous item.

## `prepareForReuse()`

Use `prepareForReuse()` for transient view state that must be cleared before the
next configuration. Examples include cancelling image tasks, clearing images,
resetting alpha, stopping animations, or removing temporary tokens.

Do not use `prepareForReuse()` as the only place that sets normal content state.
Cells may be configured without every state first passing through the exact reuse
path you expected. The configure method should still set the final state.

## Table Views and Collection Views

Table views are strong for simple vertical lists and system-style rows.
Collection views are more general. They handle grids, lists, orthogonal sections,
custom layouts, and modern list configurations.

Modern UIKit often uses collection views even for list-like screens because they
work with compositional layouts, diffable data sources, cell registrations, and
supplementary views in one model.

## Ownership Boundaries

A cell should not fetch global data, mutate navigation, or own business state. It
can expose user actions through callbacks, delegates, or control actions, but the
screen or data source should decide what those actions mean.

For Staff and Principal roles, this boundary matters because cells are
performance-sensitive, frequently reused, and hard to reason about when they own
side effects. Shared cell components should have clear configuration models and
action outputs.

## Production Application

Common reuse bugs are predictable:

| Bug | Cause | Fix |
|---|---|---|
| Wrong image appears | Async result applied after reuse | Validate item identity or cancel task |
| Old badge remains visible | Configuration only sets visible case | Set both visible and hidden states |
| Scrolling hitches | Cell does expensive work on main thread | Precompute, cache, or move work off main |
| Selection appears wrong | View state used as source of truth | Drive selection from model state |

When debugging, log the item identity used for configuration and the identity
used when async work completes. If they differ, the cell has been reused.

## References

- [UITableView](https://developer.apple.com/documentation/uikit/uitableview)
- [UICollectionView](https://developer.apple.com/documentation/uikit/uicollectionview)
- [Lists in UICollectionView](https://developer.apple.com/videos/play/wwdc2020/10026/)
