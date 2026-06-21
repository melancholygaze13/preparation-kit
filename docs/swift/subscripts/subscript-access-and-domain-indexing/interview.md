---
title: "Subscript Access and Domain Indexing: Interview Questions"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Subscript Access and Domain Indexing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is a subscript better than a method?](#q1-subscript-or-method) | Senior | API semantics and effects |
| [Should invalid indexing trap or return optional?](#q2-failure-policy) | Senior | Contract versus expected absence |
| [What makes a collection index valid?](#q3-index-validity) | Senior | Index ownership and invalidation |

---

<a id="q1-subscript-or-method"></a>
## Q1: When Is a Subscript Better Than a Method?

### What It Evaluates

Whether bracket syntax matches the operation's domain and effects.

### Short Answer

Use a subscript for natural, repeatable element lookup by a key or coordinate, with
predictable cost and failure. Use a named method when the operation performs I/O,
needs rich errors or policy, starts work, mutates broader state, or is not conceptually
collection-like. Syntax should not hide cancellation, authorization, or latency.

### Detailed Answer

A directory keyed by `UserID` fits a subscript. Fetching a user from a server fits
`fetchUser(id:) async throws`. Read-write subscripts also need symmetric getter/setter
meaning and failed writes that preserve state.

### Engineering Trade-offs

- Subscripts are concise and composable for lookup.
- Methods communicate effects, policy, and failure better.
- Typed indices improve correctness but add boundary conversion.

### Production Scenario

A subscript blocks on database access. Replacing it with an async repository method
exposes latency, failure, cancellation, and instrumentation.

### Follow-up Questions

- Should bracket access imply constant time?
- When are parameter labels useful?
- How should writes fail?

### Strong Answer Signals

- Uses domain and effect criteria.
- Requires getter/setter consistency.
- Makes operational work explicit.

### Weak Answer Signals

- Uses subscripts solely for shorter syntax.
- Hides remote access behind brackets.
- Ignores complexity.

### Related Theory

- [Failure Policy](theory.md#failure-policy)
- [Engineering Judgment](theory.md#engineering-judgment)

---

<a id="q2-failure-policy"></a>
## Q2: Should Invalid Indexing Trap or Return Optional?

### What It Evaluates

Selection of failure semantics from caller responsibility.

### Short Answer

Trap when an invalid index is a programmer-contract violation, matching standard
collection access. Return optional when absence is expected domain data or input is
untrusted. Use a throwing method when callers need diagnostic categories or recovery.
Do not silently clamp, wrap, or return an unrelated default.

### Detailed Answer

A “safe” optional subscript can prevent crashes at parsing boundaries, but broad use
may conceal logic bugs. Optional element types can also make “missing” versus “present
nil” ambiguous, requiring a richer result or membership check.

### Engineering Trade-offs

- Traps surface programming errors immediately.
- Optionals support normal absence but can be ignored.
- Throws carry detail but make bracket syntax a poor fit.

### Production Scenario

Server-supplied positions use checked optional access; internal layout indices use
trapping access so invariant violations fail near their cause during testing.

### Follow-up Questions

- Why is clamping dangerous?
- How do nested optionals affect lookup?
- Where should untrusted indices be validated?

### Strong Answer Signals

- Separates contract violations from expected absence.
- Rejects silent substitution.
- Accounts for optional ambiguity.

### Weak Answer Signals

- Makes every index optional without policy.
- Returns the nearest element on failure.
- Uses traps for expected external input.

### Related Theory

- [Failure Policy](theory.md#failure-policy)

---

<a id="q3-index-validity"></a>
## Q3: What Makes a Collection Index Valid?

### What It Evaluates

Understanding that indices are collection-specific positions, not universal offsets.

### Short Answer

An index is valid for the collection instance and version that produced it, within
that collection's documented bounds and invalidation rules. It need not be an integer
or zero-based, and advancing it need not be constant time. Do not use indices from
another collection or retain them across invalidating mutation.

### Detailed Answer

Generic code uses `startIndex`, `endIndex`, and collection index APIs rather than
integer arithmetic. Stable domain identity should use a key such as `UserID`, not an
ephemeral in-memory position.

### Engineering Trade-offs

- Native indices preserve collection abstraction.
- Offsets are portable values but may require linear traversal.
- Stable IDs survive reconstruction but require lookup structures.

### Production Scenario

A UI stores array indices as item identity. Reordering displays the wrong item. Stable
IDs replace indices while positions remain transient layout state.

### Follow-up Questions

- What does `endIndex` represent?
- Which mutations invalidate indices?
- When is an integer offset appropriate?

### Strong Answer Signals

- Ties indices to instance and mutation rules.
- Avoids assuming random access.
- Separates identity from position.

### Weak Answer Signals

- Treats every index as a zero-based integer.
- Persists collection indices.
- Uses indices across unrelated collections.

### Related Theory

- [Index Meaning and Stability](theory.md#index-meaning-and-stability)
