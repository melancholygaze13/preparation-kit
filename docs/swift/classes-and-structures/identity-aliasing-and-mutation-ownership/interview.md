---
title: "Identity, Aliasing, and Mutation Ownership: Interview Questions"
domain: "Swift"
topic: "Classes and Structures"
concept: "Identity, Aliasing, and Mutation Ownership"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-08-12
tags:
  - identity
  - aliasing
  - mutation
  - concurrency
---

# Identity, Aliasing, and Mutation Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between equality and identity?](#q1-equality-and-identity) | Senior | `==` versus `===` |
| [What does `let` guarantee for a class reference?](#q2-let-and-mutation) | Senior | Binding versus instance mutation |
| [How should shared mutable state be owned?](#q3-mutation-owner) | Senior | Isolation and lifecycle |
| [How would you migrate distributed aliases behind one owner?](#q4-ownership-migration) | Staff | Boundary migration and rollout |
| [How do you standardize identity and ownership across an organization?](#q5-system-policy) | Principal | Cross-system governance |

---

<a id="q1-equality-and-identity"></a>
## Q1: What Is the Difference Between Equality and Identity?

### Short Answer

`==` applies a type's `Equatable` policy and answers whether two values are equal in
the domain. `===` and `!==` apply to class references and answer whether they point
to the exact same instance. Two account objects can compare equal by stable account
ID while being different in-memory instances. Persist the stable ID, not object identity.

### Expanded Answer

Identity is useful for process-local instance tracking and alias detection. Equality
must be designed around domain meaning and can ignore mutable presentation fields.
Neither an address nor object identity survives reconstruction, relaunch, or another process.

### Trade-offs

- Stable IDs work across storage and services but need rules for uniqueness and reuse.
- Instance identity is precise within one process but does not survive reconstruction.
- Equality that includes mutable fields can destabilize sets, dictionaries, and diffing.

### Example

Two API decodes create separate objects for one user. An identity comparison misses
the duplicate; comparing stable user IDs correctly merges them.

---

<a id="q2-let-and-mutation"></a>
## Q2: What Does `let` Guarantee for a Class Reference?

### Short Answer

`let` prevents rebinding the variable to another instance. It does not make the
referenced class instance immutable, so variable properties can still change. For
a struct binding, changing a stored property mutates the value and is therefore
disallowed. Neither form makes every referenced object immutable.

### Expanded Answer

APIs should not use a constant reference as proof of thread safety or read-only
access. Expose immutable protocols or value snapshots and keep writes behind the owner.

### Trade-offs

- Constant references stabilize which instance is used.
- Immutable interfaces reduce accidental writes but need enforcement in concrete APIs.
- Snapshots remove shared mutation but need an update-delivery strategy and can become stale.

### Example

A service stores a dependency in `let` and assumes callers cannot change it. Another
alias mutates configuration during a request. Moving configuration to immutable values
and owner-controlled updates restores determinism.

---

<a id="q3-mutation-owner"></a>
## Q3: How Should Shared Mutable State Be Owned?

### Short Answer

Give shared mutable state one explicit owner and expose commands plus immutable
snapshots or controlled reads. Use an actor for asynchronous isolated mutation, or
an encapsulated lock-protected final class when synchronous platform constraints
require it. Do not expose mutable storage, and define ordering, cancellation,
shutdown, and observability at the boundary.

### Expanded Answer

The mechanism is less important than ownership. An actor still requires another state check after
suspension; a locked class requires one lock policy and no callbacks while unsafe
state is exposed. Explicit close or cancellation is safer than relying on deinit timing.

### Trade-offs

- Actors enforce isolation but add async boundaries and reentrancy concerns.
- Locks support synchronous access but add contention and deadlock risk.
- Snapshots simplify readers but can be stale or expensive to publish.

### Example

Several features mutate one download dictionary from callbacks. Moving all writes
into an actor establishes ordering and emits value snapshots to UI consumers.

---

<a id="q4-ownership-migration"></a>
## Q4: How Would You Migrate Distributed Aliases Behind One Owner?

### Short Answer

List all aliases and writers. Define the state owner and ordering rules. Introduce
command and snapshot APIs, then route writes through an adapter.
Measure direct mutation, migrate readers and writers in stages, and test old and new
paths together. Remove direct mutation handles only after usage reaches zero. Make
sure rollback can read state produced by either path.

### Expanded Answer

Stable entity IDs replace object identity at boundaries. Compare results from the
old direct-mutation path with snapshots from the new owner to find differences. Rollout
must account for observers, caches, cancellation, tests, and resource lifetime.

### Trade-offs

- Dual paths reduce rollout risk but can create two sources of truth.
- Blocking old writes early protects required rules but requires more migration coordination.
- Publishing snapshots improves isolation but readers may receive changes later.

### Example

A shared account object is directly changed by five modules. An adapter records every
write, forwards it to an actor, compares snapshots, and progressively denies legacy
writes before the raw object is removed.

---

<a id="q5-system-policy"></a>
## Q5: How Do You Standardize Identity and Ownership Across an Organization?

### Short Answer

Define a small set of architecture rules. Stable domain IDs cross process boundaries,
and value snapshots cross concurrency boundaries by default. Every shared mutable
resource names its owner, mutation API, isolation, and lifecycle. Enforce the
contract with reusable boundary types, review checks, and migration support.

### Expanded Answer

Exceptions such as framework objects or latency-sensitive synchronous owners should
record why identity must escape and how synchronization is encapsulated. Ownership
information belongs in API docs and production dashboards so incidents can identify
the state owner and responsible team quickly.

### Trade-offs

- Standard boundaries reduce incidents but can constrain specialized workloads.
- Shared infrastructure accelerates adoption but needs dedicated ownership.
- Enforcement catches code that no longer follows the rules but must permit reviewed, measurable exceptions.

### Example

Multiple apps define conflicting cache and user identity rules. A common entity ID,
snapshot schema, and owner contract eliminate address-based keys and make state
incidents traceable to one service boundary.
