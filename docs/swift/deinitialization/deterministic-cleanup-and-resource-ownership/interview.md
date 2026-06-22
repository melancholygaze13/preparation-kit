---
title: "Deterministic Cleanup and Resource Ownership: Interview Questions"
domain: "Swift"
topic: "Deinitialization"
concept: "Deterministic Cleanup and Resource Ownership"
page_type: interview
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Deterministic Cleanup and Resource Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is deinit insufficient for cleanup?](#q1-explicit-cleanup) | Senior | Deterministic lifecycle |
| [How would you design system-wide shutdown?](#q2-system-shutdown) | Principal | Ordering and ownership |

---

<a id="q1-explicit-cleanup"></a>
## Q1: When Is deinit Insufficient for Cleanup?

### Short Answer

Use explicit cleanup when release timing is observable, work can fail or suspend,
callers need completion, resources are shared, or shutdown must coordinate in-flight
operations. Make cleanup idempotent and define post-close behavior. Deinit remains a
bounded fallback for synchronous exclusively owned resources.

### Expanded Answer

ARC timing can be extended by references and cycles. A close method can reject new
work, drain or cancel existing work, report errors, and be awaited by the owner.

### Trade-offs

- Explicit cleanup adds lifecycle states but provides control.
- Scope-based cleanup is simple for short synchronous resources.
- Deinit fallback catches leaks but cannot report completion reliably.

### Example

A database transaction relies on deinit rollback. An explicit commit/rollback scope
makes outcome and errors deterministic before the connection returns to its pool.

---

<a id="q2-system-shutdown"></a>
## Q2: How Would You Design System-Wide Shutdown?

### Short Answer

Build an ownership graph, stop admission of new work, cancel or drain in-flight work
by policy, close owners in reverse dependency order, bound each phase with timeouts,
and publish completion and failure metrics. Composition roots coordinate shutdown;
deallocation order is not the protocol.

### Expanded Answer

Every resource needs an owner and escalation policy for partial failure. Repeated
shutdown should be safe, and rollback or restart must account for partially closed state.

### Trade-offs

- Graceful draining preserves work but increases shutdown latency.
- Cancellation is bounded but may discard progress.
- Parallel closure is faster only for independent owners.

### Example

An app stops requests, drains uploads, closes persistence, then releases logging last.
Active-resource gauges verify no owner remains after the deadline.
