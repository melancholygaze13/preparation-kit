---
title: "Scroll Position and Programmatic Scrolling"
domain: "SwiftUI"
topic: "Collections and Scrolling"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - scroll-position
  - scroll-view-reader
  - restoration
---

# Scroll Position and Programmatic Scrolling

> Scroll position describes where content is visible. Programmatic scrolling changes
> that position from code. Prefer a stable item ID over an exact pixel offset when
> content size can change.

## Quick Recall

- A target must exist and have stable identity before scrolling to it.
- Use `ScrollViewReader` for imperative targeted scrolling at a specific event.
- Use scroll-position bindings when position itself is application state.
- Separate user scrolling from programmatic commands to avoid feedback loops.
- Restore a semantic item and anchor when data or row heights can change.
- In lazy stacks, absolute size and offset are estimates that can be corrected.

Use `ScrollViewReader` for a one-time command such as “jump to unread.” Use a position
binding when the current position must be read and written as feature state. Newer
scroll APIs need availability checks when the app supports older operating systems.
For lazy content, prefer IDs or relative visibility because unmeasured rows make exact
absolute offsets unstable.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
