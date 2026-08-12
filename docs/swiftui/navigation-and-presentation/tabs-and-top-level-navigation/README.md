---
title: "Tabs and Top-Level Navigation"
domain: "SwiftUI"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tabs
  - tab-view
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation

> Tabs select among a small set of peer destinations. Store selection as stable
> typed state, and let each tab own the navigation state for its flow.

Top-level navigation moves between the app's main areas. It is separate from the
pushes, sheets, and selections that happen inside one area.

## Quick Recall

- On iOS 18 and related releases, use `Tab` with an enum-backed `TabView(selection:)`.
- For older deployment targets, use the same typed selection with `tabItem` and `tag`.
- Tabs represent peer destinations, not steps in one task.
- Preserve independent path, selection, and scroll state for each tab when users expect continuity.
- A deep link selects its owning tab, then builds validated navigation inside that flow.
- Use adaptive styles and customization only when the product supports their platform behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
