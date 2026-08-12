---
title: "Type Methods and API Design: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
---

# Type Methods and API Design: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use a type method?](#q1-type-method) | Senior | Type-owned behavior |
| [What is the difference between `static` and `class` methods?](#q2-static-class) | Senior | Overridability |

---

<a id="q1-type-method"></a>
## Q1: When Should You Use a Type Method?

### Short Answer

Use one when behavior belongs to the type as a whole, such as a named factory,
parser, preset, or type-level policy.

### Expanded Answer

Call a type method on the type name rather than an instance. Prefer an initializer
for ordinary construction. A named type method is useful when the construction or
conversion policy needs a clear name, such as `URL(string:)` versus a domain parser
that returns a specific validation result.

<a id="q2-static-class"></a>
## Q2: What Is the Difference Between `static` and `class` Methods?

### Short Answer

`static` methods cannot be overridden. A `class` method can be overridden by a
subclass and should be used only when that is part of the API contract.

### Expanded Answer

Structures, enumerations, and classes support `static` methods. Only classes support
the `class` modifier. Making a method overridable adds a behavioral contract for
subclasses, so `static` is the simpler default when dynamic dispatch is unnecessary.
