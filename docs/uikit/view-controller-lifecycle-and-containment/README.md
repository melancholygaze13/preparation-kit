---
title: "View Controller Lifecycle and Containment"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-26
---

# View Controller Lifecycle and Containment

View controllers are UIKit's presentation boundary. A strong interview answer
should separate view creation, visible lifecycle transitions, ownership, and
containment rules.

## Learning Path

### Rapid Review

1. [View Controller Responsibilities and Ownership](view-controller-responsibilities-and-ownership/README.md)
2. [View Loading, Appearance, and Disappearance](view-loading-appearance-and-disappearance/README.md)
3. [Containment and Child View Controllers](containment-and-child-view-controllers/README.md)

### Standard Preparation

Read all core concepts in order. The first two establish the controller mental
model. The containment topic explains how larger flows are composed.

### Role-Specific Depth

4. [Lifecycle, State Restoration, and System Events](lifecycle-state-restoration-and-system-events/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [View Controller Responsibilities and Ownership](view-controller-responsibilities-and-ownership/README.md) | Keeps controllers focused on presentation, coordination, and lifecycle ownership. | Core | 13 min |
| [View Loading, Appearance, and Disappearance](view-loading-appearance-and-disappearance/README.md) | Distinguishes one-time view setup from repeated visibility and layout events. | Core | 14 min |
| [Containment and Child View Controllers](containment-and-child-view-controllers/README.md) | Builds correct parent-child ownership, appearance forwarding, and modular screens. | Core | 13 min |
| [Lifecycle, State Restoration, and System Events](lifecycle-state-restoration-and-system-events/README.md) | Connects controller state to scene changes, recreation, and system-driven transitions. | Core | 12 min |
