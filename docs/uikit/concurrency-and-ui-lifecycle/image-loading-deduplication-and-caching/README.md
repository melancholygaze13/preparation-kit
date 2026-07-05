---
title: "Image Loading, Deduplication, and Caching"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Image Loading, Deduplication, and Caching

> Image loading for UIKit lists is a concurrency problem: many views ask for the
> same expensive resource while cells are being reused. A good loader separates
> cache ownership, in-flight request deduplication, decoding, and UI identity
> checks.

## Quick Recall

- Cache decoded or display-ready images when memory budget allows.
- Deduplicate in-flight requests so identical URLs do not download repeatedly.
- Keep shared loading in a service or actor, not in individual cells.
- Cancel a visible cell's interest without necessarily cancelling shared work.
- Always verify item identity before assigning the image to a reused view.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
