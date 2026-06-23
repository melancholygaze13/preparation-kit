---
title: "Pagination, Refresh, and Search: Interview Questions"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Pagination, Refresh, and Search"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - pagination
  - refresh
  - search
---

# Pagination, Refresh, and Search: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you implement reliable pagination?](#q1-how-would-you-implement-reliable-pagination) | Senior | Cursor and deduplication |
| [How do refresh and pagination interact?](#q2-how-do-refresh-and-pagination-interact) | Senior | Generations and visible state |
| [How do you prevent stale search results?](#q3-how-do-you-prevent-stale-search-results) | Senior | Cancellation and relevance |

---

<a id="q1-how-would-you-implement-reliable-pagination"></a>
## Q1: How would you implement reliable pagination?

### Short Answer

The model owns the cursor, phase, deduplication, and merge policy. A sentinel can
request the next page repeatedly, but `loadNext` coalesces the current cursor and
validates it before merging stable-ID results.

### Expanded Answer

I keep existing content visible and show inline progress or retry. The server cursor
is opaque. Page overlap is resolved by stable ID with defined ordering and update rules.

I tune page size and trigger distance from latency, memory, and scroll behavior, not
from a fixed row number alone.

<a id="q2-how-do-refresh-and-pagination-interact"></a>
## Q2: How do refresh and pagination interact?

### Short Answer

Refresh starts a new collection generation. It cancels or invalidates older page
requests so their results cannot append to the refreshed snapshot. Existing content
usually remains visible during the refresh.

### Expanded Answer

The model resets cursor and merge state atomically on successful refresh or according
to a documented optimistic policy. A next-page failure affects the boundary, not the
whole screen.

`refreshable` awaits the real operation. Repeated refresh requests are joined, replaced,
or ignored deliberately.

<a id="q3-how-do-you-prevent-stale-search-results"></a>
## Q3: How do you prevent stale search results?

### Short Answer

I normalize and optionally debounce the query, cancel prior work when it changes,
and compare the query or request generation immediately before committing. Cancellation
saves resources; the relevance check guarantees correctness.

### Expanded Answer

I define empty-query and empty-result behavior separately. Cancellation is not shown
as an error, and an old failure cannot replace a newer success.

For local user-facing filtering, I use locale-aware matching. Tests complete requests
out of order and verify only the current query can change the UI.
