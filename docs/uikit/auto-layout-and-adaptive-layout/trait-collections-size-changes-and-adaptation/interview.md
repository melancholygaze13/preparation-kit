---
title: "Trait Collections, Size Changes, and Adaptation: Interview Questions"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Trait Collections, Size Changes, and Adaptation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Trait Collections, Size Changes, and Adaptation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is a trait collection used for?](#q1-trait-collection-purpose) | Senior | Environment model |
| [How should a UIKit screen respond to rotation or window resizing?](#q2-size-change-response) | Senior | Lifecycle coordination |
| [Why is branching on device type a weak adaptive-layout strategy?](#q3-device-type-branching) | Staff | Design judgment |
| [How would you observe only relevant trait changes?](#q4-observe-specific-traits) | Senior | Focused invalidation |

---

<a id="q1-trait-collection-purpose"></a>
## Q1: What is a trait collection used for?

### Short Answer

A trait collection describes the environment a view or view controller is in. It
can include size class, interface style, display scale, contrast, and content
size category. I use it to choose adaptive behavior, not to infer exact frames.

### Expanded Answer

Traits are context. A controller in a sheet can have different effective space
than the full screen. An iPad app can run in a narrow window. That is why I use
traits for broad decisions and constraints or actual bounds for final geometry.

---

<a id="q2-size-change-response"></a>
## Q2: How should a UIKit screen respond to rotation or window resizing?

### Short Answer

Most resizing should be handled by constraints. If the screen needs a structural
mode change, I update that mode during the transition and coordinate animations
with the transition coordinator.

### Expanded Answer

For example, a toolbar might switch from horizontal buttons to a menu at narrow
widths. I would update that state in response to the new size, then call
`layoutIfNeeded()` inside the coordinated animation if constraints changed.

I would not recalculate every frame on rotation unless the view is a custom
manual-layout component that owns its geometry.

---

<a id="q3-device-type-branching"></a>
## Q3: Why is branching on device type a weak adaptive-layout strategy?

### Short Answer

Device type is too coarse. iPad can be narrow, iPhone can have different screen
sizes, and presentations can change the available area. It is better to adapt
based on available size, traits, and content needs.

### Expanded Answer

Device checks create layouts that pass on the devices the team tested but fail
in multitasking, Stage Manager, external displays, or large Dynamic Type. A
stronger design uses shared breakpoints and component rules.

### Trade-offs

Device checks can be acceptable for hardware-specific capabilities. They are a
poor fit for layout decisions unless the device capability is truly the reason
for the difference.

---

<a id="q4-observe-specific-traits"></a>
## Q4: How would you observe only relevant trait changes?

### Short Answer

I register for the specific trait types that affect the component. I configure
the initial state separately because registration reports only later changes. I
keep the handler cheap by invalidating layout or display instead of doing heavy
work immediately.

### Expanded Answer

A component that changes only with horizontal size class and content size category
does not need to react to display scale or interface style. On iOS 17 and later, I
use automatic trait tracking or `registerForTraitChanges`. If the deployment target
is older, I keep a fallback `traitCollectionDidChange(_:)` override and compare the
previous and current values before updating.
