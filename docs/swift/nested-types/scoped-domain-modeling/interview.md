---
title: "Scoped Domain Modeling: Interview Questions"
domain: "Swift"
topic: "Nested Types"
concept: "Scoped Domain Modeling"
page_type: interview
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Scoped Domain Modeling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should a type be nested?](#q1-nesting-decision) | Senior | Ownership and discoverability |
| [Does a nested type capture an outer instance?](#q2-outer-instance) | Senior | Lexical versus runtime relationship |

---

<a id="q1-nesting-decision"></a>
## Q1: When Should a Type Be Nested?

### Short Answer

Nest a type when its meaning belongs exclusively to one stable enclosing domain and
`Outer.Inner` improves discovery and disambiguation. Keep it top-level when multiple
domains use it, it has independent identity, or nesting would create the wrong module
dependency. Private implementation helpers are strong nesting candidates.

### Expanded Answer

Public nesting is an ownership and compatibility claim. Ask whether users discuss the
concept independently and whether the enclosing type will remain its long-term owner.

---

<a id="q2-outer-instance"></a>
## Q2: Does a Nested Type Capture an Outer Instance?

### Short Answer

No. A nested type is lexically declared inside another type, but each nested value is
constructed independently and receives no implicit outer instance. Pass or store the
outer value explicitly when needed, or keep behavior on the outer instance if it owns
the state and invariant.

### Expanded Answer

This differs from a closure capturing local values. Nesting affects names and lookup,
not object lifetime or automatic reference relationships.
