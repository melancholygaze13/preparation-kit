---
title: "Modal Presentation, Dismissal, and Ownership: Interview Questions"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Modal Presentation, Dismissal, and Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Modal Presentation, Dismissal, and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What relationship does modal presentation create?](#q1-modal-relationship) | Senior | UIKit model |
| [How should a modal report completion?](#q2-modal-completion) | Senior | Ownership |
| [How do you handle swipe dismissal with unsaved state?](#q3-swipe-dismissal-unsaved-state) | Staff | Production safety |

---

<a id="q1-modal-relationship"></a>
## Q1: What relationship does modal presentation create?

### Short Answer

It creates a presenting and presented view controller relationship. The presented
controller appears using a presentation style and remains part of the view
controller hierarchy until dismissed.

### Expanded Answer

The controller that calls `present` is not always the final presenter. UIKit can
walk up the hierarchy to find a suitable presentation context, especially for
full-screen styles. That is why a feature should not depend on assumptions about
the exact concrete presenter.

---

<a id="q2-modal-completion"></a>
## Q2: How should a modal report completion?

### Short Answer

The presented screen should report its result to the object that started it,
such as saved, cancelled, or failed. Dismissal should not be the only signal
because different outcomes may
need different updates.

### Expanded Answer

A small modal can use a delegate or closure. A larger flow may use a coordinator
or route action. The important part is that the owner receives the result and
decides what state should change after the modal closes.

If the modal has multiple steps, I usually embed its root controller in a
navigation controller so the modal flow owns its internal stack.

---

<a id="q3-swipe-dismissal-unsaved-state"></a>
## Q3: How do you handle swipe dismissal with unsaved state?

### Short Answer

I treat interactive dismissal as a real exit path. If state can be lost, I block
or intercept dismissal and ask the user to confirm.

### Expanded Answer

For sheets, I can use `isModalInPresentation` to prevent casual dismissal while
there are unsaved changes. I can also use presentation controller delegate
callbacks to decide whether dismissal should proceed or to show confirmation.

### Trade-offs

Blocking dismissal protects data but can feel heavy. Allowing dismissal is
smoother but requires autosave, draft state, or a clear recovery path.
