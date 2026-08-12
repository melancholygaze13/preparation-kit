---
title: "Domain, Transport, and Persistence Mapping: Interview Questions"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Domain, Transport, and Persistence Mapping"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - data-mapping
  - domain-models
  - schema-evolution
---

# Domain, Transport, and Persistence Mapping: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why separate DTO, persistence, and domain models?](#q1-why-separate-dto-persistence-and-domain-models) | Senior | Change boundaries |
| [Where should validation and mapping happen?](#q2-where-should-validation-and-mapping-happen) | Senior | Boundary ownership |
| [How do you evolve schemas safely?](#q3-how-do-you-evolve-schemas-safely) | Staff | Compatibility and migration |

---

<a id="q1-why-separate-dto-persistence-and-domain-models"></a>
## Q1: Why separate DTO, persistence, and domain models?

### Short Answer

They serve different contracts and change for different reasons. DTOs match wire shape,
persistence records support local queries and migrations, and domain values support valid
product decisions. Mapping prevents one external schema from controlling all three.

### Expanded Answer

The mapper is where optional wire fields, storage metadata, units, and identifiers become
validated product meaning. Domain code then works without transport or database lifecycle
rules. I reuse a type across boundaries only when its meaning and evolution truly match,
not merely because its fields look similar today.

### Trade-offs

Separate types add code and allocations. I use them when nullability, metadata, lifetime,
or evolution differs. For a small stable value that truly matches every boundary, one
type may be proportional until those reasons diverge.

<a id="q2-where-should-validation-and-mapping-happen"></a>
## Q2: Where should validation and mapping happen?

### Short Answer

Decode wire shape in the transport adapter, then map into a valid domain value at that
boundary. Map persistence records inside the storage adapter. Shared domain constructors
enforce product rules without importing networking or persistence frameworks.

### Expanded Answer

I explicitly handle missing versus null, unknown enum values, time, decimal precision,
and identity. Invalid data follows a named batch policy: fail, quarantine, or degrade.
It is never silently defaulted into a valid-looking value.

<a id="q3-how-do-you-evolve-schemas-safely"></a>
## Q3: How do you evolve schemas safely?

### Short Answer

I version transport and persistence contracts, keep fixtures and stores from supported
released versions, and test upgrade paths. Server rollout remains compatible with old
clients. Local migration preserves unsynced content and defines recovery for corruption.

### Expanded Answer

Additive service changes are easier, but unknown and required fields still need policy.
For storage I use the framework's versioned migration tools. Rebuilding is acceptable
only for a documented cache, not for drafts or pending offline operations.
