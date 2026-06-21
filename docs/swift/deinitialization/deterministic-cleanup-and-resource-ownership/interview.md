---
title: "Deterministic Cleanup and Resource Ownership: Interview Questions"
domain: "Swift"
topic: "Deinitialization"
concept: "Deterministic Cleanup and Resource Ownership"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Ability to separate memory lifetime from resource protocol.

### Short Answer

Use explicit cleanup when release timing is observable, work can fail or suspend,
callers need completion, resources are shared, or shutdown must coordinate in-flight
operations. Make cleanup idempotent and define post-close behavior. Deinit remains a
bounded fallback for synchronous exclusively owned resources.

### Detailed Answer

ARC timing can be extended by references and cycles. A close method can reject new
work, drain or cancel existing work, report errors, and be awaited by the owner.

### Engineering Trade-offs

- Explicit cleanup adds lifecycle states but provides control.
- Scope-based cleanup is simple for short synchronous resources.
- Deinit fallback catches leaks but cannot report completion reliably.

### Production Scenario

A database transaction relies on deinit rollback. An explicit commit/rollback scope
makes outcome and errors deterministic before the connection returns to its pool.

### Follow-up Questions

- What should repeated close do?
- How should close race with new work?
- What remains safe in deinit?

### Strong Answer Signals

- Defines idempotency and ordering.
- Covers in-flight work and errors.
- Keeps deinit bounded.

### Weak Answer Signals

- Treats ARC as transaction management.
- Launches untracked cleanup tasks.
- Leaves post-close behavior undefined.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-system-shutdown"></a>
## Q2: How Would You Design System-Wide Shutdown?

### What It Evaluates

Principal-level lifecycle coordination.

### Short Answer

Build an ownership graph, stop admission of new work, cancel or drain in-flight work
by policy, close owners in reverse dependency order, bound each phase with timeouts,
and publish completion and failure metrics. Composition roots coordinate shutdown;
deallocation order is not the protocol.

### Detailed Answer

Every resource needs an owner and escalation policy for partial failure. Repeated
shutdown should be safe, and rollback or restart must account for partially closed state.

### Engineering Trade-offs

- Graceful draining preserves work but increases shutdown latency.
- Cancellation is bounded but may discard progress.
- Parallel closure is faster only for independent owners.

### Production Scenario

An app stops requests, drains uploads, closes persistence, then releases logging last.
Active-resource gauges verify no owner remains after the deadline.

### Follow-up Questions

- Which dependencies can close concurrently?
- What happens after timeout?
- How is shutdown tested deterministically?

### Strong Answer Signals

- Uses ownership and reverse dependency order.
- Includes admission control, timeout, and observability.
- Handles partial failure and repeat calls.

### Weak Answer Signals

- Drops all root references and hopes ARC orders cleanup.
- Closes logging before dependent systems.
- Has no timeout or active-resource metrics.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
