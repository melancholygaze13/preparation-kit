---
title: "Scoped Domain Modeling: Interview Questions"
domain: "Swift"
topic: "Nested Types"
concept: "Scoped Domain Modeling"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Whether placement follows semantic ownership rather than cosmetic namespacing.

### Short Answer

Nest a type when its meaning belongs exclusively to one stable enclosing domain and
`Outer.Inner` improves discovery and disambiguation. Keep it top-level when multiple
domains use it, it has independent identity, or nesting would create the wrong module
dependency. Private implementation helpers are strong nesting candidates.

### Detailed Answer

Public nesting is an ownership and compatibility claim. Ask whether users discuss the
concept independently and whether the enclosing type will remain its long-term owner.

### Engineering Trade-offs

- Nesting improves locality and reduces global name collisions.
- Top-level types promote neutral reuse and shorter signatures.
- Namespace-only containers organize APIs but can become dumping grounds.

### Production Scenario

`Request.Priority` is later needed by jobs and uploads. Moving to a neutral domain
`WorkPriority` avoids three duplicated nested enums and conversion logic.

### Follow-up Questions

- When is a namespace enum appropriate?
- How deep should nesting go?
- What access should a helper use?

### Strong Answer Signals

- Uses ownership and reuse criteria.
- Distinguishes private and public impact.
- Considers dependency direction.

### Weak Answer Signals

- Nests every supporting declaration automatically.
- Uses one global namespace as a dumping ground.
- Ignores public qualified-name stability.

### Related Theory

- [Choosing the Boundary](theory.md#choosing-the-boundary)

---

<a id="q2-outer-instance"></a>
## Q2: Does a Nested Type Capture an Outer Instance?

### What It Evaluates

Understanding of lexical scope versus object ownership.

### Short Answer

No. A nested type is lexically declared inside another type, but each nested value is
constructed independently and receives no implicit outer instance. Pass or store the
outer value explicitly when needed, or keep behavior on the outer instance if it owns
the state and invariant.

### Detailed Answer

This differs from a closure capturing local values. Nesting affects names and lookup,
not object lifetime or automatic reference relationships.

### Engineering Trade-offs

- Explicit context makes dependencies visible.
- Storing the outer instance can create ownership/cycle concerns for classes.
- Outer methods may be more cohesive than context-heavy nested helpers.

### Production Scenario

A nested validator assumes access to its request. Its initializer instead receives a
value snapshot, making testing and lifetime independent.

### Follow-up Questions

- Can a nested type use outer static members?
- What happens if it stores an outer class reference?
- How is this different from closure capture?

### Strong Answer Signals

- Calls nesting lexical.
- Requires explicit instance context.
- Considers ownership if context is stored.

### Weak Answer Signals

- Assumes an implicit parent pointer.
- Treats nested types as closures.
- Hides outer state in globals.

### Related Theory

- [Mental Model](theory.md#mental-model)
