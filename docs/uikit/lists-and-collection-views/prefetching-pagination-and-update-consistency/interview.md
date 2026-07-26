---
title: "Prefetching, Pagination, and Update Consistency: Interview Questions"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Prefetching, Pagination, and Update Consistency"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-26
---

# Prefetching, Pagination, and Update Consistency: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is list prefetching for?](#q1-prefetching-purpose) | Senior | Performance model |
| [How do you avoid duplicate pagination requests?](#q2-duplicate-page-requests) | Senior | Async state |
| [How do you prevent stale async results from corrupting a list?](#q3-stale-results) | Staff | Update consistency |

---

<a id="q1-prefetching-purpose"></a>
## Q1: What is list prefetching for?

### Short Answer

Prefetching starts work for rows or items that are likely to become visible soon.
It can improve perceived performance, but it is only a hint and the work must be
safe to cancel or ignore.

### Expanded Answer

Good prefetch candidates include thumbnail loading, image decoding, or loading
the next page near the end of a list. I avoid using prefetch as the only path for
required data because UIKit does not guarantee every item will be prefetched.

---

<a id="q2-duplicate-page-requests"></a>
## Q2: How do you avoid duplicate pagination requests?

### Short Answer

I keep pagination state outside cells: current cursor, loading flag, loaded item
IDs, error state, and end-of-list state. Before loading, I check whether that
cursor is already in flight or complete.

### Expanded Answer

Pagination should not be triggered blindly from every cell display callback. Fast
scrolling can call those paths many times. A central loader or view model should
serialize page requests and merge results by stable ID.

---

<a id="q3-stale-results"></a>
## Q3: How do you prevent stale async results from corrupting a list?

### Short Answer

I apply results only if they still match the active refresh, page cursor, or
item identity. Older tasks should be cancelled or ignored, and snapshots should
be built from the accepted current model.

### Expanded Answer

For example, if the user refreshes while page two is loading, the page-two result
from the old generation should not append to the refreshed list. I can use a
generation token, task cancellation, or an actor-owned store to decide which
results are still valid.

### Trade-offs

Strict cancellation saves resources but can be complex when work is shared.
Ignoring stale results is simpler, but the app may still spend bandwidth or CPU
on work it no longer needs.
