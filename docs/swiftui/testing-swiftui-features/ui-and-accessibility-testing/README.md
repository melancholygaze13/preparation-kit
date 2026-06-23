---
title: "UI and Accessibility Testing"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
---

# UI and Accessibility Testing

> UI tests prove a few critical user journeys through the accessibility tree.
> Accessibility audits broaden coverage, but manual assistive-technology testing
> remains necessary.

## Quick Recall

- Swift Testing does not support UI automation; use XCTest and XCUIAutomation.
- Query stable semantic elements and wait for conditions instead of sleeping.
- Use launch arguments and environment values to create deterministic app state.
- Treat accessibility identifiers as automation hooks, not user-facing labels.
- Combine automated audits with VoiceOver, Dynamic Type, contrast, and motion checks.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
