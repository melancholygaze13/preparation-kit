---
title: "Stored and Computed Properties: Interview Questions"
domain: "Swift"
topic: "Properties"
concept: "Stored and Computed Properties"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Stored and Computed Properties: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should a value be stored, computed, or cached?](#q1-store-compute-cache) | Senior | Source of truth and cost |
| [What does lazy guarantee?](#q2-lazy-guarantees) | Senior | Lifecycle and concurrency |
| [When should a computed property be a method?](#q3-property-or-method) | Senior | Effects and API expectations |

---

<a id="q1-store-compute-cache"></a>
## Q1: When Should a Value Be Stored, Computed, or Cached?

### What It Evaluates

Whether the candidate protects one source of truth while reasoning about cost.

### Short Answer

Store authoritative facts. Compute deterministic values when their dependencies are
available and the access cost is acceptable. Cache only when measurement justifies
it and the design defines keys, invalidation, memory limits, and concurrency ownership.

### Detailed Answer

Storing a derivation creates consistency work on every dependency change. Computing
can hide repeated hot-path cost. A cache trades that cost for stale-data risk and
state management; it is not automatically an improvement.

### Engineering Trade-offs

- Computation avoids invalidation but spends work per access.
- Storage is direct but can duplicate truth.
- Caching improves selected workloads while adding memory and synchronization.

### Production Scenario

A formatted model value is read thousands of times per frame. Profiling justifies a
bounded cache invalidated by locale and source changes, owned by one isolated service.

### Follow-up Questions

- What is the cache consistency window?
- How would you measure getter cost?
- When should data be precomputed?

### Strong Answer Signals

- Defines authoritative state and invalidation.
- Requires performance evidence.
- Names an isolation owner.

### Weak Answer Signals

- Stores every derivation for speed.
- Adds an unbounded cache without invalidation.
- Ignores concurrent access.

### Related Theory

- [Store, Compute, or Cache](theory.md#store-compute-or-cache)

---

<a id="q2-lazy-guarantees"></a>
## Q2: What Does lazy Guarantee?

### What It Evaluates

Precise knowledge of deferred instance property initialization.

### Short Answer

`lazy` delays a stored property's initializer until first access and requires `var`
because initialization occurs after the instance is initialized. It does not
guarantee single initialization under concurrent first access, atomic later mutation,
or low latency. Isolate access and budget the first-use cost.

### Detailed Answer

Lazy state is useful when expensive setup may never be needed or depends on initialized
instance state. It can retain captured dependencies and move work to an unpredictable
call site. Stored type properties have a different documented single-initialization guarantee.

### Engineering Trade-offs

- Deferral reduces unused startup work.
- First access can become a latency spike.
- Synchronization adds overhead but is required for shared access.

### Production Scenario

A lazily built search index is first accessed from two tasks. The owner moves index
creation behind actor isolation and optionally prewarms it before the latency-critical path.

### Follow-up Questions

- Why must a lazy property be `var`?
- How do type properties differ?
- What can a lazy initializer retain?

### Strong Answer Signals

- Rejects implicit thread safety.
- Considers latency and lifetime.
- Distinguishes instance and type properties.

### Weak Answer Signals

- Promises exactly-once concurrent initialization.
- Uses lazy as a cache invalidation strategy.
- Ignores first-use cost.

### Related Theory

- [Lazy Stored Properties](theory.md#lazy-stored-properties)

---

<a id="q3-property-or-method"></a>
## Q3: When Should a Computed Property Be a Method?

### What It Evaluates

API judgment about field-like access, effects, and cost.

### Short Answer

Use a property for a value naturally viewed as part of the receiver, especially when
access is cheap and unsurprising. Prefer a method when the operation takes arguments,
starts work, mutates external state, is expensive, or needs a name that communicates
policy. Async or throwing getters expose effects, but syntax alone does not make the
operation a good conceptual property.

### Detailed Answer

A read-only property can be mutable over time and can throw or suspend. Callers still
tend to expect property access to be repeatable and bounded. Operationally meaningful
work benefits from an explicit verb and clearer observability.

### Engineering Trade-offs

- Properties create concise, key-path-friendly APIs.
- Methods communicate action and accept policy parameters.
- Effectful getters preserve value vocabulary but can surprise callers.

### Production Scenario

`profile.avatar` performs a network request. Renaming it `loadAvatar()` exposes work,
cancellation, retry policy, and metrics at an explicit operation boundary.

### Follow-up Questions

- Can a getter be async and throwing?
- Does getter-only mean immutable?
- How should expensive derivation be surfaced?

### Strong Answer Signals

- Uses conceptual and operational criteria.
- Makes cost and effects visible.
- Avoids treating getter syntax as purity.

### Weak Answer Signals

- Performs hidden network work in ordinary access.
- Says all read-only properties are constant.
- Chooses solely by shorter syntax.

### Related Theory

- [Effectful Getters](theory.md#effectful-getters)
