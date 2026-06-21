---
title: "Function Values and Higher-Order Functions: Interview Questions"
domain: "Swift"
topic: "Functions"
concept: "Function Values and Higher-Order Functions"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
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
| [How would you design a production callback contract?](#q5-callback-contract) | Staff | Cardinality, isolation, cancellation, and migration |

---

<a id="q1-function-type"></a>
## Q1: What Is Included in a Swift Function Type?

### What It Evaluates

Whether the candidate distinguishes declaration spelling from callable type and
recognizes effectful function values.

### Short Answer

A function type includes parameter types, result type, and relevant effects such
as async, throws, `@Sendable`, or actor isolation. Declaration argument labels are
not part of the stored arrow type, so a function value is called positionally.
Matching types provide compile-time compatibility, but do not define semantic
purpose, invocation count, ordering, or lifetime.

### Detailed Answer

`(Input) -> Output` differs from `(Input) throws -> Output` and
`@Sendable (Input) async -> Output`. The caller must satisfy the effects and
isolation of the value it invokes.

Converting a named declaration to a function value removes its external labels
from call syntax. Type aliases can name the shape but do not create a distinct
nominal type, so two semantically different callbacks can remain interchangeable.

### Engineering Trade-offs

- Function types support lightweight substitution.
- Effect annotations improve correctness while constraining callers.
- Named wrappers add semantic separation at API cost.

### Production Scenario

Two callbacks share `(Data) -> Void`: one persists data and one only observes it.
They are accidentally swapped. Distinct labeled parameters or wrapper types make
the semantic roles visible.

### Follow-up Questions

- Are argument labels part of the function type?
- Is a type alias a new callback type?
- Can a synchronous function satisfy an async-oriented abstraction?

### Strong Answer Signals

- Includes effects and excludes declaration labels.
- Separates type compatibility from semantic substitutability.
- Uses nominal abstractions when role confusion is costly.

### Weak Answer Signals

- Calls stored functions using declaration labels.
- Treats type aliases as distinct types.
- Assumes matching arrows define the complete callback contract.

### Related Theory

- [Function Types](theory.md#function-types)
- [Type Aliases and Semantic Wrappers](theory.md#type-aliases-and-semantic-wrappers)

---

<a id="q2-escaping-lifetime"></a>
## Q2: What Changes When a Function Parameter Is Escaping?

### What It Evaluates

Understanding of dynamic lifetime, captures, storage, and cancellation ownership.

### Short Answer

A nonescaping function parameter must finish use before the callee returns. Mark
it `@escaping` when the callee stores it or may invoke it later. Escaping can keep
captured objects and mutable state alive, create retain cycles, outlive caller
assumptions, and require explicit cancellation or deregistration. It does not say
when or how many times invocation occurs.

### Detailed Answer

Nonescaping is the stronger default because it bounds lifetime and enables better
reasoning and optimization. “Asynchronous callback” normally escapes, but so does
any callback stored for later synchronous invocation.

The API must own removal and late-delivery behavior. A registration token or
cancellation owner is more reliable than asking for callback equality. Captured
reference graphs require an explicit ownership decision, detailed further in the
Closures topic.

### Engineering Trade-offs

- Escaping enables deferred work and observers.
- It increases memory, lifecycle, and concurrency complexity.
- Nonescaping limits flexibility while preserving a clear dynamic extent.

### Production Scenario

An observer closure captures its controller, while the event source stores the
closure indefinitely. Neither deallocates. Returning a cancellation token and
defining capture ownership closes the lifecycle.

### Follow-up Questions

- Does @escaping mean asynchronous?
- How should an observer be removed?
- Why is nonescaping the default?

### Strong Answer Signals

- Defines escaping by lifetime, not by thread or timing.
- Connects storage to captured-object lifetime.
- Provides cancellation or registration ownership.

### Weak Answer Signals

- Says every closure should be @escaping.
- Equates escaping with background execution.
- Removes observers by comparing closures.

### Related Theory

- [Nonescaping and Escaping Parameters](theory.md#nonescaping-and-escaping-parameters)
- [Function Identity and Registration](theory.md#function-identity-and-registration)

---

<a id="q3-sendable-functions"></a>
## Q3: What Does @Sendable Guarantee and Not Guarantee?

### What It Evaluates

Modern concurrency reasoning about transferred behavior and shared state.

### Short Answer

`@Sendable` marks a function value as safe to transfer across concurrency domains
and enables compiler checks on captured values and mutation. It does not start a
task, select an executor, guarantee concurrent or serial invocation, or make global
and referenced shared state thread-safe. Use actor isolation or synchronization
for those properties.

### Detailed Answer

A sendable closure can capture sendable immutable values or safely isolated
references according to Swift's concurrency rules. Capturing a mutable local or a
non-Sendable class exposes an ownership problem rather than a reason to add an
unchecked annotation reflexively.

An API can combine `@Sendable` with `@MainActor` or another global actor when the
function must execute under that isolation. The scheduler still determines when
it runs.

### Engineering Trade-offs

- Sendable annotations detect unsafe captures early.
- Adoption can expose legacy reference ownership requiring redesign.
- Actor isolation serializes protected state but adds asynchronous boundaries.

### Production Scenario

A sendable operation mutates a global dictionary from concurrent tasks. Capture
checking passes because the dictionary is not captured locally, but the race
remains. Moving storage into an actor supplies the missing isolation.

### Follow-up Questions

- Does @Sendable imply a background thread?
- Can a sendable closure mutate global state safely?
- When should a function type be @MainActor?

### Strong Answer Signals

- Defines transfer safety and capture checking precisely.
- Separates scheduling, serialization, and isolation.
- Treats diagnostics as ownership feedback.

### Weak Answer Signals

- Calls @Sendable a lock.
- Assumes it launches concurrent work.
- Uses unchecked sendability without an enforced invariant.

### Related Theory

- [@Sendable Function Values](theory.md#sendable-function-values)
- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q4-function-versus-protocol"></a>
## Q4: When Should You Inject a Function Instead of a Protocol?

### What It Evaluates

Ability to choose the smallest abstraction that still represents lifecycle and
semantics.

### Short Answer

Inject a function for one focused operation with no durable identity or related
capabilities. Use a protocol or concrete strategy when behavior has multiple
cohesive methods, configuration, state, lifecycle, cancellation, identity, or
discoverable capabilities. A function is an excellent test seam until its
captures become a hidden object model.

### Detailed Answer

A predicate, mapper, clock read, or one-shot sender often fits a function. A
repository, transaction, transport, or observer system usually owns more than one
operation and a lifecycle.

Returning or injecting several unrelated closures can recreate a protocol without
naming its invariants. Conversely, a one-method protocol may add unnecessary
types when a labeled function parameter expresses the contract fully.

### Engineering Trade-offs

- Functions minimize ceremony and compose naturally.
- Protocols expose capabilities and support stateful implementations.
- Concrete types can enforce stronger construction and ownership invariants.

### Production Scenario

A networking client begins with one injected send function. Retry policy,
cancellation, streaming, metrics, and authentication accumulate as captured
closures. Promoting the seam to a transport abstraction makes lifecycle and
capabilities explicit.

### Follow-up Questions

- When is a one-method protocol justified?
- How can captures become hidden state?
- What makes a function seam easy to test?

### Strong Answer Signals

- Chooses based on cohesive behavior and lifecycle.
- Recognizes both over-abstraction and hidden closure objects.
- Evolves the boundary when responsibilities grow.

### Weak Answer Signals

- Always prefers protocols by policy.
- Uses a bag of closures for a stateful subsystem.
- Selects solely by mocking convenience.

### Related Theory

- [Passing Functions as Parameters](theory.md#passing-functions-as-parameters)
- [Function Value versus Protocol](theory.md#function-value-versus-protocol)

---

<a id="q5-callback-contract"></a>
## Q5: How Would You Design a Production Callback Contract?

### What It Evaluates

Staff-level completeness across timing, ownership, isolation, and migration.

### Short Answer

Specify whether the callback is synchronous or deferred, its invocation count and
ordering, actor or executor, reentrancy, error delivery, cancellation and late
events, registration ownership, and capture lifetime. Encode what Swift can check
with nonescaping, `@escaping`, `@Sendable`, and actor annotations. Use stable
tokens for registration and prefer async functions for one-shot asynchronous
results when they provide a clearer structured contract.

### Detailed Answer

The implementation must uphold exactly-once claims on success, failure, and
cancellation. If callbacks can overlap or arrive after cancellation, say so and
make clients resilient. Never mix synchronous and deferred delivery without an
explicit reentrancy contract.

Instrument registrations, delivery count, delay, cancellation, and late calls.
For callback-to-async migration, define coexistence, cancellation bridging,
single-resume enforcement, and removal timing before deprecating the old API.

### Engineering Trade-offs

- Stronger guarantees simplify callers but constrain implementations.
- Main-actor delivery protects UI state but can add hops and latency.
- Async migration improves structure while requiring compatibility adapters.

### Production Scenario

A callback sometimes fires inline from cache and later from network, causing a
caller to mutate state reentrantly and complete twice. The redesigned contract
uses one async result, a separate progress stream, explicit cancellation, and
delivery metrics.

### Follow-up Questions

- Can the callback fire after cancellation?
- How is exactly-once delivery enforced?
- Which isolation should callers assume?

### Strong Answer Signals

- Covers timing, cardinality, ordering, isolation, ownership, and cancellation.
- Encodes guarantees in types where possible.
- Includes observability and migration.

### Weak Answer Signals

- Documents only the callback's parameter types.
- Says delivery is “usually” on one thread.
- Ignores reentrancy and late events.

### Related Theory

- [Execution Contract Beyond the Type](theory.md#execution-contract-beyond-the-type)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
