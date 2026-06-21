---
title: "Instance Methods and Self Semantics: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Instance Methods and Self Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should behavior be an instance method?](#q1-behavior-placement) | Senior | Cohesion and ownership |
| [What does self mean inside a method?](#q2-self-semantics) | Senior | Receiver and value/reference behavior |
| [What must an actor method reconsider after await?](#q3-actor-reentrancy) | Staff | Isolation and reentrancy |

---

<a id="q1-behavior-placement"></a>
## Q1: When Should Behavior Be an Instance Method?

### What It Evaluates

Whether behavior is placed by ownership rather than call-site convenience.

### Short Answer

Use an instance method when the operation naturally acts on one receiver's state,
preserves its invariants, or expresses its capability. Use a service when coordinating
several owners or effects, and a free function when no receiver naturally owns a pure
operation. Attaching code to a model does not automatically make it cohesive.

### Detailed Answer

Intent methods such as `cancel()` can be safer than public setters because they name
the transition and centralize idempotency. A model method that reaches into networking,
persistence, feature flags, and analytics is orchestration with hidden dependencies.

### Engineering Trade-offs

- Instance methods make owned behavior discoverable.
- Services expose cross-boundary dependencies and lifecycle.
- Free functions keep genuinely receiver-free transforms lightweight.

### Production Scenario

An order model gains `submit()`, which calls five services. Moving submission to an
injected workflow owner leaves pricing invariants on the order and effects at a testable boundary.

### Follow-up Questions

- When is a public setter weaker than a method?
- Can a pure operation still be an instance method?
- What signals a god model?

### Strong Answer Signals

- Uses state and invariant ownership.
- Separates orchestration from domain behavior.
- Makes dependencies explicit.

### Weak Answer Signals

- Puts every related function on the data model.
- Uses static utilities for all operations.
- Ignores side-effect ownership.

### Related Theory

- [Behavior Placement](theory.md#behavior-placement)

---

<a id="q2-self-semantics"></a>
## Q2: What Does self Mean Inside a Method?

### What It Evaluates

Understanding of the implicit receiver and mutation differences.

### Short Answer

`self` is the current value or instance whose method was called. Member access uses it
implicitly unless names are ambiguous. A struct or enum method needs `mutating` to
change `self`; a class method can change variable properties of its referenced instance.
Explicit `self` is useful for shadowing and capture clarity, not as mandatory decoration.

### Detailed Answer

The receiver behaves like an implicit parameter. Value mutation replaces some or all
of the value, while class mutation is observed through aliases. That distinction
matters more than whether `self.` is written at each access.

### Engineering Trade-offs

- Implicit member access keeps code concise.
- Explicit `self` resolves ambiguity and clarifies capture.
- Overuse can add noise without improving ownership understanding.

### Production Scenario

An initializer parameter shadows a stored property. `self.timeout = timeout` states
the assignment direction; unrelated member reads remain implicit.

### Follow-up Questions

- Why do value types need `mutating`?
- How do class aliases affect method mutation?
- What does `self` mean in a type method?

### Strong Answer Signals

- Calls `self` the receiver.
- Distinguishes value and reference mutation.
- Uses explicit syntax for a concrete reason.

### Weak Answer Signals

- Defines `self` only as syntax style.
- Claims class methods need `mutating`.
- Ignores alias-visible changes.

### Related Theory

- [Receiver Context](theory.md#receiver-context)

---

<a id="q3-actor-reentrancy"></a>
## Q3: What Must an Actor Method Reconsider After await?

### What It Evaluates

Concurrency correctness beyond superficial actor usage.

### Short Answer

After `await`, another task may have run on the actor and changed isolated state, so
every state-based assumption from before the suspension must be revalidated. Capture
independent results locally, check current state before commit, and model in-flight
work when duplicate operations matter. Actor isolation prevents simultaneous isolated
access; it does not make a suspended method one uninterrupted transaction.

### Detailed Answer

A read-await-write sequence can overwrite a newer decision or duplicate work. Prefer
synchronous state transitions around asynchronous effects, or use version/token checks
when committing a result. Plain `async` also does not guarantee background execution.

### Engineering Trade-offs

- Actors centralize mutation and eliminate data races on isolated state.
- Reentrancy keeps actors responsive but permits interleaving.
- Nonreentrant assumptions require explicit state-machine design, not wishful locking.

### Production Scenario

An actor sees no cached item, awaits a download, then writes it after invalidation.
A generation token rejects the stale result and an in-flight table deduplicates requests.

### Follow-up Questions

- Why can a force unwrap after `await` fail?
- How would you deduplicate in-flight work?
- Does `async` move work off the actor?

### Strong Answer Signals

- Revalidates after every suspension.
- Separates effect execution from commit.
- Understands isolation versus transactionality.

### Weak Answer Signals

- Assumes actor methods run start-to-finish exclusively.
- Force-unwraps actor state after suspension.
- Uses detached tasks to avoid reasoning about isolation.

### Related Theory

- [Isolation and Suspension](theory.md#isolation-and-suspension)
