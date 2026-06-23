---
title: "Profiling, Hitches, and Memory: Interview Questions"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Profiling, Hitches, and Memory"
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
  - instruments
  - hitches
  - memory
---

# Profiling, Hitches, and Memory: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you investigate a slow SwiftUI screen?](#q1-how-would-you-investigate-a-slow-swiftui-screen) | Senior | Reproduction and evidence |
| [How do you diagnose a scrolling hitch?](#q2-how-do-you-diagnose-a-scrolling-hitch) | Senior | Frame-stage correlation |
| [How do you distinguish high memory from a leak?](#q3-how-do-you-distinguish-high-memory-from-a-leak) | Senior | Lifetime and allocation evidence |
| [How would you prevent performance regressions across teams?](#q4-how-would-you-prevent-performance-regressions-across-teams) | Staff | Budgets and observability |

---

<a id="q1-how-would-you-investigate-a-slow-swiftui-screen"></a>
## Q1: How would you investigate a slow SwiftUI screen?

### Short Answer

I define a reproducible user interaction, profile an optimized build on representative
hardware, add signposts, and select tools for the symptom. I identify the measured
call stack or update cause, change one factor, then repeat the same trace.

### Expanded Answer

Time Profiler locates CPU work, SwiftUI instrumentation explains update dependencies,
and hangs or hitch timelines isolate unresponsive intervals. I also inspect I/O,
allocation, and rendering when CPU alone does not explain the symptom.

I compare user-visible latency or hitch duration, not a debug body-call counter.

<a id="q2-how-do-you-diagnose-a-scrolling-hitch"></a>
## Q2: How do you diagnose a scrolling hitch?

### Short Answer

I record the missed-frame interval and correlate it with main-thread samples, SwiftUI
updates, layout, image decode, allocations, and rendering. The fix depends on which
stage exceeded the frame budget.

### Expanded Answer

If image decoding appears on the main thread, I downsample and prepare it earlier. If
state invalidates many rows, I narrow dependencies or batch events. If CPU is low but
visual effects dominate, I reduce compositing area or effect complexity.

I test real data, rapid scroll, Dynamic Type, and target devices in release-like builds.

<a id="q3-how-do-you-distinguish-high-memory-from-a-leak"></a>
## Q3: How do you distinguish high memory from a leak?

### Short Answer

I establish expected lifetime, mark an allocation generation, perform and close the
flow, then inspect surviving objects and ownership paths. I also separate bounded
working set and cache growth from objects that can no longer be released.

### Expanded Answer

Repeated navigation that retains another model each time suggests a lifetime defect.
A one-time decoded image peak may be high working set. An unbounded cache is not a
retain cycle but is still a memory bug.

I inspect tasks, streams, observers, timers, callbacks, navigation state, and caches.
I fix ownership rather than adding weak captures mechanically.

<a id="q4-how-would-you-prevent-performance-regressions-across-teams"></a>
## Q4: How would you prevent performance regressions across teams?

### Short Answer

I define user-centered budgets and representative device scenarios, provide shared
signposts and profiling guidance, automate stable critical benchmarks, and monitor
production hangs, hitches, memory terminations, and latency by version.

### Expanded Answer

Budgets cover tail latency and memory high-water marks, not only averages. Feature
owners investigate regressions with before-and-after traces. Platform teams own shared
image pipelines, instrumentation, and dashboards.

Exceptions require evidence and an owner. Production telemetry identifies affected
segments; local traces explain the cause. We verify that fixes do not shift cost to
energy, memory, or correctness.

### Trade-offs

Frequent device benchmarks cost time and can be noisy. Run a small stable suite on
critical paths continuously and broader hardware coverage on a scheduled cadence.
