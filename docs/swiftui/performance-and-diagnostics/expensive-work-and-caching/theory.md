---
title: "Expensive Work and Caching: Theory"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Expensive Work and Caching"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - expensive-work
  - caching
  - responsiveness
---

# Expensive Work and Caching: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Place work where its inputs change, not where its output happens to be displayed.
View evaluation should read already prepared state and perform small pure composition.

A cache trades memory and invalidation complexity for avoided work. It needs an owner,
key, freshness rule, capacity, concurrency policy, and observability.

## How It Works

### Identify Hot-Path Work

Repeated work commonly hides in view initializers, `body`, row builders, computed
properties, formatters, sorting, filtering, image decoding, and synchronous disk access.

```swift
// Repeats whenever the view evaluates.
List(items.sorted(by: newestFirst)) { item in
    ItemRow(item: item)
}
```

If sorting depends only on item changes, calculate it when those inputs change and
store or expose the result through the model. For small collections, recomputation
may be cheaper and safer than caching. Profile realistic sizes.

Use modern `FormatStyle` APIs directly in `Text` for ordinary date, number, and
currency presentation. Do not create heavyweight formatter objects per row. When a
custom formatter is truly necessary, give it an appropriate stable owner.

### Separate I/O, CPU, and UI Commit

Async I/O suspends while waiting. CPU-heavy decoding, parsing, compression, and image
processing still consume an executor. In Swift 6.2, use an explicitly concurrent,
nonisolated boundary for measured CPU work and return a `Sendable` value. Commit the
small result to the main-actor model.

```text
fetch bytes -> decode/transform -> validate relevance -> commit UI state
```

Do not wrap ordinary networking in `Task.detached`. Detached tasks lose structured
cancellation and isolation context. Design the dependency boundary to perform the
right work on the right executor.

### Derived Data

Derived collections should have one source of truth. Options include:

- compute cheaply on access;
- recompute when source or filter inputs change;
- memoize by immutable inputs;
- ask a repository for indexed or queried results.

Do not put a derived collection in `@State` without explicit synchronization. It can
become stale when source data, locale, permissions, or sort policy changes. If derived
state is stored, centralize its invalidation with every input that determines it.

For search, debounce input to reduce requests, cancel obsolete work, and validate the
query before commit. Debounce is not a cache and does not solve stale-result ordering.

### Cache Design

A useful cache key includes every input that changes the result. An image key may need
resource ID, target pixel size, scale, rendering mode, and content version. An incomplete
key returns incorrect content; an overly specific key destroys reuse.

Define invalidation:

| Rule | Suitable use |
|---|---|
| Immutable content version | Long-lived exact reuse |
| Time-to-live | Data with acceptable bounded staleness |
| Explicit event | Known writes or account changes |
| Memory pressure eviction | Reconstructable in-memory values |
| Capacity or cost limit | Large or numerous entries |

Never rely on cache eviction for correctness. The authoritative store or service
defines truth. A cache miss and an evicted item must be recoverable.

Negative caching can temporarily remember “not found” or a recent failure, but only
when the domain supports it. Use a short explicit lifetime and distinguish permanent
absence from transient failure. Otherwise, a cache can hide newly created content or
prevent recovery after connectivity returns.

### Cache Ownership and Concurrency

Screen-local caching is appropriate for expensive values useful only during one
stable view lifetime. Repository caching fits data reused across screens. Image
pipelines often need a shared memory cache and URL or disk cache with account and
privacy boundaries.

Shared mutable caches require synchronization, often an actor or proven lock-based
implementation. Deduplicate in-flight work so several consumers do not decode or
download the same resource. Define whether one consumer canceling affects shared work.

Avoid retaining feature models, views, or closures in cache values. Cache immutable
results rather than object graphs with UI ownership.

Estimate cost from the retained representation, not only entry count. One decoded
image may cost far more than hundreds of small metadata records. An `NSCache`-style
eviction signal is a resource hint; code must tolerate removal at any time and should
not use it as the sole freshness mechanism.

For persistent caches, write atomically and version the stored representation. Treat
decode failure as a miss and remove corrupt entries. Migration complexity should be
proportional to how expensive the content is to refetch or recompute.

### Images

Large compressed images can expand to substantial decoded memory. Downsample or
resize near the display pixel dimensions before committing them to rows. Loading an
original multi-megapixel image for a thumbnail wastes decode time, memory, and upload cost.

Use placeholders with stable layout to avoid repeated layout shifts. Cancel row-only
requests when identity disappears, while allowing a shared pipeline to continue work
that other consumers still need.

### Prefetching

Prefetch only when traces show latency the user will reach and the cost is bounded.
Aggressive prefetch can compete with visible work, increase memory, waste network and
battery, and worsen scrolling.

The owner should prioritize visible requests, cap concurrency, and stop speculative
work when direction or context changes. Cache hit rate alone is not success if most
prefetched bytes are never displayed.

### Memory and Pressure

Choose count and cost limits from representative devices. Respond to memory pressure
by dropping reconstructable values, not unsaved user data. Avoid two caches storing
the same decoded object at different layers without an ownership reason.

Measure resident memory, allocation churn, cache hit rate, eviction rate, duplicate
work, and latency distribution. A high hit rate with unbounded growth is not healthy.

### Correctness before Optimization

Caches must respect account, authorization, locale, and privacy scope. Clear or
partition values when account or tenant changes. Sensitive content may not be eligible
for disk caching.

Test key completeness and invalidation. Include source updates, locale changes,
memory eviction, concurrent misses, cancellation, and corrupted persisted cache data.

Benchmark cold miss, warm hit, and concurrent miss separately. A cache can improve
average latency while making cold paths slower through serialization or disk lookup.
Tail latency and contention matter for user-visible work.

## Constraints and Guarantees

- SwiftUI may reevaluate view descriptions frequently, so hot-path work must remain cheap.
- `await` does not itself move CPU work to a background executor.
- `@State` provides lifetime storage, not automatic invalidation for derived caches.
- Cache correctness depends on complete keys and explicit freshness policy.
- Eviction timing and memory pressure are not deterministic application contracts.

## Engineering Decisions

| Work | Preferred placement |
|---|---|
| Small display-only expression | View `body` |
| Sort/filter on changing feature data | Model-derived state or query boundary |
| Large CPU transform | Explicit concurrent dependency operation |
| Reused remote entity | Repository cache with freshness policy |
| Thumbnail decode | Image pipeline keyed by target pixel size |
| One-screen expensive object | Stable feature or view-lifetime owner |

## Production Application

Profile before caching, then compare CPU, latency, memory, energy, and correctness
under the same workload. Add metrics at cache boundaries, not per-view ad hoc logs.

At Staff scope, define shared image and data cache contracts, budgets by device class,
privacy rules, and incident dashboards. Prevent every feature from creating a new
unbounded cache while allowing specialized policies where domain semantics differ.

## References

- [Understanding and improving SwiftUI performance](https://developer.apple.com/documentation/swiftui/understanding-and-improving-swiftui-performance)
- [Improve app responsiveness](https://developer.apple.com/documentation/xcode/improving-app-responsiveness)
- [Loading and displaying a large data feed](https://developer.apple.com/documentation/swiftui/loading-and-displaying-a-large-data-feed)
- [Reducing your app's memory use](https://developer.apple.com/documentation/xcode/reducing-your-app-s-memory-use)
