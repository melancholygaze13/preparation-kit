---
title: "Concurrency and UI Lifecycle"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: draft
last_reviewed: 2026-06-22
---

# Concurrency and UI Lifecycle

## Learning Path

1. [MainActor and UI Thread Confinement](main-actor-and-ui-thread-confinement/README.md)
2. [Async Work, Cancellation, and View Reuse](async-work-cancellation-and-view-reuse/README.md)
3. [Image Loading, Deduplication, and Caching](image-loading-deduplication-and-caching/README.md)
4. [Background Work and Result Ordering](background-work-and-result-ordering/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [MainActor and UI Thread Confinement](main-actor-and-ui-thread-confinement/README.md) | Keeps UIKit access in the correct isolation domain. | Core | 1 min |
| [Async Work, Cancellation, and View Reuse](async-work-cancellation-and-view-reuse/README.md) | Prevents obsolete work from updating recycled or invisible UI. | Core | 1 min |
| [Image Loading, Deduplication, and Caching](image-loading-deduplication-and-caching/README.md) | Coordinates expensive loading across scrolling interfaces. | Core | 1 min |
| [Background Work and Result Ordering](background-work-and-result-ordering/README.md) | Preserves state when asynchronous results complete out of order. | Core | 1 min |
