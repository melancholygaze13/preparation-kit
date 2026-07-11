---
title: "Async Work, Lifecycle, and Cancellation: Theory"
domain: "Architecture"
topic: "MVVM"
concept: "Async Work, Lifecycle, and Cancellation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-11
tags:
  - mvvm
  - concurrency
  - cancellation
---

# Async Work, Lifecycle, and Cancellation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The component that owns an async operation must define when it starts, how repeated
inputs interact, when it stops, and which result may change state. A view model is a
good owner for presentation work tied to one feature lifetime. It is the wrong owner
for a download, upload, or queued operation that must survive the screen.

Mark a presentation view model `@MainActor` so its mutable UI state has one isolation
domain. An `await` may suspend and let other main-actor work run, so state can change
before the call resumes. Isolation prevents simultaneous unsafe access; it does not
make an entire async method atomic.

## Match the Task to the Lifetime

| Work | Suitable owner |
|---|---|
| Load while a SwiftUI screen is present | View `.task` calling an async view-model method |
| Search that restarts with a query | `.task(id:)` or a replaceable view-model task |
| Save that must finish after navigation | Feature flow, repository, or operation service |
| Upload that must survive process termination | Durable persisted operation plus system-supported scheduling |
| Data shared across screens | Repository or session-scoped model |

SwiftUI can cancel work started with `.task` when the view disappears. With `.task(id:)`,
SwiftUI cancels and restarts when the identifier changes. The called operation must
still respond to cancellation.

If the view model creates an unstructured `Task`, it owns the handle:

```swift
@Observable
@MainActor
final class SearchViewModel {
    private(set) var state: State = .idle
    private var searchTask: Task<Void, Never>?
    private let search: SearchService

    func queryChanged(to query: String) {
        searchTask?.cancel()
        searchTask = Task { [weak self, search] in
            do {
                try await Task.sleep(for: .milliseconds(250))
                let results = try await search.results(for: query)
                try Task.checkCancellation()
                self?.state = .content(results)
            } catch is CancellationError {
                // Replacement is expected, so keep the current state.
            } catch {
                self?.state = .failed(error.localizedDescription)
            }
        }
    }

    deinit { searchTask?.cancel() }
}
```

The task handle makes replacement and teardown explicit. The capture list avoids a
task retaining its owner for the full operation. Capture choices must follow the
required lifetime; weak capture is not a universal rule.

## Treat Cancellation as a Control Signal

Swift task cancellation is cooperative. Calling `cancel()` marks a task canceled.
Async functions must throw, return, or check cancellation at useful points. Many
system async APIs propagate cancellation, but custom loops and bridges must implement
it deliberately.

Use `Task.checkCancellation()` when continuing would be useless or unsafe. Use a
cancellation handler to notify an underlying callback API, while avoiding shared
mutable state between the operation and handler.

Do not usually show cancellation as an error. Disappearance, query replacement, and
new user intent are expected control flow. Also do not reset newer state in an older
task's cancellation handler.

## Prevent Stale Results

Cancellation alone is not an ordering guarantee. Underlying work may ignore
cancellation or finish near the same time. Add an acceptance rule when requests can
overlap:

- keep and compare a request identifier;
- compare the query or model version before applying the result;
- serialize mutations through one effect owner;
- make commands idempotent when they can reach an external system more than once.

For search A followed by search B, only B should update results even if A completes
last. A main-actor view model can still accept A unless it checks identity.

## Separate Presentation State from Durable Effects

The view model may show progress for work owned elsewhere. It does not need to own
the work itself. A repository can expose an operation identifier or stream of durable
status, and a new view model can resume observation after navigation.

This distinction matters for payment, uploads, offline edits, and background work.
Tying them to `deinit` can lose user intent. Keeping a screen view model alive only
to finish them creates a hidden lifetime and possible memory leak.

## Test Time and Ordering Deterministically

Inject async dependencies and, when delay policy matters, a clock. Tests should cover:

- initial load and repeated appearance;
- cancellation before and after suspension;
- old result arriving after new intent;
- error versus cancellation behavior;
- teardown and work that intentionally outlives the view model.

Avoid tests based on real sleep. Control continuations, test clocks, or fake services
so the test decides completion order.

At Staff scope, establish shared conventions for actor isolation, task handles,
cancellation propagation, and durable operation ownership. Add metrics for abandoned
work, stale-result rejection, retry age, and operations that outlive expected scopes.

## References

- [Concurrency — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Task — Apple Developer Documentation](https://developer.apple.com/documentation/swift/task)
- [`task(id:priority:_:)` — SwiftUI](https://developer.apple.com/documentation/swiftui/view/task(id:priority:_:))
- [Data race safety — Swift 6 migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/dataracesafety/)
