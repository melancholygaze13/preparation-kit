---
title: "Stored-Property Initialization and Delegation: Interview Questions"
domain: "Swift"
topic: "Initialization"
concept: "Stored-Property Initialization and Delegation"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Stored-Property Initialization and Delegation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What must be true when initialization completes?](#q1-complete-state) | Senior | Definite initialization and invariants |
| [How should multiple construction paths share validation?](#q2-delegation-design) | Senior | Delegation and API ownership |

---

<a id="q1-complete-state"></a>
## Q1: What Must Be True When Initialization Completes?

### What It Evaluates

Understanding of memory safety and domain validity.

### Short Answer

Every stored property must have an initial value, every constant must have its one
allowed assignment, and all domain invariants must hold before the instance escapes.
Compiler definite-initialization checks guarantee assigned storage, not business validity.

### Detailed Answer

Defaults must be real valid states, not sentinels repaired later. Failure must publish
no partial instance or externally registered reference.

### Engineering Trade-offs

- Required inputs maximize explicitness.
- Valid defaults simplify common construction.
- Factories better expose effectful setup.

### Production Scenario

A model defaults an identifier to an empty string and repairs it asynchronously. Requiring
a validated ID prevents invalid cache keys from escaping.

### Follow-up Questions

- Can `let` be assigned later?
- Can a default closure use `self`?
- What does the compiler not validate?

### Strong Answer Signals

- Separates memory safety from domain validity.
- Prevents partial escape.
- Rejects sentinel defaults.

### Weak Answer Signals

- Relies on later repair.
- Treats non-nil fields as sufficient validity.
- Starts external work before validation.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-delegation-design"></a>
## Q2: How Should Multiple Construction Paths Share Validation?

### What It Evaluates

Ability to keep one invariant-owning construction path.

### Short Answer

Delegate convenience input forms to a small canonical initializer that owns validation
and assignment. Avoid copying validation across overloads. For value types use
`self.init`; class convenience initializers delegate across and ultimately reach a
designated initializer.

### Detailed Answer

Public entry points should express caller intent, while canonical construction prevents
rules drifting. Effectful variants should be factories that produce validated inputs.

### Engineering Trade-offs

- Delegation centralizes correctness.
- Too many convenience forms expand compatibility obligations.
- Factories expose effects but add an API layer.

### Production Scenario

Three parsing initializers normalize names differently. They are replaced by parsers
that produce one validated argument set for the canonical initializer.

### Follow-up Questions

- Can delegation form cycles?
- How can custom struct initializers affect synthesis?
- Where should I/O occur?

### Strong Answer Signals

- Names one canonical path.
- Separates input adaptation from invariants.
- Keeps effects explicit.

### Weak Answer Signals

- Duplicates validation in every overload.
- Uses placeholder state between paths.
- Hides blocking I/O in initialization.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
