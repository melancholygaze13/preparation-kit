---
title: "Type Safety and Type Inference: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Type Safety and Type Inference"
page_type: interview
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Type Safety and Type Inference: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Does type inference make Swift dynamically typed?](#q1-does-inference-make-swift-dynamic) | Senior | Static typing |
| [When does inference become ambiguous?](#q2-when-does-inference-become-ambiguous) | Senior | Compiler context |
| [When should you write an explicit type?](#q3-when-should-you-write-an-explicit-type) | Senior | API clarity |

---

<a id="q1-does-inference-make-swift-dynamic"></a>
## Q1: Does Type Inference Make Swift Dynamically Typed?

### Short Answer

No. The compiler still gives every expression a static type and checks it at
compile time. Inference only lets the compiler fill in omitted annotations.

---

<a id="q2-when-does-inference-become-ambiguous"></a>
## Q2: When Does Inference Become Ambiguous?

### Short Answer

Common cases include overloaded functions, empty collections, `nil` without an
expected optional type, complex generic relationships, and unclear closures.

### Expanded Answer

Add a parameter, result, or receiving-variable annotation at the smallest point
that identifies the intended type.

---

<a id="q3-when-should-you-write-an-explicit-type"></a>
## Q3: When Should You Write an Explicit Type?

### Short Answer

Use one when representation is important, inference is ambiguous, or a public
boundary should make its contract clear. Avoid annotations that only add noise.
