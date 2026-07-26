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
last_reviewed: 2026-07-26
---

# Blur, Material Effects, and Advanced Compositing

> Blur samples nearby content. A material combines blur, color, and vibrancy to
> keep foreground content readable. Compositing combines layers into the final
> image. Masks, filters, shadows, and rasterization can make that work expensive,
> so measure them on real devices.

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
