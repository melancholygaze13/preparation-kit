---
title: "Tabs and Top-Level Navigation"
domain: "UIKit"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
tags:
  - tabs
  - tab-bar-controller
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation

> Tabs switch among a small set of equally important top-level destinations.
> Give each tab stable
> identity and independent flow state, while a top-level owner handles selection,
> deep links, and restoration.

## Quick Recall

- Use tabs for peer destinations, not steps in one task.
- A tab often owns its own navigation controller and stack.
- Prefer stable `UITab` identifiers on supported systems; do not persist a tab's
  array index as its identity.
- A deep link selects the owning tab, then builds a valid route inside that flow.
- Let `UITabBarController` adapt its standard tab bar, sidebar, search, and
  accessory behavior before building custom chrome.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related

- [Navigation Controller Stack and Ownership](../navigation-controller-stack-and-ownership/README.md)
- [Split View Controller and Adaptive Navigation](../split-view-controller-and-adaptive-navigation/README.md)
