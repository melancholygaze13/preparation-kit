---
title: "Unsafe Memory and Foreign Boundaries: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "Unsafe Memory and Foreign Boundaries"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Unsafe Memory and Foreign Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What must be proven before dereferencing an unsafe pointer?](#q1-pointer-proof) | Senior | Memory invariants |
| [Why can a pointer from `withUnsafe...` not normally escape?](#q2-scoped-pointer) | Senior | Lifetime scope |
| [How should an organization govern unsafe Swift?](#q3-unsafe-governance) | Principal | Trust boundary |

---

<a id="q1-pointer-proof"></a>
## Q1: What Must Be Proven Before Dereferencing an Unsafe Pointer?

### What It Evaluates

Completeness of manual memory reasoning.

### Short Answer

The allocation is live and large enough; the address is in bounds and aligned; memory is correctly
bound and initialized for the pointee type; access respects exclusivity/synchronization; and ownership
will be released exactly once with the correct convention.

### Detailed Answer

Also validate byte arithmetic for overflow and foreign representation assumptions. The proof spans
allocation origin through all aliases and cleanup, not only the load instruction.

### Engineering Trade-offs

- Unsafe access enables interop and storage control.
- It moves failures from diagnostics/traps into corruption, crashes, leaks, or races.

### Production Scenario

A binary decoder validates header length and multiplication overflow, uses scoped bytes, copies the
validated payload into a safe model, and cleans partial initialization on failure.

### Follow-up Questions

- What is memory binding?
- How do alignment requirements affect raw loads?

### Strong Answer Signals

- Covers lifetime, bounds, alignment, binding, initialization, aliasing, and ownership.

### Weak Answer Signals

- Checks only non-nullness.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-scoped-pointer"></a>
## Q2: Why Can a Pointer from `withUnsafe...` Not Normally Escape?

### What It Evaluates

Scoped storage validity.

### Short Answer

The API guarantees access only for the closure duration. Afterward, the value/collection may move,
copy, mutate, deallocate, or release temporary storage. The same numeric address is not a lifetime
guarantee.

### Detailed Answer

Perform work inside the closure or copy into independently allocated/owned storage. If an API truly
supports escape, it must document the owner, invalidation events, and deallocator explicitly.

### Engineering Trade-offs

- Scoped access avoids copies safely.
- Independent storage supports escape but adds allocation and ownership obligations.

### Production Scenario

A C library retains a buffer asynchronously. Swift allocates dedicated storage with an owner object
and completion-based release instead of passing an array's temporary buffer pointer.

### Follow-up Questions

- How can array mutation invalidate storage?
- When is copying the better design?

### Strong Answer Signals

- Ties validity to documented scope, not address stability.

### Weak Answer Signals

- Stores the pointer because a test showed the same address.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q3-unsafe-governance"></a>
## Q3: How Should an Organization Govern Unsafe Swift?

### What It Evaluates

Principal-level risk and ownership judgment.

### Short Answer

Inventory and minimize unsafe boundaries, assign owners, require invariant/lifetime documentation and
specialized review, expose safe APIs, run sanitizers/fuzzing, benchmark necessity, track foreign ABI
changes, and define rollback and incident response.

### Detailed Answer

Review rigor follows blast radius and input trust. A tiny stable system adapter differs from a shared
network parser. `@unchecked Sendable` and `Unmanaged` belong in the same proof inventory because they
transfer safety obligations to humans.

### Engineering Trade-offs

- Central policy concentrates expertise and reduces duplicated risk.
- Excess ceremony can impede necessary interop, so requirements should be proportional and actionable.

### Production Scenario

A platform package becomes the only owner of a C codec. It publishes safe value types, fuzzes malformed
inputs, runs sanitizers in CI, and versions the adapter with the foreign library.

### Follow-up Questions

- Which unsafe changes require security review?
- What evidence justifies a zero-copy path?

### Strong Answer Signals

- Covers ownership, testing, evidence, compatibility, and incidents.

### Weak Answer Signals

- Relies on code review intuition alone.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
