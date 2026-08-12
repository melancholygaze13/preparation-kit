---
title: "Embedding UIKit in SwiftUI: Interview Questions"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Embedding UIKit in SwiftUI"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Embedding UIKit in SwiftUI: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When does a UIKit component need a controller representable?](#q1-view-or-controller) | Senior | Boundary selection |
| [Why can a coordinator keep stale SwiftUI inputs?](#q2-stale-coordinator) | Staff | Wrapper identity |
| [What cleanup belongs in `dismantle`?](#q3-dismantle) | Senior | Resource lifetime |

---

<a id="q1-view-or-controller"></a>
## Q1: When does a UIKit component need a controller representable?

### Short Answer

I use `UIViewControllerRepresentable` when controller containment, presentation, or
controller lifecycle is part of the component's required behavior. A view-only
component uses `UIViewRepresentable`.

### Expanded Answer

Examples include a document picker or a legacy controller that owns child
controllers. Wrapping only its view can detach it from lifecycle and presentation
context. I still prefer a native SwiftUI component when it covers the same contract,
because a wrapper adds another lifecycle boundary.

---

<a id="q2-stale-coordinator"></a>
## Q2: Why can a coordinator keep stale SwiftUI inputs?

### Short Answer

SwiftUI may create a new representable value while keeping the existing coordinator
and UIKit object. If the coordinator captured only the first wrapper, it can therefore
send callbacks to old bindings or actions.

### Expanded Answer

In `updateUIView` or `updateUIViewController`, I refresh the coordinator's parent or
callback references before UIKit can emit new events. The coordinator translates
events but does not own another state copy. This keeps the reference-lifetime object
connected to the latest SwiftUI description.

---

<a id="q3-dismantle"></a>
## Q3: What cleanup belongs in `dismantle`?

### Short Answer

I remove external work the adapter installed: observers, targets, delegates, timers,
tasks, sessions, or registrations. Ordinary UIKit ownership should release the view
hierarchy without manual teardown.

### Expanded Answer

Cleanup belongs to the owner that created the resource. If the wrapped UIKit object
owns and releases an internal subview, the representable does nothing extra. I test
repeated insertion and removal because leaks and callbacks into removed SwiftUI state
often appear only after several lifecycle cycles.
