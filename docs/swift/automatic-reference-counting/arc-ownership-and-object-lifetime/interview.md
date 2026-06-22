---
title: "ARC Ownership and Object Lifetime: Interview Questions"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "ARC Ownership and Object Lifetime"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# ARC Ownership and Object Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What determines a class instance's lifetime?](#q1-lifetime) | Senior | Strong ownership |
| [Does `let` make a class instance immutable or non-retaining?](#q2-let-reference) | Senior | Binding versus object |
| [Why is ARC not a resource-lifecycle protocol?](#q3-resource-lifecycle) | Staff | Memory versus business cleanup |

---

<a id="q1-lifetime"></a>
## Q1: What Determines a Class Instance's Lifetime?

### Short Answer

A class instance remains alive while strong ownership requires it. Strong edges can come from
locals, properties, collections, captures, tasks, globals, or frameworks. It is deallocated after
the last strong ownership ends, unless a strong cycle keeps the graph alive.

### Expanded Answer

ARC inserts ownership operations and the optimizer may change their placement while preserving
semantics. Diagnose lifetime by finding roots and strong paths, not by counting assignments or
assuming the closing brace performs business cleanup.

### Trade-offs

- Strong ownership guarantees availability.
- Broad or hidden ownership makes shutdown and memory harder to reason about.

### Example

A view model survives dismissal because a notification token's callback captures it. The local
controller variable is gone, but the registration remains a live root.

---

<a id="q2-let-reference"></a>
## Q2: Does `let` Make a Class Instance Immutable or Non-Retaining?

### Short Answer

No. `let` prevents rebinding that reference, but the binding is strong by default and the class's
mutable properties may still change. Other aliases observe the same instance.

### Expanded Answer

This differs from a value type stored in a `let` binding, where mutating the value is prohibited.
For classes, immutability must be designed through API and synchronization, not inferred from the
constant reference.

### Trade-offs

- Constant references stabilize which instance a component uses.
- They do not provide deep immutability or thread safety.

### Example

A supposedly immutable configuration service is stored in `let` but exposes mutable fields shared
across tasks. The fix is immutable snapshots or actor-owned mutation, not changing binding syntax.

---

<a id="q3-resource-lifecycle"></a>
## Q3: Why Is ARC Not a Resource-Lifecycle Protocol?

### Short Answer

ARC decides object memory lifetime from strong ownership. It does not define when business work
finishes, cancellation propagates, data flushes, or remote/file resources close. Those require
explicit synchronous or asynchronous lifecycle APIs.

### Expanded Answer

`deinit` is synchronous, nonthrowing, and cannot await. Cycles or legitimate owners may delay it.
Use explicit `cancel`, `close`, or scoped ownership for required behavior, with `deinit` only for
bounded final release or diagnostics.

### Trade-offs

- Implicit cleanup is convenient for strictly memory-bound state.
- Explicit lifecycle is observable and testable but needs state-machine design.

### Example

A streaming client must send a closing frame and await acknowledgement. It exposes `close()` and
cancellation semantics instead of relying on its deinitializer.
