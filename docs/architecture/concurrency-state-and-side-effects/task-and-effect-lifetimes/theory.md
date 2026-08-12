---
title: "Task and Effect Lifetimes: Theory"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Task and Effect Lifetimes"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - task-lifetime
  - structured-concurrency
  - side-effects
---

# Task and Effect Lifetimes: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Every asynchronous effect needs an owner. The owner starts it, observes its outcome,
cancels it when it is no longer useful, and decides whether it may outlive the current
screen or process.

Prefer structured concurrency because its task tree makes those responsibilities
visible. A parent scope does not finish until its child tasks finish. Cancellation and
priority flow through that relationship. An unstructured task has no parent-child
lifetime, so architecture must provide the missing ownership.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Task and Effect Lifetimes" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Task and Effect Lifetimes diagram</a></figcaption>
</figure>

The task tree handles in-memory work. The outbox handles work whose business lifetime
must survive the tree.

## Match Work to a Lifetime

Common owners are:

| Lifetime | Example | End policy |
|---|---|---|
| Function or request | Load two resources for one response | Await children; cancel on failure or caller cancellation |
| Screen | Search or preview for visible input | Cancel on disappearance or replacement |
| Feature flow | Checkout or upload across several screens | Cancel when flow ends, unless intent is durable |
| Session | Token refresh or account event observation | Cancel on sign-out |
| Application | Connectivity monitor or sync coordinator | Stop at process end; restore durable work later |
| Durable business intent | Send message or submit offline edit | Persist, retry, acknowledge, or explicitly compensate |

Do not tie important business work to a view merely because the user initiated it there.
Conversely, do not promote every screen request to an application singleton. The smallest
owner that matches the required outcome is easier to reason about and test.

## Structured Work First

Use sequential `await` when operations depend on each other. Use `async let` for a fixed
small set of independent results. Use a task group for a dynamic set of similar children.

```swift
func loadDashboard() async throws -> Dashboard {
    async let account = accountClient.account()
    async let activity = activityClient.recentActivity()

    return try await Dashboard(account: account, activity: activity)
}
```

The function cannot return while either child is still running. If one child throws,
the other is cancelled before the scope exits. Cancellation remains cooperative, so
child code still needs to respond to it.

Task groups launch children eagerly. Bound concurrency when the input can be large or
the downstream system has a limit. Structure provides lifetime control, not automatic
resource control.

## When an Unstructured Task Is Valid

`Task {}` is useful at a synchronous-to-async boundary such as a button action, delegate
callback, or lifecycle hook. It returns a handle. Keep that handle when the task can be
replaced or when an owner must cancel it.

```swift
@MainActor
final class SearchController {
    private var searchTask: Task<Void, Never>?

    func search(for query: String) {
        searchTask?.cancel()
        let repository = self.repository
        searchTask = Task { [weak self, repository] in
            do {
                let results = try await repository.search(query)
                try Task.checkCancellation()
                guard let self else { return }
                self.show(results, for: query)
            } catch is CancellationError {
                // Replacement is expected.
            } catch {
                guard let self else { return }
                self.show(error)
            }
        }
    }

    func stop() {
        searchTask?.cancel()
        searchTask = nil
    }
}
```

`Task {}` inherits actor isolation, priority, and task-local values from its context, but
it is still unstructured. Cancelling the caller does not automatically cancel it. A
discarded handle also discards the obvious place to observe a thrown error.

Use `Task.detached` rarely. It gives up actor context, priority, and task-local values.
It is not the standard way to make work “background.” Prefer an isolated async API,
structured child task, or an explicitly concurrent CPU-bound function.

## Effects Are More Than Tasks

An effect includes its policy and external consequence, not only the `Task` executing
it. A network write may have reached the server even if the waiting task is cancelled.
A file write may need atomic completion. An analytics event may be best-effort. An offline
mutation may require durable replay.

Define for each effect:

- owner and maximum lifetime;
- identity and whether newer work replaces older work;
- cancellation behavior;
- error destination and retry policy;
- idempotency or compensation needs;
- result commit boundary and observability.

Cancellation of observation is not always cancellation of intent. Closing a “send
message” screen can stop UI waiting while a persisted outbox continues. Product state
must say whether the message is queued, sent, or failed.

## Retention and Teardown

A task closure can retain its captures for the task's lifetime. Weak capture only helps
before a strong reference is established; immediately promoting `self` and then awaiting
a long operation can still keep the owner alive. Prefer passing the specific value or
dependency needed, and use explicit cancellation as the primary lifetime tool.

Teardown should be idempotent. Cancel task handles, finish stream continuations, remove
observers, and release external resources. Do not rely only on `deinit` if the object can
remain retained by its task.

## Engineering Decisions

| Approach | Benefit | Cost or risk |
|---|---|---|
| Structured child tasks | Clear completion, error, and cancellation tree | Scope must await all children |
| Owned unstructured task | Bridges synchronous entry points | Manual handle, error, and cancellation policy |
| Long-lived service task | Centralizes session or app observation | Explicit start, stop, and duplicate-start rules |
| Durable queue | Survives process loss and supports replay | Persistence, idempotency, migration, operations |

At Staff scope, standardize effect ownership across features. Shared helpers should not
hide unstructured tasks or retries. Give teams common cancellation, logging, task naming,
and durable-work conventions, then verify them with lifecycle and failure tests.

## References

- [The Swift Programming Language: Tasks and task groups](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Tasks-and-Task-Groups)
- [SE-0304: Structured Concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md)
- [Apple: `Task`](https://developer.apple.com/documentation/swift/task)
- [Apple: `withTaskGroup(of:returning:isolation:body:)`](https://developer.apple.com/documentation/swift/withtaskgroup%28of%3Areturning%3Aisolation%3Abody%3A%29)
