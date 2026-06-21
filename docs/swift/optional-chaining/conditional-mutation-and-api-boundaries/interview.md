---
title: "Conditional Mutation and API Boundaries: Interview Questions"
domain: "Swift"
topic: "Optional Chaining"
concept: "Conditional Mutation and API Boundaries"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Conditional Mutation and API Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How can you tell whether a chained Void call ran?](#q1-optional-void) | Senior | Execution versus success |
| [When is conditional mutation unsafe API design?](#q2-silent-mutation) | Staff | Missing dependencies and ownership |

---

<a id="q1-optional-void"></a>
## Q1: How Can You Tell Whether a Chained Void Call Ran?

### What It Evaluates

Understanding of optional call results.

### Short Answer

A method returning `Void` produces `Void?` through optional chaining. A non-nil result
means the receiver existed and the call executed; nil means it was skipped. This does
not prove business success—methods that can reject work should return a domain outcome
or throw.

### Detailed Answer

The same short-circuit applies to chained assignment: the right-hand side is not
evaluated when the receiver path is nil.

### Engineering Trade-offs

- Optional Void can detect best-effort execution cheaply.
- Explicit outcomes distinguish execution from success.
- Silent skips reduce noise but weaken observability.

### Production Scenario

Metrics are emitted only when `(session?.cancel()) != nil`, while cancellation failure
is represented separately by the operation's own result.

### Follow-up Questions

- Is an assignment's right side evaluated when skipped?
- Can the method still throw?
- What does nil tell you about a multi-link chain?

### Strong Answer Signals

- Distinguishes execution from success.
- Knows right-side short-circuiting.
- Uses explicit outcomes for domain failure.

### Weak Answer Signals

- Calls non-nil Void a successful business result.
- Assumes argument side effects always run.
- Cannot distinguish skipped from rejected.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-silent-mutation"></a>
## Q2: When Is Conditional Mutation Unsafe API Design?

### What It Evaluates

Whether skipped commands are aligned with the domain contract.

### Short Answer

It is unsafe when the mutation is required for correctness, persistence, payment,
authorization, or a state transition, because a nil receiver silently turns the command
into a no-op. Guard the dependency and return an explicit error. Chaining fits genuinely
best-effort local behavior where skipping is documented and observable enough.

### Detailed Answer

Optional chaining also provides no synchronization. A separate read and later chained
write can race; compound mutation belongs to one actor or synchronized owner method.

### Engineering Trade-offs

- Conditional mutation is concise for optional decoration.
- Explicit failure adds control flow but protects required work.
- Owner methods provide atomic policy at the cost of a stronger boundary.

### Production Scenario

`cart?.submit()` silently skips checkout after cart eviction. An actor-owned checkout
operation validates cart identity and returns a typed missing-cart error.

### Follow-up Questions

- When is best-effort cleanup acceptable?
- Does actor isolation make separate accesses atomic?
- How should skipped work be measured?

### Strong Answer Signals

- Classifies command criticality.
- Models missing dependencies explicitly.
- Covers compound-mutation ownership.

### Weak Answer Signals

- Uses `?.` to suppress all missing-state errors.
- Assumes chaining is synchronization.
- Has no telemetry for required skipped work.

### Related Theory

- [Mutation Policy](theory.md#mutation-policy)
