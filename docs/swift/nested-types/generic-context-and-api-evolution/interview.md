---
title: "Generic Context and API Evolution: Interview Questions"
domain: "Swift"
topic: "Nested Types"
concept: "Generic Context and API Evolution"
page_type: interview
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Generic Context and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does generic context affect a nested type?](#q1-generic-context) | Senior | Specialization and dependencies |
| [How would you move a public nested type?](#q2-public-type-migration) | Staff | Compatibility and rollout |

---

<a id="q1-generic-context"></a>
## Q1: How Does Generic Context Affect a Nested Type?

### Short Answer

A nested type can use generic parameters from its enclosing type, so its meaning and
qualified spelling can depend on the outer specialization, such as
`Buffer<String>.Entry`. Use that coupling when the inner concept is genuinely defined
by the outer generic context; otherwise lift it into an independently generic type.

### Expanded Answer

Generic nesting can express ownership precisely but create verbose signatures and
unnecessary feature-level dependencies when the inner record is broadly reusable.

---

<a id="q2-public-type-migration"></a>
## Q2: How Would You Move a Public Nested Type?

### Short Answer

Introduce the new type at its stable owner, provide a deprecated typealias or adapter
where compatibility permits, migrate internal producers and representative clients,
and verify generated interfaces, binary expectations, reflection, and serialization.
Measure old-name use before removal and never use the qualified type name as persisted identity.

### Expanded Answer

A typealias can preserve source spelling but not every ABI, tooling, reflection, or
schema behavior. Mixed-version modules need a declared compatibility window and rollback.
