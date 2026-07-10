---
title: "UI, Accessibility, and Interaction Testing"
domain: "UIKit"
topic: "Testing UIKit Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# UI, Accessibility, and Interaction Testing

> UI tests prove that the built app works through its public, accessible
> interface. Make them reliable by controlling launch state, querying elements
> by meaning, and waiting for observable conditions.

## Quick Recall

- XCUIAutomation runs out of process and UI tests still use XCTest, not Swift
  Testing.
- Configure deterministic fixtures through launch arguments or environment at
  the app's composition root.
- Prefer accessible roles and labels; add stable identifiers when labels are
  localized or ambiguous.
- Automated accessibility audits find common issues, but they do not replace
  semantic assertions or manual assistive-technology testing.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
