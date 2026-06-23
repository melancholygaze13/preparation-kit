---
title: "Pagination, Refresh, and Search: Theory"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Pagination, Refresh, and Search"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - pagination
  - refresh
  - search
---

# Pagination, Refresh, and Search: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Pagination, refresh, and search are state transitions over one collection model. The
model owns query, loaded items, cursor, freshness, request identity, and user-visible
phases. Views provide triggers and render progress or errors.

Triggers can repeat and responses can finish out of order. Operations must be
idempotent and validate relevance before commit.

## How It Works

### Pagination State

A model commonly tracks:

```swift
struct PageState {
    var items: [Item] = []
    var nextCursor: Cursor?
    var isLoadingNext = false
    var nextPageError: DisplayError?
}
```

`loadNext()` guards that a cursor exists and no identical request is active. It
captures the cursor, awaits the repository, verifies the cursor is still current,
then merges the response by stable ID.

A sentinel near the end can call `loadNext()` from `.task(id: nextCursor)`. Lazy
appearance is not exactly once, so the model—not the view—provides deduplication.

### Merge Policy

Appending blindly can duplicate items when pages overlap or the server updates an
entity. Define ordering, update, duplicate, and deletion behavior. Normalize by ID
or use a repository that returns a consistent snapshot.

Cursor pagination usually handles changing datasets more reliably than offsets, but
the server contract decides. Treat cursors as opaque and do not derive product meaning
from their contents.

### Refresh

Refresh revalidates existing content. `refreshable` awaits the model's refresh method,
allowing the platform indicator to match actual work. Preserve current items during
refresh when they remain useful.

Define how refresh interacts with pagination: cancel page work, join it, or allow the
repository to reconcile. Resetting the cursor while an old next-page response commits
can corrupt order, so every path checks a request generation or snapshot identity.

Initial-load failure may replace the screen. Refresh and next-page failures usually
keep existing content and offer a scoped retry.

### Search

Search state includes raw text, normalized query, current result set, and phase. Local
filtering uses `localizedStandardContains` for user-facing text. Remote search often
debounces input and cancels the previous task:

```swift
.task(id: query) {
    await model.search(query)
}
```

Inside the operation, a cancellation-aware duration sleep can debounce. After the
response, compare the query or generation before commit. Debounce lowers request
volume; cancellation and validation prevent stale results.

Define empty query behavior: show recent items, all content, suggestions, or no
results. A successful empty result is different from an error.

### Loading Phases

Avoid one `isLoading` flag for all operations. Initial load, refresh, next page, and
search replacement have different UI and overlap rules. Model the legal combinations
without multiplying unrelated Booleans.

Disable duplicate actions when needed, but do not block reading existing content.
Progress should appear near the operation: full-screen for no content, inline at the
end for pagination, and subtle for refresh.

### Caching and Offline Behavior

Cache by normalized query and relevant account or filter inputs when reuse is valuable.
Define freshness and memory bounds. A cached result can appear immediately while a
refresh runs, with age communicated when correctness depends on current data.

Offline pagination cannot invent later pages. Preserve loaded content and a retryable
boundary. Reachability can schedule retry but does not guarantee success.

### Testing

Use a controlled repository to complete page and search requests in any order. Test
duplicate triggers, overlapping pages, refresh during pagination, canceled search,
empty result, retry, and account change. Do not use fixed sleeps.

Verify both state and effect count when duplicate writes or requests matter. UI tests
cover the trigger and presentation; model tests cover ordering and merge policy.

## Constraints and Guarantees

- `refreshable` awaits its async action but does not define the model's freshness policy.
- Lazy/sentinel appearance can repeat and is not a durable pagination cursor.
- Cancellation is cooperative, so stale-result validation remains necessary.
- Search and page ordering depend on repository/server contracts.
- Stable IDs are required to merge and retain correct row state.

## Engineering Decisions

| Situation | Policy |
|---|---|
| Duplicate next-page trigger | Coalesce by cursor |
| Refresh during page load | Cancel or invalidate old generation |
| Overlapping page entities | Merge by stable ID with defined ordering |
| Rapid remote search | Normalize, debounce, cancel, validate |
| Refresh fails with content | Preserve content and show scoped retry |
| Offline with cached results | Show age and retry policy |

## References

- [`refreshable(action:)`](https://developer.apple.com/documentation/swiftui/view/refreshable%28action%3A%29)
- [`searchable`](https://developer.apple.com/documentation/swiftui/view/searchable%28text%3Aplacement%3Aprompt%3A%29)
- [Adding a search interface to your app](https://developer.apple.com/documentation/swiftui/adding-a-search-interface-to-your-app)
- [Loading and displaying a large data feed](https://developer.apple.com/documentation/swiftui/loading-and-displaying-a-large-data-feed)
