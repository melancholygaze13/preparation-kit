---
title: "Async Loading, Refresh, and Streams: Interview Questions"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "Async Loading, Refresh, and Streams"
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
  - loading-state
  - refreshable
  - async-sequence
---

# Async Loading, Refresh, and Streams: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you model loading state?](#q1-how-do-you-model-loading-state) | Senior | Legal UI states |
| [How should pull to refresh differ from initial load?](#q2-how-should-pull-to-refresh-differ-from-initial-load) | Senior | Content continuity |
| [How do you consume an AsyncSequence in SwiftUI?](#q3-how-do-you-consume-an-asyncsequence-in-swiftui) | Senior | Lifetime and cleanup |
| [How would you design a shared live-data feed?](#q4-how-would-you-design-a-shared-live-data-feed) | Staff | Ownership and resilience |

---

<a id="q1-how-do-you-model-loading-state"></a>
## Q1: How do you model loading state?

### Short Answer

I model legal user-visible states explicitly: idle or initial loading, loaded,
empty success, and failure. Refresh activity can be separate so existing content
remains visible. An enum or structured state prevents contradictory Boolean flags.

### Expanded Answer

Initial loading has no content and may need a full placeholder. Empty is a successful
outcome and should explain what the user can do. Refresh and transient errors often
preserve usable content and context.

The main-actor model owns transitions; the repository owns fetching, caching, and
freshness. Cancellation leaves useful state intact rather than presenting an error.

<a id="q2-how-should-pull-to-refresh-differ-from-initial-load"></a>
## Q2: How should pull to refresh differ from initial load?

### Short Answer

Initial load establishes the first useful content. Refresh updates content the user
already has, so I usually keep it visible, show lighter progress, and preserve scroll
context. The `refreshable` closure awaits the actual refresh operation.

### Expanded Answer

The model defines overlap: join an in-flight request, replace it, or ignore a
duplicate. Responses cannot commit in arbitrary order. A refresh failure can show a
nonblocking message and the last-updated time while retaining cached data.

I avoid an artificial delay to keep the indicator visible. Its duration should
reflect real awaited work.

### Trade-offs

Replacing content with a spinner is simple but creates flicker and loses context.
Keeping stale content improves continuity but requires communicating age and errors
when freshness is important.

<a id="q3-how-do-you-consume-an-asyncsequence-in-swiftui"></a>
## Q3: How do you consume an AsyncSequence in SwiftUI?

### Short Answer

For screen-scoped updates, I iterate it in `.task` or `.task(id:)`. View disappearance
or ID changes cancel the consumer. I handle cancellation separately from failure,
and the producer releases resources when the stream terminates.

### Expanded Answer

Each element is transformed as needed and committed through the main-actor model.
If order matters, I process sequentially. I do not launch an unlimited task per
event. A high-rate producer needs an explicit buffer or coalescing policy.

If multiple screens need the same feed, a repository owns one connection and
publishes shared state instead of each view opening a socket.

### Example

A detail screen uses `.task(id: accountID)` to consume account updates. Changing
accounts cancels the old loop before starting the new subscription.

<a id="q4-how-would-you-design-a-shared-live-data-feed"></a>
## Q4: How would you design a shared live-data feed?

### Short Answer

A repository owns the connection, authentication, decoding, reconnect policy, and
authoritative cached state. Features observe normalized updates. The repository
defines subscriber lifetime, buffering, and whether one canceled consumer affects
shared work.

### Expanded Answer

I separate durable domain events from replaceable UI status. Critical events go
through persistent storage or an acknowledged protocol; an in-memory dropping
buffer is acceptable only for replaceable values.

Reconnect uses bounded backoff with jitter and stops for authentication failures or
when no policy requires the connection. Telemetry covers connection state, lag,
dropped values, retries, and time since last valid update.

### Trade-offs

One shared feed saves resources and centralizes ordering but needs subscription and
account-isolation rules. Per-screen feeds are simpler locally but duplicate
connections and make consistency, retry, and observability harder.
