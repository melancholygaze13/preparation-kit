---
title: "Invalidation and Body Recomputation: Interview Questions"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Invalidation and Body Recomputation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - invalidation
  - body-recomputation
  - observation
---

# Invalidation and Body Recomputation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What happens when SwiftUI state changes?](#q1-what-happens-when-swiftui-state-changes) | Senior | Invalidation and reconciliation |
| [How do you reduce unnecessary updates?](#q2-how-do-you-reduce-unnecessary-updates) | Senior | Dependency scope and identity |
| [Why does identity affect performance and correctness?](#q3-why-does-identity-affect-performance-and-correctness) | Senior | Structural and data identity |
| [How would you diagnose a frequently recomputed screen?](#q4-how-would-you-diagnose-a-frequently-recomputed-screen) | Staff | Evidence-driven analysis |

---

<a id="q1-what-happens-when-swiftui-state-changes"></a>
## Q1: What happens when SwiftUI state changes?

### Short Answer

SwiftUI invalidates views that depend on the changed state, reevaluates their
descriptions, and reconciles the result with retained framework state. A `body` call
does not imply rebuilding or redrawing the entire screen.

### Expanded Answer

The important costs are dependency scope, work performed during evaluation, identity
changes, and the resulting layout or rendering. `body` should therefore be cheap,
deterministic, and free of effects.

I first measure a slow interaction instead of counting body calls in isolation.

<a id="q2-how-do-you-reduce-unnecessary-updates"></a>
## Q2: How do you reduce unnecessary updates?

### Short Answer

I narrow observable reads to the views that need them, keep expensive transforms out
of `body`, pass small inputs to reusable leaves, and preserve stable structure and IDs.
I use equality-based skipping only after profiling shows a benefit.

### Expanded Answer

Duplicating model state locally is not a safe optimization because it creates a
second source of truth. I split meaningful view types and move computation to the
boundary where inputs change.

If a timer invalidates an entire root, I move its read into the small child that
renders it rather than adding cache flags throughout the hierarchy.

<a id="q3-why-does-identity-affect-performance-and-correctness"></a>
## Q3: Why does identity affect performance and correctness?

### Short Answer

SwiftUI uses structural position and explicit IDs to associate new descriptions with
retained state. Unstable IDs or changing view types can make existing content look
new, causing extra replacement, lost state, and incorrect animations.

### Expanded Answer

Collection IDs represent logical entities, not offsets or current display values.
Conditional branches are appropriate for different UI, but when only a modifier value
changes, one stable structure often preserves identity and reduces churn.

Identity fixes should follow semantics. Forcing unrelated screens to share identity
can preserve state that should have reset.

<a id="q4-how-would-you-diagnose-a-frequently-recomputed-screen"></a>
## Q4: How would you diagnose a frequently recomputed screen?

### Short Answer

I reproduce the user symptom, record SwiftUI update causes and CPU samples, identify
the changing dependency, then inspect the work and identity changes downstream. I
optimize the measured cost and rerun the same trace.

### Expanded Answer

Frequent recomputation may be harmless. I look for sorting, formatting, decoding,
allocation, broad observable reads, unstable collection IDs, and layout or animation
work caused by the update.

I add product signposts to align state transitions with the trace and compare on the
same device and data. The result should improve hitch time or interaction latency,
not merely reduce a debug counter.

### Trade-offs

Breaking a view into focused types can narrow dependencies and improve clarity, but
excessive fragmentation adds API and navigation cost. Manual equality can skip work
but risks stale UI when its contract omits an input.
