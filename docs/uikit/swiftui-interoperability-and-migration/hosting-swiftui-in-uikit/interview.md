---
title: "Hosting SwiftUI in UIKit: Interview Questions"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Hosting SwiftUI in UIKit"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Hosting SwiftUI in UIKit: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Where should a hosting boundary sit in a mixed UIKit screen?](#q1-hosting-boundary) | Senior | Boundary placement |
| [How should hosted SwiftUI content size itself?](#q2-hosting-size) | Senior | Layout contract |
| [How would you use SwiftUI in reusable UIKit cells?](#q3-hosting-cells) | Staff | Reuse and identity |

---

<a id="q1-hosting-boundary"></a>
## Q1: Where should a hosting boundary sit in a mixed UIKit screen?

### Short Answer

I place it around the smallest coherent region that can have clear inputs and
actions. UIKit keeps the surrounding controller lifecycle, while the hosted region
owns declarative rendering without duplicating state or routing.

### Expanded Answer

For a complete screen, I push or present the hosting controller. For a region, I use
full child-controller containment and keep the hosting controller attached to its
view. I avoid many tiny islands when their update and ownership contracts would cost
more than the migration helps.

---

<a id="q2-hosting-size"></a>
## Q2: How should hosted SwiftUI content size itself?

### Short Answer

For a constrained child or full screen, UIKit proposes size through the hosting
view's constraints. I enable a sizing option only when the UIKit container consumes
SwiftUI's ideal size.

### Expanded Answer

I use `.preferredContentSize` for a popover or custom container that reads the
controller's preferred size. I use `.intrinsicContentSize` when Auto Layout needs the
hosting view's changing ideal size. I avoid enabling both without a container need,
because two layout systems can otherwise create unclear feedback.

---

<a id="q3-hosting-cells"></a>
## Q3: How would you use SwiftUI in reusable UIKit cells?

### Short Answer

I use `UIHostingConfiguration` as the cell's content configuration. UIKit still owns
reuse, selection, and highlighting, while SwiftUI describes the cell content.

### Expanded Answer

The cell provider creates a configuration from the item identified by the data
source. If appearance depends on cell state, I recreate the configuration from the
configuration update handler. Actions capture a stable item identifier, never an
index path that may become stale after snapshot updates.

### Trade-offs

Hosting configurations make gradual adoption small and reversible. A highly tuned
cell may still need measurement for layout, memory, and scrolling cost before broad
rollout.
