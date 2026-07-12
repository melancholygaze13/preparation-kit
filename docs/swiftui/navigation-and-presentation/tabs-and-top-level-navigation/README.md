---
title: "Tabs and Top-Level Navigation"
domain: "SwiftUI"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
tags:
  - tabs
  - tab-view
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation

> Tabs select among a small set of peer destinations. Store selection as stable
> typed state, and let each tab own the navigation state for its flow.

## Quick Recall

- Use the modern `Tab` API with an enum-backed `TabView(selection:)`.
- Tabs represent peer destinations, not steps in one task.
- Preserve independent path, selection, and scroll state for each tab when users expect continuity.
- A deep link selects its owning tab, then builds validated navigation inside that flow.
- Use adaptive styles and customization only when the product supports their platform behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
