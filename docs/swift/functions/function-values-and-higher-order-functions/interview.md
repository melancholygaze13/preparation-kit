---
title: "Function Values and Higher-Order Functions: Interview Questions"
domain: "Swift"
topic: "Functions"
concept: "Function Values and Higher-Order Functions"
page_type: interview
interview_priority: high
estimated_read_minutes: 5
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - function-types
  - higher-order-functions
  - escaping
  - sendable
---

# Function Values and Higher-Order Functions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is included in a Swift function type?](#q1-function-type) | Senior | Inputs, outputs, effects, and labels |
| [What changes when a function parameter is escaping?](#q2-escaping-lifetime) | Senior | Storage, capture lifetime, and ownership |
| [What does @Sendable guarantee and not guarantee?](#q3-sendable-functions) | Senior | Transfer safety versus synchronization |
| [When should you inject a function instead of a protocol?](#q4-function-versus-protocol) | Senior | Abstraction shape and lifecycle |

---

<a id="q1-function-type"></a>
## Q1: What Is Included in a Swift Function Type?

### Short Answer

A function type includes parameter types, result type, and relevant effects such
as async, throws, `@Sendable`, or actor isolation. Declaration argument labels are
not part of the stored arrow type, so a function value is called positionally.
Matching types provide compile-time compatibility, but do not define semantic
purpose, invocation count, ordering, or lifetime.

### Expanded Answer

`(Input) -> Output` differs from `(Input) throws -> Output` and
`@Sendable (Input) async -> Output`. The caller must satisfy the effects and
isolation of the value it invokes.

Converting a named declaration to a function value removes its external labels
from call syntax. Type aliases can name the shape but do not create a distinct
nominal type, so two semantically different callbacks can remain interchangeable.

### Trade-offs

- Function types support lightweight substitution.
- Effect annotations improve correctness while constraining callers.
- Named wrappers add semantic separation at API cost.

### Example

Two callbacks share `(Data) -> Void`: one persists data and one only observes it.
They are accidentally swapped. Distinct labeled parameters or wrapper types make
the semantic roles visible.

---

<a id="q2-escaping-lifetime"></a>
## Q2: What Changes When a Function Parameter Is Escaping?

### Short Answer

A nonescaping function parameter must finish use before the callee returns. Mark
it `@escaping` when the callee stores it or may invoke it later. Escaping can keep
captured objects and mutable state alive, create retain cycles, outlive caller
assumptions, and require explicit cancellation or deregistration. It does not say
when or how many times invocation occurs.

### Expanded Answer

Nonescaping is the stronger default because it bounds lifetime and enables better
reasoning and optimization. “Asynchronous callback” normally escapes, but so does
any callback stored for later synchronous invocation.

The API must own removal and late-delivery behavior. A registration token or
cancellation owner is more reliable than asking for callback equality. Captured
reference graphs require an explicit ownership decision, detailed further in the
Closures topic.

### Trade-offs

- Escaping enables deferred work and observers.
- It increases memory, lifecycle, and concurrency complexity.
- Nonescaping limits flexibility while preserving a clear dynamic extent.

### Example

An observer closure captures its controller, while the event source stores the
closure indefinitely. Neither deallocates. Returning a cancellation token and
defining capture ownership closes the lifecycle.

---

<a id="q3-sendable-functions"></a>
## Q3: What Does @Sendable Guarantee and Not Guarantee?

### Short Answer

`@Sendable` marks a function value as safe to transfer across concurrency domains
and enables compiler checks on captured values and mutation. It does not start a
task, select an executor, guarantee concurrent or serial invocation, or make global
and referenced shared state thread-safe. Use actor isolation or synchronization
for those properties.

### Expanded Answer

A sendable closure can capture sendable immutable values or safely isolated
references according to Swift's concurrency rules. Capturing a mutable local or a
non-Sendable class exposes an ownership problem rather than a reason to add an
unchecked annotation reflexively.

An API can combine `@Sendable` with `@MainActor` or another global actor when the
function must execute under that isolation. The scheduler still determines when
it runs.

### Trade-offs

- Sendable annotations detect unsafe captures early.
- Adoption can expose legacy reference ownership requiring redesign.
- Actor isolation serializes protected state but adds asynchronous boundaries.

### Example

A sendable operation mutates a global dictionary from concurrent tasks. Capture
checking passes because the dictionary is not captured locally, but the race
remains. Moving storage into an actor supplies the missing isolation.

---

<a id="q4-function-versus-protocol"></a>
## Q4: When Should You Inject a Function Instead of a Protocol?

### Short Answer

Inject a function for one focused operation with no durable identity or related
capabilities. Use a protocol or concrete strategy when behavior has multiple
cohesive methods, configuration, state, lifecycle, cancellation, identity, or
discoverable capabilities. A function is an excellent test seam until its
captures become a hidden object model.

### Expanded Answer

A predicate, mapper, clock read, or one-shot sender often fits a function. A
repository, transaction, transport, or observer system usually owns more than one
operation and a lifecycle.

Returning or injecting several unrelated closures can recreate a protocol without
naming its invariants. Conversely, a one-method protocol may add unnecessary
types when a labeled function parameter expresses the contract fully.

### Trade-offs

- Functions minimize ceremony and compose naturally.
- Protocols expose capabilities and support stateful implementations.
- Concrete types can enforce stronger construction and ownership invariants.

### Example

A networking client begins with one injected send function. Retry policy,
cancellation, streaming, metrics, and authentication accumulate as captured
closures. Promoting the seam to a transport abstraction makes lifecycle and
capabilities explicit.
