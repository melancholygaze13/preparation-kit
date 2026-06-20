---
title: "Conditional and Logical Operators: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Conditional and Logical Operators"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - ternary-operator
  - boolean-logic
  - short-circuiting
  - evaluation-order
---

# Conditional and Logical Operators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does Swift evaluate a ternary conditional expression?](#q1-ternary-evaluation) | Senior | Branch evaluation and type checking |
| [How do `&&` and `||` short-circuit, and why does operand order matter?](#q2-short-circuiting) | Senior | Safety, cost, and side effects |
| [How would you make a complex Boolean rule maintainable?](#q3-readable-policy) | Senior | Precedence, naming, and domain modeling |
| [Does short-circuit evaluation make a decision thread-safe?](#q4-concurrency) | Senior | Isolation and consistent snapshots |
| [How should consequential Boolean policy be governed across a system?](#q5-policy-governance) | Staff | Ownership, rollout, and observability |

---

<a id="q1-ternary-evaluation"></a>
## Q1: How Does Swift Evaluate a Ternary Conditional Expression?

### What It Evaluates

Whether the candidate understands that a ternary is value-producing control flow,
not eager evaluation of three ordinary operands.

### Short Answer

Swift first evaluates the Boolean condition, then evaluates exactly one result
expression: the expression after `?` when true or the expression after `:` when
false. The selected expression supplies the value. Both alternatives must still
type-check for the surrounding context. Use a ternary for a simple two-value
choice, not nested or effect-heavy control flow.

### Detailed Answer

```swift
let message = isOnline ? cachedMessage() : offlineMessage()
```

Only one function call runs. Runtime branch selection is lazy, but compile-time
checking still covers both calls and their result compatibility.

This makes a ternary useful for a short assignment, argument, or return value.
Once either branch needs multiple operations, logging, throwing behavior, or
explanation, `if` or `switch` makes control flow easier to review. Nested
ternaries are particularly risky because a reader must reconstruct both branch
ownership and operator grouping.

### Engineering Trade-offs

- A ternary keeps a simple value choice local and concise.
- An `if` or `switch` uses more syntax but exposes branch behavior.
- Effects in a branch are valid but are easier to miss in expression form.

### Production Scenario

A cell configuration chooses a compact title from two already available strings.
A ternary is clear. If the fallback must fetch, log, and update state, explicit
control flow makes lifecycle and failure behavior visible.

### Follow-up Questions

- Does the unselected branch need to compile?
- When would you replace a ternary with `switch`?
- Why are nested ternaries difficult to maintain?

### Strong Answer Signals

- States that exactly one result expression executes.
- Separates runtime evaluation from compile-time type checking.
- Chooses syntax based on branch complexity and effects.

### Weak Answer Signals

- Claims both result expressions execute before selection.
- Assumes an unreachable branch can contain invalid code.
- Treats terseness as sufficient justification for nesting.

### Related Theory

- [Ternary Conditional Operator](theory.md#ternary-conditional-operator)

---

<a id="q2-short-circuiting"></a>
## Q2: How Do `&&` and `||` Short-Circuit, and Why Does Operand Order Matter?

### What It Evaluates

Understanding of left-to-right evaluation, skipped work, safe guards, and
effectful operands.

### Short Answer

Swift evaluates the left operand first. `&&` skips the right operand when the
left is false; `||` skips it when the left is true. Put required guards before
operations they protect. Ordering can also avoid expensive work, but don't hide
required mutation, logging, or I/O in an operand that might be skipped.

### Detailed Answer

```swift
if values.indices.contains(index) && values[index].isReady {
    consume(values[index])
}
```

The first predicate proves the subscript is valid before the subscript executes.
Reversing the operands can trap. Similarly, a cheap pure cache check on the left
of `||` can avoid a more expensive fallback.

The operators aren't freely commutative at the program-behavior level. `a && b`
and `b && a` have the same truth table for stable Boolean values, but may call
different code before returning, fail differently, or observe mutable state in a
different order.

### Engineering Trade-offs

- Short-circuiting can encode a precondition and avoid unnecessary work.
- Inline guards are compact but can hide a meaningful validation boundary.
- Explicit statements are longer but make required effects unambiguous.

### Production Scenario

An image pipeline checks that a request remains current before starting a decode.
The currency check goes first so stale work is skipped. Metrics that must count
every request are emitted separately, not as the right operand of `&&`.

### Follow-up Questions

- What changes if the operands are swapped?
- Can the right operand mutate state?
- How would you test that an expensive fallback was skipped?

### Strong Answer Signals

- Gives the exact skip condition for both operators.
- Connects operand order to traps, cost, and side effects.
- Keeps mandatory effects outside a potentially skipped expression.

### Weak Answer Signals

- Describes only the final truth tables.
- Assumes Boolean operands can always be reordered.
- Relies on a skipped logging call for required observability.

### Related Theory

- [Logical AND and Short-Circuiting](theory.md#logical-and-and-short-circuiting)
- [Logical OR and Short-Circuiting](theory.md#logical-or-and-short-circuiting)

---

<a id="q3-readable-policy"></a>
## Q3: How Would You Make a Complex Boolean Rule Maintainable?

### What It Evaluates

Ability to move from correct syntax to reviewable, testable domain policy.

### Short Answer

First make grouping explicit with parentheses, especially when mixing `&&` and
`||`. Then extract named predicates that describe domain meaning rather than
mechanics. If several Booleans represent mutually exclusive states or allow
invalid combinations, replace them with an enum or state machine. Centralize
consequential shared policy behind an owned API.

### Detailed Answer

Although `&&` binds more tightly than `||`, relying on remembered precedence
makes policy harder to review:

```swift
let passedPrimaryAuthentication = enteredCode && passedBiometrics
let canEnter = passedPrimaryAuthentication || hasRecoveryKey
```

This form names the intended exception path. A dedicated function can return a
decision plus a reason code, enabling focused tests and useful diagnostics.

Apply De Morgan's laws carefully. They preserve truth values for pure operands,
but a rewrite can change which effectful expression executes or when mutable
state is read. For several state dimensions, an enum can make invalid states
unrepresentable rather than asking every caller to reproduce a Boolean formula.

### Engineering Trade-offs

- Parentheses are local and cheap but don't remove duplicated policy.
- Named predicates improve reviewability but still allow invalid Boolean states.
- An enum or policy type adds structure and migration work but centralizes rules.

### Production Scenario

Access depends on account state, device trust, and a recovery exception. The team
moves the rule from view controllers into an authorization evaluator that accepts
an immutable facts snapshot and returns `.allowed(reason:)` or `.denied(reason:)`.

### Follow-up Questions

- What is the precedence relationship between `&&` and `||`?
- When are De Morgan transformations safe?
- When should correlated Booleans become an enum?

### Strong Answer Signals

- Uses names to reveal domain intent and exception paths.
- Distinguishes parsing correctness from maintainability.
- Escalates important repeated logic into an owned abstraction.

### Weak Answer Signals

- Adds parentheses without addressing duplication or invalid states.
- Produces a single longer negated expression.
- Treats access policy as presentation-layer convenience logic.

### Related Theory

- [Combining Logical Operators](theory.md#combining-logical-operators)
- [System Impact](theory.md#system-impact)

---

<a id="q4-concurrency"></a>
## Q4: Does Short-Circuit Evaluation Make a Decision Thread-Safe?

### What It Evaluates

Whether the candidate separates ordered expression evaluation from synchronized
state access.

### Short Answer

No. Short-circuiting defines which operand is evaluated next or skipped; it
doesn't lock state or create an atomic snapshot. Two predicates can observe
different versions of shared mutable data. Evaluate a critical invariant inside
its actor or lock owner, or take one immutable snapshot and decide from that.

### Detailed Answer

An expression such as:

```swift
account.isActive && account.hasPermission
```

doesn't prove that both properties came from one coherent account version. State
can change between accesses if ownership permits concurrent mutation. A skipped
right operand also means work attached to it won't begin.

Move the decision to the state owner or expose a snapshot containing the facts
needed for the policy. If the decision precedes slow external work, revalidate
inside isolation before committing because the snapshot can become stale while
the work is in flight.

### Engineering Trade-offs

- Actor or lock isolation gives a coherent local decision but must remain brief.
- Immutable snapshots simplify reasoning but can become stale.
- Holding isolation across slow work preserves serialization at a throughput and
  reentrancy cost.

### Production Scenario

A task checks that a session is valid and then uploads. It reads one session
snapshot, performs the upload outside the actor, and asks the actor to revalidate
the session generation before recording success.

### Follow-up Questions

- Does left-to-right evaluation imply atomicity?
- When should a snapshot be revalidated?
- Should network work run while actor-isolated?

### Strong Answer Signals

- Explicitly denies synchronization or snapshot guarantees.
- Identifies time-of-check/time-of-use risk.
- Balances isolation correctness with slow-work throughput.

### Weak Answer Signals

- Calls one Boolean expression atomic.
- Assumes `let` or source order makes reference state immutable.
- Holds a lock across arbitrary I/O without discussing consequences.

### Related Theory

- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q5-policy-governance"></a>
## Q5: How Should Consequential Boolean Policy Be Governed Across a System?

### What It Evaluates

Staff-level judgment about policy ownership, consistency, migration, and
operational evidence.

### Short Answer

Separate facts from policy, give the policy a named owner and versioned contract,
and return auditable reason codes rather than only a Boolean. Test the complete
truth table and boundary cases. For a risky change, compare old and new evaluators
against the same snapshot, observe discrepancies, roll out gradually, and retain
a rollback path.

### Detailed Answer

Authorization, eligibility, and rollout expressions often spread across apps,
services, and configuration. Local rewrites then create inconsistent user states
and make incidents difficult to explain.

A shared evaluator should define required facts, consistency expectations,
failure defaults, and version compatibility. It should remain deterministic for
one immutable input where possible. Structured outcomes support telemetry without
logging credentials or personal data.

During migration, shadow evaluation is meaningful only when both implementations
receive the same facts. Otherwise differences may reflect input races rather than
policy changes.

### Engineering Trade-offs

- Centralization improves consistency but adds dependency and release coupling.
- Client-side evaluation supports offline behavior but requires version and
  configuration discipline.
- Reason codes improve diagnosis but become an API that needs privacy review and
  compatibility management.

### Production Scenario

Several clients implement subscription eligibility differently. The organization
defines a versioned decision contract, distributes one rules package, shadows the
new evaluator, dashboards reason-code differences, and rolls enforcement out by
client version with a server-controlled rollback.

### Follow-up Questions

- Where should the authoritative decision live?
- How do you compare two policies safely?
- What information should reason-code telemetry exclude?

### Strong Answer Signals

- Addresses ownership, versioning, rollout, rollback, and privacy.
- Uses the same immutable facts for policy comparison.
- Recognizes offline and cross-client consistency trade-offs.

### Weak Answer Signals

- Suggests copying the same expression into each client.
- Changes enforcement without shadow evidence or rollback.
- Logs raw sensitive inputs to explain decisions.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
