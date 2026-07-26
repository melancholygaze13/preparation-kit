---
title: "Presentation Context, Popovers, and Sheets: Interview Questions"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Presentation Context, Popovers, and Sheets"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-26
---

# Presentation Context, Popovers, and Sheets: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does presentation context control?](#q1-presentation-context) | Senior | UIKit hierarchy |
| [What does a popover need to present correctly?](#q2-popover-source) | Senior | Popover setup |
| [How do you choose between popover, sheet, and full screen?](#q3-choose-presentation-style) | Staff | Product judgment |
| [How would you protect unsaved state in an interactively dismissible sheet?](#q4-sheet-dismissal) | Senior | Dismissal policy |

---

<a id="q1-presentation-context"></a>
## Q1: What does presentation context control?

### Short Answer

Presentation context tells UIKit which controller and area a presentation should cover.
UIKit may route a presentation request to an ancestor or container that can
provide the right context.

### Expanded Answer

For full-screen presentation, UIKit needs a controller that can cover the whole
screen. For current-context presentation, a controller can set
`definesPresentationContext` so the presented view covers only that controller's
area. This is important in split views and custom containers.

---

<a id="q2-popover-source"></a>
## Q2: What does a popover need to present correctly?

### Short Answer

A contextual presentation needs source information, such as a source view and rect,
a bar button item, or a source item. The source tells UIKit what object the
presentation relates to and where it belongs.

### Expanded Answer

The content also needs to adapt. In compact width, the popover may become a
different style, so the presented controller still needs a clear dismissal path
and layout that works without a popover anchor. I provide the source on iPhone too,
because current action sheets can use anchored presentation there.

---

<a id="q3-choose-presentation-style"></a>
## Q3: How do you choose between popover, sheet, and full screen?

### Short Answer

I choose by task meaning. Popovers fit contextual choices tied to an object.
Sheets fit focused tasks that can keep surrounding context. Full screen fits
major mode changes, privacy, or tasks that need complete attention.

### Expanded Answer

For example, a sort menu from a toolbar may be a popover on iPad and a sheet on
iPhone. Editing a profile may be a sheet with its own navigation stack.
Authentication may be full screen if it blocks the app.

### Trade-offs

Adaptive presentations improve reuse, but they require testing the same feature
in regular and compact widths. Hard-coding one presentation style everywhere can
make the feature feel wrong on either phone or iPad.

---

<a id="q4-sheet-dismissal"></a>
## Q4: How would you protect unsaved state in an interactively dismissible sheet?

### Short Answer

I keep draft state outside the dismissal gesture, then either save it continuously,
disable interactive dismissal with `isModalInPresentation`, or use the presentation
controller delegate to confirm cancellation. Close buttons follow the same policy.

### Expanded Answer

A detent change is layout, not task completion. I commit only from an explicit save
action. If dismissal is attempted with dirty state, the owner can reject it and show
confirmation. This keeps swipe, tap-outside, and explicit Close behavior consistent.
