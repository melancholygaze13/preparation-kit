---
title: "Multiwindow, State Restoration, and Handoff: Interview Questions"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
concept: "Multiwindow, State Restoration, and Handoff"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Multiwindow, State Restoration, and Handoff: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you open content in another scene?](#q1-activate-scene) | Senior | Scene activation |
| [How do restoration and Handoff differ?](#q2-restoration-vs-handoff) | Senior | Continuity boundaries |
| [What belongs in `NSUserActivity`?](#q3-activity-payload) | Senior | Durable identity and privacy |
| [How do multiple scenes share data safely?](#q4-cross-scene-data) | Staff | Ownership and conflicts |

---

<a id="q1-activate-scene"></a>
## Q1: How do you open content in another scene?

### Short Answer

I create a user activity with stable content identity, put it in a scene-session
activation request, and ask `UIApplication` to activate the request.

### Expanded Answer

UIKit may reuse a matching scene or create one, so I do not assume the result is
always a new window. The destination scene handles the activity through its
connection options or continuation callback and routes it through its own
coordinator. I surface activation failures instead of silently falling back to an
unrelated scene.

---

<a id="q2-restoration-vs-handoff"></a>
## Q2: How do restoration and Handoff differ?

### Short Answer

Scene restoration rebuilds one local UI session after disconnection or relaunch.
Handoff continues an activity on another device or platform.

### Expanded Answer

Both can use `NSUserActivity`, but their constraints differ. Restoration can refer to
local scene state. Handoff must use a small, portable, privacy-safe payload and assume
the receiving device may have different capabilities or stale data.

Both paths resolve stable identifiers, validate current access, and fall back when
the original content is unavailable.

---

<a id="q3-activity-payload"></a>
## Q3: What belongs in `NSUserActivity`?

### Short Answer

I store a version, stable content identifiers, route, and only the small amount of
interaction state needed to continue the task.

### Expanded Answer

I do not store controllers, views, credentials, or a large document. Handoff payloads
should remain below Apple's recommended 3 KB. The receiving scene loads durable data
from its real store and handles missing or incompatible content explicitly.

---

<a id="q4-cross-scene-data"></a>
## Q4: How do multiple scenes share data safely?

### Short Answer

I share the durable data repository and its rules for conflicting edits, but keep navigation,
selection, undo context, and presentation state owned by each scene.

### Expanded Answer

Two scenes may edit the same document concurrently. The data layer needs explicit
serialization, merge, or conflict behavior and must notify every observing scene of
committed changes. Scene coordinators then update their own routes without reaching
into another window.

At team scale, I version activity schemas and assign ownership for cross-platform
compatibility, privacy, and conflict tests.

### Trade-offs

Shared live state improves consistency, but coupling scene-local UI state makes one
window's actions unexpectedly change another. Share only the product state that is
truly common.
