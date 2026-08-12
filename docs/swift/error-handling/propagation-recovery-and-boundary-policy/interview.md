---
title: "Propagation, Recovery, and Boundary Policy: Interview Questions"
domain: "Swift"
topic: "Error Handling"
concept: "Propagation, Recovery, and Boundary Policy"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Propagation, Recovery, and Boundary Policy: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Where should an error be caught?](#q1-catch-boundary) | Senior | Recovery ownership |
| [How should cancellation interact with error handling?](#q2-cancellation-policy) | Senior | Cooperative cancellation |
| [How should a system govern retries and error translation?](#q3-system-error-policy) | Principal | Reliability, metrics, and logs |

---

<a id="q1-catch-boundary"></a>
## Q1: Where Should an Error Be Caught?

### Short Answer

Catch at the nearest layer that can retry, use a fallback, undo effects, translate, or present.
If the current layer cannot make such a decision, propagate. Translate implementation
errors at stable boundaries and avoid logging the same failure at every layer.

### Expanded Answer

Specific catch patterns precede general ones. Cleanup belongs in `defer` or explicit
resource owners; catching solely to clean up and then silently continuing creates false success.

### Trade-offs

- Early translation stabilizes callers but can discard context.
- Late presentation retains context but must avoid leaking internals.
- Central policy reduces duplicates while requiring clear ownership.

### Example

A repository propagates database errors to a service, which translates “row missing”
to a domain case; the UI alone decides presentation.

---

<a id="q2-cancellation-policy"></a>
## Q2: How Should Cancellation Interact with Error Handling?

### Short Answer

Cancellation is cooperative control flow. Long-running work checks cancellation,
structured children inherit it, and generic catch policy should preserve or separately
handle `CancellationError` rather than alerting or retrying. Bridge cancellation to
underlying operations when they have their own cancel mechanism.

### Expanded Answer

An `await` does not guarantee the callee checks cancellation. CPU loops need explicit
checks. Unstructured tasks need stored ownership and explicit cancellation.

### Trade-offs

- Prompt checks save work but must occur at safe consistency points.
- Cleanup may delay exit but protects required rules.
- Treating cancellation as failure simplifies code while creating noise and wasted retries.

### Example

A cancelled search request enters generic retry and displays an error. Filtering
cancellation stops both while genuine network failure keeps its retry policy.

---

<a id="q3-system-error-policy"></a>
## Q3: How Should a System Govern Retries and Error Translation?

### Short Answer

Define stable error categories, retry rules, requirements for safe repetition, attempt
limits, delays, cancellation, redaction, translation owners, request identifiers, and
alerts. Retry near the operation owner only for known temporary failures. Change public
error schemas with tolerant readers, metrics, and a rollback plan.

### Expanded Answer

Operations that are not safe to repeat need an idempotency key or an undo action before
retry. One layer should own the failure event to prevent duplicate metrics and alerts.

### Trade-offs

- Retries improve transient availability but amplify load and duplicate effects.
- Stable translation protects clients but requires versioning.
- Rich diagnostics aid incidents but increase privacy risk.

### Example

A payment timeout is blindly retried and charges twice. Idempotency keys, limited retries,
and stable “outcome unknown” policy make recovery safe.
