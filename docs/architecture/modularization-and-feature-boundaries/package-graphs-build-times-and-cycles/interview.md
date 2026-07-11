---
title: "Package Graphs, Build Times, and Cycles: Interview Questions"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Package Graphs, Build Times, and Cycles"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-11
tags:
  - modularization
  - build-performance
  - dependency-graphs
---

# Package Graphs, Build Times, and Cycles: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Does modularization improve build time?](#q1-does-modularization-improve-build-time) | Senior | Measurement and graph shape |
| [How do you break a module cycle?](#q2-how-do-you-break-a-module-cycle) | Senior | Ownership and direction |
| [How would you govern a large package graph?](#q3-how-would-you-govern-a-large-package-graph) | Staff | Tooling and budgets |

---

<a id="q1-does-modularization-improve-build-time"></a>
## Q1: Does modularization improve build time?

### Short Answer

It can, by shrinking invalidation regions and enabling parallel or cached work, but
extra targets also add module, scheduling, and linking cost. I measure clean, leaf
incremental, shared-interface, test, indexing, and CI workflows before and after.

### Expanded Answer

Graph shape matters more than target count. Long chains serialize work, and changes
to high-fan-in modules rebuild many consumers. I use Xcode timing summaries with fixed
hardware, configuration, and representative edits.

<a id="q2-how-do-you-break-a-module-cycle"></a>
## Q2: How do you break a module cycle?

### Short Answer

I identify the shared policy or interaction and give it one owner. I might extract a
narrow capability, invert a dependency through a consumer-owned interface, or let a
parent coordinate both features. I do not hide the cycle with service lookup.

### Expanded Answer

Moving both modules wholesale into `Common` usually creates a dependency hub. The new
boundary should contain only the fact or capability that genuinely belongs together.

<a id="q3-how-would-you-govern-a-large-package-graph"></a>
## Q3: How would you govern a large package graph?

### Short Answer

I define allowed dependency directions, reject cycles automatically, track critical
paths and fan-in, and assign owners to shared APIs. Teams get graph visualization,
templates, and exception workflows. Success is developer wait time and change safety,
not module count.

### Expanded Answer

I keep high-fan-in interfaces small, review transitive external dependencies, and
prefer local same-repository packages unless independent distribution is required.
Build budgets cover representative local and CI workflows.
