---
title: "Lazy Containers and Scroll Performance: Theory"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Lazy Containers and Scroll Performance"
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
  - lazy-containers
  - scrolling
  - list-identity
---

# Lazy Containers and Scroll Performance: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Lazy containers defer creating child descriptions until needed near the visible
region. They reduce eager work for large data, but do not make expensive rows, unstable
identity, oversized images, or unbounded tasks cheap.

Smooth scrolling is a frame-budget problem. Each frame competes for main-actor work,
layout, display preparation, image decoding, rendering, and memory bandwidth.

## How It Works

### Choose the Container

Use `VStack` or `HStack` when child counts are small and eager sizing is useful. Use
`LazyVStack` or `LazyHStack` inside a scroll view for large custom layouts. Use `List`
when platform list behavior, selection, editing, accessibility, and efficient row
management match the product.

Lazy is not always faster. It adds deferred measurement and lifetime behavior. For a
short settings screen, an eager stack can be simpler and entirely adequate.

### Stable Collection Identity

Rows need stable, unique IDs from the domain model:

```swift
List(items) { item in
    ItemRow(item: item)
}
```

Avoid offsets as identity when insertion, deletion, sorting, or filtering can change
positions. Avoid generating a new UUID during rendering. Unstable identity resets row
state, breaks animation association, and can make small changes look like full replacement.

Apply filtering and sorting before the row builder. Inline transforms may repeat and
can obscure identity or complexity:

```swift
List(model.visibleItems) { item in
    ItemRow(item: item)
}
```

The model keeps `visibleItems` synchronized with source and filter inputs.

### Keep Rows Cheap

A row should compose prepared values. Avoid synchronous file access, parsing, image
decoding, expensive date formatting, broad geometry readers, and nested unbounded
collections in its initializer or `body`.

Extract a dedicated row `View` rather than a large computed property on the parent.
This clarifies dependencies and gives SwiftUI a focused type boundary. Pass only the
values and actions the row requires when it is reusable.

Variable-height content is valid, but unpredictable measurement can increase work.
Use text and adaptive layout correctly rather than forcing fixed heights that break
Dynamic Type. Reserve known image aspect ratios to reduce layout changes as content loads.

Accessibility changes the workload and remains part of correctness. Large text can
increase wrapping and row height, VoiceOver can traverse elements beyond the currently
visible focus, and Reduce Motion changes animation policy. Optimize the adaptive
design rather than shipping a fast fixed-size layout that loses content.

### Images and Media

Decode and resize images near their display pixel size. Perform measured CPU-heavy
work outside the main actor and commit prepared images. A shared pipeline can cache
variants and deduplicate in-flight requests.

Row disappearance should cancel work useful only to that row identity. A shared
download needed by another consumer may continue under the pipeline's ownership.
Never start an unlimited detached task from every row.

Video previews, animated images, materials, shadows, masks, and compositing effects
can dominate rendering even if row construction is cheap. Profile the actual visual
design on target hardware.

### Pagination

Trigger pagination from model state and a stable threshold, not from every row's
uncoordinated appearance callback. The model prevents duplicate pages, records the
cursor, exposes progress and retry, and rejects stale responses.

A sentinel view can request the next page through `.task(id: cursor)`. The repository
or model coalesces calls because lazy appearance can repeat. Page sizes and prefetch
distance should be tuned to latency, memory, and user scroll speed.

Preserve existing rows during pagination failure and show a retry near the boundary.
Do not replace the entire feed with an error for one failed next page.

### Programmatic Scrolling

Scroll targets require stable IDs. Large immediate jumps can force construction or
measurement of intermediate layout depending on container behavior. If a deep link
targets unloaded data, load and identify the target before issuing the scroll request.

Avoid writing scroll position back into broad app state on every pixel change. Store
semantic position only when restoration or product behavior needs it, and throttle
expensive downstream work.

### Prefetch and Back Pressure

Prefetch can hide network or decode latency but must be bounded. Give visible work
priority, limit concurrent operations, cancel low-value speculation, and measure the
fraction of prefetched content actually displayed.

An async stream or event callback that updates many rows faster than frames can render
needs coalescing. Apply batches or latest-value semantics where the domain permits.
Do not enqueue unbounded main-actor changes.

Batch insertion should preserve stable order and IDs. Replacing the entire array for
one changed status can be acceptable with efficient observation, but rebuilding every
row's expensive derived input is not. Normalize updates in the model and project the
small values each row needs.

### Layout and Rendering

Nested stacks, preferences, geometry measurements, and custom layouts may cause
multiple measurement passes. This is not inherently wrong. Keep layout calculations
cheap and free of effects, then profile problematic rows.

Offscreen rendering, large blur regions, multiple shadows, clipping, and alpha
compositing can increase GPU or render-server work. Simplify the measured effect or
reduce its area; do not assume CPU optimization solves a rendering bottleneck.

### Resource Lifetime

Lazy creation does not promise immediate destruction of every offscreen child. Do not
use row destruction as a deterministic cache eviction signal. Large resources belong
to a cache with cost limits and memory-pressure behavior.

Be careful with nested scrolling containers. Competing gestures, unbounded proposed
sizes, and independently lazy children can create confusing measurement and interaction.
Prefer one clear scroll owner unless horizontal sections or another product requirement
justifies nesting, then test focus and accessibility navigation as well as touch.

Tasks, observers, and streams need explicit lifetime ownership. A row-local `.task`
fits row-only data. A list-wide live feed belongs to the list model or repository.

### Diagnosis

Profile release-like builds with realistic item counts, long localized text, dynamic
type, real images, rapid scrolling, pagination, and updates. Correlate hitches with:

- main-thread samples;
- SwiftUI update and identity activity;
- image decode and allocation spikes;
- layout and rendering work;
- network callbacks and model updates.

Change one suspected cause and repeat the same gesture. Simulator results can help
functional diagnosis but do not replace device performance evidence.

## Constraints and Guarantees

- Lazy containers defer work but do not guarantee a precise creation or destruction distance.
- Stable IDs represent logical entities across collection mutations.
- Row appearance can occur repeatedly and is not an exactly-once pagination event.
- Main-actor, layout, rendering, and memory costs can independently cause scroll hitches.
- Fixed row dimensions can improve predictability only when content and accessibility allow them.

## Engineering Decisions

| Symptom | First investigation |
|---|---|
| Slow initial creation | Container choice and eager child work |
| Hitch when images appear | Decode size, executor, caching, and layout shift |
| State jumps between rows | Stable and unique IDs |
| Duplicate page requests | Central pagination state and coalescing |
| Growing memory while scrolling | Image/resource cache and retained tasks |
| GPU-heavy scrolling | Effects, compositing area, and overdraw |

## Production Application

Define representative scroll benchmarks and device tiers. Track hitch duration,
frame pacing, time to useful content, memory high-water mark, image cache behavior,
and pagination latency.

At Staff scope, provide a shared image pipeline, pagination contract, diagnostics,
and performance budgets. Avoid prescribing one container for every screen; choose
based on semantics and validate against measured workloads.

## References

- [Creating performant scrollable stacks](https://developer.apple.com/documentation/swiftui/creating-performant-scrollable-stacks)
- [Loading and displaying a large data feed](https://developer.apple.com/documentation/swiftui/loading-and-displaying-a-large-data-feed)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
- [Analyze hangs with Instruments](https://developer.apple.com/videos/play/wwdc2023/10248/)
