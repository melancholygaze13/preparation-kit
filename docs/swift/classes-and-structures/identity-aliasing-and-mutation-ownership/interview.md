---
title: "Identity, Aliasing, and Mutation Ownership: Interview Questions"
domain: "Swift"
topic: "Classes and Structures"
concept: "Identity, Aliasing, and Mutation Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-20
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
| [What does let guarantee for a class reference?](#q2-let-and-mutation) | Senior | Binding versus instance mutation |
| [How should shared mutable state be owned?](#q3-mutation-owner) | Senior | Isolation and lifecycle |
| [How would you migrate distributed aliases behind one owner?](#q4-ownership-migration) | Staff | Boundary migration and rollout |
| [How do you standardize identity and ownership across an organization?](#q5-system-policy) | Principal | Cross-system governance |

---

<a id="q1-equality-and-identity"></a>
## Q1: What Is the Difference Between Equality and Identity?

### What It Evaluates

Whether the candidate separates domain equivalence from instance sameness.

### Short Answer

`==` applies a type's `Equatable` policy and answers whether two values are equal in
the domain. `===` and `!==` apply to class references and answer whether they point
to the exact same instance. Two account objects can compare equal by stable account
ID while being different in-memory instances. Persist the stable ID, not object identity.

### Detailed Answer

Identity is useful for process-local instance tracking and alias detection. Equality
must be designed around domain meaning and can ignore mutable presentation fields.
Neither an address nor object identity survives reconstruction, relaunch, or another process.

### Engineering Trade-offs

- Stable IDs work across storage and services but require collision and lifecycle policy.
- Instance identity is precise locally but ephemeral.
- Equality that includes mutable fields can destabilize sets, dictionaries, and diffing.

### Production Scenario

Two API decodes create separate objects for one user. An identity comparison misses
the duplicate; comparing stable user IDs correctly merges them.

### Follow-up Questions

- Can classes conform to `Equatable`?
- When is `===` appropriate?
- What fields should define equality?

### Strong Answer Signals

- Gives distinct examples for equality and identity.
- Keeps object identity process-local.
- Connects equality to stable domain policy.

### Weak Answer Signals

- Treats `==` and `===` as interchangeable.
- Persists an object address.
- Includes arbitrary mutable fields in identity.

### Related Theory

- [Identity Versus Equality](theory.md#identity-versus-equality)

---

<a id="q2-let-and-mutation"></a>
## Q2: What Does let Guarantee for a Class Reference?

### What It Evaluates

Precise understanding of binding immutability.

### Short Answer

`let` prevents rebinding the variable to another instance. It does not make the
referenced class instance immutable, so variable properties can still change. For
a struct binding, changing a stored property mutates the value and is therefore
disallowed. Neither form implies transitive immutability of referenced objects.

### Detailed Answer

APIs should not use a constant reference as proof of thread safety or read-only
access. Expose immutable protocols or value snapshots and keep writes behind the owner.

### Engineering Trade-offs

- Constant references stabilize which instance is used.
- Immutable interfaces reduce accidental writes but need enforcement in concrete APIs.
- Snapshots remove shared mutation at the cost of publication and staleness.

### Production Scenario

A service stores a dependency in `let` and assumes callers cannot change it. Another
alias mutates configuration during a request. Moving configuration to immutable values
and owner-controlled updates restores determinism.

### Follow-up Questions

- Does `private(set)` make an instance thread-safe?
- Can a `let` struct contain a mutable class?
- How would you expose read-only state?

### Strong Answer Signals

- Separates reference rebinding from instance mutation.
- Rejects transitive immutability claims.
- Proposes an ownership boundary.

### Weak Answer Signals

- Calls every `let` object immutable.
- Assumes access control is synchronization.
- Ignores other aliases.

### Related Theory

- [Aliasing and let](theory.md#aliasing-and-let)

---

<a id="q3-mutation-owner"></a>
## Q3: How Should Shared Mutable State Be Owned?

### What It Evaluates

Design judgment about isolation, synchronization, and lifecycle.

### Short Answer

Give shared mutable state one explicit owner and expose commands plus immutable
snapshots or controlled reads. Use an actor for asynchronous isolated mutation, or
an encapsulated lock-protected final class when synchronous platform constraints
require it. Do not expose mutable storage, and define ordering, cancellation,
shutdown, and observability at the boundary.

### Detailed Answer

The primitive is secondary to ownership. An actor still requires revalidation after
suspension; a locked class requires one lock policy and no callbacks while unsafe
state is exposed. Explicit close or cancellation is safer than relying on deinit timing.

### Engineering Trade-offs

- Actors enforce isolation but add async boundaries and reentrancy concerns.
- Locks support synchronous access but add contention and deadlock risk.
- Snapshots simplify readers but can be stale or expensive to publish.

### Production Scenario

Several features mutate one download dictionary from callbacks. Moving all writes
into an actor establishes ordering and emits value snapshots to UI consumers.

### Follow-up Questions

- What invariant can fail across actor suspension?
- When is a lock-backed class preferable?
- How should shutdown be tested?

### Strong Answer Signals

- Defines one mutation authority.
- Covers lifecycle and observability, not only race prevention.
- Understands actor reentrancy.

### Weak Answer Signals

- Adds locks at each call site.
- Exposes the mutable dictionary for convenience.
- Treats ARC as a shutdown protocol.

### Related Theory

- [Mutation Ownership](theory.md#mutation-ownership)
- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q4-ownership-migration"></a>
## Q4: How Would You Migrate Distributed Aliases Behind One Owner?

### What It Evaluates

Staff-level incremental migration of mutation authority.

### Short Answer

Inventory all aliases and writers, define the authoritative owner and ordering
contract, introduce command and snapshot APIs, then route writes through an adapter.
Instrument direct mutation, migrate readers and writers in stages, test mixed-mode
consistency, and remove raw handles only after usage reaches zero. Keep rollback able
to read state produced by either path.

### Detailed Answer

Stable entity IDs replace object identity at boundaries. Shadow comparisons can
detect divergence between old direct mutation and owner-produced snapshots. Rollout
must account for observers, caches, cancellation, tests, and resource lifetime.

### Engineering Trade-offs

- Dual paths reduce rollout risk but can create two sources of truth.
- Blocking old writes early protects invariants but increases migration coordination.
- Snapshot publication improves isolation while adding consistency latency.

### Production Scenario

A shared account object is directly changed by five modules. A facade records every
write, forwards it to an actor, compares snapshots, and progressively denies legacy
writes before the raw object is removed.

### Follow-up Questions

- How do you prevent two sources of truth?
- What telemetry proves completion?
- How does rollback handle new state?

### Strong Answer Signals

- Finds writers before changing representation.
- Includes adapters, telemetry, mixed mode, and rollback.
- Replaces object identity at boundaries.

### Weak Answer Signals

- Requires one coordinated flag day without dependency evidence.
- Migrates readers but leaves direct writers.
- Omits rollback and consistency checks.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)

---

<a id="q5-system-policy"></a>
## Q5: How Do You Standardize Identity and Ownership Across an Organization?

### What It Evaluates

Principal-level governance of boundaries shared by many teams.

### Short Answer

Define a small architecture contract: stable domain IDs cross process boundaries,
value snapshots cross concurrency and module boundaries by default, and every shared
mutable resource names one owning component, mutation API, isolation mechanism, and
lifecycle protocol. Enforce it with reusable boundary types, review checks, telemetry,
and migration support rather than relying only on documentation.

### Detailed Answer

Exceptions such as framework objects or latency-sensitive synchronous owners should
record why identity must escape and how synchronization is encapsulated. Ownership
metadata belongs in API docs and operational dashboards so incidents can identify
the authoritative state and team quickly.

### Engineering Trade-offs

- Standard boundaries reduce incidents but can constrain specialized workloads.
- Shared infrastructure accelerates adoption but needs dedicated ownership.
- Enforcement catches drift but must permit reviewed, measurable exceptions.

### Production Scenario

Multiple apps define conflicting cache and user identity rules. A common entity ID,
snapshot schema, and owner contract eliminate address-based keys and make state
incidents traceable to one service boundary.

### Follow-up Questions

- Which exceptions are legitimate?
- How would you detect leaked mutable references?
- Who owns schema and migration tooling?

### Strong Answer Signals

- Combines technical rules with ownership and enforcement.
- Provides an exception and migration process.
- Connects policy to incident response.

### Weak Answer Signals

- Publishes style guidance without adoption mechanisms.
- Mandates actors for every type regardless of constraints.
- Leaves shared infrastructure without an owning team.

### Related Theory

- [System Impact](theory.md#system-impact)
- [Organizational Impact](theory.md#organizational-impact)
