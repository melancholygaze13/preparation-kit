---
title: "Stacks, Grids, and Safe Areas: Theory"
domain: "SwiftUI"
topic: "Layout and View Composition"
concept: "Stacks, Grids, and Safe Areas"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - layout
  - grids
  - safe-area
---

# Stacks, Grids, and Safe Areas: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A SwiftUI container owns a layout relationship. A stack allocates one primary axis,
a grid coordinates tracks on two axes, and a safe-area modifier changes the region
descendants may use. Pick the smallest container that expresses the relationship,
then test it under actual window, text, and system-inset constraints.

## Linear and Layered Stacks

`HStack` and `VStack` arrange children horizontally or vertically. The stack accounts
for spacing, proposes space to its children, and aligns them on the cross axis.
Children still choose sizes through the normal proposal-response process.

Alignment is a shared reference, not padding. A `VStack(alignment: .leading)` aligns
the leading guides of its direct children. Nested content does not automatically
share that guide unless the hierarchy exposes a custom alignment.

`ZStack` overlays children and aligns them within the stack's combined layout bounds.
Use `overlay` or `background` when one view is semantically attached to another. Use
`ZStack` when the layered children are peers. This distinction affects sizing and
makes ownership clearer.

Stacks create all declared children when SwiftUI evaluates the container. That is
appropriate for small, bounded compositions. An eager `VStack` inside a `ScrollView`
is a poor default for hundreds of complex rows because the initial update constructs
the entire hierarchy.

## Eager and Lazy Grids

`Grid` coordinates row heights and column widths across its cells. Each `GridRow`
represents a row; a child placed directly in the grid can span the full grid width.
Grid-specific modifiers support column spanning, cell alignment, and unsized axes.
Use `Grid` when the dataset is bounded and cross-row alignment is the important rule.

`LazyVGrid` and `LazyHGrid` create content as it approaches the visible region. They
are designed for scrollable or otherwise large collections. Their track definitions
come from arrays of `GridItem` values:

| Grid item | Sizing rule | Typical use |
|---|---|---|
| `.fixed(n)` | A track uses a fixed extent | Known-size artwork or controls |
| `.flexible(minimum:maximum:)` | A track accepts remaining space within limits | A stable number of responsive columns |
| `.adaptive(minimum:maximum:)` | The grid fits as many tracks as the range permits | Cards whose count changes with width |

An adaptive grid is often better than selecting a column count from device type.
Window width can change through iPad multitasking, Stage Manager, rotation, or a new
platform. The available container size is the relevant input, not the hardware name.

Lazy grids do not provide every eager-grid relationship. Their tracks are driven by
the grid configuration and proposed space, not by globally measuring all cell
content first. If data requires table-like column widths derived from every value,
use a bounded `Grid`, define explicit track policy, or adopt a custom layout.

## What Laziness Guarantees

Laziness limits how much child content must be created for the current presentation.
It is not an application lifecycle contract. A row can be created, updated, removed,
and created again as identity, data, viewport, or framework decisions change.

Keep row initializers and `body` evaluation cheap. Move asynchronous work to `.task`
or `.task(id:)` and make cancellation safe. Cache images or decoded data at a layer
whose lifetime matches the product need, not inside a transient row view.

Use stable data identity. Index-based identity can attach state to the wrong row after
insertion or deletion. Laziness magnifies this problem because only part of the
collection may exist at a given moment.

For a small number of views, eager containers are simpler and can be faster. Lazy
containers have bookkeeping costs and should solve a measured or credible scaling
need, not serve as an automatic replacement for every stack or grid.

## Safe Areas as Layout Input

The safe area describes regions where content can avoid system UI or device features.
It varies by platform, window, keyboard, bars, and presentation. Treat it as dynamic
container information rather than a device constant.

Three APIs express different policies:

- `safeAreaInset` places content at a safe-area edge and adjusts the region observed
  by the modified content. Use it for a bottom action bar, mini-player, or banner that
  scrollable content must not hide behind.
- `safeAreaPadding` adds space between content and one or more safe-area edges without
  introducing separate inset content.
- `ignoresSafeArea` allows a view hierarchy to extend into selected safe-area regions
  and edges. Apply it narrowly, commonly to a background.

```swift
ScrollView {
    LazyVStack {
        ForEach(results) { result in
            ResultRow(result: result)
        }
    }
}
.safeAreaInset(edge: .bottom) {
    CheckoutBar()
}
.background {
    Color.surface.ignoresSafeArea()
}
```

An overlay can draw a bar above a scroll view, but it does not inherently communicate
that the scrollable region should reserve that space. `safeAreaInset` expresses both
presentation and layout ownership.

Ignoring every safe-area edge at a high level often produces controls behind the home
indicator, camera region, keyboard, or window chrome. Extend artwork intentionally,
then keep interactive and essential content inside an appropriate readable region.

## Engineering Decisions

| Need | Prefer | Reason |
|---|---|---|
| A few vertical or horizontal peers | `VStack` or `HStack` | Direct, eager relationship |
| Attached decoration | `overlay` or `background` | Decoration follows its base view |
| Small table-like matrix | `Grid` | Coordinates both axes across cells |
| Large scrolling matrix | Lazy grid | Bounds initial child creation |
| Variable card count by width | Adaptive grid item | Responds to actual container width |
| Persistent bar above content | `safeAreaInset` | Reserves usable content space |
| Full-bleed artwork | Narrow `ignoresSafeArea` | Extends visuals without moving all controls |

Avoid fixed screen calculations such as `UIScreen.main.bounds`. The current view may
occupy only part of a window. Prefer container-driven APIs and adaptive composition.

## Production Application

Test the composition with accessibility text, long localization, right-to-left
layout, keyboard presentation, split windows, and changing system bars. Confirm that
the last scroll item remains reachable above any custom inset and that interactive
targets do not move into unsafe regions.

Profile large collections using realistic rows and release builds. Look for costly
initializers, repeated sorting or image decoding, unstable identity, and work started
without cancellation. At Staff or Principal scope, standardize container selection,
spacing, safe-area ownership, and supported adaptive ranges in shared components.

## References

- [`HStack`](https://developer.apple.com/documentation/swiftui/hstack)
- [`Grid`](https://developer.apple.com/documentation/swiftui/grid)
- [`LazyVGrid`](https://developer.apple.com/documentation/swiftui/lazyvgrid)
- [`GridItem`](https://developer.apple.com/documentation/swiftui/griditem)
- [`safeAreaInset`](https://developer.apple.com/documentation/swiftui/view/safeareainset%28edge%3Aalignment%3Aspacing%3Acontent%3A%29)
- [`ignoresSafeArea`](https://developer.apple.com/documentation/swiftui/view/ignoressafearea%28_%3Aedges%3A%29)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
