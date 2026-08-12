---
title: "Composition Roots and Object Graphs: Interview Questions"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Composition Roots and Object Graphs"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-injection
  - composition-root
  - object-graph
---

# Composition Roots and Object Graphs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is a composition root?](#q1-what-is-a-composition-root) | Senior | Concrete assembly |
| [How do you construct runtime-created features?](#q2-how-do-you-construct-runtime-created-features) | Senior | Narrow factories |
| [Would you use a DI container in Swift?](#q3-would-you-use-a-di-container-in-swift) | Senior | Tooling trade-offs |

---

<a id="q1-what-is-a-composition-root"></a>
## Q1: What is a composition root?

### Short Answer

It is an application boundary where concrete implementations, configuration, and
lifetimes are selected and assembled. App, session, scene, and feature roots can form
a hierarchy. Feature code receives constructed dependencies and does not resolve them
from the root.

### Expanded Answer

I build longer-lived infrastructure first, then repositories, flow owners, and
feature-scoped presentation objects. Root smoke tests catch missing registrations and
invalid startup configuration.

<a id="q2-how-do-you-construct-runtime-created-features"></a>
## Q2: How do you construct runtime-created features?

### Short Answer

A parent flow receives a narrow feature factory that captures allowed shared services
and creates the feature's short-lived graph. The factory exposes product-specific
creation, not generic `resolve<T>()`, so requirements and return scope remain visible.

### Expanded Answer

The navigation owner retains the created coordinator or model for the feature lifetime.
Providers document whether they return a shared, current-scope, or new instance.

<a id="q3-would-you-use-a-di-container-in-swift"></a>
## Q3: Would you use a DI container in Swift?

### Short Answer

I start with manual construction because Swift's type system makes it explicit and
compiler-checked. I consider generation or a container when measured graph size and
repeated wiring justify the tooling. Container lookup stays inside composition roots.

### Expanded Answer

Factories or generated assembly can remove mechanical repetition while preserving typed
initializers. If a container is used, registration and resolution remain at app, scene,
or feature composition boundaries. Feature code still receives explicit capabilities so
missing dependencies and cycles do not become hidden runtime behavior.

### Trade-offs

Containers reduce repetitive assembly and can support configuration. They can also
hide dependencies, move failures to runtime, complicate debugging, and mask cycles.
