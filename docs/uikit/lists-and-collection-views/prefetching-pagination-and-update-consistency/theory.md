---
title: "Prefetching, Pagination, and Update Consistency: Theory"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Prefetching, Pagination, and Update Consistency"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
---

# Prefetching, Pagination, and Update Consistency: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Lists are asynchronous systems. The user scrolls, UIKit reuses cells, network or
disk work completes later, and the model may change while updates are in flight.

Prefetching improves perceived speed by starting work early. It does not remove
the need for identity checks, cancellation, or consistent model updates.

## Prefetching

Table and collection views can ask the data source to prefetch rows or items
that are likely to appear soon. This is a hint. UIKit may prefetch items that
never become visible, or visible cells may still need work that was not
prefetched.

Use prefetching for work that can start early and can be cancelled or reused:
image decoding, thumbnail fetches, or page loading near the end of a list.

When UIKit cancels prefetching, cancel work if it is no longer useful. If the
work is shared, such as an image request used by another visible cell, decrement
interest or keep the shared request alive.

## Pagination

Pagination should be driven by model state, not by cell instances. Common state
includes current items, next cursor, loading state, error state, and whether the
end has been reached.

```swift
guard !isLoadingPage, let cursor = nextCursor else { return }
isLoadingPage = true

Task { @MainActor in
    defer { isLoadingPage = false }

    do {
        let page = try await service.loadPage(after: cursor)
        merge(page)
        applySnapshot()
    } catch is CancellationError {
        return
    } catch {
        pageError = error
    }
}
```

The example assumes its surrounding list owner is main-actor isolated. The `guard`
prevents duplicate page requests, and `defer` clears the in-flight state on success,
failure, or cancellation. The merge step handles duplicate items, deleted items, or
changed item content before the snapshot is applied.

## Update Consistency

Do not apply UI updates directly from every async callback. Older work can
finish after newer work. A page response can arrive after a refresh. A cell image
request can finish after reuse.

Use sequence numbers, task cancellation, actor isolation, or a single model store
to make sure the UI reflects the latest accepted state. Diffable snapshots should
be built from that accepted state.

## Engineering Decisions

Use prefetching when the work is expensive enough to benefit from early start and
safe enough to cancel. Do not prefetch everything. It can waste bandwidth,
battery, memory, and server capacity.

For Staff and Principal roles, pagination is a reliability boundary. Define
retry behavior, duplicate handling, cursor ownership, observability, and loading
state. A list that appears simple can still create production incidents if it
spams requests or corrupts ordering.

## Production Application

Common problems:

| Bug | Cause | Fix |
|---|---|---|
| Same page loads twice | No in-flight guard | Track loading state per cursor |
| Refreshed list reverts | Older response applied later | Gate by generation or cancel older task |
| Spinner never stops | Error path does not update state | Model loading, error, and end states explicitly |
| Duplicate rows appear | Page merge appends blindly | Deduplicate by stable ID |

Test pagination with fast scrolling, cancellation, retry, refresh during load,
empty pages, and duplicate items from the server.

## References

- [UITableViewDataSourcePrefetching](https://developer.apple.com/documentation/uikit/uitableviewdatasourceprefetching)
- [UICollectionViewDataSourcePrefetching](https://developer.apple.com/documentation/uikit/uicollectionviewdatasourceprefetching)
- [Building High-Performance Lists and Collection Views](https://developer.apple.com/documentation/uikit/building-high-performance-lists-and-collection-views)
