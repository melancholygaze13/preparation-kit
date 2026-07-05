---
title: "Concurrency and UI Lifecycle"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-05
---

# Concurrency and UI Lifecycle

UIKit concurrency questions are usually lifecycle questions. A strong answer
keeps UI updates on the main actor, cancels obsolete work, and rejects stale
results before rendering.

## Learning Path

### Rapid Review

1. [MainActor and UI Thread Confinement](main-actor-and-ui-thread-confinement/README.md)
2. [Async Work, Cancellation, and View Reuse](async-work-cancellation-and-view-reuse/README.md)

### Standard Preparation

3. [Image Loading, Deduplication, and Caching](image-loading-deduplication-and-caching/README.md)
4. [Background Work and Result Ordering](background-work-and-result-ordering/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [MainActor and UI Thread Confinement](main-actor-and-ui-thread-confinement/README.md) | Keeps UIKit access in the correct isolation domain. | Core | 12 min |
| [Async Work, Cancellation, and View Reuse](async-work-cancellation-and-view-reuse/README.md) | Prevents obsolete work from updating recycled or invisible UI. | Core | 13 min |
| [Image Loading, Deduplication, and Caching](image-loading-deduplication-and-caching/README.md) | Coordinates expensive loading across scrolling interfaces. | Core | 14 min |
| [Background Work and Result Ordering](background-work-and-result-ordering/README.md) | Preserves state when asynchronous results complete out of order. | Core | 13 min |
