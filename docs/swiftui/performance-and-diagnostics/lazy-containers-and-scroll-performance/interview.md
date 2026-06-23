---
title: "Lazy Containers and Scroll Performance: Interview Questions"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Lazy Containers and Scroll Performance"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - lazy-containers
  - scrolling
  - list-identity
---

# Lazy Containers and Scroll Performance: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you use a lazy stack or List?](#q1-when-do-you-use-a-lazy-stack-or-list) | Senior | Container selection |
| [What commonly causes scrolling hitches?](#q2-what-commonly-causes-scrolling-hitches) | Senior | Frame-budget diagnosis |
| [How would you implement pagination?](#q3-how-would-you-implement-pagination) | Senior | Idempotent loading |
| [How would you set a scrolling performance standard?](#q4-how-would-you-set-a-scrolling-performance-standard) | Staff | Benchmarks and platform policy |

---

<a id="q1-when-do-you-use-a-lazy-stack-or-list"></a>
## Q1: When do you use a lazy stack or List?

### Short Answer

I use eager stacks for small content, lazy stacks for large custom scroll layouts,
and `List` when platform list behavior, editing, selection, and accessibility fit.
Laziness defers child creation but does not fix expensive rows.

### Expanded Answer

I validate with realistic item counts and interactions. The data uses stable entity
IDs, and transformation occurs outside row builders. A short settings screen usually
does not benefit from lazy complexity.

Container choice follows product semantics first, then measured performance.

<a id="q2-what-commonly-causes-scrolling-hitches"></a>
## Q2: What commonly causes scrolling hitches?

### Short Answer

Main-thread transforms, image decode, unstable IDs, broad updates, expensive layout,
allocation spikes, synchronous I/O, and rendering effects can all exceed the frame
budget. I record a trace to identify which resource is responsible.

### Expanded Answer

Rows should compose prepared values. Images are downsampled near display size and
cached with limits. Visible work has priority and tasks are bounded.

I profile device, release-like code, real data, Dynamic Type, pagination, and updates.
A CPU optimization will not fix a blur or compositing bottleneck, so I separate stages.

<a id="q3-how-would-you-implement-pagination"></a>
## Q3: How would you implement pagination?

### Short Answer

The model owns cursor, phase, deduplication, cancellation, and retry. A stable sentinel
near the end requests the next page, but the operation is idempotent because lazy
appearance can repeat.

### Expanded Answer

Existing content remains visible during page load and failure. The model rejects
stale responses and merges entities by stable identity. Prefetch distance and page
size balance latency, memory, network, and scroll speed.

I avoid starting independent requests from many rows. One feature operation gives
clear progress and observability.

<a id="q4-how-would-you-set-a-scrolling-performance-standard"></a>
## Q4: How would you set a scrolling performance standard?

### Short Answer

I define representative feeds, device tiers, data and image sizes, scripted gestures,
and metrics for hitches, frame pacing, memory, and load latency. Teams compare traces
before and after changes in release-like builds.

### Expanded Answer

The platform supplies a shared image pipeline, pagination contract, signposts, and
profiling playbook. Feature teams retain domain-specific layout and freshness policy.

CI can catch large regressions with repeatable benchmarks, while device labs and
production telemetry validate variability. Thresholds distinguish launch, steady
scroll, pagination, and live-update scenarios.

### Trade-offs

Strict universal targets can ignore older devices and feature complexity. Per-feature
exceptions are necessary, but they need evidence, ownership, and a plan rather than
silently accepting degradation.
