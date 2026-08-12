---
title: "State Ownership and Source of Truth: Interview Questions"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "State Ownership and Source of Truth"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
tags:
  - state-ownership
  - source-of-truth
  - data-flow
---

# State Ownership and Source of Truth: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does single source of truth mean in an iOS app?](#q1-what-does-single-source-of-truth-mean-in-an-ios-app) | Senior | Authority and scope |
| [Where should SwiftUI state live?](#q2-where-should-swiftui-state-live) | Senior | Lifetime and data flow |
| [How do you prevent state from becoming inconsistent?](#q3-how-do-you-prevent-state-from-becoming-inconsistent) | Senior | Derived state and transitions |
| [How do you model local and remote state together?](#q4-how-do-you-model-local-and-remote-state-together) | Staff | Offline authority and conflict |

---

<a id="q1-what-does-single-source-of-truth-mean-in-an-ios-app"></a>
## Q1: What does single source of truth mean in an iOS app?

### Short Answer

It means each mutable fact has one authoritative owner within a defined scope.
Other components can receive a value, observe it, or request changes, but they do
not maintain an unsynchronized copy. An app can have many sources of truth: local UI,
feature, session, database, and server state.

### Expanded Answer

Ownership includes more than storage. The owner defines valid transitions, lifetime,
isolation, persistence, and conflict policy. A binding shares access to existing
storage; it does not create another owner.

Copies can be intentional. A form draft, cache, or offline replica has a distinct
meaning and needs a save, invalidation, refresh, or merge rule. If that rule is not
clear, the copy will eventually diverge.

<a id="q2-where-should-swiftui-state-live"></a>
## Q2: Where should SwiftUI state live?

### Short Answer

Transient UI state should live at the least common ancestor of the views that need
it. Feature and durable state should live in an owner whose lifetime matches the
workflow. A child receives a value for reading, a binding for controlled editing, or
an intent closure for policy-sensitive changes.

### Expanded Answer

Focus or disclosure can stay in a view. A checkout draft that must survive navigation
belongs in a feature or flow model. An operation that must survive process termination
needs durable storage. I do not move all state upward by default because global state
couples unrelated views.

With Observation, a view-created observable model can be held in `@State`; a model
created by an ancestor can be passed as a dependency. Property wrappers describe
storage and data flow. They do not decide the architecture by themselves.

<a id="q3-how-do-you-prevent-state-from-becoming-inconsistent"></a>
## Q3: How do you prevent state from becoming inconsistent?

### Short Answer

I store independent facts once, derive dependent values, and route mutations through
the owner as named intents. When combinations matter, I model valid states with an
enum. For async work, I add cancellation or operation identity so older results
cannot overwrite newer intent.

### Expanded Answer

Mutable `items`, `subtotal`, `isLoading`, `error`, and `result` can drift into invalid
combinations. I derive the subtotal and represent request phases explicitly when the
UI or retry policy differs. The owner updates related values in one transition and
keeps setters narrow.

Actor isolation prevents data races, but not logical races. A first search can still
finish after a second search on the same actor. The feature must cancel old work or
compare a request identifier before accepting the result.

<a id="q4-how-do-you-model-local-and-remote-state-together"></a>
## Q4: How do you model local and remote state together?

### Short Answer

I name the authorities instead of claiming the cache and server are one value. A
repository can own the local view and pending operations, while the server owns final
acceptance. Stable operation and revision identifiers support retry, deduplication,
conflict detection, and honest UI states.

### Expanded Answer

I distinguish locally edited, queued, confirmed, stale, and conflicted data when they
produce different behavior. The repository persists enough intent to resume, sends
idempotent operations, and reconciles responses against known revisions. The feature
receives a coherent state rather than coordinating database and network sources.

The conflict rule follows product meaning. Some fields can use server authority,
some can merge, and some require user choice. I track queue age, conflict count,
discarded stale results, and reconciliation failures in production.

### Trade-offs

A local-first model improves responsiveness and recovery but adds operation logs,
schema migration, conflict policy, storage security, and support cost. Read-only or
low-value data may need only a replaceable cache with simple refresh behavior.
