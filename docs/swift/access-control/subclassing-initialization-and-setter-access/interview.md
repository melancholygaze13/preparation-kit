---
title: "Subclassing, Initialization, and Setter Access: Interview Questions"
domain: "Swift"
topic: "Access Control"
concept: "Subclassing, Initialization, and Setter Access"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subclassing, Initialization, and Setter Access: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do `public` and `open` differ?](#q1-public-open) | Senior | External inheritance |
| [Why is a public struct's memberwise initializer not automatically public?](#q2-memberwise-init) | Senior | Construction invariants |
| [When should a setter be less accessible than its getter?](#q3-restricted-setter) | Staff | Mutation ownership |

---

<a id="q1-public-open"></a>
## Q1: How Do `public` and `open` Differ?

### Short Answer

Public permits external clients to name/use a declaration. For classes, open additionally permits
external subclassing; an open member permits external overriding. Within the defining module, public
classes/members can still be subclassed/overridden unless final.

### Expanded Answer

Open behavior is a long-lived extension contract involving call order, invariants, super calls,
isolation, and evolution. Use final/public when external inheritance is not supported.

### Trade-offs

- Open enables framework customization.
- It constrains implementation evolution around unknown subclasses.

### Example

A framework changes most base controllers to final/public and exposes small protocol strategies;
only one lifecycle base class remains open with downstream fixtures.

---

<a id="q2-memberwise-init"></a>
## Q2: Why Is a Public Struct's Memberwise Initializer Not Automatically Public?

### Short Answer

Stored representation should not automatically become external construction API. Synthesized
initializer access is limited and never implicitly publishes a public memberwise contract. Declare
an explicit public initializer that validates stable inputs.

### Expanded Answer

Otherwise adding/reordering/private storage would break callers and allow invalid combinations.
Synthesis is useful internally, while public construction is a deliberate semantic boundary.

### Trade-offs

- Explicit initializers add code but stabilize invariants/evolution.
- Public memberwise construction tightly couples storage to clients.

### Example

A retry configuration publishes `init(maxAttempts:policy:)` and keeps derived backoff state private,
allowing storage changes without client migration.

---

<a id="q3-restricted-setter"></a>
## Q3: When Should a Setter Be Less Accessible Than Its Getter?

### Short Answer

When consumers need state observation but only the owning type/module/package should perform
transitions. `private(set)`, `internal(set)`, or `package(set)` can expose reads while routing writes
through validated intent methods.

### Expanded Answer

Restricted setters are encapsulation, not synchronization. The owner still needs actor/lock policy
for shared mutation. Choose setter scope to match the component enforcing invariants.

### Trade-offs

- Restricted setters improve auditability and evolution.
- Too-narrow setters can force unnecessary forwarding if ownership is misplaced.

### Example

A download exposes public progress but only its package-level engine updates it; clients call pause,
resume, and cancel instead of assigning fields.
