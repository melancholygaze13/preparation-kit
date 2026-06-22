---
title: "Freestanding and Attached Macro Semantics: Interview Questions"
domain: "Swift"
topic: "Macros"
concept: "Freestanding and Attached Macro Semantics"
page_type: interview
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Freestanding and Attached Macro Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do freestanding and attached macros differ?](#q1-macro-roles) | Senior | Invocation and expansion roles |
| [When is a macro the wrong abstraction?](#q2-macro-selection) | Senior | Alternatives and semantic visibility |

---

<a id="q1-macro-roles"></a>
## Q1: How Do Freestanding and Attached Macros Differ?

### Short Answer

Freestanding macros use `#` and expand as an expression or declarations where invoked.
Attached macros use `@` on an existing declaration and expand under declared roles such
as peer, member, accessor, member-attribute, or extension. Both generate source at
compile time, and the generated code is type-checked normally.

### Expanded Answer

The macro declaration publishes signature, roles, and generated-name constraints; a
plugin supplies implementation. Role and name declarations let tools and reviewers
reason about what the macro may introduce before running it.

### Trade-offs

- Freestanding syntax makes generation explicit at a location.
- Attached roles colocate policy with a declaration but can hide a larger surface.
- Generated-name constraints reduce collision risk while limiting flexibility.

### Example

A member macro generates an initializer whose name collides with a handwritten one.
The declared name contract, collision diagnostic, and expansion test catch it before adoption.

---

<a id="q2-macro-selection"></a>
## Q2: When Is a Macro the Wrong Abstraction?

### Short Answer

A macro is wrong when a function, generic, protocol, property wrapper, or small amount
of handwritten code expresses the behavior clearly; when behavior is fundamentally
runtime policy; or when expansion hides ownership and effects. Use macros for stable,
repetitive compile-time structure with meaningful correctness leverage.

### Expanded Answer

Macros add compiler-plugin dependencies, debugging through expansion, build cost, and
generated API evolution. Removing ten obvious lines rarely justifies that platform cost.

### Trade-offs

- Macros eliminate repetitive structural code.
- Language abstractions remain visible and easier to debug.
- Generated code can enforce conventions but centralizes maintenance risk.

### Example

A macro wraps one logging call but adds a plugin to every target. A function provides
the same semantics without build integration or hidden expansion.
