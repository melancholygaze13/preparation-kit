---
title: "Associated Values and Pattern Matching: Interview Questions"
domain: "Swift"
topic: "Enumerations"
concept: "Associated Values and Pattern Matching"
page_type: interview
interview_priority: high
estimated_read_minutes: 5
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - associated-values
  - pattern-matching
  - state-machines
---

# Associated Values and Pattern Matching: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do associated values differ from raw values?](#q1-associated-versus-raw) | Senior | Per-instance payload versus fixed representation |
| [When should you use switch, if case, guard case, or for case?](#q2-pattern-selection) | Senior | Exhaustive versus selective handling |
| [How should an associated-value payload be structured?](#q3-payload-design) | Senior | Labels, named types, and common metadata |
| [What do enum value semantics mean for reference-type payloads?](#q4-reference-payloads) | Senior | Structural independence and aliasing |

---

<a id="q1-associated-versus-raw"></a>
## Q1: How Do Associated Values Differ from Raw Values?

### Short Answer

Associated values are supplied each time an enum instance is constructed and can
have different types and values per case. A raw value is one fixed unique literal
chosen in the enum declaration, with the same raw type for every case. Use
associated values for state payload; use raw values for a stable external code only
when that mapping is intentional.

### Expanded Answer

`.loaded(document)` can hold a different document in every value. A raw string
such as `.loaded = "loaded"` is always the same code and cannot hold the document.
An enum case cannot use raw value syntax as a substitute for associated payload.

Raw-value initialization is failable because external input may not match a known
case. Associated construction is type-checked by the selected case constructor.

### Trade-offs

- Associated values model rich state but couple patterns to payload shape.
- Raw values integrate simple codes but require unknown-input policy.
- Explicit encoding can support both case tag and payload without conflating them.

### Example

An API models HTTP failure details by trying to make every status code an enum raw
case. Associated `.failure(status: Int, body: Data?)` better represents the open
code space while retaining typed state.

---

<a id="q2-pattern-selection"></a>
## Q2: When Should You Use switch, if case, guard case, or for case?

### Short Answer

Use switch when every enum case needs explicit policy. Use `if case` for optional
one-case behavior, `guard case` when the rest of the scope requires one case, and
`for case` to intentionally process only matching elements. Selective forms ignore
nonmatches unless an else path handles them, so they are inappropriate when
discarded states need errors, metrics, or fallback.

### Expanded Answer

All forms can bind associated values, and patterns can include `where` clauses.
Switch provides compiler exhaustiveness and clearer policy for state machines.
Guard case flattens the required success path. For case is concise for extracting
successes but dangerous in imports if failures disappear silently.

### Trade-offs

- Switch is explicit and migration-sensitive.
- Selective patterns reduce ceremony for genuinely irrelevant states.
- Filtering patterns can hide data loss.

### Example

An import loop uses `for case .success` and loses all failures. A switch retains
valid records while counting, reporting, and enforcing a failure threshold.

---

<a id="q3-payload-design"></a>
## Q3: How Should an Associated-Value Payload Be Structured?

### Short Answer

Use labeled associated values for a few obvious fields. Use a named payload type
when fields have their own invariants, methods, reuse, or likely evolution. Put
metadata shared by every state in a wrapper struct rather than duplicating it in
each case. Avoid optional bags and `Any`, which make invalid states representable
again.

### Expanded Answer

Repeated primitive types need labels to prevent construction mistakes. A named
failure context can own retry policy and request identity while keeping the enum
case shape stable.

If every state carries a timestamp and source, a `Snapshot { metadata, state }`
wrapper separates lifecycle facts from the mutually exclusive state. This also
avoids destructuring the same common values in every switch.

### Trade-offs

- Inline payloads are concise and tightly scoped.
- Named payloads add types while localizing evolution.
- Wrappers separate common data but introduce another layer.

### Example

A `.failed(Error, Bool, UUID, Date)` case becomes unreadable and fragile. A named
`FailureContext` defines retry policy, request identity, and diagnostics explicitly.

---

<a id="q4-reference-payloads"></a>
## Q4: What Do Enum Value Semantics Mean for Reference-Type Payloads?

### Short Answer

Copying an enum creates an independent enum value: replacing one copy's case does
not replace the other. If the associated payload is a class reference, both enum
values can still reference the same object, so object mutation is visible through
both. Value semantics isolate the case and payload slot, not the referenced graph.

### Expanded Answer

This distinction matters for snapshots and `Sendable`. An enum containing a
mutable non-Sendable class is not a safe immutable snapshot merely because the
enum is a value type.

Use value payloads, immutable references, actors, or explicit deep-copy policy
according to identity and concurrency needs. Boxing a large payload changes
ownership semantics and should not be treated as a transparent optimization.

### Trade-offs

- Reference payloads preserve identity and avoid large value copies.
- Value payloads support stronger snapshot reasoning.
- Deep copies isolate graphs at explicit cost and complexity.

### Example

Two state snapshots carry the same mutable document object. Editing the latest
snapshot changes the historical one. Moving document state to a value model makes
snapshot history reliable.
