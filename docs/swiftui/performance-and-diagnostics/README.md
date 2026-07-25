---
title: "Performance and Diagnostics"
domain: "SwiftUI"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-25
---

# Performance and Diagnostics

## Preparation Paths

### Rapid Review

1. [Invalidation and Body Recomputation](invalidation-and-body-recomputation/README.md)
2. [Expensive Work and Caching](expensive-work-and-caching/README.md)
3. [Lazy Containers and Scroll Performance](lazy-containers-and-scroll-performance/README.md)

### Standard Preparation

Complete rapid review, then study:

4. [Profiling, Hitches, and Memory](profiling-hitches-and-memory/README.md)

All four concepts are core. Start with the dependency and identity model before
discussing optimization. Profiling is required for production diagnosis because a
plausible code smell is not evidence of the current bottleneck.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Invalidation and Body Recomputation](invalidation-and-body-recomputation/README.md) | Targets avoidable update propagation and view work. | Core | 18 min |
| [Expensive Work and Caching](expensive-work-and-caching/README.md) | Places computation outside hot rendering paths. | Core | 18 min |
| [Lazy Containers and Scroll Performance](lazy-containers-and-scroll-performance/README.md) | Controls work and memory for large interfaces. | Core | 18 min |
| [Profiling, Hitches, and Memory](profiling-hitches-and-memory/README.md) | Uses evidence to diagnose responsiveness and retention. | Core | 18 min |
