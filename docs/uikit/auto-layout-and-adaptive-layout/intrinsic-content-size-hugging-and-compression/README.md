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
last_reviewed: 2026-07-01
---

# Intrinsic Content Size, Hugging, and Compression

> Some UIKit views know a natural size from their content. Content hugging says
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
