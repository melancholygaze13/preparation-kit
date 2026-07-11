---
title: "Boundary Models and Data Mapping: Interview Questions"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Boundary Models and Data Mapping"
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
  - clean-architecture
  - data-mapping
  - boundary-models
---

# Boundary Models and Data Mapping: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why not use one model across every layer?](#q1-why-not-use-one-model-across-every-layer) | Senior | Independent meanings |
| [Where should mapping and validation happen?](#q2-where-should-mapping-and-validation-happen) | Senior | Boundary ownership |
| [How do you balance mapping isolation and performance?](#q3-how-do-you-balance-mapping-isolation-and-performance) | Senior | Cost and measurement |

---

<a id="q1-why-not-use-one-model-across-every-layer"></a>
## Q1: Why not use one model across every layer?

### Short Answer

Transport, persistence, domain, and presentation models solve different problems and
often change independently. One shared type spreads optional API fields, storage
annotations, and display concerns through the app. I separate them where meaning or
ownership changes, not mechanically at every call.

### Expanded Answer

A stable value such as a validated identifier can cross boundaries. A server response
with versioned optional fields should not become the domain model. The adapter maps it
into required product meaning and reports invalid data explicitly.

<a id="q2-where-should-mapping-and-validation-happen"></a>
## Q2: Where should mapping and validation happen?

### Short Answer

The adapter that knows the external schema maps and validates it before creating domain
values. Domain constructors enforce rules that must always hold. Presentation later
maps domain outcomes into display state. The domain never imports DTO or record types.

### Expanded Answer

I preserve missing versus null when the API distinguishes them, translate units and
identifiers, and map infrastructure errors into application outcomes. Invalid required
data is not silently replaced with a plausible default.

<a id="q3-how-do-you-balance-mapping-isolation-and-performance"></a>
## Q3: How do you balance mapping isolation and performance?

### Short Answer

I measure representative data first. If mapping matters, I use pagination, focused
projections, lazy conversion, background work, or caching with an invalidation rule.
I do not leak managed objects or DTOs throughout the app based only on assumed cost.

### Trade-offs

Mapping adds allocations and code, while leakage makes every consumer depend on schema
and lifecycle details. The right boundary depends on data size, change rate, ownership,
and the cost of coupling.
