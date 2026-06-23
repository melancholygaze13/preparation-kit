---
title: "Expensive Work and Caching: Interview Questions"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Expensive Work and Caching"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - expensive-work
  - caching
  - responsiveness
---

# Expensive Work and Caching: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What work should stay out of body?](#q1-what-work-should-stay-out-of-body) | Senior | Hot rendering paths |
| [When should derived data be cached?](#q2-when-should-derived-data-be-cached) | Senior | Invalidation and trade-offs |
| [How would you optimize image-heavy rows?](#q3-how-would-you-optimize-image-heavy-rows) | Senior | Decode, sizing, and lifetime |
| [How would you design a shared cache?](#q4-how-would-you-design-a-shared-cache) | Staff | Ownership and policy |

---

<a id="q1-what-work-should-stay-out-of-body"></a>
## Q1: What work should stay out of body?

### Short Answer

I/O, state mutation, task creation, decoding, and repeated expensive transforms such
as large sorts or filters. `body` should cheaply compose prepared values because
SwiftUI can reevaluate it frequently.

### Expanded Answer

I move work to the point where its inputs change: an async model operation, repository
query, or derived-state calculation. Small pure display expressions remain in the view.

View initializers follow the same rule. Networking uses `.task`; CPU-heavy transforms
use an explicitly suitable concurrency boundary and return a small value for UI commit.

<a id="q2-when-should-derived-data-be-cached"></a>
## Q2: When should derived data be cached?

### Short Answer

After profiling shows meaningful repeated cost and the inputs, invalidation, lifetime,
and memory policy are clear. For small collections, recomputing may be safer and faster
than maintaining another stored value.

### Expanded Answer

A cached result needs a complete key and every determining input: source data, filter,
sort, locale, permissions, and content version as applicable. I avoid copying derived
collections into `@State` without one owner updating them.

I verify both latency improvement and correctness after source changes and eviction.

<a id="q3-how-would-you-optimize-image-heavy-rows"></a>
## Q3: How would you optimize image-heavy rows?

### Short Answer

I measure download, decode, resize, memory, and rendering separately. I downsample near
display pixel size, bound concurrent work, use stable row identity, cancel obsolete
requests, and cache decoded results with cost and privacy limits.

### Expanded Answer

Compressed byte size does not represent decoded memory. Original images used as tiny
thumbnails can create main-thread stalls and memory pressure. A shared image pipeline
deduplicates requests and keys variants by resource and target size.

Placeholders reserve stable layout. Visible requests outrank prefetch, and speculative
work stops when it is no longer likely to be used.

<a id="q4-how-would-you-design-a-shared-cache"></a>
## Q4: How would you design a shared cache?

### Short Answer

I define authoritative source, key, freshness, capacity or cost, eviction, concurrency,
account scope, cancellation, and observability. The cache owns immutable results and
deduplicates in-flight work; features consume a documented repository contract.

### Expanded Answer

Memory and disk layers can have different privacy and persistence policies. Shared
mutable state needs synchronization. One consumer canceling does not automatically
cancel work needed by others.

Metrics cover hit and miss latency, evictions, duplicate work, memory cost, stale
responses, and unused prefetch. Tests cover concurrent misses, account changes,
invalidation, pressure eviction, and corruption.

### Trade-offs

Central caches improve reuse and consistency but can become contention and memory
hotspots. Feature-local caches permit specialized semantics but duplicate resources.
Share infrastructure where behavior is genuinely common and keep domain freshness local.
