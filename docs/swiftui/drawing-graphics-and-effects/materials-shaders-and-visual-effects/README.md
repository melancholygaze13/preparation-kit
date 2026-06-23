---
title: "Materials, Shaders, and Visual Effects"
domain: "SwiftUI"
topic: "Drawing, Graphics, and Effects"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - materials
  - shaders
  - visual-effects
---

# Materials, Shaders, and Visual Effects

> Prefer system materials and glass for adaptive surfaces. Use shaders when a pixel or
> sampling algorithm is genuinely part of the product, declare sampling bounds
> correctly, and preserve legibility, accessibility, and a measured frame-time budget.

## Quick Recall

- A `Material` is an adaptive backdrop treatment, not a fixed color.
- On iOS 26, use system glass APIs and button styles for appropriate foreground controls.
- `colorEffect`, `distortionEffect`, and `layerEffect` have different sampling contracts.
- `maxSampleOffset` must cover how far an effect reads or moves pixels.
- Provide fallbacks for Reduce Transparency, Reduce Motion, contrast, and unsupported GPUs.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
