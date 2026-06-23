---
title: "Task Modifier and View Lifetime: Interview Questions"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "Task Modifier and View Lifetime"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - task-modifier
  - view-lifetime
  - cancellation
---

# Task Modifier and View Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why prefer `.task` over `onAppear` plus `Task`?](#q1-why-prefer-task-over-onappear-plus-task) | Senior | Lifetime and cancellation |
| [When should you use `.task(id:)`?](#q2-when-should-you-use-taskid) | Senior | Input-dependent work |
| [Should every operation cancel when its view disappears?](#q3-should-every-operation-cancel-when-its-view-disappears) | Senior | Ownership boundary |
| [How would you diagnose repeated network loads?](#q4-how-would-you-diagnose-repeated-network-loads) | Staff | Identity and observability |

---

<a id="q1-why-prefer-task-over-onappear-plus-task"></a>
## Q1: Why prefer `.task` over `onAppear` plus `Task`?

### Short Answer

`.task` declares work that belongs to a view identity, and SwiftUI can cancel it
when that identity disappears. A manually launched task in `onAppear` is
unstructured, needs explicit handle management, and can duplicate across repeated
appearances.

### Expanded Answer

Cancellation still requires cooperation from called code. I treat cancellation as
normal control flow and avoid replacing existing content with an error. Loading is
idempotent or cached because appearance is not guaranteed to occur only once.

I use a manual `Task` at synchronous event boundaries such as a button action, not
as a substitute for a declarative lifecycle modifier.

<a id="q2-when-should-you-use-taskid"></a>
## Q2: When should you use `.task(id:)`?

### Short Answer

When the async result depends on an equatable input such as an entity ID or search
query. SwiftUI cancels the previous task and starts a new one when that value
changes, aligning work with current view state.

### Expanded Answer

The ID should include every input that changes the result, but not unrelated display
state. An overly broad ID causes needless restarts; an incomplete ID allows stale
data. The model still validates relevance before commit because cancellation can
arrive too late or a dependency might ignore it.

### Example

`.task(id: productID) { await model.load(productID) }` replaces product 1's load when
the same screen identity starts showing product 2.

<a id="q3-should-every-operation-cancel-when-its-view-disappears"></a>
## Q3: Should every operation cancel when its view disappears?

### Short Answer

No. Cancel work whose value exists only for that view, such as a screen load or
subscription. Move committed work that must finish—uploads, purchases, migrations,
or background transfers—to a longer-lived model or service.

### Expanded Answer

The deciding question is who owns the outcome. A screen can start and observe an
upload, but navigation should not silently revoke an accepted user operation. A
detail-only observation should not remain active after the detail disappears.

This distinction also improves retry, progress reporting, and testability because
the durable operation has an explicit owner independent from view reconstruction.

<a id="q4-how-would-you-diagnose-repeated-network-loads"></a>
## Q4: How would you diagnose repeated network loads?

### Short Answer

I log task start, cancellation, completion, view input, and request key. Then I check
whether structural identity changes, the `.task` ID is unstable, the model lacks
deduplication, or multiple hierarchy branches request the same resource.

### Expanded Answer

Views can legitimately appear several times, so I do not solve this with a `didLoad`
Boolean at the leaf. The repository can cache results or deduplicate an in-flight
request, while the feature defines freshness and reload policy.

I verify that navigation and conditional branches are not recreating the owner and
that route identity excludes mutable display data. Metrics should distinguish
requested loads from actual network requests after caching.

### Trade-offs

Aggressive caching reduces duplicate work but can show stale content. View-only
guards reduce calls locally but lose state when identity changes. A repository-level
freshness policy is more reusable but needs invalidation and observability.
