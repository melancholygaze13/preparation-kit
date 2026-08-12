---
title: "Image Loading, Deduplication, and Caching"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Image Loading, Deduplication, and Caching

> A cache reuses a finished image. Request deduplication lets several callers
> share one load that is still running. A good loader owns both rules, decodes
> away from scrolling work, and checks item identity before updating a reused cell.

## Quick Recall

- Cache decoded or display-ready images when memory budget allows.
- Deduplicate in-flight requests so identical URLs do not download repeatedly.
- Keep shared loading in a service or actor, not in individual cells.
- Cancel a visible cell's interest without necessarily cancelling shared work.
- Always verify item identity before assigning the image to a reused view.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
