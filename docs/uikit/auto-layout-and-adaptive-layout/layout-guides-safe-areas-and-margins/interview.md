---
title: "Layout Guides, Safe Areas, and Margins: Interview Questions"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Layout Guides, Safe Areas, and Margins"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Layout Guides, Safe Areas, and Margins: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use safe areas versus margins?](#q1-safe-areas-vs-margins) | Senior | Boundary choice |
| [How do you constrain content inside a scroll view?](#q2-scroll-view-layout-guides) | Senior | Scroll layout |
| [How would you make a UIKit layout work well on iPad?](#q3-ipad-readable-layout) | Staff | Adaptive spacing |

---

<a id="q1-safe-areas-vs-margins"></a>
## Q1: When should you use safe areas versus margins?

### Short Answer

I use safe areas to keep important content clear of system UI and screen cutouts. I use margins for
content spacing inside a container. They solve different problems, so I avoid
using safe-area constants as general padding.

### Expanded Answer

A bottom button should usually respect the safe area so it is not blocked by the
home indicator. A label inside a card should usually respect the card's layout
margins. A background view may extend beyond both because it is not interactive
content.

---

<a id="q2-scroll-view-layout-guides"></a>
## Q2: How do you constrain content inside a scroll view?

### Short Answer

I pin the scroll view itself to the screen area, then pin the content container
to the scroll view's content layout guide. For a vertical form, I also constrain
the content container's width to the scroll view's frame layout guide.

### Expanded Answer

The content layout guide defines the scrollable content size. The frame layout
guide defines the visible viewport. Matching widths in a vertical scroll view
prevents accidental horizontal scrolling and gives labels a known width for
wrapping.

---

<a id="q3-ipad-readable-layout"></a>
## Q3: How would you make a UIKit layout work well on iPad?

### Short Answer

I would avoid simply stretching phone content edge to edge. For text-heavy
content, I would use readable content width. For controls and forms, I would use
adaptive margins, split layouts, or centered content depending on the workflow.

### Expanded Answer

The right answer depends on the screen. A detail article benefits from readable
line length. A data-entry form may use a max width and grouped sections. A
master-detail workflow may need split navigation. The shared rule is to express
these as layout relationships, not as one-off device checks.
