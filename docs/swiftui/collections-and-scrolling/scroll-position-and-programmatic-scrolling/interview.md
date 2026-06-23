---
title: "Scroll Position and Programmatic Scrolling: Interview Questions"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Scroll Position and Programmatic Scrolling"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - scroll-position
  - scroll-view-reader
  - restoration
---

# Scroll Position and Programmatic Scrolling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you scroll to a specific item?](#q1-how-do-you-scroll-to-a-specific-item) | Senior | Targets and lifecycle |
| [How would you restore scroll position?](#q2-how-would-you-restore-scroll-position) | Senior | Semantic versus geometric state |
| [How do you handle new chat messages without fighting the user?](#q3-how-do-you-handle-new-chat-messages-without-fighting-the-user) | Senior | User intent and updates |

---

<a id="q1-how-do-you-scroll-to-a-specific-item"></a>
## Q1: How do you scroll to a specific item?

### Short Answer

I give the content a stable ID and use `ScrollViewReader` for a one-shot command, or
a scroll-position binding when position is ongoing state. The target must be loaded
before the command runs.

### Expanded Answer

For a deep link, I load the required page, merge it into the collection, then scroll
to the ID. I do not schedule a fixed delay. I choose an anchor and animation according
to context and reduced-motion policy.

<a id="q2-how-would-you-restore-scroll-position"></a>
## Q2: How would you restore scroll position?

### Short Answer

I usually persist a semantic item ID and anchor rather than a pixel offset. After
data loads, I validate the item and restore it, with a safe fallback if it disappeared.

### Expanded Answer

Pixel offsets become invalid when rows change height due to new data, Dynamic Type,
locale, or window size. The product must define whether restoration means last visible,
first unread, latest item, or another meaningful target.

I keep restoration state scoped to the scene or flow, not a global singleton.

<a id="q3-how-do-you-handle-new-chat-messages-without-fighting-the-user"></a>
## Q3: How do you handle new chat messages without fighting the user?

### Short Answer

I auto-scroll only when the user is already near the latest message or explicitly
requests it. Otherwise I preserve their anchor and show a “new messages” affordance.

### Expanded Answer

Incoming data and scroll commands are separate events. Stable message IDs let inserts
preserve association. When older messages prepend, I preserve the current semantic
anchor so visible content does not jump.

I distinguish observed user movement from programmatic commands to avoid a binding
feedback loop that overrides gestures.
