---
title: "Dependency Rule and Use-Case Boundaries: Interview Questions"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Dependency Rule and Use-Case Boundaries"
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
  - clean-architecture
  - dependency-rule
  - use-cases
---

# Dependency Rule and Use-Case Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the dependency rule?](#q1-what-is-the-dependency-rule) | Senior | Source dependency direction |
| [What belongs in a use case?](#q2-what-belongs-in-a-use-case) | Senior | Application policy |
| [When is a use-case layer unnecessary?](#q3-when-is-a-use-case-layer-unnecessary) | Senior | Proportional design |

---

<a id="q1-what-is-the-dependency-rule"></a>
## Q1: What is the dependency rule?

### Short Answer

Source dependencies point toward product policy. UI and infrastructure can depend on
application contracts, but application code does not import concrete UI, database,
HTTP, or vendor types. Runtime calls may go outward through an inward-owned port that
an adapter implements.

### Expanded Answer

Dependency injection alone is not enough. Injecting a concrete HTTP client still makes
the use case know transport concepts. A narrow `OrderSubmitting` port expressed in
domain terms reverses that knowledge, and an outer adapter performs translation.

<a id="q2-what-belongs-in-a-use-case"></a>
## Q2: What belongs in a use case?

### Short Answer

A use case coordinates one meaningful product operation: validating domain input,
calling required ports, applying operation policy, and returning a domain result. It
does not decide layout, endpoint shape, persistence format, or navigation.

### Expanded Answer

Reusable required rules can live in domain values. The use case coordinates them with
external capabilities and operation-level concerns such as idempotency or authorization.
Presentation maps the result into display state.

<a id="q3-when-is-a-use-case-layer-unnecessary"></a>
## Q3: When is a use-case layer unnecessary?

### Short Answer

It is unnecessary when it only forwards one stable call and owns no policy, reuse,
security, transaction, or coordination. A direct injected dependency can be clearer.
I add the boundary when important behavior needs isolation or several callers need the
same operation.

### Expanded Answer

I look for a product decision that deserves a name and independent tests. If the type
only renames an adapter method, it increases navigation and mapping without protecting
policy. The boundary can be introduced later when coordination, reuse, authorization,
or transaction rules appear.

### Trade-offs

Use cases protect policy and provide focused tests, but one type and protocol per
trivial action creates navigation and mapping cost. The architecture should grow at
real change and risk boundaries.
