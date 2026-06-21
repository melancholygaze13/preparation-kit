---
title: "Bitwise and Overflow Arithmetic: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Bitwise and Overflow Arithmetic"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Bitwise and Overflow Arithmetic: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When are overflow operators appropriate?](#q1-wrapping-policy) | Senior | Modular arithmetic |
| [How would you decode a bit field safely?](#q2-bit-field) | Senior | Representation validation |
| [Why is a bit mask not a synchronization primitive?](#q3-bitmask-concurrency) | Staff | Atomicity |

---

<a id="q1-wrapping-policy"></a>
## Q1: When Are Overflow Operators Appropriate?

### What It Evaluates

Overflow policy and domain reasoning.

### Short Answer

Use `&+`, `&-`, and `&*` only when arithmetic is intentionally modulo the fixed width, such as a
specified hash/checksum or wrapping counter. Use ordinary checked arithmetic, validation, or
reporting-overflow for sizes, money, indexes, and untrusted input.

### Detailed Answer

Wrapping preserves low bits and discards overflow, producing a valid-looking value. It must be part
of the algorithm, not a crash-avoidance patch.

### Engineering Trade-offs

- Wrapping expresses modular arithmetic directly.
- It can conceal invariant and security failures.

### Production Scenario

A packet parser rejects `offset + length` overflow with reporting APIs; its CRC implementation uses
documented wrapping arithmetic internally.

### Follow-up Questions

- What does reporting overflow return?
- Does ordinary integer arithmetic wrap in release builds?

### Strong Answer Signals

- Restricts wrapping to explicit modular domains.

### Weak Answer Signals

- Uses `&+` anywhere overflow might occur.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-bit-field"></a>
## Q2: How Would You Decode a Bit Field Safely?

### What It Evaluates

Representation and compatibility judgment.

### Short Answer

Define width, byte order, masks, signedness, valid combinations, and reserved/unknown-bit policy;
validate length and conversions first; extract with typed masks; then return a nominal validated type.

### Detailed Answer

Golden vectors across implementations catch endianness and shift mistakes. Preserve unknown bits only
when forward compatibility requires round trips; otherwise reject unsupported flags explicitly.

### Engineering Trade-offs

- Strict validation prevents ambiguity.
- Unknown-bit preservation can improve forwarding compatibility but complicates semantics.

### Production Scenario

A capabilities byte becomes an `OptionSet` plus retained unknown bits, with versioned golden vectors
shared by iOS and server teams.

### Follow-up Questions

- How do signed shifts differ?
- When should unknown bits be rejected?

### Strong Answer Signals

- Covers width, endianness, reserved bits, and safe output.

### Weak Answer Signals

- Applies a mask without validating source representation.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-bitmask-concurrency"></a>
## Q3: Why Is a Bit Mask Not a Synchronization Primitive?

### What It Evaluates

Separation of compact representation and atomic state.

### Short Answer

Ordinary read-modify-write operators on an integer are not a concurrency contract. Multiple tasks can
lose updates or race even when state fits in one word. Use an actor, lock, or a correctly designed
atomic algorithm with explicit ordering.

### Detailed Answer

Atomic access to one word still may not protect invariants spanning several values or operations.
Choose synchronization from the whole transition.

### Engineering Trade-offs

- Bit packing is compact.
- Synchronization adds ordering/coordination necessary for shared mutation.

### Production Scenario

Concurrent feature-flag updates race with `flags |= newFlag`. An actor owns the set and publishes
immutable snapshots.

### Follow-up Questions

- When could an atomic integer be appropriate?
- How does memory ordering matter?

### Strong Answer Signals

- Rejects assumed atomicity and covers compound invariants.

### Weak Answer Signals

- Equates machine-word size with thread safety.

### Related Theory

- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)
