---
title: "Destinations, Deep Links, and Restoration: Interview Questions"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "Destinations, Deep Links, and Restoration"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - deep-links
  - state-restoration
  - routing
---

# Destinations, Deep Links, and Restoration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you implement a deep link?](#q1-how-would-you-implement-a-deep-link) | Senior | Parsing, validation, and state |
| [What navigation state would you restore?](#q2-what-navigation-state-would-you-restore) | Senior | Durable intent and stale data |
| [How do you handle a deep link that arrives during another flow?](#q3-how-do-you-handle-a-deep-link-that-arrives-during-another-flow) | Staff | Conflict policy |
| [How would you evolve routing across teams?](#q4-how-would-you-evolve-routing-across-teams) | Staff | Ownership and compatibility |

---

<a id="q1-how-would-you-implement-a-deep-link"></a>
## Q1: How would you implement a deep link?

### Short Answer

I parse the external input into a typed application route, validate authorization
and current availability, then translate it into complete navigation state. The
route holds stable IDs. Destinations resolve current data and handle missing or
unauthorized content explicitly.

### Expanded Answer

The URL parser is an adapter, not a view router. Notifications, activities, and URLs
can all produce the same `AppRoute`. A coordinator decides the selected tab,
columns, modal, and path in one state transition.

I treat inputs as untrusted and constrain every field. If authentication is needed,
I retain the typed route, complete sign-in, then revalidate it. I avoid delayed
simulated taps because they race lifecycle and rendering.

### Example

`myapp://orders/42` becomes `.order(42)`. The account is selected, the account path
becomes `[.orders, .order(42)]`, and the order screen loads ID 42 from the current
repository.

<a id="q2-what-navigation-state-would-you-restore"></a>
## Q2: What navigation state would you restore?

### Short Answer

I restore compact user intent: selected tab, stable selections, route IDs, and
eligible presentation state. I do not persist views, model snapshots, loading flags,
or secrets. On launch I decode, migrate, and validate before applying a safe path.

### Expanded Answer

Restoration is best effort because entities disappear, permissions change, and the
route schema evolves. I version the persisted schema and keep the longest valid
prefix when possible. A corrupt or unsupported route falls back to a known root and
must never prevent launch.

For multiple windows, each scene owns separate restoration state. I also verify the
restored identifiers belong to the active account or tenant.

### Trade-offs

Restoring every modal can surprise users or reopen sensitive workflows. The product
should define which tasks are worth restoring and which return to a stable parent.

<a id="q3-how-do-you-handle-a-deep-link-that-arrives-during-another-flow"></a>
## Q3: How do you handle a deep link that arrives during another flow?

### Short Answer

I make conflict handling a product policy. If the current flow has no important
state, I can replace navigation atomically. If it has unsaved work or a transaction,
I reject, queue, or ask for confirmation. I never let independent mutations race.

### Expanded Answer

The coordinator evaluates the current state and the incoming route in one place.
Queued routes are typed, revalidated before use, and consumed once. This also handles
links arriving during sign-in or initial dependency loading.

I define precedence for repeated links and whether a route targets the current scene
or opens another. Telemetry records the normalized outcome without storing sensitive
URL content.

### Trade-offs

Immediate replacement is simple but can lose work. Queuing preserves work but may
make the later navigation feel disconnected from the original action. Confirmation
is safest for destructive transitions but adds friction.

<a id="q4-how-would-you-evolve-routing-across-teams"></a>
## Q4: How would you evolve routing across teams?

### Short Answer

I treat external and persisted routes as versioned interfaces. A platform owner sets
parsing, validation, privacy, and compatibility rules; feature teams own their typed
destinations. Contract tests cover supported links and migrations across releases.

### Expanded Answer

Transport URLs should not expose Swift type names or internal module structure. A
stable application route maps the external schema to feature entry intents. Changes
support a compatibility window because old emails, notifications, and installed app
versions remain in use.

I monitor parse, validation, and resolution failures separately. A staged rollout
can ship readers before producers emit a new route. Removing a route includes a safe
fallback and coordination with every producer.

### Trade-offs

Central ownership prevents schema collisions but can bottleneck feature work.
Federated ownership scales changes but needs namespace rules, automated contract
checks, and one documented conflict policy.
