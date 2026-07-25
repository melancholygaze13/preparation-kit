---
title: "Sheets, Popovers, and Dialogs"
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
  - sheets
  - popovers
  - dialogs
---

# Sheets, Popovers, and Dialogs

> Modal presentation is state: a Boolean represents one context-free presentation,
> while an optional identifiable value represents both whether and what to present.

A sheet presents a focused task. A popover presents contextual content from a source.
An alert or confirmation dialog asks for a small decision without creating a full flow.

## Quick Recall

- Prefer item-driven presentation when the destination needs selected data.
- Keep one source of truth; avoid a Boolean plus a separate optional payload.
- Attach presentation near the UI and state that own the interaction.
- Expect popovers and sheets to adapt their appearance to the current platform and size.
- Use alerts for important information and confirmation dialogs for action choices.
- Make destructive actions explicit, cancelable, and correctly assigned a role.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
