---
title: "Tabs and Top-Level Navigation: Interview Questions"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "Tabs and Top-Level Navigation"
page_type: interview
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-12
tags:
  - tabs
  - tab-view
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should tab selection be modeled?](#q1-tab-selection-state) | Senior | Typed selection and identity |
| [Who owns navigation state inside each tab?](#q2-per-tab-navigation) | Senior | Flow ownership and continuity |
| [How should a deep link open content in another tab?](#q3-cross-tab-deep-link) | Staff | Validated coordinated routing |
| [When should tabs adapt or be customizable?](#q4-adaptation-and-customization) | Staff | Platform behavior and evolution |

---

<a id="q1-tab-selection-state"></a>
## Q1: How Should Tab Selection Be Modeled?

### Short Answer

Use `TabView(selection:)` with a binding to a stable enum, and declare each destination
with the modern `Tab` API and matching value. The enum makes selection testable and keeps
integer or string tags from drifting away from the destination model.

### Expanded Answer

Tabs should represent a small set of peer destinations. A role such as search communicates
meaning to SwiftUI; it should not be used only to force placement. The selection owner may
record analytics or coordinate cross-tab routes, but ordinary feature behavior stays inside
the selected flow.

### Trade-offs

- Typed selection improves exhaustive handling but requires migration when tabs evolve.
- Uncontrolled dynamic tabs can move familiar destinations and reset identity.

### Example

An app replaces integer tags with `AppTab.home`, `.library`, and `.search`. Tests can now
assert the selected destination without coupling to view order.

---

<a id="q2-per-tab-navigation"></a>
## Q2: Who Owns Navigation State Inside Each Tab?

### Short Answer

Each feature flow should own its path, selection, and presentation state. The tab root owns
only top-level selection and cross-feature coordination. Preserve each tab's stable identity
so switching tabs does not discard its navigation stack or local work.

### Expanded Answer

A feature can store a local typed path, or an injected feature router can own it when
restoration and external routing require longer lifetime. Avoid one mixed global path that
exposes every feature's internal routes.

### Trade-offs

- Local paths keep ownership clear but need an entry API for external routes.
- Central coordination simplifies deep links but can couple unrelated features.

### Example

The library tab remains on a book detail screen while the user checks search. Returning to
library restores that detail because the library flow, not the selected-tab value, owns it.

---

<a id="q3-cross-tab-deep-link"></a>
## Q3: How Should a Deep Link Open Content in Another Tab?

### Short Answer

Parse and authorize the link, select the tab that owns the destination, then give that
feature a typed route built from stable IDs. Apply the changes through one routing owner
and define fallback behavior for missing, expired, or unauthorized content.

### Expanded Answer

The URL is untrusted input, not navigation state. It should never construct a view or insert
an unchecked model into a path. The target feature remains responsible for loading the ID
and presenting loading, error, or replacement state.

### Trade-offs

- One root coordinator provides atomic cross-tab transitions but needs narrow feature APIs.
- Direct global path mutation is quick to implement but breaks module ownership.

### Example

A receipt link selects the account tab and asks its router to show `.receipt(id)`. If the
receipt no longer exists, the feature shows a stable error state instead of corrupting the path.

---

<a id="q4-adaptation-and-customization"></a>
## Q4: When Should Tabs Adapt or Be Customizable?

### Short Answer

Use `.sidebarAdaptable` when the same destination hierarchy should become a tab bar or
sidebar according to platform. Enable customization only when users benefit from reordering
or hiding secondary destinations, and give every customizable tab a stable ID and migration
policy. Required destinations should remain protected.

### Expanded Answer

Adaptive presentation must not create a second feature-state model. Persisted customization
becomes product data: renamed or removed tabs need tolerant migration. Keep the destination
set understandable even when sections are available.

### Trade-offs

- Adaptation uses platform conventions but requires testing every representation.
- Customization improves control but adds persistence, support, and evolution cost.

### Example

An iPad content app uses a sidebar-adaptable tab view and lets users reorder optional
collections. Home and search remain fixed so restoration and support instructions stay reliable.
