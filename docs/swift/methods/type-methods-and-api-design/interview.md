---
title: "Type Methods and API Design: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Type Methods and API Design: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

- [When should you use a type method?](#q1-type-method)
- [What is the difference between `static` and `class` methods?](#q2-static-class)

<a id="q1-type-method"></a>
## Q1: When Should You Use a Type Method?

### Short Answer

Use one when behavior belongs to the type as a whole, such as a named factory,
parser, preset, or type-level policy.

<a id="q2-static-class"></a>
## Q2: What Is the Difference Between `static` and `class` Methods?

### Short Answer

`static` methods cannot be overridden. A `class` method can be overridden by a
subclass and should be used only when that is part of the API contract.
