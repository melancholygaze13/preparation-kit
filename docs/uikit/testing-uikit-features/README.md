---
title: "Testing UIKit Features"
domain: "UIKit"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-08-12
---

# Testing UIKit Features

UIKit tests should run at the smallest useful level. Test presentation rules as
plain logic, use controller tests for lifecycle wiring, and keep UI tests for a
small set of important user flows.

## Preparation Paths

- **Rapid review:** Study presentation logic, lifecycle boundaries, one critical
  UI flow, and accessibility audits.
- **Standard preparation:** Complete the first three concepts in learning-path
  order.
- **Role-specific depth:** Add snapshot testing and broader device or locale
  matrices for design-system, accessibility, or UI-platform roles.

## Learning Path

1. [Testing Presentation and View Model Logic](testing-presentation-and-view-model-logic/README.md)
2. [Testing View Controller Lifecycle and Navigation](testing-view-controller-lifecycle-and-navigation/README.md)
3. [UI, Accessibility, and Interaction Testing](ui-accessibility-and-interaction-testing/README.md)
4. **Optional role-specific depth:**
   [Snapshot Testing and Visual Regressions](snapshot-testing-and-visual-regressions/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Testing Presentation and View Model Logic](testing-presentation-and-view-model-logic/README.md) | Verifies presentation decisions without unnecessary UI setup. | High | 11 min |
| [Testing View Controller Lifecycle and Navigation](testing-view-controller-lifecycle-and-navigation/README.md) | Exercises loading, appearance, containment, and routing boundaries. | High | 11 min |
| [UI, Accessibility, and Interaction Testing](ui-accessibility-and-interaction-testing/README.md) | Validates user-visible flows through stable accessibility information. | High | 11 min |
| [Snapshot Testing and Visual Regressions](snapshot-testing-and-visual-regressions/README.md) | Detects selected rendering changes with controlled baselines. | Situational | 8 min |
