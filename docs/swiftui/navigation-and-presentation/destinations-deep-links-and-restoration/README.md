---
title: "Destinations, Deep Links, and Restoration"
domain: "SwiftUI"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - deep-links
  - state-restoration
  - routing
---

# Destinations, Deep Links, and Restoration

> Convert every external or persisted route through one validated application
> route model. Restore identifiers and intent, then resolve current data when the
> destination appears.

## Quick Recall

- Parse URLs and activities at a boundary; views should receive typed routes.
- Validate authorization, feature availability, and object existence before routing.
- Treat a deep link as a complete desired state, not a sequence of simulated taps.
- Persist compact, versioned route data rather than view state or model objects.
- Restoration is best effort because data, permissions, and app structure change.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
