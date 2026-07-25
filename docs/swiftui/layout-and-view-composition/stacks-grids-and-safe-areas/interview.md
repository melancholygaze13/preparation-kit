---
title: "Stacks, Grids, and Safe Areas: Interview Questions"
domain: "SwiftUI"
topic: "Layout and View Composition"
concept: "Stacks, Grids, and Safe Areas"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-25
tags:
  - layout
  - grids
  - safe-area
---

# Stacks, Grids, and Safe Areas: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between a stack and a grid?](#q1-how-do-you-choose-between-a-stack-and-a-grid) | Senior | Container relationships |
| [When should a container be lazy?](#q2-when-should-a-container-be-lazy) | Senior | Lifecycle and performance |
| [How do fixed, flexible, and adaptive grid items differ?](#q3-how-do-grid-item-types-differ) | Senior | Responsive grid policy |
| [How should a bottom bar interact with scrolling content?](#q4-how-should-a-bottom-bar-interact-with-scrolling-content) | Staff | Safe-area ownership |

---

<a id="q1-how-do-you-choose-between-a-stack-and-a-grid"></a>
## Q1: How do you choose between a stack and a grid?

### Short Answer

I choose from the relationship. A stack arranges peers on one primary axis, while a
grid coordinates row and column tracks. I use `Grid` for bounded, table-like content
and a lazy grid when a large collection must scale in a scrolling region.

### Expanded Answer

`HStack` and `VStack` remain the clearest choice for linear content. `ZStack` is for
peer layers; an overlay or background better expresses decoration attached to one
base view. `Grid` supports cross-row column alignment and spanning, which nested
stacks often approximate poorly.

For an eager `Grid`, `GridRow` children define successive cells. A direct child of
the grid spans its columns, and `gridCellColumns` can set an explicit span. Flexible
cells may need `gridCellUnsizedAxes` so they do not widen the whole grid.

I do not choose from device class alone. If card count should change with available
width, an adaptive grid or another container-driven composition handles resizing,
multitasking, and new platforms more reliably.

<a id="q2-when-should-a-container-be-lazy"></a>
## Q2: When should a container be lazy?

### Short Answer

I use a lazy stack or grid when an eager container would create an expensive, large
collection before it is visible. Laziness reduces initial construction, but it does
not guarantee that a row is created once or preserve row-local work indefinitely.

### Expanded Answer

Rows must still have stable identity, cheap initialization, and cancellable work.
Images and data should be cached at an appropriate model or service boundary because
off-screen views can disappear and return. For small bounded content, eager stacks
are simpler and avoid lazy-container bookkeeping.

I profile with production-scale data. A lazy container will not fix repeated sorting,
synchronous decoding, unstable IDs, or expensive `body` computation.

I also do not rely on an exact visibility threshold. SwiftUI can prepare nearby
rows and later discard them. View lifetime is not a cache or a signal that an item
has been seen exactly once.

<a id="q3-how-do-grid-item-types-differ"></a>
## Q3: How do fixed, flexible, and adaptive grid items differ?

### Short Answer

A fixed item requests one track extent. A flexible item shares available space within
minimum and maximum limits. An adaptive item repeats tracks to fit as many as possible
within its range, so it is useful when column count should follow container width.

### Expanded Answer

I use fixed sizing only for content with a genuinely stable requirement. Flexible
tracks suit a known number of columns that should resize. Adaptive tracks suit card
layouts whose count should change.

The grid policy still needs testing with spacing, long text, minimum readable width,
and accessibility sizes. If each column's width must be derived from all cell content,
a bounded eager grid or custom layout may better express that relationship.

`GridItem` configures columns for `LazyVGrid` and rows for `LazyHGrid`; eager `Grid`
derives tracks from its cells instead. Mixing those models is a common source of
incorrect expectations.

<a id="q4-how-should-a-bottom-bar-interact-with-scrolling-content"></a>
## Q4: How should a bottom bar interact with scrolling content?

### Short Answer

I normally attach the bar with `safeAreaInset(edge: .bottom)`. It presents the bar and
reduces the region available to the scroll content, so the last item can remain visible
above it. An overlay alone draws above content without expressing that reservation.

### Expanded Answer

I let a full-bleed background ignore the safe area separately, while keeping the bar's
controls and essential content in safe interactive space. I verify behavior with the
keyboard, home indicator, sheets, rotation, split windows, and large text.

I distinguish container and keyboard regions. Ignoring the keyboard safe area can
leave controls covered, so I apply `ignoresSafeArea` narrowly to artwork unless the
product intentionally keeps content fixed behind the keyboard.

### Trade-offs

An overlay is correct when covering content is intentional. `safeAreaInset` is correct
when the bar and content share layout space. Applying `ignoresSafeArea` at the root is
compact but usually broadens the policy beyond what the design requires.
