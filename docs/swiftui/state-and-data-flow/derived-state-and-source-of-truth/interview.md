---
title: "Derived State and Source of Truth: Interview Questions"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Derived State and Source of Truth"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - derived-state
  - source-of-truth
  - state-modeling
---

# Derived State and Source of Truth: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is derived state, and when should it be stored?](#q1-what-is-derived-state-and-when-should-it-be-stored) | Senior | Authority and projections |
| [How do you model mutually exclusive UI states?](#q2-how-do-you-model-mutually-exclusive-ui-states) | Senior | Valid state representation |
| [When is caching derived data justified?](#q3-when-is-caching-derived-data-justified) | Senior | Performance and invalidation |
| [When is a second copy of data legitimate?](#q4-when-is-a-second-copy-of-data-legitimate) | Staff | Drafts and synchronization policy |

---

<a id="q1-what-is-derived-state-and-when-should-it-be-stored"></a>
## Q1: What is derived state, and when should it be stored?

### Short Answer

Derived state is a value completely determined by other current state, such as
`canSubmit`, filtered results, or a selected item found by ID. I compute it instead
of storing another mutable copy. I store it only when it becomes an independent
fact or a measured cache with a complete invalidation contract.

### Expanded Answer

Duplicating a projection creates two representations that can disagree. A computed
property always reflects its current inputs, and Observation tracks observable
stored properties read through that computation.

I keep cheap presentation derivation near the view and reusable domain rules in the
model. I do not use `onChange` to synchronize routine copies. If several source
fields must change together, one model operation owns that transition.

### Example

Store `email` and `acceptedTerms`; derive `canSubmit`. Store `items` and
`selectedID`; derive `selectedItem`. If the item disappears, handle that as an
explicit selection policy rather than retaining a stale copied object.

<a id="q2-how-do-you-model-mutually-exclusive-ui-states"></a>
## Q2: How do you model mutually exclusive UI states?

### Short Answer

I use an enum or another state type that makes invalid combinations impossible,
rather than several booleans such as `isLoading`, `hasContent`, and `hasError`.
Events transition the model from one valid state to another.

### Expanded Answer

A load state might have idle, loading, loaded, and failed cases with associated
data. A `switch` then makes the view handle every mode explicitly. Tests exercise
the transition table instead of arbitrary boolean combinations.

The model must match the product. Refreshing may show existing content while a
request is active, so one mutually exclusive enum might be too simple. I could
store content plus a refresh phase, as long as their combinations are meaningful
and intentional.

### Trade-offs

State types add explicit cases and transition code but remove contradictory values.
Overly rigid enums can hide legitimate overlapping states, so I model domain
invariants rather than forcing every screen into the same template.

<a id="q3-when-is-caching-derived-data-justified"></a>
## Q3: When is caching derived data justified?

### Short Answer

After measurement shows repeated derivation is materially expensive. The owner of
the inputs should own the cache, key it by every dependency, invalidate it on every
relevant change, and expose one coherent result. Otherwise, direct computation is
safer.

### Expanded Answer

Caching exchanges CPU time for memory and stale-data risk. Inputs can include the
source collection, query, sort order, permissions, locale, or feature configuration.
Missing any one creates incorrect UI.

I avoid copying a model-derived collection into view `@State`; that gives the view
a second source of truth. For high-volume search, the model can debounce input,
cancel obsolete work, and publish a result tagged to the current query or request.

### Trade-offs

Recomputation can be cheaper than cache coordination, especially for small data.
At scale, caching can remove hitches but needs metrics for hit rate, computation
time, memory, and stale-result prevention.

<a id="q4-when-is-a-second-copy-of-data-legitimate"></a>
## Q4: When is a second copy of data legitimate?

### Short Answer

When it represents a different fact with an explicit lifecycle. An editing draft is
not the saved value: it is a snapshot with commit, discard, validation, and conflict
rules. Remote, persisted, cached, and optimistic values can also coexist when their
authority and reconciliation policies are defined.

### Expanded Answer

For a draft, I define when the snapshot starts, whether external updates merge or
conflict, how commit fails, and whether cancellation discards all changes. Version
or revision information prevents silently overwriting newer data.

For offline or optimistic state, I identify the authoritative write owner, freshness
rules, retry and rollback behavior, and what the UI shows while states diverge. The
view consumes one reconciled feature state rather than implementing synchronization
across repositories itself.

### Trade-offs

Separate representations support offline work, cancellation, and safe editing, but
increase conflict and observability requirements. At Staff scope, the policy must
be shared across teams and storage layers rather than encoded independently in each
screen.
