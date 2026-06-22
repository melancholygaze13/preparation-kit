---
title: "inout Writeback and Mutation APIs: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "inout Writeback and Mutation APIs"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# `inout` Writeback and Mutation APIs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does `inout` guarantee?](#q1-inout-contract) | Senior | Scoped mutation |
| [Why can an observed property react to a no-op `inout` call?](#q2-observed-writeback) | Senior | Writeback effects |
| [When should an API return a value instead?](#q3-return-versus-inout) | Staff | Mutation design |

---

<a id="q1-inout-contract"></a>
## Q1: What Does `inout` Guarantee?

### Short Answer

It grants temporary exclusive mutable access for the call and writes the final value back to caller
storage. It does not guarantee stable address identity, eager copying, thread safety, or a reference
that can escape.

### Expanded Answer

Swift may use direct access or copy-in/copy-out. The source cannot be read or written through another
alias during the call. Callers mark the mutation with `&` and must provide writable storage.

### Trade-offs

- It makes synchronous mutation explicit.
- It restricts aliasing and can expose writeback side effects.

### Example

A byte parser uses `inout` for one local cursor. It returns parsed domain values and never stores a
pointer to the cursor, keeping mutation bounded and testable.

---

<a id="q2-observed-writeback"></a>
## Q2: Why Can an Observed Property React to a No-Op `inout` Call?

### Short Answer

Passing a property `inout` can involve reading a temporary value and assigning it back when the call
ends. That writeback uses the property's setter/observer behavior even if the callee did not change
the logical value.

### Expanded Answer

Do not place expensive or externally visible effects in observers without accounting for `inout`.
Prefer explicit mutation methods when equality suppression or transactional behavior matters.

### Trade-offs

- Property `inout` is convenient for reusable algorithms.
- Writeback can make hidden effects and performance costs observable.

### Example

A validation observer sends analytics on every assignment. A sorting helper passed the property
`inout` and emits redundant events; the API moves analytics to an explicit state transition.

---

<a id="q3-return-versus-inout"></a>
## Q3: When Should an API Return a Value Instead?

### Short Answer

Return a value when the operation is computation, aliases may overlap, failure should commit nothing,
or composition/reentrancy benefits from ending access before mutation. Use `inout` when one synchronous
owner intentionally updates storage in place.

### Expanded Answer

Named results clarify several outputs and make transactional commit explicit. `inout` is appropriate
for measured in-place algorithms and focused state transitions, not as a substitute for return values.

### Trade-offs

- Returned values improve composition and shorten access.
- `inout` can reduce copies and express intentional mutation.

### Example

A geometry API with three `inout` outputs is replaced by a `LayoutResult`; callers validate the full
result and commit it once, eliminating alias conflicts and partial updates.
