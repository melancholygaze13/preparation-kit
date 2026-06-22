---
title: "Unsafe Memory and Foreign Boundaries: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "Unsafe Memory and Foreign Boundaries"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
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

### Short Answer

The allocation must be live and large enough. The address must be aligned and in
bounds. Memory needs correct type binding and initialization. Access must respect
synchronization, and the owner must release memory exactly once.

### Expanded Answer

Also validate byte arithmetic for overflow and foreign representation assumptions. The proof spans
allocation origin through all aliases and cleanup, not only the load instruction.

### Trade-offs

- Unsafe access enables interop and storage control.
- It moves failures from diagnostics/traps into corruption, crashes, leaks, or races.

### Example

A binary decoder validates header length and multiplication overflow, uses scoped bytes, copies the
validated payload into a safe model, and cleans partial initialization on failure.

---

<a id="q2-scoped-pointer"></a>
## Q2: Why Can a Pointer from `withUnsafe...` Not Normally Escape?

### Short Answer

The API guarantees access only for the closure duration. Afterward, the value/collection may move,
copy, mutate, deallocate, or release temporary storage. The same numeric address is not a lifetime
guarantee.

### Expanded Answer

Perform work inside the closure or copy into independently allocated/owned storage. If an API truly
supports escape, it must document the owner, invalidation events, and deallocator explicitly.

### Trade-offs

- Scoped access avoids copies safely.
- Independent storage supports escape but adds allocation and ownership obligations.

### Example

A C library retains a buffer asynchronously. Swift allocates dedicated storage with an owner object
and completion-based release instead of passing an array's temporary buffer pointer.

---

<a id="q3-unsafe-governance"></a>
## Q3: How Should an Organization Govern Unsafe Swift?

### Short Answer

Inventory and minimize unsafe boundaries, assign owners, require invariant/lifetime documentation and
specialized review, expose safe APIs, run sanitizers/fuzzing, benchmark necessity, track foreign ABI
changes, and define rollback and incident response.

### Expanded Answer

Review rigor follows blast radius and input trust. A tiny stable system adapter differs from a shared
network parser. `@unchecked Sendable` and `Unmanaged` belong in the same proof inventory because they
transfer safety obligations to humans.

### Trade-offs

- Central policy concentrates expertise and reduces duplicated risk.
- Excess ceremony can impede necessary interop, so requirements should be proportional and actionable.

### Example

A platform package becomes the only owner of a C codec. It publishes safe value types, fuzzes malformed
inputs, runs sanitizers in CI, and versions the adapter with the foreign library.
