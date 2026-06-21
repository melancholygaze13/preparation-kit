---
title: "Freestanding and Attached Macro Semantics: Interview Questions"
domain: "Swift"
topic: "Macros"
concept: "Freestanding and Attached Macro Semantics"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Understanding of use-site syntax and expansion contracts.

### Short Answer

Freestanding macros use `#` and expand as an expression or declarations where invoked.
Attached macros use `@` on an existing declaration and expand under declared roles such
as peer, member, accessor, member-attribute, or extension. Both generate source at
compile time, and the generated code is type-checked normally.

### Detailed Answer

The macro declaration publishes signature, roles, and generated-name constraints; a
plugin supplies implementation. Role and name declarations let tools and reviewers
reason about what the macro may introduce before running it.

### Engineering Trade-offs

- Freestanding syntax makes generation explicit at a location.
- Attached roles colocate policy with a declaration but can hide a larger surface.
- Generated-name constraints reduce collision risk while limiting flexibility.

### Production Scenario

A member macro generates an initializer whose name collides with a handwritten one.
The declared name contract, collision diagnostic, and expansion test catch it before adoption.

### Follow-up Questions

- What does the compiler type-check?
- Why declare generated names?
- Can a macro implement runtime policy?

### Strong Answer Signals

- Distinguishes `#` and `@` roles.
- Treats expansion as real source/API.
- Includes name and collision contracts.

### Weak Answer Signals

- Calls macros runtime reflection.
- Assumes expansion bypasses type checking.
- Ignores generated declarations.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-macro-selection"></a>
## Q2: When Is a Macro the Wrong Abstraction?

### What It Evaluates

Judgment about compile-time generation versus normal language tools.

### Short Answer

A macro is wrong when a function, generic, protocol, property wrapper, or small amount
of handwritten code expresses the behavior clearly; when behavior is fundamentally
runtime policy; or when expansion hides ownership and effects. Use macros for stable,
repetitive compile-time structure with meaningful correctness leverage.

### Detailed Answer

Macros add compiler-plugin dependencies, debugging through expansion, build cost, and
generated API evolution. Removing ten obvious lines rarely justifies that platform cost.

### Engineering Trade-offs

- Macros eliminate repetitive structural code.
- Language abstractions remain visible and easier to debug.
- Generated code can enforce conventions but centralizes maintenance risk.

### Production Scenario

A macro wraps one logging call but adds a plugin to every target. A function provides
the same semantics without build integration or hidden expansion.

### Follow-up Questions

- When is a property wrapper preferable?
- How would you quantify leverage?
- Which business logic should remain visible?

### Strong Answer Signals

- Compares concrete alternatives.
- Includes build and debugging cost.
- Requires stable structural repetition.

### Weak Answer Signals

- Uses macros for shorter syntax alone.
- Hides I/O or ownership in expansion.
- Ignores dependency cost.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
