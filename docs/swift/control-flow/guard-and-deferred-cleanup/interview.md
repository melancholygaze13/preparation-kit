---
title: "Guard and Deferred Cleanup: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Guard and Deferred Cleanup"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - guard
  - defer
  - resource-management
---

# Guard and Deferred Cleanup: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does guard differ from if?](#q1-guard-versus-if) | Senior | Prerequisites, scope, and exits |
| [What exactly does defer guarantee?](#q2-defer-guarantees) | Senior | Scope, ordering, and exit coverage |
| [Where should defer be declared after resource acquisition?](#q3-resource-pairing) | Senior | Leak-free lifecycle design |
| [How do cleanup and cancellation interact with async code?](#q4-async-cleanup) | Staff | Suspension and explicit lifecycle ownership |

---

<a id="q1-guard-versus-if"></a>
## Q1: How Does guard Differ from if?

### What It Evaluates

Whether the candidate understands guard as a scope prerequisite rather than
stylistic early return.

### Short Answer

Guard requires an `else` that exits the enclosing scope. If its conditions
succeed, bound values remain available afterward and the main path continues
without nesting. Use it for requirements of all remaining work. Use if when the
condition controls only local work or both branches are valid peer outcomes.

### Detailed Answer

A guard failure can `return`, `throw`, `break`, `continue`, or call a nonreturning
function. The correct exit depends on who owns recovery. Missing external input
usually should not become `fatalError`, while an iterator loop may legitimately
`continue` past one invalid element.

Long guards with effectful conditions can obscure failure reasons. Split them
when each requirement has different error or observability policy.

### Engineering Trade-offs

- Guard flattens the success path and extends bindings.
- Several guards can fragment validation and repeat cleanup.
- If makes symmetric branching easier to see.

### Production Scenario

A payment function uses `guard let` and silently returns on missing account data.
The caller records success because no error propagates. Throwing a typed validation
error moves recovery to the owning boundary.

### Follow-up Questions

- Which statements may exit a guard else?
- Where are guard bindings visible?
- Is fatalError appropriate for user input?

### Strong Answer Signals

- Calls guard a prerequisite for the remaining scope.
- Selects exit behavior from ownership.
- Avoids using guard only to reduce indentation.

### Weak Answer Signals

- Says guard and if are interchangeable syntax.
- Continues execution from the else branch.
- Crashes on recoverable external data.

### Related Theory

- [guard Establishes the Success Path](theory.md#guard-establishes-the-success-path)
- [Choosing the Exit](theory.md#choosing-the-exit)

---

<a id="q2-defer-guarantees"></a>
## Q2: What Exactly Does defer Guarantee?

### What It Evaluates

Precise knowledge of lexical scope, runtime registration, ordering, and limits.

### Short Answer

Once execution reaches a defer declaration, its synchronous body runs when
control leaves that lexical scope through normal completion, return, throw,
break, or continue. Defers in the same scope run in reverse declaration order.
It does not run if registration was never reached or if the process terminates or
crashes, and its body cannot transfer control outward or perform an async call.

### Detailed Answer

Defer belongs to its nearest enclosing scope, which might be an if body or loop
iteration rather than a function. Variables are evaluated when cleanup executes,
so later mutation can change what cleanup observes.

The reverse order supports nested acquisition: release the most recently acquired
dependency first. Complex or escaping ownership is usually clearer in a dedicated
type than in a stack of defers.

### Engineering Trade-offs

- Defer covers many exits with one cleanup declaration.
- Lexical timing can be surprising in nested scopes.
- It cannot guarantee crash recovery or suspending cleanup.

### Production Scenario

A transaction defer is declared inside a short `if` block, so rollback runs before
later function work that assumes the transaction remains open. Moving ownership
to the correct scope fixes the lifetime.

### Follow-up Questions

- What order do multiple defers run?
- Does defer execute after a thrown error?
- Does it execute after fatal process termination?

### Strong Answer Signals

- Conditions the guarantee on reaching the declaration.
- Names lexical scope and LIFO ordering.
- Identifies crash and async limits.

### Weak Answer Signals

- Calls defer a guaranteed function-exit hook.
- Assumes declaration order equals execution order.
- Relies on defer for durable crash recovery.

### Related Theory

- [defer Registration and Scope](theory.md#defer-registration-and-scope)
- [Exit Coverage and Limits](theory.md#exit-coverage-and-limits)

---

<a id="q3-resource-pairing"></a>
## Q3: Where Should defer Be Declared After Resource Acquisition?

### What It Evaluates

Ability to construct a leak-free resource lifetime with the correct scope.

### Short Answer

Declare defer immediately after acquisition succeeds, in the narrowest scope that
owns the complete resource lifetime. Declaring it later leaves a throw or return
gap that can leak; declaring cleanup before acquisition requires invalid partial
state. Acquire dependent resources in order so reverse defer execution releases
them safely.

### Detailed Answer

```swift
let descriptor = try openDescriptor()
defer { close(descriptor) }

let lock = acquireLock()
defer { lock.release() }
```

Here the lock releases before the descriptor closes. If the resource escapes the
scope or cleanup is stateful, move lifecycle ownership into a type or repository
operation instead of extending the lexical scope indefinitely.

Cleanup failure needs policy. It should be observable without replacing the
primary operation error unintentionally.

### Engineering Trade-offs

- Immediate defer minimizes leak windows.
- Narrow scope releases resources promptly but may require decomposition.
- Owning types add abstraction while supporting nonlexical lifetimes.

### Production Scenario

A file is opened, metadata is parsed, and only then is defer declared. Parsing can
throw and leak descriptors. Moving defer directly after `open` closes every
covered path and leak metrics confirm the migration.

### Follow-up Questions

- What if acquisition itself throws?
- How does reverse order help nested resources?
- When should ownership move into a type?

### Strong Answer Signals

- Eliminates the acquisition-to-registration gap.
- Aligns lexical scope with actual lifetime.
- Considers cleanup error observability.

### Weak Answer Signals

- Registers cleanup after the first risky operation.
- Uses a force-unwrapped optional resource in defer.
- Extends resource lifetime to function end without need.

### Related Theory

- [defer Registration and Scope](theory.md#defer-registration-and-scope)
- [defer versus RAII-Style Ownership](theory.md#defer-versus-raii-style-ownership)

---

<a id="q4-async-cleanup"></a>
## Q4: How Do Cleanup and Cancellation Interact with async Code?

### What It Evaluates

Staff-level reasoning about synchronous defer, suspension, and lifecycle
ownership.

### Short Answer

Defer can run synchronous cleanup when an async function leaves scope, including
through cancellation errors, but its body cannot await. Suspending cleanup needs
an explicit awaited lifecycle that covers success, failure, and cancellation.
Never hold a blocking lock across await, and revalidate actor state after
suspension before committing work.

### Detailed Answer

Launching an unstructured task from defer is not equivalent to awaited cleanup:
completion, errors, ordering, and process lifetime become uncertain. Prefer an
async operation abstraction whose method performs work and then awaits cleanup in
both success and catch paths, preserving the primary error while recording cleanup
failure.

Cancellation is cooperative. It may surface as a thrown error and trigger defer,
but CPU work or APIs that do not check cancellation continue. Cleanup should be
bounded and safe even when the task is already cancelled.

### Engineering Trade-offs

- Synchronous defer is simple and deterministic but cannot suspend.
- Explicit async cleanup duplicates some control flow unless abstracted.
- Detached cleanup reduces caller latency but weakens delivery and ordering
  guarantees.

### Production Scenario

An upload session needs an awaited server abort on cancellation. A task spawned
from defer is lost when the app suspends. The upload owner instead awaits abort in
its cancellation path and persists recovery state if completion is not possible.

### Follow-up Questions

- Can await appear inside defer?
- Does cancellation automatically stop a loop?
- How should cleanup failure interact with the primary error?

### Strong Answer Signals

- Distinguishes synchronous defer from awaited cleanup.
- Rejects fire-and-forget as an equivalent guarantee.
- Includes cancellation, state revalidation, and error precedence.

### Weak Answer Signals

- Places await directly inside defer.
- Holds a mutex across suspension.
- Assumes cancellation always interrupts immediately.

### Related Theory

- [Exit Coverage and Limits](theory.md#exit-coverage-and-limits)
- [Concurrency and Cancellation](theory.md#concurrency-and-cancellation)
