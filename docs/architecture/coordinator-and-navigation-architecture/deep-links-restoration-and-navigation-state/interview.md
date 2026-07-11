---
title: "Deep Links, Restoration, and Navigation State: Interview Questions"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Deep Links, Restoration, and Navigation State"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-11
tags:
  - deep-links
  - restoration
  - navigation-state
---

# Deep Links, Restoration, and Navigation State: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you design deep-link handling?](#q1-how-would-you-design-deep-link-handling) | Senior | Parsing and flow ownership |
| [How do you handle a protected deep link while logged out?](#q2-how-do-you-handle-a-protected-deep-link-while-logged-out) | Senior | Prerequisites and security |
| [What navigation state should be restored?](#q3-what-navigation-state-should-be-restored) | Senior | Persistence boundaries |
| [How do multiple scenes affect routing?](#q4-how-do-multiple-scenes-affect-routing) | Staff | Scope and conflict policy |

---

<a id="q1-how-would-you-design-deep-link-handling"></a>
## Q1: How would you design deep-link handling?

### Short Answer

I parse the external URL into a typed product route, validate and authorize it, resolve
prerequisites, then delegate to the feature that owns the journey. The feature builds
valid navigation state. Raw URLs and view-controller construction stay outside feature
policy.

### Expanded Answer

The parser validates host, identifiers, parameters, size, and supported versions.
Missing data or unavailable features produce explicit fallback or rejection. Metrics
record outcomes without logging sensitive payloads.

<a id="q2-how-do-you-handle-a-protected-deep-link-while-logged-out"></a>
## Q2: How do you handle a protected deep link while logged out?

### Short Answer

I retain the typed pending route, start authentication, and resume only after success
and authorization for the current account. I clear or revalidate it on cancellation,
logout, account change, or expiry. The URL itself never proves access.

### Expanded Answer

I avoid prebuilding the destination stack. Authentication and workspace selection are
flow states. If the resource is missing or forbidden after login, I route to a safe
fallback with an honest message.

<a id="q3-what-navigation-state-should-be-restored"></a>
## Q3: What navigation state should be restored?

### Short Answer

I persist stable route identifiers and restorable draft references, not view instances,
services, tasks, or transient prompts. On launch I revalidate current data and policy,
migrate the route schema, and restore the nearest valid path.

### Expanded Answer

Critical unsaved work lives in durable product storage; navigation stores only its ID.
If a product was deleted, the restored path can stop at its catalog rather than fail
the whole scene.

<a id="q4-how-do-multiple-scenes-affect-routing"></a>
## Q4: How do multiple scenes affect routing?

### Short Answer

Each scene owns an independent path and restoration payload. An app-level router chooses
an existing scene or requests a new one, then delegates to that scene's feature flows.
A global navigation path would couple windows and corrupt restoration.

### Expanded Answer

I define what happens when a route competes with active editing or payment: focus,
queue, replace with confirmation, or reject. The rule follows data-loss and workflow
risk rather than always replacing the current stack.
