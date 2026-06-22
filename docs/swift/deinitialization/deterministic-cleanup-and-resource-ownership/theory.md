---
title: "Deterministic Cleanup and Resource Ownership: Theory"
domain: "Swift"
topic: "Deinitialization"
concept: "Deterministic Cleanup and Resource Ownership"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Deterministic Cleanup and Resource Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Ownership answers who releases; lifecycle protocol answers when and how. ARC answers
only when memory can be reclaimed.

## How It Works

```swift
final class Session {
    private var isClosed = false

    func close() {
        guard !isClosed else { return }
        isClosed = true
        // Synchronously release owned resources.
    }

    deinit { close() }
}
```

For shared concurrent state, put lifecycle behind an actor or audited synchronized
owner. Make shutdown reject new work, cancel or drain in-flight work by policy, release
resources, and publish completion. Do not spawn fire-and-forget cleanup from `deinit`.

### Core Invariants

- One owner controls acquisition and release.
- Cleanup is idempotent and has documented ordering.
- New work cannot race successfully after closure begins.
- Async completion is awaited by the lifecycle coordinator.
- Deinit fallback never hides missing explicit shutdown.

## Engineering Judgment

Use lexical scope for short synchronous resources, explicit close/cancel for long-lived
owners, and structured async shutdown for concurrent systems. Deinit can assert or
best-effort release only what is safe synchronously.

## References

- [The Swift Programming Language: Deinitialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/deinitialization/)
- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
