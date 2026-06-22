---
title: "Property Wrappers and Type Properties: Interview Questions"
domain: "Swift"
topic: "Properties"
concept: "Property Wrappers and Type Properties"
page_type: interview
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Property Wrappers and Type Properties: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What API does a property wrapper create?](#q1-wrapper-api) | Senior | Wrapped, projected, and backing values |
| [When should you use a wrapper instead of a domain type?](#q2-wrapper-or-domain-type) | Senior | Invariant scope |
| [Does a locking wrapper make mutation atomic?](#q3-wrapper-atomicity) | Staff | Compound operations and isolation |
| [How should shared type properties be governed?](#q4-shared-type-state) | Principal | Ownership and platform policy |

---

<a id="q1-wrapper-api"></a>
## Q1: What API Does a Property Wrapper Create?

### Short Answer

The wrapper type supplies `wrappedValue`, exposed as the declared property. It may
supply `projectedValue`, exposed as `$property`. The compiler synthesizes backing
storage, and wrapper initializers determine declaration syntax. Public design must
review wrapped access, projection, initialization, mutability, and copy semantics—not
depend on generated storage names.

### Expanded Answer

`init(wrappedValue:)` supports an initial wrapped value; additional arguments configure
the wrapper. A reference-backed wrapper inside a struct may make copies share state.
Projection should expose a deliberate capability, not raw mutable storage.

### Trade-offs

- Wrappers remove repeated storage policy.
- Generated API can hide cost and ownership.
- Projection is convenient but expands the public contract.

### Example

A persistence wrapper exposes its database handle through `$value`. Replacing the
projection with a narrow status interface prevents callers bypassing ownership.

---

<a id="q2-wrapper-or-domain-type"></a>
## Q2: When Should You Use a Wrapper Instead of a Domain Type?

### Short Answer

Use a wrapper for repeated policy attached to particular storage locations, such as
local clamping or observation. Use a domain type when the invariant must hold wherever
the value travels, is passed, decoded, or stored. Use a service or actor when the
policy needs I/O, asynchronous coordination, or lifecycle ownership.

### Expanded Answer

`@Validated var email: String` protects one property but raw strings can still escape.
An `EmailAddress` type makes invalid states harder to represent across all boundaries.

### Trade-offs

- Wrappers integrate ergonomically with declarations.
- Domain types preserve meaning across APIs.
- Services handle effects but require explicit dependency boundaries.

### Example

A wrapper validates identifiers only in one model; decoded strings bypass it elsewhere.
A domain ID type centralizes parsing and equality across network, storage, and UI.

---

<a id="q3-wrapper-atomicity"></a>
## Q3: Does a Locking Wrapper Make Mutation Atomic?

### Short Answer

Not generally. Locking each getter and setter protects those individual accesses,
but a compound operation such as read-modify-write can release the lock between them
and lose updates. Expose one synchronized mutation operation or isolate the state in
an actor. Do not use unchecked sendability merely to silence diagnostics.

### Expanded Answer

The wrapper must define what operation is atomic, how projection avoids bypassing it,
and how copies share synchronization. Actor isolation is often clearer for async
shared state; a lock-backed final owner can fit synchronous low-level boundaries.

### Trade-offs

- Per-access locks are simple but insufficient for transactions.
- Atomic mutation closures preserve sync access but need reentrancy discipline.
- Actors enforce isolation while adding async access.

### Example

Two tasks execute `counter += 1` through a locking wrapper and lose increments. The
API becomes `increment()` on the isolated owner and tests the final count under load.

---

<a id="q4-shared-type-state"></a>
## Q4: How Should Shared Type Properties Be Governed?

### Short Answer

Keep type properties immutable when possible. For mutable shared state, name one
owner, isolation domain, lifecycle, reset policy, observability contract, and module
boundary. Use global-actor isolation for state genuinely owned there or inject an
actor/service. Standardize exceptions and migration tooling; a type namespace does
not make global state local.

### Expanded Answer

Stored type-property initialization is lazy and once-only, but subsequent access is
not automatically safe. Module default isolation may differ, so exported contracts
should be explicit where callers depend on isolation.

### Trade-offs

- Static constants are simple and deterministic.
- Shared mutable state is convenient but couples tests and features.
- Injected owners add plumbing while making lifecycle and replacement explicit.

### Example

Several modules mutate a static experiment set. The platform moves it behind a
main-actor-owned service, injects snapshots, adds reset-free test fixtures, and tracks callers.
