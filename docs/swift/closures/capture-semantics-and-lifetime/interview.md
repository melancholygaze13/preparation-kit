---
title: "Capture Semantics and Lifetime: Interview Questions"
domain: "Swift"
topic: "Closures"
concept: "Capture Semantics and Lifetime"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - closures
  - captures
  - lifetime
  - sendable
---

# Capture Semantics and Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do ordinary capture and capture-list value snapshots differ?](#q1-capture-time) | Senior | Live bindings versus creation-time values |
| [What happens when a closure value is copied?](#q2-reference-semantics) | Senior | Shared capture context |
| [How do strong, weak, and unowned captures differ?](#q3-reference-ownership) | Senior | Lifetime guarantees and cycles |
| [Why can an escaping closure not capture inout or mutable value-type self?](#q4-exclusive-access) | Senior | Escaping lifetime and exclusivity |
| [How should captured state be designed for concurrent work?](#q5-concurrent-captures) | Staff | Sendability and isolation |

---

<a id="q1-capture-time"></a>
## Q1: How Do Ordinary Capture and Capture-List Value Snapshots Differ?

### What It Evaluates

Whether the candidate can choose invocation-time state versus creation-time
snapshot intentionally.

### Short Answer

Ordinary use of an outer variable captures access to that binding, so the closure
can observe later changes. A capture-list entry such as `[mode]` evaluates and
stores that value when the closure is created. If the value is a class reference,
the list snapshots the reference strongly, not a deep copy of the object.

### Detailed Answer

Use a capture-list value for request IDs, configuration, or other state that must
represent scheduling time. Use actor lookup or another live owner when invocation
must observe current state.

Capturing `[requestID = request.id]` also reduces the retained graph compared with
capturing an entire request or controller. But snapshotting can be incorrect when
policy changes between scheduling and execution.

### Engineering Trade-offs

- Snapshots are temporally stable but can become stale.
- Live captures observe changes but increase shared-state coupling.
- Captured references retain identity and mutable object behavior.

### Production Scenario

A queued audit operation captures the entire mutable session and later logs a new
user ID. Capturing the original immutable ID records the intended scheduling-time
identity and releases the session graph.

### Follow-up Questions

- Does `[object]` clone a class instance?
- When should delayed work read current actor state?
- When are capture initializers evaluated?

### Strong Answer Signals

- Distinguishes binding access from value snapshot.
- Separates reference snapshot from deep copy.
- Chooses based on domain time semantics.

### Weak Answer Signals

- Claims all captures freeze values automatically.
- Treats capture lists as deep-copy syntax.
- Snapshots live policy without considering staleness.

### Related Theory

- [Ordinary Capture versus Value Capture](theory.md#ordinary-capture-versus-value-capture)
- [Capturing Less State](theory.md#capturing-less-state)

---

<a id="q2-reference-semantics"></a>
## Q2: What Happens When a Closure Value Is Copied?

### What It Evaluates

Knowledge that closure references share captured mutable context.

### Short Answer

Functions and closures are reference types. Assigning one closure value to
another variable makes both references invoke the same closure context; it does
not duplicate captured mutable state. Calling either reference can therefore
affect what the other observes. Invoke the factory again or use an explicit owner
when independent state is required.

### Detailed Answer

Two references to one incrementer share its captured total. Two separate calls to
the incrementer factory create separate totals. This behavior is observable even
though the closure variables themselves are `let` constants: the reference is
constant, not the captured state.

Reference behavior does not provide general closure equality or persistence
identity. Registration still requires explicit tokens.

### Engineering Trade-offs

- Shared closure state enables lightweight encapsulation.
- Copy-looking assignment can conceal aliasing.
- Named state owners improve inspection and synchronization.

### Production Scenario

A retry closure is copied into two queues, and both mutate the same attempt count.
The combined retries exceed policy. Separate operation instances make ownership
and budgets independent.

### Follow-up Questions

- Does `let` make captured state immutable?
- How do you create independent capture contexts?
- Can closures be compared for equality?

### Strong Answer Signals

- Describes shared context through references.
- Distinguishes closure binding from captured mutation.
- Rejects closure identity as domain identity.

### Weak Answer Signals

- Assumes assignment clones the closure state.
- Treats `let closure` as a pure function guarantee.
- Uses callback comparison for deregistration.

### Related Theory

- [Closures Are Reference Types](theory.md#closures-are-reference-types)

---

<a id="q3-reference-ownership"></a>
## Q3: How Do Strong, weak, and unowned Captures Differ?

### What It Evaluates

Ability to select ownership from a proven lifetime graph instead of convention.

### Short Answer

A strong capture keeps the object alive and can form a cycle if that object stores
the closure. Weak does not retain and yields an optional that can become nil.
Unowned does not retain and assumes the object is alive; access after deallocation
traps. Use strong when completion requires lifetime, weak when owner disappearance
is valid, and unowned only with a guaranteed lifetime relationship.

### Detailed Answer

`[weak self]` plus silent return is a behavior decision: work may be discarded.
Sometimes the correct design is a separate operation owner that survives the UI,
not weakening the capture. One-shot callback owners can break cycles by clearing
the stored closure after invocation.

Unowned avoids optional handling but turns a mistaken lifetime assumption into a
runtime failure. Documentation such as “normally retained” is insufficient.

### Engineering Trade-offs

- Strong preserves required work but extends lifetime.
- Weak prevents retention while allowing disappearance.
- Unowned simplifies access at crash risk when the invariant fails.

### Production Scenario

A purchase operation weakly captures a screen controller and silently skips state
persistence when the screen closes. Moving persistence to an operation owner and
weakly capturing only UI presentation preserves the required effect.

### Follow-up Questions

- How does a closure property create a cycle?
- Is weak self always the correct cycle fix?
- What evidence justifies unowned?

### Strong Answer Signals

- States retain and failure behavior precisely.
- Separates operation lifetime from UI lifetime.
- Considers explicit callback release.

### Weak Answer Signals

- Adds weak self mechanically.
- Calls unowned a faster weak reference without risk.
- Ignores stored-closure release.

### Related Theory

- [Strong Reference Cycles](theory.md#strong-reference-cycles)
- [weak and unowned Captures](theory.md#weak-and-unowned-captures)

---

<a id="q4-exclusive-access"></a>
## Q4: Why Can an Escaping Closure Not Capture inout or Mutable Value-Type self?

### What It Evaluates

Understanding of access lifetime, writeback, and value semantics.

### Short Answer

`inout` and a mutating value-type `self` provide exclusive mutable access bounded
to the current call. An escaping closure could run after that access and writeback
end, effectively preserving a mutable alias beyond its valid lifetime. Swift
rejects this. Copy the required value, return a result, or move long-lived mutable
state into an explicit owner.

### Detailed Answer

A nonescaping closure may use scoped mutable access when the compiler proves it
does not outlive the call. Escaping turns that local borrow-like access into shared
mutation, conflicting with Swift's exclusivity and value-type model.

Unsafe pointers are not a general workaround; they replace compiler enforcement
with a manual lifetime proof and should remain at justified low-level boundaries.

### Engineering Trade-offs

- Scoped mutation is efficient and locally verifiable.
- Copying creates snapshot semantics and possible cost.
- Reference or actor ownership supports escape with a different API contract.

### Production Scenario

A mutating struct method tries to queue a closure that updates `self` later. The
state moves into an actor-owned coordinator, and the struct returns an immutable
operation description instead.

### Follow-up Questions

- Can a nonescaping closure use an inout parameter?
- Why is copying a possible redesign?
- When would an unsafe pointer be justified?

### Strong Answer Signals

- Connects rejection to bounded exclusivity and writeback.
- Preserves value semantics in the redesign.
- Avoids unsafe lifetime bypasses.

### Weak Answer Signals

- Calls it an arbitrary compiler limitation.
- Stores the address manually without lifetime proof.
- Assumes value-type self can become shared mutable state safely.

### Related Theory

- [Capture and inout Access](theory.md#capture-and-inout-access)

---

<a id="q5-concurrent-captures"></a>
## Q5: How Should Captured State Be Designed for Concurrent Work?

### What It Evaluates

Staff-level reasoning about sendability, isolation, and hidden shared state.

### Short Answer

Use `@Sendable` closure types at transfer boundaries and capture immutable
Sendable values, actors, or synchronized owners. Do not capture and mutate local
variables from work that can overlap. Actor isolation or locks protect mutable
state; `@Sendable` checks transfer and captures but does not synchronize global or
indirect state. Define cancellation and late-invocation ownership too.

### Detailed Answer

Strict-concurrency diagnostics identify captures whose ownership is unclear.
Move counters, caches, and state machines into one actor rather than suppressing
diagnostics. If UI state is involved, encode main-actor isolation in the closure
or owning API.

Weak capture does not solve a race. The object may still be mutated concurrently,
and a successful optional unwrap only establishes lifetime for that local use, not
serialization across suspension.

### Engineering Trade-offs

- Immutable snapshots are simple but may become stale.
- Actors serialize state with await and reentrancy implications.
- Locks support synchronous critical sections with ordering risk.

### Production Scenario

Parallel image operations capture and append to one local results array. Strict
checking rejects the mutation. An actor owns result collection and final ordering,
or structured tasks return values for deterministic aggregation.

### Follow-up Questions

- Does @Sendable choose an executor?
- Is weak capture thread-safe?
- When is returning task results better than shared accumulation?

### Strong Answer Signals

- Combines sendability with an actual state owner.
- Separates lifetime from synchronization.
- Includes ordering and cancellation.

### Weak Answer Signals

- Adds @unchecked Sendable to the capture container.
- Uses weak self as race prevention.
- Mutates a captured array from concurrent tasks.

### Related Theory

- [Sendable Captures and Concurrency](theory.md#sendable-captures-and-concurrency)
- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
