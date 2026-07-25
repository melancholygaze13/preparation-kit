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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - image-renderer
  - export
  - pdf
---

# Image Rendering and Export

> Image rendering converts a SwiftUI view into pixels or draws it into a graphics
> context. Export delivers that result outside the current screen, such as a PNG, JPEG,
> PDF, share item, or file.

## Quick Recall

- Prefer `ImageRenderer` for rendering SwiftUI content.
- Proposed size uses points; `scale` determines bitmap pixel density.
- Supply export-specific environment values instead of depending on the visible screen.
- Use the render callback for a `CGContext`, including a PDF context.
- Large exports can consume substantial memory and may contain unsupported hosted views.

Use `ImageRenderer` with explicit point size, pixel scale, environment, color, alpha,
and output format. Treat temporary-file protection, cleanup, cancellation, and private
content as part of the export contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
