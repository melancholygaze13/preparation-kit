---
title: "Subscript Access and Domain Indexing: Interview Questions"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-22
---

# Subscript Access and Domain Indexing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

- [When is a subscript better than a method?](#q1-subscript-method)
- [Should invalid indexing trap or return an optional?](#q2-invalid-index)

<a id="q1-subscript-method"></a>
## Q1: When Is a Subscript Better Than a Method?

### Short Answer

Use a subscript for direct, unsurprising indexed access. Use a method when the
operation has policy, side effects, I/O, or cost that the call site should name.

### Expanded Answer

A subscript makes the index relationship concise, as in `matrix[row, column]`.
Because bracket syntax hides the operation name, the type must make the lookup and
its result clear. Use a method such as `loadItem(id:)` when work or failure deserves
an explicit verb.

<a id="q2-invalid-index"></a>
## Q2: Should Invalid Indexing Trap or Return an Optional?

### Short Answer

Trap for a programmer-contract violation. Return an optional or throw when
absence or invalid external input is expected during normal operation.

### Expanded Answer

Array-style out-of-bounds access indicates broken program logic and can trap.
Dictionary lookup returns an optional because a missing key is normal. Do not call
an optional subscript “safe” while silently clamping or wrapping the supplied index.
