---
title: "Image Rendering and Export: Theory"
domain: "SwiftUI"
topic: "Drawing, Graphics, and Effects"
concept: "Image Rendering and Export"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
tags:
  - image-renderer
  - export
  - pdf
---

# Image Rendering and Export: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Rendering is a separate presentation of data, not a screenshot side effect. Build an
export view with explicit inputs, ask `ImageRenderer` to lay it out at a defined point
size, and choose how those points map to output pixels or a graphics context.

## Configuring ImageRenderer

`ImageRenderer` is main-actor isolated and takes SwiftUI content. Its important inputs
are `proposedSize`, `scale`, `isOpaque`, `colorMode`, and, on current platforms, allowed
dynamic range. It can return a `CGImage` or platform image when rendering succeeds.

```swift
let renderer = ImageRenderer(
    content: ReceiptExportView(receipt: receipt)
        .environment(\.colorScheme, .light)
)

renderer.proposedSize = .init(width: 600, height: nil)
renderer.scale = displayScale

guard let image = renderer.uiImage else {
    throw ExportError.renderingFailed
}
```

The proposal is expressed in points. A 600-point width at scale 3 produces 1,800 output
pixels before considering internal limits. Pixel memory grows with width multiplied by
height and bytes per pixel, so a poster-sized export can exhaust memory even when the
on-screen view is cheap.

An offscreen export does not automatically mean “exactly what this user sees.” Decide
the locale, calendar, time zone, color scheme, Dynamic Type size, display scale, and
redaction policy. Apply required environment values to the export content explicitly.
This also makes output reproducible in tests.

## Bitmap and PDF Output

Use `uiImage` or `cgImage` for bitmap output, then encode the chosen format with an
explicit compression and alpha policy. PNG suits lossless graphics and transparency;
JPEG may suit photographs when smaller files matter. Validate color profile and dynamic
range support at the destination instead of assuming every consumer preserves them.

The `render(rasterizationScale:renderer:)` callback supplies the rendered size and a
function that draws into a `CGContext`. A PDF exporter creates a PDF context, begins a
page with the intended media box, invokes that drawing function, and closes the page and
document. Some effects or embedded content may still rasterize, so test the resulting
PDF rather than promising vector output.

SwiftUI views backed by external platform views or services may not render like native
SwiftUI content. Maps, web or media content, asynchronous images, and protected surfaces
need explicit validation or an export-specific substitute. Ensure all required data is
loaded before rendering; do not rely on an offscreen view's appearance lifecycle.

## Export Boundaries

Keep export view code free of navigation, gestures, and incidental screen state. It
should receive an immutable snapshot of the data needed for one output. Rendering and
encoding failures are user-visible outcomes that need retry or recovery.

Temporary files require unique names, appropriate protection, bounded lifetime, and
cleanup after sharing or cancellation. Exclude secrets and debug overlays. For large
exports, serialize requests and move safe encoding or file I/O away from the main actor
while respecting the sendability of captured values.

## Production Decisions

Test exact pixel dimensions, alpha, color, pagination, localization, long text, memory
pressure, cancellation, and target-app import. Snapshot tests can verify a controlled
export environment, but structural assertions should also verify page count and size.

At Staff or Principal scope, define an export contract covering schema version, visual
version, privacy, quality limits, observability, and backward compatibility. Centralize
the renderer so features do not invent conflicting scale and environment policies.

## References

- [`ImageRenderer`](https://developer.apple.com/documentation/swiftui/imagerenderer)
- [`ImageRenderer.render`](https://developer.apple.com/documentation/swiftui/imagerenderer/render%28rasterizationscale%3Arenderer%3A%29)
- [`ProposedViewSize`](https://developer.apple.com/documentation/swiftui/proposedviewsize)
- [Creating a PDF with SwiftUI views](https://developer.apple.com/documentation/swiftui/imagerenderer)
- [Core Graphics PDF documents](https://developer.apple.com/documentation/coregraphics/cgcontext#PDF-Documents)
