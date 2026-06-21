---
title: "Object Graph Cycles and Non-Owning References: Interview Questions"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "Object Graph Cycles and Non-Owning References"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Object Graph Cycles and Non-Owning References: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do weak and unowned differ?](#q1-weak-versus-unowned) | Senior | Lifetime contracts |
| [Does changing one cycle edge to weak always fix the design?](#q2-arbitrary-weak-edge) | Staff | Ownership modeling |
| [How do you diagnose a strong-reference cycle?](#q3-cycle-diagnosis) | Senior | Root-path analysis |

---

<a id="q1-weak-versus-unowned"></a>
## Q1: How Do Weak and Unowned Differ?

### What It Evaluates

Precise non-owning lifetime semantics.

### Short Answer

Both avoid retaining. Weak is an optional reference that ARC zeroes when the object deallocates,
so disappearance is valid. Unowned assumes the object is alive on every access; safe unowned traps
if that assumption is false. Choose from the lifetime model, not convenience.

### Detailed Answer

Weak fits independently disappearing delegates or observers. Unowned fits an owner-owned child
that cannot escape the owner. Unowned optionals permit `nil` but retain the same manual lifetime
responsibility and are not weak zeroing references.

### Engineering Trade-offs

- Weak forces absence handling and tolerates independent lifetime.
- Unowned gives nonoptional access but converts a violated invariant into a trap.

### Production Scenario

A coordinator weakly references an optional delegate. A line item uses an unowned reference to its
document only after the API prevents line items from escaping the document's lifetime.

### Follow-up Questions

- What does `unowned(unsafe)` change?
- Can unwrapping weak extend lifetime?

### Strong Answer Signals

- Covers zeroing, optionality, and trap behavior.
- Requires structural proof for unowned.

### Weak Answer Signals

- Chooses unowned because it is shorter.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q2-arbitrary-weak-edge"></a>
## Q2: Does Changing One Cycle Edge to Weak Always Fix the Design?

### What It Evaluates

Ownership reasoning beyond leak suppression.

### Short Answer

It can break the retain cycle but still violate the domain. The weakened object may disappear while
required work remains. The correct non-owning edge is the relationship that does not own lifetime;
otherwise introduce an explicit lifecycle owner or teardown mechanism.

### Detailed Answer

Leaks and premature release are dual failures. Draw roots, ownership, callbacks, and cancellation.
Weak is correct only when absence has valid behavior. Required asynchronous work often belongs to
an operation object rather than a view/controller.

### Engineering Trade-offs

- Weakening is a small local change.
- Redesigning ownership costs more but makes work and shutdown reliable.

### Production Scenario

A payment callback is made weak to release a screen, then payment completion is lost after navigation.
The operation moves to a service owner; the screen becomes a weak observer of progress.

### Follow-up Questions

- Who should own long-running work?
- When is explicit callback clearing preferable?

### Strong Answer Signals

- Evaluates required lifetime and missing-work risk.
- Identifies a durable owner.

### Weak Answer Signals

- Treats every strong capture as a bug.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-cycle-diagnosis"></a>
## Q3: How Do You Diagnose a Strong-Reference Cycle?

### What It Evaluates

Practical graph-based debugging.

### Short Answer

Reproduce the lifecycle, verify the instance remains through a weak probe, capture a memory graph,
and trace strong paths from live roots. Identify which edge's domain semantics are non-owning or
which registration needs explicit teardown, then regression-test release and behavior.

### Detailed Answer

A cycle alone may still be intentionally owned by a root; a leak is unexpectedly retained lifetime.
Inspect collections, closures, tasks, timers, notifications, delegates, caches, and framework tokens.
Confirm deallocation only after expected async work and pools/scopes have drained.

### Engineering Trade-offs

- Memory graphs quickly expose current paths.
- Lifecycle logging and focused tests reveal when and why ownership was established.

### Production Scenario

A dismissed editor remains alive. The memory graph shows editor → observation token → closure → editor.
Cancellation at editor shutdown removes the registration and a weak-probe test prevents regression.

### Follow-up Questions

- How do you distinguish delayed release from a leak?
- What metrics can reveal repeated leaked graphs?

### Strong Answer Signals

- Traces roots and validates semantics.
- Adds a release regression test.

### Weak Answer Signals

- Searches code for `weak` without reproducing ownership.

### Related Theory

- [Observability and Debugging](theory.md#observability-and-debugging)
