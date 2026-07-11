---
title: "Offline Conflicts, Idempotency, and Retries: Interview Questions"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Offline Conflicts, Idempotency, and Retries"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-11
tags:
  - offline
  - idempotency
  - conflict-resolution
---

# Offline Conflicts, Idempotency, and Retries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you make an offline mutation reliable?](#q1-how-do-you-make-an-offline-mutation-reliable) | Senior | Durable outbox |
| [When is a retry safe?](#q2-when-is-a-retry-safe) | Senior | Idempotency and backoff |
| [How do you resolve offline conflicts?](#q3-how-do-you-resolve-offline-conflicts) | Senior | Version-aware policy |

---

<a id="q1-how-do-you-make-an-offline-mutation-reliable"></a>
## Q1: How do you make an offline mutation reliable?

### Short Answer

I commit the optimistic local change and a versioned outbox entry in one transaction.
The entry has stable operation identity, target, base version, payload, and retry state.
A worker sends it until acknowledged, and replay is safe through server idempotency.

### Expanded Answer

If the process stops after server success but before local acknowledgement, the same
entry runs again. It must reuse the original idempotency key. The UI distinguishes queued,
confirmed, blocked, and failed state when users need that truth.

<a id="q2-when-is-a-retry-safe"></a>
## Q2: When is a retry safe?

### Short Answer

When the failure is temporary and repeating the logical operation cannot duplicate its
effect. I use a stable idempotency key, bounded exponential backoff with jitter, server
retry guidance, and one retry budget. I do not retry validation or conflict blindly.

### Trade-offs

Fast retries can amplify an outage; long retries delay recovery. Connectivity is only a
wake-up hint. Cancellation of one screen should stop waiting, not erase already persisted
intent unless the user explicitly cancels the business operation.

<a id="q3-how-do-you-resolve-offline-conflicts"></a>
## Q3: How do you resolve offline conflicts?

### Short Answer

I send the base version with the mutation and compare base, local, and current server
values on conflict. The policy is domain-specific: server wins, three-way field merge,
operation merge, or user resolution. I avoid one global last-write-wins rule.

### Example

Independent profile fields may merge automatically. A payment amount or inventory change
returns to server validation. If an outbox entry depends on a conflicted create, I block
and surface the dependent work instead of retrying it forever.
