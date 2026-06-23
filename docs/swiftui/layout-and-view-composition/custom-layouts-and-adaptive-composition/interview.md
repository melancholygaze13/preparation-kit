---
title: "Custom Layouts and Adaptive Composition: Interview Questions"
domain: "SwiftUI"
topic: "Layout and View Composition"
concept: "Custom Layouts and Adaptive Composition"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - custom-layout
  - adaptive-ui
  - responsive-layout
---

# Custom Layouts and Adaptive Composition: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you make a SwiftUI layout adaptive?](#q1-how-do-you-make-a-swiftui-layout-adaptive) | Senior | Container-driven decisions |
| [How do ViewThatFits and AnyLayout differ?](#q2-how-do-viewthatfits-and-anylayout-differ) | Senior | Alternative content and algorithms |
| [How does a custom Layout work?](#q3-how-does-a-custom-layout-work) | Senior | Measurement and placement |
| [How would you design a reusable flow layout?](#q4-how-would-you-design-a-reusable-flow-layout) | Staff | Correctness and component policy |

---

<a id="q1-how-do-you-make-a-swiftui-layout-adaptive"></a>
## Q1: How do you make a SwiftUI layout adaptive?

### Short Answer

I adapt to the space the view receives, its content, and user settings. I start with
flexible frames, adaptive grids, and relative sizing. For distinct alternatives I use
`ViewThatFits`; for one hierarchy with different arrangements I use `AnyLayout` or a
custom `Layout`.

### Expanded Answer

I do not branch primarily on device model or screen bounds because the same app may be
in split view, a sheet, or a resizable window. Size classes are useful broad context,
but they are not precise available dimensions.

I test long localization and accessibility text because content can force adaptation
without a window-size change. Each compact alternative must preserve essential actions
and a coherent accessibility order.

<a id="q2-how-do-viewthatfits-and-anylayout-differ"></a>
## Q2: How do ViewThatFits and AnyLayout differ?

### Short Answer

`ViewThatFits` chooses the first declared alternative whose ideal size fits the chosen
axes. `AnyLayout` switches the layout algorithm applied to one shared set of subviews,
which avoids replacing the content hierarchy just to rearrange it.

### Expanded Answer

I use `ViewThatFits` when wide and compact presentations are meaningful alternatives.
Their order defines preference. I use `AnyLayout` when the content stays the same but
changes from a horizontal to vertical or another arrangement.

### Trade-offs

Duplicated alternatives can drift in behavior and accessibility. A shared hierarchy is
cleaner for pure rearrangement, but explicit branches are clearer when the product
actually changes content, reading order, or interaction.

<a id="q3-how-does-a-custom-layout-work"></a>
## Q3: How does a custom Layout work?

### Short Answer

A `Layout` receives subview proxies. In `sizeThatFits` it measures them under proposals
and reports the container size. In `placeSubviews` it positions them inside the bounds
SwiftUI assigns. Both methods may run repeatedly and must be cheap and side-effect free.

### Expanded Answer

Subview proxies expose sizing, dimensions, spacing, placement, and layout values. I
handle unspecified and finite proposals, empty content, spacing, alignment, and text
that changes height under a final width. Placement uses the supplied bounds origin,
not an assumed zero origin.

I add a cache only for repeatable, expensive derived measurements. Correctness must not
depend on a fixed call order or one measurement per update.

<a id="q4-how-would-you-design-a-reusable-flow-layout"></a>
## Q4: How would you design a reusable flow layout?

### Short Answer

I define the contract first: wrapping axis, item and line spacing, alignment, proposal
behavior, and oversized-item policy. Then I measure subviews, form lines within the
proposed width, return the combined size, and place each line from the supplied bounds.

### Expanded Answer

I support zero children, unspecified width, right-to-left layout, multiline content,
and accessibility sizes. I use subview spacing preferences or an explicit component
policy. If line formation is costly, a cache can share it between measurement and
placement, with inputs sufficient to invalidate when proposal or subviews change.

At Staff scope, I would expose this as a small shared component only after multiple
features need the same behavior. Its contract would document supported platforms,
animation and accessibility behavior, performance limits, and a fallback for content
that cannot fit.

### Trade-offs

A custom flow layout centralizes a real algorithm and avoids geometry feedback state.
It also creates maintenance and testing cost. An adaptive grid is preferable when
uniform tracks already satisfy the design.
