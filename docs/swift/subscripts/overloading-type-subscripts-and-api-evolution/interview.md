---
title: "Overloading, Type Subscripts, and API Evolution: Interview Questions"
domain: "Swift"
topic: "Subscripts"
concept: "Overloading, Type Subscripts, and API Evolution"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-22
---

# Overloading, Type Subscripts, and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

- [When is subscript overloading appropriate?](#q1-overloading)
- [When should you use a type subscript?](#q2-type-subscript)

<a id="q1-overloading"></a>
## Q1: When Is Subscript Overloading Appropriate?

### Short Answer

Use it when each overload represents a distinct, clear index domain. Avoid forms
that depend only on expected return type.

### Expanded Answer

Different argument types or labels make selection visible, such as an integer
position and a labeled domain ID. Adding an overload can make old calls ambiguous,
so test source compatibility for public APIs.

<a id="q2-type-subscript"></a>
## Q2: When Should You Use a Type Subscript?

### Short Answer

Use one for lookup owned by the type rather than an instance. Do not use bracket
syntax to hide global mutable state or expensive effects.

### Expanded Answer

Declare a normal type subscript with `static subscript`. A class can use
`class subscript` only when subclasses should override the lookup. Prefer a named
method when the operation performs I/O or coordinates mutable shared state.
