---
title: "Alignment, Geometry, and Preferences"
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
  - alignment
  - geometry
  - preferences
---

# Alignment, Geometry, and Preferences

> Alignment gives a parent reference points for placement. Geometry reports spatial
> facts in a chosen coordinate space. Preferences carry aggregated values from
> descendants to an ancestor when normal data flow is the wrong direction.

Use alignment when views need to share a visual reference point. Use geometry when
code needs a fact about size or position. Use a preference when a descendant must
report a presentation value to an ancestor.

## Quick Recall

- Alignment guides change a child's reference point; they do not directly set a frame.
- Custom alignment can coordinate views across nested container boundaries.
- A frame is meaningful only in its local, global, or explicitly named coordinate space.
- Ask for the smallest geometry value needed and choose its coordinate space explicitly.
- Prefer `onGeometryChange` for observation that does not require a geometry container.
- Preference reduction must be deterministic, cheap, and safe for repeated evaluation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
