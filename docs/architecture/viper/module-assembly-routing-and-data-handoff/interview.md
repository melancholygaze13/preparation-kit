---
title: "Module Assembly, Routing, and Data Handoff: Interview Questions"
domain: "Architecture"
topic: "VIPER"
concept: "Module Assembly, Routing, and Data Handoff"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - viper
  - composition-root
  - routing
---

# Module Assembly, Routing, and Data Handoff: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you assemble a VIPER module?](#q1-how-do-you-assemble-a-viper-module) | Senior | Composition |
| [How should VIPER modules exchange data?](#q2-how-should-viper-modules-exchange-data) | Senior | Typed contracts |
| [How do VIPER routers and coordinators coexist?](#q3-how-do-viper-routers-and-coordinators-coexist) | Staff | Flow ownership |

---

<a id="q1-how-do-you-assemble-a-viper-module"></a>
## Q1: How do you assemble a VIPER module?

### Short Answer

A builder outside the module creates the view, presenter, interactor, and router, injects
shared dependencies, connects outputs, and returns one supported entry point. The caller
should not construct or know each internal role.

### Expanded Answer

The parent or router owns the active child module for its navigation lifetime. Assembly
tests catch missing links. Presenters and interactors should not build their own
dependencies because that hides the graph and mixes construction with behavior.

<a id="q2-how-should-viper-modules-exchange-data"></a>
## Q2: How should VIPER modules exchange data?

### Short Answer

Pass required immutable input at construction and return outcomes through a small typed
delegate, closure, or result contract. For shared domain state, pass identity and use its
real owner rather than letting modules edit the same mutable object.

### Example

An editor receives an entity ID and mode. On completion it reports `.saved(id)` or
`.cancelled`. The parent decides whether to refresh, dismiss, or continue the flow.

<a id="q3-how-do-viper-routers-and-coordinators-coexist"></a>
## Q3: How do VIPER routers and coordinators coexist?

### Short Answer

A local router can perform transitions within a feature. A coordinator or application
router owns journeys across several modules, deep-link reconstruction, and shared flow
lifetime. This prevents every VIPER router from knowing every destination.

### Trade-offs

Using both adds one boundary, so ownership must be explicit. The presenter emits local
route intent, the feature router handles local mechanics, and the parent flow owns
cross-feature policy.
