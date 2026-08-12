---
title: "Intrinsic Content Size, Hugging, and Compression"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Intrinsic Content Size, Hugging, and Compression

> Intrinsic content size is the natural size a view reports from its content.
> Content hugging says
> how strongly a view resists growing, and compression resistance says how
> strongly it resists shrinking.

## Quick Recall

- Labels, buttons, image views, and text fields often provide intrinsic content
  size.
- Hugging answers "which view grows when there is extra space?"
- Compression resistance answers "which view shrinks or truncates when space is
  tight?"
- Priorities should reflect product intent, such as keeping a button visible
  before preserving a full title.
- Dynamic Type and localization turn weak priority choices into real bugs.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
