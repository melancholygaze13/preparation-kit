---
title: "Error Modeling and Throwing APIs: Interview Questions"
domain: "Swift"
topic: "Error Handling"
concept: "Error Modeling and Throwing APIs"
page_type: interview
interview_priority: core
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Error Modeling and Throwing APIs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should an API throw instead of return optional?](#q1-error-or-optional) | Senior | Failure semantics |
| [When are typed throws appropriate?](#q2-typed-throws) | Staff | Closed contracts and evolution |

---

<a id="q1-error-or-optional"></a>
## Q1: When Should an API Throw Instead of Return Optional?

### Short Answer

Return optional when callers need only present-or-absent and all absence has one benign
meaning. Throw when failure categories change recovery, retry, diagnostics, or user
feedback. Use preconditions for programmer-contract violations, not expected runtime input.

### Expanded Answer

`try?` can deliberately collapse an error to absence at a boundary that truly does not
care why. Applying it earlier destroys information required by later policy.

### Trade-offs

- Optionals are concise but carry no reason.
- Errors support policy and diagnostics but expand API contracts.
- Result values fit stored/callback outcomes but add wrapping to direct control flow.

### Example

A cache miss returns nil; a profile load throws offline, unauthorized, or corrupt-data
errors because each requires different behavior.

---

<a id="q2-typed-throws"></a>
## Q2: When Are Typed Throws Appropriate?

### Short Answer

Use typed throws when a narrow domain operation has a meaningful closed failure set
and exhaustive caller handling adds value. Prefer ordinary throws when composing open
dependencies or when future failures cannot be mapped stably. Translate low-level
errors at the domain boundary rather than creating one system-wide error enum.

### Expanded Answer

Typed throws improves inference and documents the contract, but adding a case can
affect exhaustive clients. The boundary needs ownership and an evolution policy.

### Trade-offs

- Closed errors enable exhaustive recovery.
- Open errors compose dependencies more easily.
- Translation stabilizes callers while potentially losing low-level detail unless preserved safely.

### Example

A checkout command exposes a small typed domain error while its repository layer uses
ordinary throws and preserves transport diagnostics internally.
