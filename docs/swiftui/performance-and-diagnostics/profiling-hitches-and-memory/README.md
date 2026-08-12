---
title: "Profiling, Hitches, and Memory"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - instruments
  - hitches
  - memory
---

# Profiling, Hitches, and Memory

> Profiling records runtime evidence. A hitch is a visible delay because a frame
> missed its deadline. Memory diagnosis explains allocation and object lifetime.
> Start with one reproducible user symptom and inspect its exact time interval.

## Quick Recall

- Profile optimized, release-like builds on representative hardware and data.
- Separate CPU stalls, excessive updates, rendering cost, I/O, and memory growth.
- Use Time Profiler, SwiftUI Instruments, hangs/hitches, allocations, and memory graph as needed.
- Confirm a retain cycle from ownership paths; do not infer it from high memory alone.
- Fix the measured bottleneck and repeat the same trace to verify improvement.

High CPU, frequent view updates, a hitch, and growing memory are different symptoms.
They can happen together, but each needs its own evidence. Do not call retained memory
a leak until an object outlives its intended owner.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
