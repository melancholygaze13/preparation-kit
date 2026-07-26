---
title: "Instruments, Hangs, Hitches, and Memory: Theory"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Instruments, Hangs, Hitches, and Memory"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-26
---

# Instruments, Hangs, Hitches, and Memory: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Diagnostics are how senior engineers avoid guessing. A good performance answer
starts with a symptom, creates a repeatable scenario, records the right signal,
and changes the smallest thing that explains the measurement.

UIKit symptoms usually fall into four groups:

| Symptom | Likely signal |
|---|---|
| Screen freezes | Main-thread hang or blocked run loop |
| Scroll stutters | Animation hitch, layout, rendering, or cell work |
| Memory climbs forever | Leak, retained screen, cache growth, or large assets |
| Battery or heat rises | CPU, GPU, networking, or wakeup cost |

## Choosing the Tool

Use Time Profiler when CPU time is the question. It shows where threads spend
time. For UIKit responsiveness, start with the main thread and look around the
period where the user saw a pause.

Use Allocations when memory growth is the question. It shows allocation volume
and surviving objects. Use Leaks or the memory graph debugger when you suspect
objects are no longer reachable by product logic but are still retained.

Use animation hitch or Core Animation instruments when the symptom is missed
frames. These tools help separate main-thread work from rendering and compositing
cost.

Use signposts when the app has important flows that are hard to isolate from
system noise. Signposts make traces easier to read because they label product
events, such as opening a feed, applying a snapshot, or rendering search results.

```swift
import os

let signposter = OSSignposter(
    subsystem: "com.example.app",
    category: "Feed"
)

let state = signposter.beginInterval("Apply snapshot")
dataSource.apply(snapshot, animatingDifferences: true) {
    signposter.endInterval("Apply snapshot", state)
}
```

An interval gives a trace a named start and end. Keep names stable and avoid
putting private user data into signpost messages.

## Hangs and Hitches

A hang is sustained unresponsiveness. In UIKit, it often means the main thread is
blocked by synchronous work, lock contention, file I/O, database work, JSON
parsing, image decoding, or waiting for another queue.

A hitch is a delayed frame. The app may still respond, but animation or scrolling
is not smooth. Hitches can come from main-thread work, layout, rendering,
compositing, or memory pressure.

This distinction affects the fix. Moving JSON parsing off the main thread may
fix a hang. It will not fix a cell that triggers expensive shadows or repeated
self-sizing work on every scroll.

## Memory Diagnosis

Memory growth has several causes:

| Cause | What it looks like | Fix direction |
|---|---|---|
| Leak | Old objects survive after their owner should end | Break retaining path |
| Retained screen | View controllers remain after navigation | Inspect ownership graph |
| Cache growth | Memory increases with legitimate cached data | Add limits and eviction |
| Asset size | Few objects use a large amount of memory | Downsample or stream |
| Autorelease spike | Temporary objects accumulate during a loop | Reduce temporary work or add scoped pools when appropriate |

Do not call every memory increase a leak. A cache retaining useful images is not
the same bug as a view controller retained by a closure. The user impact may be
similar, but the fix is different.

## Production Workflow

A disciplined workflow:

1. Define the symptom in user terms.
2. Reproduce it on a realistic device and data set.
3. Record with the narrowest useful instrument.
4. Mark the relevant interaction with signposts if the trace is noisy.
5. Identify the dominant cost or retaining path.
6. Fix one cause.
7. Remeasure the same scenario.

For Staff and Principal roles, diagnostics should become part of release
quality. Useful practices include performance budgets for critical flows,
regression traces for scrolling screens, memory checks for navigation loops, and
shared signpost names for common app phases.

## References

- [Analyzing the performance of your app](https://developer.apple.com/documentation/xcode/analyzing-the-performance-of-your-app)
- [Diagnosing memory, thread, and crash issues early](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early)
- [Improving app responsiveness](https://developer.apple.com/documentation/xcode/improving-app-responsiveness)
- [Logging](https://developer.apple.com/documentation/os/logging)
