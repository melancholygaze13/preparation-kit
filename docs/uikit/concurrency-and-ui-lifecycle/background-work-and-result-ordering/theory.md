---
title: "Background Work and Result Ordering: Theory"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Background Work and Result Ordering"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
---

# Background Work and Result Ordering: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Users create events in one order. Async work may finish in another order.
UIKit screens must decide which results are still valid before rendering them.

The safe flow is:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 568" title="Background Work and Result Ordering" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Background Work and Result Ordering diagram</a></figcaption>
</figure>

Do not let every completion handler directly mutate views. That gives callback
order control over screen state.

## Result Ordering

A generation token is a simple way to reject stale results:

```swift
@MainActor
final class SearchViewController: UIViewController {
    private var generation = 0
    private var searchTask: Task<Void, Never>?

    func search(query: String) {
        generation += 1
        let currentGeneration = generation

        searchTask?.cancel()
        searchTask = Task { [weak self, service] in
            do {
                let results = try await service.search(query)
                guard !Task.isCancelled else { return }

                guard let self else { return }
                guard currentGeneration == generation else { return }
                render(results)
            } catch is CancellationError {
                return
            } catch {
                guard let self else { return }
                guard currentGeneration == generation else { return }
                showError(error)
            }
        }
    }
}
```

This protects against an older request finishing after a newer one. The same
idea can use a request ID, item ID, cursor, or current query string.

## Background Work

Background work should stay outside UIKit boundaries. Services can fetch,
decode, parse, rank, or merge data. The UI boundary accepts the result and
renders it on the main actor. Do not assume plain async code is automatically
off the main actor. CPU-heavy processing needs an explicit non-UI execution
plan in modern Swift.

For fixed independent work, `async let` is often enough:

```swift
async let profile = service.profile()
async let badges = service.badges()

let state = try await ProfileState(
    profile: profile,
    badges: badges
)
```

For a dynamic number of child operations, use a task group rather than creating
loose `Task` values in a loop:

```swift
let thumbnails = try await withThrowingTaskGroup(
    of: (Int, Thumbnail).self
) { group in
    for (index, item) in items.enumerated() {
        group.addTask {
            (index, try await thumbnailService.thumbnail(for: item))
        }
    }

    var results = Array<Thumbnail?>(repeating: nil, count: items.count)
    for try await (index, thumbnail) in group {
        results[index] = thumbnail
    }
    return results.compactMap { $0 }
}
```

Task-group results arrive in completion order, not submission order. The example
returns each thumbnail with its input index and rebuilds input order explicitly.
If order does not matter, a simple append is enough.

If the list is large, add a concurrency limit. Starting hundreds of requests at
once can hurt memory, network throughput, server capacity, and battery.

## Constraints and Guarantees

Structured concurrency propagates cancellation from parent tasks to child tasks.
That is why task groups are a better fit than fire-and-forget tasks for related
batch work.

Actor state can change across every `await`. If an actor checks state, awaits,
and then assumes the old check is still true, another call may have changed the
state during suspension. Recheck state or store in-flight work before awaiting.

## Production Application

Common ordering bugs:

| Bug | Cause | Fix |
|---|---|---|
| Search results revert | Older request finishes later | Generation token or cancellation |
| Page order corrupts | Responses appended by finish order | Merge by cursor or model state |
| UI freezes | CPU work runs on main actor | Move work to non-UI service |
| Too many requests | Unbounded task group | Limit concurrency |

For Staff and Principal roles, ordering is a system contract. Define whether
newer results replace older results, whether partial results are allowed, how
retry interacts with generations, and what metrics show stale-result drops or
request cancellation.

## References

- [Swift Evolution SE-0304: Structured Concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md)
- [withThrowingTaskGroup(of:returning:isolation:body:)](https://developer.apple.com/documentation/swift/withthrowingtaskgroup%28of%3Areturning%3Aisolation%3Abody%3A%29)
- [Task.checkCancellation()](https://developer.apple.com/documentation/swift/task/checkcancellation%28%29)
- [MainActor](https://developer.apple.com/documentation/swift/mainactor)
