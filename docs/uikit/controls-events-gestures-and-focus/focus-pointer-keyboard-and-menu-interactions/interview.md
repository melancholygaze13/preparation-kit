---
title: "Focus, Pointer, Keyboard, and Menu Interactions: Interview Questions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Focus, Pointer, Keyboard, and Menu Interactions"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-05
---

# Focus, Pointer, Keyboard, and Menu Interactions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why does focus matter in UIKit?](#q1-focus) | Senior | Non-touch navigation |
| [How should keyboard commands be designed?](#q2-keyboard-commands) | Senior | Command routing |
| [How do pointer and menu interactions fit with touch UI?](#q3-pointer-menu) | Staff | Multi-input design |

---

<a id="q1-focus"></a>
## Q1: Why does focus matter in UIKit?

### Short Answer

Focus identifies the active element for non-touch navigation. It matters for
keyboard, remote, game controller, iPad, Catalyst, and tvOS-style interaction.

### Expanded Answer

Focus should make navigation predictable. Custom containers should expose focus
targets that match the visual layout and should avoid trapping the user. I would
use focus updates mainly for appearance, not for committing business changes.

Selection or activation should usually be a separate user action.

---

<a id="q2-keyboard-commands"></a>
## Q2: How should keyboard commands be designed?

### Short Answer

Keyboard commands should trigger the same intents as touch and menu actions,
route to the active context, and avoid stealing normal text input.

### Expanded Answer

I would use keyboard commands for frequent actions such as search, save, delete,
escape, and navigation. For document-style commands, responder-chain routing is
often better than hard-coding one controller.

Commands should be enabled only when valid and should go through the same
validation, undo, analytics, and state update path as touch.

---

<a id="q3-pointer-menu"></a>
## Q3: How do pointer and menu interactions fit with touch UI?

### Short Answer

Pointer and menu interactions should expose or clarify the same commands, not
create a separate pointer-only or menu-only product path.

### Expanded Answer

Pointer feedback should communicate what can be clicked, dragged, or opened.
Menus are useful for secondary, contextual, or keyboard-discoverable commands.
Primary required actions should still be available through the main UI.

For larger apps, I would standardize common commands and menu placement so each
feature does not invent a different input model.
