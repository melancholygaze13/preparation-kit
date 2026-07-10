---
title: "Blur, Material Effects, and Advanced Compositing"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# Blur, Material Effects, and Advanced Compositing

> Prefer system visual effects when the design needs live material over changing
> content. Every mask, filter, shadow, and rasterization choice changes how the
> layer tree is composited, so validate appearance and frame cost on real devices.

## Quick Recall

- Put foreground content inside `UIVisualEffectView.contentView`.
- Keep a visual effect view and its ancestors at full alpha; partial alpha can
  produce incorrect effects and extra offscreen work.
- A mask clips by alpha. A shadow needs a shape; `shadowPath` can avoid deriving
  that shape from rendered content when geometry is known.
- `shouldRasterize` is a measured cache trade-off, not a general performance flag.
- Use Core Image for filter pipelines and Metal for sustained custom GPU work.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
