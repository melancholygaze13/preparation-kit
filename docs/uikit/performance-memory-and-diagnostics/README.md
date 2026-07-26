---
title: "Performance, Memory, and Diagnostics"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-26
---

# Performance, Memory, and Diagnostics

UIKit performance work means finding the measured cause of slow frames, hangs,
or memory growth. Interview answers should keep ownership graphs clear, keep
scrolling work small, reduce layout and rendering
cost, and prove claims with measurements before rewriting code.

## Learning Path

### Rapid Review

1. [Retain Cycles, Delegates, and Closure Lifetimes](retain-cycles-delegates-and-closure-lifetimes/README.md)
2. [Scrolling Performance and Cell Configuration](scrolling-performance-and-cell-configuration/README.md)

### Standard Preparation

3. [Layout, Rendering, and Offscreen Cost](layout-rendering-and-offscreen-cost/README.md)
4. [Instruments, Hangs, Hitches, and Memory](instruments-hangs-hitches-and-memory/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Retain Cycles, Delegates, and Closure Lifetimes](retain-cycles-delegates-and-closure-lifetimes/README.md) | Connects UIKit ownership graphs to leaks and delayed teardown. | Core | 13 min |
| [Scrolling Performance and Cell Configuration](scrolling-performance-and-cell-configuration/README.md) | Keeps reuse paths predictable and inexpensive. | Core | 15 min |
| [Layout, Rendering, and Offscreen Cost](layout-rendering-and-offscreen-cost/README.md) | Identifies expensive layout passes and compositing work. | Core | 14 min |
| [Instruments, Hangs, Hitches, and Memory](instruments-hangs-hitches-and-memory/README.md) | Uses measurements to locate responsiveness and retention problems. | Core | 14 min |
