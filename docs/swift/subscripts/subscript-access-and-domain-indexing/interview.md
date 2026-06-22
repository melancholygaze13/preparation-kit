---
title: "Subscript Access and Domain Indexing: Interview Questions"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
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

<a id="q2-invalid-index"></a>
## Q2: Should Invalid Indexing Trap or Return an Optional?

### Short Answer

Trap for a programmer-contract violation. Return an optional or throw when
absence or invalid external input is expected during normal operation.
