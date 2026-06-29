---
title: "Incremental Migration and Framework Boundaries: Interview Questions"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
concept: "Incremental Migration and Framework Boundaries"
page_type: interview
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-06-29
---

# Incremental Migration and Framework Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you choose what to migrate from UIKit to SwiftUI first?](#q1-choose-first-migration) | Senior | Boundary selection |
| [How do you avoid duplicated state during migration?](#q2-avoid-duplicated-state) | Staff | Ownership |
| [What makes a framework boundary healthy?](#q3-healthy-framework-boundary) | Staff | Contracts and lifecycle |
| [How would you lead a large UIKit-to-SwiftUI migration?](#q4-lead-large-migration) | Principal | Rollout and standards |

---

<a id="q1-choose-first-migration"></a>
## Q1: How would you choose what to migrate from UIKit to SwiftUI first?

### Short Answer

I would start at a stable product boundary with clear inputs, outputs, and test
coverage. A leaf component, isolated screen, or new feature is usually safer than
rewriting the middle of a complex UIKit flow.

### Expanded Answer

The first migration should prove the boundary model without putting the highest
risk path under unnecessary pressure. I look for low coupling, clear ownership,
limited navigation complexity, and enough usage to learn from real behavior.

If the feature is critical, I would use a feature flag, staged rollout, and
rollback path. If it is new and isolated, I might build the full screen in
SwiftUI from the start while keeping the surrounding UIKit flow in control.

---

<a id="q2-avoid-duplicated-state"></a>
## Q2: How do you avoid duplicated state during migration?

### Short Answer

Pick one authoritative owner for each piece of state. Pass derived values,
bindings, actions, or model references across the boundary instead of letting
UIKit and SwiftUI both mutate the same fact independently.

### Expanded Answer

Duplicated state often appears when UIKit owns a view model and the hosted
SwiftUI view also creates its own copy of the same domain state. That can cause
stale UI, conflicting validation, and navigation that depends on the wrong
source.

I define the owner before writing the wrapper. If UIKit owns the flow, SwiftUI
emits intents and receives current values. If SwiftUI owns the feature, UIKit
hosts the boundary and delegates the internal state transitions to SwiftUI. The
important part is that the same fact does not have two mutation paths.

### Example

For an edit profile screen in a UIKit app, UIKit might own presentation while
SwiftUI owns the form draft. The save action crosses the boundary once. UIKit
does not also keep a second editable copy unless there is an explicit conflict
or rollback policy.

---

<a id="q3-healthy-framework-boundary"></a>
## Q3: What makes a framework boundary healthy?

### Short Answer

A healthy boundary has a small contract: inputs, user intents, ownership,
lifecycle, layout responsibility, and teardown are clear. The wrapper translates
between frameworks without owning product policy.

### Expanded Answer

For `UIViewRepresentable`, SwiftUI owns the surrounding state and the wrapper
adapts a UIKit view. For `UIHostingController`, UIKit owns containment and may
own navigation while SwiftUI renders the hosted feature. In both directions, the
boundary should not hide business logic or long-lived side effects.

I also check testability. Boundary behavior should be testable without relying
only on visual inspection: state synchronization, callback ordering, cancellation
on dismissal, dynamic type, accessibility labels, and deep-link behavior all
matter.

---

<a id="q4-lead-large-migration"></a>
## Q4: How would you lead a large UIKit-to-SwiftUI migration?

### Short Answer

I would set migration standards, choose rollout boundaries, keep rollback
possible, and measure production behavior. The goal is to reduce architectural
complexity over time, not create permanent mixed-framework ownership.

### Expanded Answer

At Principal scope, I would start with an inventory of flows, ownership, risk,
and shared UI patterns. Then I would define where SwiftUI is the default for new
work, where UIKit remains appropriate, and what wrapper contracts teams must
follow.

Rollout should be staged. Critical flows need flags, monitoring, accessibility
checks, and clear reversal. Teams also need removal criteria so temporary
adapters and duplicate models do not become permanent infrastructure.

### Trade-offs

A slower staged migration costs more coordination, but it protects product
quality and lets teams learn. A rewrite can be simpler technically when the old
flow is isolated, but it is rarely safer for large, high-traffic UIKit areas.
