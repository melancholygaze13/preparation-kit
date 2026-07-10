---
title: "Image Decoding, Rendering, and Resizing"
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

# Image Decoding, Rendering, and Resizing

> File size is not display cost. A compressed image must become pixels before it
> can be rendered, so decode and downsample near the requested pixel size before
> a large image reaches a scrolling view.

## Quick Recall

- A small JPEG on disk can expand to a large decoded bitmap in memory.
- Downsample with Image I/O from the source data; resizing an already decoded
  full-size `UIImage` does not avoid the memory spike.
- Convert point size to pixel size with the destination display scale.
- Perform data access and image preparation away from the main actor, then apply
  the result to UIKit on the main actor.
- Cache by stable content identity and output variant, not only by URL.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
