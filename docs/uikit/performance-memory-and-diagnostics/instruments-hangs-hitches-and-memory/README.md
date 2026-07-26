---
title: "Instruments, Hangs, Hitches, and Memory"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Instruments, Hangs, Hitches, and Memory

> Instruments records CPU, memory, and rendering behavior while the app runs.
> It helps turn "the app feels slow" into a specific main-thread, allocation,
> memory, or rendering problem.

## Quick Recall

- Reproduce on a realistic device before trusting a profile.
- Use Time Profiler for CPU, Allocations and Leaks for memory, and hitch tools
  for responsiveness.
- A hang is long main-thread unresponsiveness; a hitch is a missed or delayed
  frame.
- Memory growth is not always a leak; caches and retained screens need different
  fixes.
- Optimize the measured bottleneck, then remeasure.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
