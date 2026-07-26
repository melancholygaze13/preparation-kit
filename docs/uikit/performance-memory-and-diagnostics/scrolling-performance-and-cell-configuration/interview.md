---
title: "Scrolling Performance and Cell Configuration: Interview Questions"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Scrolling Performance and Cell Configuration"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Scrolling Performance and Cell Configuration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What makes a table view or collection view scroll smoothly?](#q1-smooth-scrolling) | Senior | Main-thread cost |
| [What belongs in `prepareForReuse`?](#q2-prepare-for-reuse) | Senior | Reuse correctness |
| [How do you prevent wrong images in reused cells?](#q3-wrong-images) | Senior | Async result ordering |
| [How would you investigate a feed that hitches while scrolling?](#q4-investigate-feed-hitches) | Staff | Measurement and prioritization |

---

<a id="q1-smooth-scrolling"></a>
## Q1: What makes a table view or collection view scroll smoothly?

### Short Answer

Visible-cell work must be cheap. Cell configuration should bind prepared model
state to views, while loading, decoding, expensive formatting, and heavy layout
work happen outside the critical scroll path.

### Expanded Answer

UIKit asks for cells while handling input and rendering. If `cellForRowAt`, a
cell registration, or layout delegate method blocks, the list can miss frames.

I would keep configuration synchronous and small, reuse cells correctly, cache
images at the right size, and use prefetching only for cancellable work. Then I
would verify the result with Time Profiler or animation hitch data.

---

<a id="q2-prepare-for-reuse"></a>
## Q2: What belongs in `prepareForReuse`?

### Short Answer

`prepareForReuse` should cancel work and clear non-content or temporary resources,
such as identity tokens, callbacks, animations, and temporary visual state. The
configure method should set all normal text, images, loading presentation, and
selection-derived UI for the next model.

### Expanded Answer

It should not rebuild the whole view hierarchy. Constraints and subviews should
usually be created once. Reuse should reset state and cancel obsolete async work.

After reuse, configuration applies the new model. That split keeps old data from
flashing and prevents async work from updating a cell that now represents a
different item.

---

<a id="q3-wrong-images"></a>
## Q3: How do you prevent wrong images in reused cells?

### Short Answer

Cancel the old request on reuse and check the represented model identity before
setting the image. Cancellation alone is not enough because completion can race
with reuse.

### Expanded Answer

I store the model identifier on the cell or in the configuration state. When the
image request completes, I only apply the result if the cell still represents
that identifier. I also use a placeholder so reused content does not show stale
images while the new request is pending.

For a larger app, I would centralize image loading with deduplication,
downsampling, memory limits, and cancellation support.

---

<a id="q4-investigate-feed-hitches"></a>
## Q4: How would you investigate a feed that hitches while scrolling?

### Short Answer

I would reproduce the hitch on a realistic device, record scrolling with
profiling tools, and look for main-thread work around cell creation, binding,
layout, image decoding, and rendering.

### Expanded Answer

I would start with Time Profiler and animation hitch or Core Animation data. If
new cells are expensive, I inspect configuration. If layout dominates, I inspect
constraint churn and self-sizing. If memory spikes, I inspect image size and
cache behavior.

The fix should target the measured cost. For example, precomputing display
models helps formatting cost, but it does not fix offscreen rendering or full
size image memory.
