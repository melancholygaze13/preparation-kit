---
title: "UI and Accessibility Testing"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
---

# UI and Accessibility Testing

> A UI test drives the built app as a user process. Accessibility testing checks the
> semantic interface and alternate interaction paths. Use XCTest for automation;
> Swift Testing does not support UI tests.

## Quick Recall

- Swift Testing does not support UI automation; use XCTest and XCUIAutomation.
- Query stable semantic elements and wait for conditions instead of sleeping.
- Use launch arguments and environment values to create deterministic app state.
- Treat accessibility identifiers as automation hooks, not user-facing labels.
- Combine automated audits with VoiceOver, Dynamic Type, contrast, and motion checks.

UI tests prove framework wiring and a few critical journeys. They are slower and less
precise than model tests. Accessibility audits find supported technical issues, but
manual assistive-technology use is still required to judge meaning and workflow.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
