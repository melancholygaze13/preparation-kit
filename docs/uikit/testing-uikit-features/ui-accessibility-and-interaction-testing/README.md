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
last_reviewed: 2026-08-12
---

# UI, Accessibility, and Interaction Testing

> UI tests prove that the built app works through its public, accessible
> interface. Make them reliable by controlling launch state, querying elements
> by meaning, and waiting for observable conditions.

## Quick Recall

- XCUIAutomation runs out of process and UI tests still use XCTest, not Swift
  Testing.
- Use launch arguments or environment values to choose known test data when the
  app starts.
- Prefer accessible roles and labels; add stable identifiers when labels are
  localized or ambiguous.
- Automated accessibility audits find common issues, but they do not replace
  checks of accessible meaning or manual assistive-technology testing.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
