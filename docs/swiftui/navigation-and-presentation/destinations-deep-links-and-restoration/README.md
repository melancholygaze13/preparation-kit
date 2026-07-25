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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - deep-links
  - state-restoration
  - routing
---

# Destinations, Deep Links, and Restoration

> Convert every external or persisted route through one validated application
> route model. Restore identifiers and intent, then resolve current data when the
> destination appears.

A destination is the app state and screen reached by navigation. A deep link is an
external reference to that destination. Restoration rebuilds a previous scene after
the system has removed it or the app launches again.

## Quick Recall

- Parse URLs and activities at a boundary; views should receive typed routes.
- Validate authorization and feature availability before routing; handle data that
  disappears before the destination loads.
- Treat a deep link as a complete desired state, not a sequence of simulated taps.
- Persist compact, versioned route data rather than view state or model objects.
- Restoration is best effort because data, permissions, and app structure change.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
