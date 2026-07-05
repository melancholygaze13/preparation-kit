---
title: "Instruments, Hangs, Hitches, and Memory: Interview Questions"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Instruments, Hangs, Hitches, and Memory"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-05
---

# Instruments, Hangs, Hitches, and Memory: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you approach a performance problem in a UIKit app?](#q1-performance-workflow) | Senior | Measurement workflow |
| [Which Instruments template would you use for a slow screen?](#q2-choose-instrument) | Senior | Tool selection |
| [What is the difference between a hang and a hitch?](#q3-hang-vs-hitch) | Senior | Responsiveness diagnosis |
| [How do you tell a leak from cache growth?](#q4-leak-vs-cache) | Staff | Memory judgment |

---

<a id="q1-performance-workflow"></a>
## Q1: How do you approach a performance problem in a UIKit app?

### Short Answer

I define the symptom, reproduce it on a realistic device, record the right
signal, fix the measured cause, and remeasure the same scenario.

### Expanded Answer

I try to avoid starting with a rewrite. If the problem is a scrolling hitch, I
profile the scroll. If the problem is memory growth after navigation, I repeat
the navigation loop and inspect surviving objects.

For noisy flows, I add signposts so the trace lines up with product events. That
makes it easier to explain the result to other engineers and to prevent
regressions later.

---

<a id="q2-choose-instrument"></a>
## Q2: Which Instruments template would you use for a slow screen?

### Short Answer

It depends on the symptom. I use Time Profiler for CPU and main-thread work,
Allocations or Leaks for memory, and animation hitch or Core Animation tools for
frame drops and rendering cost.

### Expanded Answer

For a screen that freezes during load, I would start with Time Profiler and look
for main-thread blocking. For a feed that stutters while scrolling, I would
combine CPU data with hitch or rendering data. For memory growth, I would use
Allocations, Leaks, and the memory graph to inspect surviving objects.

---

<a id="q3-hang-vs-hitch"></a>
## Q3: What is the difference between a hang and a hitch?

### Short Answer

A hang is sustained unresponsiveness, usually because the main thread cannot
process input. A hitch is a delayed frame that makes animation or scrolling look
uneven.

### Expanded Answer

They can share causes, but they are not the same symptom. Synchronous database
work on the main thread may cause a hang. Expensive self-sizing cells or layer
effects may cause hitches during scrolling.

The distinction helps choose the tool and the fix. I would not solve a rendering
hitch by only moving parsing to a background queue.

---

<a id="q4-leak-vs-cache"></a>
## Q4: How do you tell a leak from cache growth?

### Short Answer

A leak keeps objects alive after product logic no longer needs them. Cache growth
keeps objects intentionally, but without enough limits or eviction.

### Expanded Answer

I would repeat the flow and inspect what survives. If old view controllers remain
after dismissal, I look for a retaining path. If image objects remain because a
cache stores them, I inspect cache policy, image size, and eviction behavior.

### Trade-offs

The user may see both as memory pressure, but the fixes differ. A leak needs an
ownership fix. A cache needs sizing, eviction, downsampling, or a policy change.
