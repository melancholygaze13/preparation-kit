---
title: "Image Decoding, Rendering, and Resizing: Theory"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Image Decoding, Rendering, and Resizing"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Image Decoding, Rendering, and Resizing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An image has at least three relevant sizes: compressed bytes in storage or over the
network, decoded pixels in memory, and displayed points on screen. The compressed
file size does not predict the decoded memory cost.

A common 8-bit RGBA buffer needs about four bytes per pixel, before supporting
objects and temporary buffers. A 12-megapixel image can therefore require roughly
48 MB for one decoded buffer even when its JPEG file is much smaller. The exact
format is an implementation choice, so use the estimate for planning and measure
the process for proof.

## Downsample Before Full Decode

If an image will appear as a small thumbnail, create a thumbnail near the target
pixel dimensions directly from the source with Image I/O. This avoids decoding a
full-resolution `UIImage` merely to draw it into a smaller renderer.

The requested output is in pixels, not points:

```swift
let maxPixelSize = max(targetSize.width, targetSize.height) * displayScale
```

Create a `CGImageSource`, request a thumbnail with a maximum pixel size, allow Image
I/O to create one from the full image, and request the embedded orientation
transform. `CGImageSourceCreateThumbnailAtIndex` returns the prepared `CGImage`.
Do data access and preparation outside the main actor; create or assign the visible
UIKit state on the main actor.

```swift
import UIKit
import ImageIO

func downsample(
    data: Data,
    to pointSize: CGSize,
    scale: CGFloat
) -> CGImage? {
    let sourceOptions: [CFString: Any] = [
        kCGImageSourceShouldCache: false
    ]
    guard let source = CGImageSourceCreateWithData(
        data as CFData,
        sourceOptions as CFDictionary
    ) else {
        return nil
    }

    let maxPixels = max(pointSize.width, pointSize.height) * scale
    let thumbnailOptions: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceShouldCacheImmediately: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxPixels
    ]

    return CGImageSourceCreateThumbnailAtIndex(
        source,
        0,
        thumbnailOptions as CFDictionary
    )
}
```

The function returns pixels near the display size without first creating a
full-resolution `UIImage`. Use the resulting `CGImage` to create the visible image
on the main actor.

Downsampling preserves the source aspect ratio. Decide separately whether the view
uses aspect fit, aspect fill, or cropping. Do not stretch pixels to satisfy a target
rectangle.

## Define Cache Identity

Cache the work that is expensive and likely to be reused. A useful key includes:

- stable content identity or version;
- target pixel-size bucket;
- scale and any appearance-dependent variant;
- transformation policy, such as crop or corner treatment.

A URL alone is insufficient when the same asset appears at different sizes or the
server changes content behind it. Store source bytes and prepared images as
different cache layers when both are valuable. Set count and cost limits, respond to
memory pressure, and avoid retaining decoded full-size originals after producing
the needed variant.

## Keep Reuse and Ordering Correct

In reusable cells, bind an image request to the item's stable identifier. Cancel work
when the cell stops representing that item, and check identity before applying a
late result. Deduplicate concurrent requests for the same cache key so rapid reuse
does not launch the same decode many times.

Use Instruments and realistic feeds to inspect memory peaks, main-thread stalls,
cache hit rate, and duplicate work. Preheating can improve scrolling only when its
window is bounded and cancellation prevents speculative work from taking over the
pipeline.

## References

- [Image I/O](https://developer.apple.com/documentation/imageio)
- [`CGImageSourceCreateThumbnailAtIndex`](https://developer.apple.com/documentation/imageio/cgimagesourcecreatethumbnailatindex(_:_:_:))
- [`kCGImageSourceThumbnailMaxPixelSize`](https://developer.apple.com/documentation/imageio/kcgimagesourcethumbnailmaxpixelsize)
- [iOS Memory Deep Dive](https://developer.apple.com/videos/play/wwdc2018/416/)
- [Image and graphics best practices](https://developer.apple.com/videos/play/wwdc2018/219/)
