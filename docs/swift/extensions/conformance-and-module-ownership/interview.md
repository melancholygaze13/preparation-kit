---
title: "Conformance and Module Ownership: Interview Questions"
domain: "Swift"
topic: "Extensions"
concept: "Conformance and Module Ownership"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Conformance and Module Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is a retroactive conformance and why is it risky?](#q1-retroactive-conformance) | Senior | Global uniqueness |
| [Does @retroactive make a conformance safe?](#q2-retroactive-attribute) | Staff | Warning acknowledgment |
| [How should an organization govern extension ownership?](#q3-extension-governance) | Principal | Compatibility and rollout |

---

<a id="q1-retroactive-conformance"></a>
## Q1: What Is a Retroactive Conformance and Why Is It Risky?

### Short Answer

A retroactive conformance makes a type from one imported module conform to a protocol
from another imported module. Conformances are globally unique at runtime, so either
owner can later add the same conformance and create build failures or undefined witness selection.

### Expanded Answer

The risk propagates to every client importing a library that declares it. Different
implementations can disagree about identity, hashing, equality, encoding, or ordering,
and persisted data can outlive the binary that supplied the original semantics.

### Trade-offs

- Retroactive conformance gives immediate generic integration.
- A wrapper adds ceremony but owns semantics and migration.

### Example

A library makes `Date` identifiable using one epoch; Foundation later adds another
identity definition. Rebuilt clients conflict and persisted identifiers no longer agree.

---

<a id="q2-retroactive-attribute"></a>
## Q2: Does @retroactive Make a Conformance Safe?

### Short Answer

No. `@retroactive` acknowledges and suppresses the Swift 6 warning when both declarations
are imported. It does not reserve the conformance, coordinate with upstream owners, or
resolve a future duplicate. Prefer an owned wrapper.

### Expanded Answer

If the conformance is unavoidable in a closed deployment, assign one owner, inventory
clients, monitor upstream betas, avoid persistent semantics where possible, and prepare
a migration to an adapter or wrapper.

### Trade-offs

- Explicit annotation makes risk searchable.
- It can normalize a dangerous pattern if review treats it as routine syntax.

### Example

A closed enterprise app temporarily bridges a vendor type. The conformance is blocked
from shared libraries and has an expiry tied to the vendor's next SDK release.

---

<a id="q3-extension-governance"></a>
## Q3: How Should an Organization Govern Extension Ownership?

### Short Answer

Assign public extensions and conformances to modules that own the semantics, register
retroactive conformances centrally, prohibit them in broadly distributed libraries by
default, compile downstream fixtures, and test platform betas for collisions.

### Expanded Answer

Review should cover name ownership, protocol law, isolation, persistence, binary
distribution, upstream evolution, and removal strategy. Extensions on primitives and
SDK types need naming conventions or wrappers to avoid organization-wide API pollution.

### Trade-offs

- Central review slows local convenience changes.
- It prevents dependency-wide source breaks and unclear support ownership.

### Example

An internal platform team inventories foreign-type extensions, moves feature-specific
ones to wrappers, and adds beta-toolchain client builds before the annual SDK rollout.
