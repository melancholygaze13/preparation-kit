---
title: "Image Loading, Deduplication, and Caching: Interview Questions"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Image Loading, Deduplication, and Caching"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-05
---

# Image Loading, Deduplication, and Caching: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What makes image loading hard in UIKit lists?](#q1-image-loading-difficulty) | Senior | Reuse and async work |
| [How do you deduplicate image requests?](#q2-deduplication) | Senior | In-flight work |
| [What should be cached?](#q3-cache-policy) | Staff | Performance trade-offs |
| [How do you handle cancellation for shared image work?](#q4-shared-cancellation) | Staff | Ownership |

---

<a id="q1-image-loading-difficulty"></a>
## Q1: What makes image loading hard in UIKit lists?

### Short Answer

Cells are reused while image work finishes later. Many visible items can also
ask for the same image at the same time. Without cancellation, identity checks,
and caching, lists show wrong images or hitch while scrolling.

### Expanded Answer

The cell should render the current item, not own the whole loading system. I
usually put shared fetch, decode, deduplication, and cache policy in a loader,
then have the screen or cell verify identity before assigning the result.

---

<a id="q2-deduplication"></a>
## Q2: How do you deduplicate image requests?

### Short Answer

Keep an in-flight task dictionary keyed by URL or cache key. If a request is
already running, new callers await the same task instead of starting another
download.

### Expanded Answer

An actor is a good owner for that dictionary because it serializes access to the
cache and in-flight state. The loader should store the task before awaiting it,
then remove it when the task succeeds or fails.

---

<a id="q3-cache-policy"></a>
## Q3: What should be cached?

### Short Answer

Cache the form that saves real work. Network response caching helps bandwidth,
but scrolling often needs decoded, resized, or display-ready images to avoid
hitches.

### Expanded Answer

The trade-off is memory and invalidation. A full-size image cache may waste RAM
if the UI only needs thumbnails. A prepared thumbnail cache is faster for a list
but needs a key that includes size, scale, and transformation.

---

<a id="q4-shared-cancellation"></a>
## Q4: How do you handle cancellation for shared image work?

### Short Answer

Cancel a cell's interest when it is reused, but do not automatically cancel a
shared request if other visible items still need it.

### Expanded Answer

For cheap thumbnails, it may be better to finish the request and cache the
result. For large downloads or expensive APIs, I would track interested callers
and cancel the underlying task when no one remains. The decision depends on
bandwidth, memory, server cost, and likelihood of reuse.
