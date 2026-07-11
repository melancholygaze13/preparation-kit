---
title: "Constructor and Protocol Injection: Interview Questions"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Constructor and Protocol Injection"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - dependency-injection
  - constructor-injection
  - protocols
---

# Constructor and Protocol Injection: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why prefer constructor injection?](#q1-why-prefer-constructor-injection) | Senior | Visible requirements |
| [Does every dependency need a protocol?](#q2-does-every-dependency-need-a-protocol) | Senior | Proportional abstraction |
| [What does a large initializer tell you?](#q3-what-does-a-large-initializer-tell-you) | Senior | Cohesion and graph design |

---

<a id="q1-why-prefer-constructor-injection"></a>
## Q1: Why prefer constructor injection?

### Short Answer

It makes required collaborators visible, prevents partially configured objects, and
lets Swift initialization guarantee the instance is usable. The composition root owns
concrete construction, while consumers only know their declared capabilities.

### Expanded Answer

Property injection fits framework-created or genuinely optional late dependencies,
but required implicitly unwrapped properties create runtime wiring failures. Method
injection fits context that varies for one operation.

<a id="q2-does-every-dependency-need-a-protocol"></a>
## Q2: Does every dependency need a protocol?

### Short Answer

No. Injection works with concrete types. I use a protocol or closure when it creates a
meaningful consumer boundary, contains volatility, limits capability, or supports real
implementations. A stable concrete value or pure function often needs no abstraction.

### Expanded Answer

Testability does not require mocking every type. Adapter contract tests remain necessary
because a fake can satisfy the Swift signature while violating production behavior.

<a id="q3-what-does-a-large-initializer-tell-you"></a>
## Q3: What does a large initializer tell you?

### Short Answer

It is useful design feedback. The type may own too many responsibilities, or it may
legitimately coordinate a complex feature. I review cohesion and scopes before grouping
dependencies. I do not hide the problem in a global container or universal bag.

### Trade-offs

A scoped dependency group can simplify feature construction. A broad bag hides which
capabilities are actually required and gives the feature access to unrelated services.
