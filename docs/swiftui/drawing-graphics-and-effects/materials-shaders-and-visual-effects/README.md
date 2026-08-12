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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - materials
  - shaders
  - visual-effects
---

# Materials, Shaders, and Visual Effects

> A material is an adaptive backdrop style. A shader is a GPU function that changes
> pixels or sampling positions. A visual effect changes rendered appearance without
> becoming the source of layout or feature state.

## Quick Recall

- A `Material` is an adaptive backdrop treatment, not a fixed color.
- On iOS 26, use system glass APIs and button styles for appropriate foreground controls.
- `colorEffect`, `distortionEffect`, and `layerEffect` have different sampling contracts.
- `maxSampleOffset` must cover how far an effect reads or moves pixels.
- Provide fallbacks for Reduce Transparency, Reduce Motion, contrast, and unsupported GPUs.

Prefer system materials and glass for appropriate surfaces. Use a shader only when its
pixel algorithm is part of the product. Declare its sampling bounds, measure real frame
cost, and preserve meaning when the effect is unavailable or reduced.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
