---
title: "Image Rendering and Export"
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
  - image-renderer
  - export
  - pdf
---

# Image Rendering and Export

> `ImageRenderer` renders a SwiftUI view into a bitmap or caller-provided graphics
> context. Export code must explicitly define point size, pixel scale, environment,
> color and alpha policy, output format, and the lifetime of sensitive temporary files.

## Quick Recall

- Prefer `ImageRenderer` for rendering SwiftUI content.
- Proposed size uses points; `scale` determines bitmap pixel density.
- Supply export-specific environment values instead of depending on the visible screen.
- Use the render callback for a `CGContext`, including a PDF context.
- Large exports can consume substantial memory and may contain unsupported hosted views.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
