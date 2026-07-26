---
title: "Image Decoding, Rendering, and Resizing: Interview Questions"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Image Decoding, Rendering, and Resizing"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Image Decoding, Rendering, and Resizing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why can a small JPEG consume much more memory?](#q1-file-vs-memory) | Senior | Decoded representation |
| [How would you prepare thumbnails for a scrolling feed?](#q2-thumbnail-pipeline) | Senior | Image pipeline |
| [What belongs in an image-cache key?](#q3-cache-identity) | Staff | Correct reuse |

---

<a id="q1-file-vs-memory"></a>
## Q1: Why can a small JPEG consume much more memory?

### Short Answer

JPEG size describes compressed storage. Rendering needs decoded pixels. A common
RGBA buffer is about four bytes per pixel, so pixel dimensions, not compressed byte
count, drive display memory.

### Expanded Answer

A 12-megapixel image can need roughly 48 MB for one four-byte-per-pixel buffer, plus
temporary and framework overhead. The exact backing format is not guaranteed. I use
the estimate to spot risk, then measure memory peaks on the target devices.

---

<a id="q2-thumbnail-pipeline"></a>
## Q2: How would you prepare thumbnails for a scrolling feed?

### Short Answer

I use Image I/O to downsample from the source data near the destination pixel size,
off the main actor. I cache the prepared result, then assign it on the main actor
only if the reused cell still represents the same item.

### Expanded Answer

I multiply the destination point size by display scale and request an oriented
thumbnail with that maximum pixel dimension. This avoids fully decoding the original
before resizing it. The request layer deduplicates identical work and supports
cancellation for cells that scroll away.

I also bound prefetching and caches so an optimization does not create excessive
I/O or decoded-memory pressure.

---

<a id="q3-cache-identity"></a>
## Q3: What belongs in an image-cache key?

### Short Answer

The key needs stable content identity plus the output variant: a range of pixel sizes,
scale, content version, appearance variant, and transformation or crop policy.

### Expanded Answer

A URL-only key can return the wrong resolution or stale bytes. I separate original
data caching from decoded or resized image caching because they have different cost
and eviction needs. Prepared-image entries use memory cost limits and are safe to
discard and recreate.

### Trade-offs

More variants improve reuse accuracy but lower the hit rate and increase memory.
Coarser size buckets improve hit rate but may waste memory or reduce visual quality.
