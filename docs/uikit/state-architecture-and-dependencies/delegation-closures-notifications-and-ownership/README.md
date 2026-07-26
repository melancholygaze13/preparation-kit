---
title: "Delegation, Closures, Notifications, and Ownership"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Delegation, Closures, Notifications, and Ownership

> Delegation sends callbacks to one assigned object. A closure stores one block
> of work. A notification broadcasts an event to registered observers. Use
> delegation for a one-to-one relationship, closures for local callbacks, and notifications for
> broadcast events where the sender should not know the receivers.

## Quick Recall

- Delegates are usually weak because the delegating object should not own its
  controller.
- Closures are direct and lightweight, but capture lists decide lifetime.
- Notifications decouple senders from receivers, but hide control flow.
- Prefer the narrowest mechanism that matches the relationship.
- Make observer and callback lifetimes explicit during reuse and deallocation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
