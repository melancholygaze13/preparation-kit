---
title: "Scoping, Presentation, and Navigation: Interview Questions"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Scoping, Presentation, and Navigation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tca
  - navigation
  - feature-composition
---

# Scoping, Presentation, and Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does feature scoping work in TCA?](#q1-how-does-feature-scoping-work-in-tca) | Senior | Parent-child composition |
| [How does TCA model navigation?](#q2-how-does-tca-model-navigation) | Senior | Tree and stack state |
| [Who should own a navigation decision?](#q3-who-should-own-a-navigation-decision) | Senior | Flow ownership |

---

<a id="q1-how-does-feature-scoping-work-in-tca"></a>
## Q1: How does feature scoping work in TCA?

### Short Answer

A parent stores child state, wraps child actions, and composes the child reducer by
mapping both. A scoped store exposes only that child domain to its view. The parent owns
creation and lifetime; the child owns its local behavior.

### Expanded Answer

I use reducers for behavior boundaries, not every view. A child sends narrow delegate
outcomes upward, and the parent applies product or route policy without reaching into
the child's internal actions.

<a id="q2-how-does-tca-model-navigation"></a>
## Q2: How does TCA model navigation?

### Short Answer

Presentation is state. Optional or enum destination state models sheets and fixed
branches. `StackState` models a typed push stack. Creating, replacing, or removing that
state drives navigation and can be tested as a reducer transition.

### Expanded Answer

The parent composes destination reducers and scopes stores from the same state and action
path that drives the UI. A tree fits a known optional destination; a stack fits a dynamic
push history. Deep links and restoration construct typed route state rather than replaying
view operations.

### Trade-offs

Typed state gives testable deep links, restoration, and lifetime, but adds route models
and action routing. I still keep UI integration tests because reducer tests cannot prove
that SwiftUI or UIKit presents the right interface.

<a id="q3-who-should-own-a-navigation-decision"></a>
## Q3: Who should own a navigation decision?

### Short Answer

The closest parent or flow that understands sibling and product context. A child reports
an outcome such as `saved` or `deleteConfirmed`; the parent decides to dismiss, replace,
or push. This prevents a reusable child from depending on one route hierarchy.

### Expanded Answer

The child owns its local validation and completion outcome. The parent owns how that
outcome changes the larger journey because it knows adjacent features and prerequisites.
Narrow delegate actions keep that boundary explicit and stop internal child actions from
becoming a routing API.

### Example

A profile editor should report that saving finished. In onboarding, the parent may show
permissions. In settings, it may dismiss. The editor does not need either route in its
domain.
