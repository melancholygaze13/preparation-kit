---
title: "Custom Layouts and Adaptive Composition: Theory"
domain: "SwiftUI"
topic: "Layout and View Composition"
concept: "Custom Layouts and Adaptive Composition"
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
  - custom-layout
  - adaptive-ui
  - responsive-layout
---

# Custom Layouts and Adaptive Composition: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Adaptive layout chooses a composition from current constraints, content, and user
settings. It should not infer space from a device model. Start with built-in flexible
containers, move to explicit alternatives, and implement `Layout` only when the app
owns a reusable placement algorithm.

```text
flexible built-ins -> fitting alternatives -> switch layout algorithm -> custom Layout
```

## Adapt to the Container

An app can run in split view, a resizable window, a sheet, a widget, or another host.
The same device can offer very different widths. Dynamic Type and localization also
change whether a composition fits without changing the window.

Size classes remain useful environment signals, but they are broad categories. They
do not report exact usable width and can be identical for materially different spaces.
Use them when the platform meaning is the design input. Use fitting or container size
when the actual available region is the input.

Built-in options cover many responsive designs:

- Flexible frames accept a range rather than imposing one device-specific size.
- Adaptive grid items change track count with available width.
- `containerRelativeFrame` sizes content relative to a containing view.
- `ViewThatFits` selects among ordered view alternatives.
- `AnyLayout` switches a layout algorithm around the same subviews.

These options keep the decision in layout. Storing every geometry change in state adds
an update path and is unnecessary when layout alone can select the result.

## ViewThatFits

`ViewThatFits` evaluates alternatives in declaration order and chooses the first whose
ideal size fits the available space in the specified axes. Order therefore expresses
product priority:

```swift
ViewThatFits(in: .horizontal) {
    HStack {
        SummaryView(summary: summary)
        ActionsView(actions: actions)
    }

    VStack(alignment: .leading) {
        SummaryView(summary: summary)
        ActionsView(actions: actions)
    }
}
```

The compact alternative must remain semantically complete. Do not remove an essential
action merely to make it fit. Fitting also depends on content, font, and modifiers, so
test localized strings and accessibility sizes rather than assuming one breakpoint.

Use `ViewThatFits` for a small ordered set of meaningful alternatives. If many branches
repeat nearly identical content, switching only the layout algorithm can preserve a
clearer hierarchy.

## AnyLayout and Identity

`AnyLayout` type-erases a concrete `Layout`. It lets one branch choose, for example,
an `HStackLayout` or `VStackLayout`, then applies that algorithm to one shared subview
builder:

```swift
let layout = isWide
    ? AnyLayout(HStackLayout(alignment: .top))
    : AnyLayout(VStackLayout(alignment: .leading))

layout {
    DetailsView(details: details)
    ActionsView(actions: actions)
}
```

This changes measurement and placement without expressing two separate structural
branches for the content. It helps preserve subview identity and supports animated
layout changes. State still needs stable data identity, and the transition must remain
understandable with VoiceOver and Reduce Motion settings.

If the two presentations contain materially different content or reading order,
explicit branches may be more honest. `AnyLayout` is for changing arrangement, not
hiding a product-level difference behind type erasure.

## The Layout Protocol

A custom type conforming to `Layout` behaves as a container. Its two essential methods
mirror SwiftUI's layout process:

- `sizeThatFits(proposal:subviews:cache:)` measures subview proxies and returns the
  container's required size.
- `placeSubviews(in:proposal:subviews:cache:)` places proxies within the bounds that
  SwiftUI assigns.

`Layout.Subviews` contains proxies, not the child views themselves. A proxy supports
measurement under a `ProposedViewSize`, placement, dimensions, spacing, and explicit
layout values. The custom layout does not reach into a child's application state.

```swift
struct EqualWidthRow: Layout {
    func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) -> CGSize {
        let idealSizes = subviews.map { $0.sizeThatFits(.unspecified) }
        let width = idealSizes.map(\.width).max() ?? 0
        let height = idealSizes.map(\.height).max() ?? 0

        return CGSize(width: width * CGFloat(subviews.count), height: height)
    }

    func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) {
        let width = bounds.width / CGFloat(max(subviews.count, 1))

        for (index, subview) in subviews.enumerated() {
            subview.place(
                at: CGPoint(x: bounds.minX + CGFloat(index) * width,
                            y: bounds.minY),
                anchor: .topLeading,
                proposal: ProposedViewSize(width: width, height: bounds.height)
            )
        }
    }
}
```

This example exposes the method relationship, but a production row must include
spacing, empty content, proposal constraints, alignment, and remeasurement under its
final cell width. Text height can change when width changes, so reusing an ideal height
after a narrower proposal can be incorrect.

The bounds origin passed to placement is not guaranteed to be zero. Place relative to
`bounds.minX` and `bounds.minY`. Measurement and placement can run repeatedly, so they
must be deterministic and free of network work, logging assumptions, or state changes.

## Spacing, Values, and Cache

A reusable layout should respect platform spacing rather than always hard-coding a
gap. Subview proxies expose spacing preferences that a layout can combine along an
axis. A container may also accept an explicit spacing policy from its initializer.

`LayoutValueKey` lets a child attach layout-only metadata that its container reads,
such as whether a flow item should start a new row. Keep this metadata local to the
layout relationship; domain state belongs elsewhere.

The optional layout cache stores derived measurement data shared across sizing and
placement. `makeCache` creates it, and `updateCache` can rebuild it when the subview set
changes. Cache only work that is expensive enough to justify invalidation complexity.
Never make correctness depend on a particular number or order of measurement calls.

## Engineering Decisions

| Requirement | Prefer |
|---|---|
| Cards fill available width | Adaptive grid or flexible frame |
| Choose first viable semantic presentation | `ViewThatFits` |
| Same children switch horizontal and vertical arrangement | `AnyLayout` |
| Reusable flow, radial, or equalized placement algorithm | Custom `Layout` |
| One descendant needs its container size | `GeometryReader` or relative frame |
| Product changes content by capability or workflow | Explicit view composition |

Do not write a custom layout merely to centralize several frames. It earns its cost
when it makes a multi-child rule reusable, testable, and more correct than geometry
state or nested stacks.

## Production Application

Define supported constraints before implementing the algorithm: zero children,
unbounded proposals, minimum widths, multiline text, right-to-left order, accessibility
sizes, animation, and platform spacing. Verify both measurement and placement under
finite and unspecified proposals.

Profile with realistic child counts and content. A mathematically elegant algorithm
can still be too expensive if it remeasures every child many times. At Staff or
Principal scope, publish adaptive component contracts instead of shared device-width
constants. Include migration behavior, accessibility ownership, telemetry for layout
failures, and a fallback when content cannot fit any preferred presentation.

## References

- [`ViewThatFits`](https://developer.apple.com/documentation/swiftui/viewthatfits)
- [`AnyLayout`](https://developer.apple.com/documentation/swiftui/anylayout)
- [`Layout`](https://developer.apple.com/documentation/swiftui/layout)
- [`LayoutSubview`](https://developer.apple.com/documentation/swiftui/layoutsubview)
- [`containerRelativeFrame`](https://developer.apple.com/documentation/swiftui/view/containerrelativeframe%28_%3Aalignment%3A%29)
- [Compose custom layouts with SwiftUI](https://developer.apple.com/videos/play/wwdc2022/10056/)
