---
title: "Error Modeling and Throwing APIs: Interview Questions"
domain: "Swift"
topic: "Error Handling"
concept: "Error Modeling and Throwing APIs"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Whether failure representation matches caller recovery needs.

### Short Answer

Return optional when callers need only present-or-absent and all absence has one benign
meaning. Throw when failure categories change recovery, retry, diagnostics, or user
feedback. Use preconditions for programmer-contract violations, not expected runtime input.

### Detailed Answer

`try?` can deliberately collapse an error to absence at a boundary that truly does not
care why. Applying it earlier destroys information required by later policy.

### Engineering Trade-offs

- Optionals are concise but carry no reason.
- Errors support policy and diagnostics but expand API contracts.
- Result values fit stored/callback outcomes but add wrapping to direct control flow.

### Production Scenario

A cache miss returns nil; a profile load throws offline, unauthorized, or corrupt-data
errors because each requires different behavior.

### Follow-up Questions

- When is `try?` appropriate?
- What belongs in an error case?
- How do partial side effects change the design?

### Strong Answer Signals

- Chooses from recovery requirements.
- Separates expected absence and programmer defects.
- Preserves diagnostics until policy is applied.

### Weak Answer Signals

- Uses nil for every failure.
- Throws for ordinary collection absence automatically.
- Uses preconditions on untrusted input.

### Related Theory

- [Error, Optional, or Contract Failure](theory.md#error-optional-or-contract-failure)

---

<a id="q2-typed-throws"></a>
## Q2: When Are Typed Throws Appropriate?

### What It Evaluates

Judgment about closed error contracts and evolution.

### Short Answer

Use typed throws when a narrow domain operation has a meaningful closed failure set
and exhaustive caller handling adds value. Prefer ordinary throws when composing open
dependencies or when future failures cannot be mapped stably. Translate low-level
errors at the domain boundary rather than creating one system-wide error enum.

### Detailed Answer

Typed throws improves inference and documents the contract, but adding a case can
affect exhaustive clients. The boundary needs ownership and an evolution policy.

### Engineering Trade-offs

- Closed errors enable exhaustive recovery.
- Open errors compose dependencies more easily.
- Translation stabilizes callers while potentially losing low-level detail unless preserved safely.

### Production Scenario

A checkout command exposes a small typed domain error while its repository layer uses
ordinary throws and preserves transport diagnostics internally.

### Follow-up Questions

- How should new cases roll out?
- Where is underlying context stored?
- When does typed throws overcouple layers?

### Strong Answer Signals

- Selects a stable owning boundary.
- Covers exhaustive-client evolution.
- Avoids leaking transport errors.

### Weak Answer Signals

- Uses one typed enum for every system failure.
- Exposes localized descriptions as cases.
- Ignores additive-case compatibility.

### Related Theory

- [Typed Throws](theory.md#typed-throws)
