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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - instruments
  - hitches
  - memory
---

# Profiling, Hitches, and Memory

> Start from a reproducible user symptom, record the relevant time interval, and
> correlate SwiftUI updates with main-thread work, rendering, allocation, and lifetime evidence.

## Quick Recall

- Profile optimized, release-like builds on representative hardware and data.
- Separate CPU stalls, excessive updates, rendering cost, I/O, and memory growth.
- Use Time Profiler, SwiftUI Instruments, hangs/hitches, allocations, and memory graph as needed.
- Confirm a retain cycle from ownership paths; do not infer it from high memory alone.
- Fix the measured bottleneck and repeat the same trace to verify improvement.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
