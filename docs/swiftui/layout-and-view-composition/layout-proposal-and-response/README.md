---
title: "Layout Proposal and Response"
domain: "SwiftUI"
topic: "Layout and View Composition"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - layout
  - size-proposal
  - view-sizing
---

# Layout Proposal and Response

> SwiftUI layout is a negotiation: a parent proposes a size, each child chooses and
> reports a concrete size, then the parent places the child. A proposal guides the
> response; it is not always a hard constraint.

The response is the size the child chooses. Placement is the position the parent
assigns after measurement.

## Quick Recall

- Layout flows down as proposals and back up as size responses.
- Width and height are negotiated independently and may be unspecified.
- Containers can measure a child more than once with different proposals.
- Frames, padding, and `fixedSize` change the negotiation as wrapper views.
- Layout bounds and rendered pixels can differ because drawing may overflow or move.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
