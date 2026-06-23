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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - alignment
  - geometry
  - preferences
---

# Alignment, Geometry, and Preferences

> Alignment gives a parent reference points for placement. Geometry reports spatial
> facts in a chosen coordinate space. Preferences carry aggregated values from
> descendants to an ancestor when normal data flow is the wrong direction.

## Quick Recall

- Alignment guides change a child's reference point; they do not directly set a frame.
- Custom alignment can coordinate views across nested container boundaries.
- Ask for the smallest geometry value needed and choose its coordinate space explicitly.
- Prefer `onGeometryChange` for observation that does not require a geometry container.
- Preference reduction must be deterministic, cheap, and safe for repeated evaluation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
