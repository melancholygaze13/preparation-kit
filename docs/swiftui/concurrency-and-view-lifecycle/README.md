---
title: "Concurrency and View Lifecycle"
domain: "SwiftUI"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-23
---

# Concurrency and View Lifecycle

## Learning Path

### Rapid Review

1. [Task Modifier and View Lifetime](task-modifier-and-view-lifetime/README.md)
2. [MainActor and UI State](main-actor-and-ui-state/README.md)
3. [Cancellation, Stale Results, and Races](cancellation-stale-results-and-races/README.md)

### Standard Preparation

Complete rapid review, then study:

4. [Async Loading, Refresh, and Streams](async-loading-refresh-and-streams/README.md)

All four concepts are core. The rapid path covers the minimum model for safe UI
work. Add streams and refresh when the role involves live data, search, feeds, or
long-lived observations.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Task Modifier and View Lifetime](task-modifier-and-view-lifetime/README.md) | Ties asynchronous work to view identity and lifetime. | Core | 15 min |
| [MainActor and UI State](main-actor-and-ui-state/README.md) | Keeps UI state changes in the correct isolation domain. | Core | 15 min |
| [Cancellation, Stale Results, and Races](cancellation-stale-results-and-races/README.md) | Prevents obsolete work from committing UI state. | Core | 16 min |
| [Async Loading, Refresh, and Streams](async-loading-refresh-and-streams/README.md) | Models loading, refresh, and values arriving over time. | Core | 16 min |
