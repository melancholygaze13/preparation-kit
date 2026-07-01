---
title: "Presentation Context, Popovers, and Sheets: Theory"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Presentation Context, Popovers, and Sheets"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-01
---

# Presentation Context, Popovers, and Sheets: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Presentation context answers "what area is this presentation allowed to cover?"
In UIKit, the controller that asks to present is not always the final controller
that handles the presentation. Containers may provide the needed context.

This matters for split views, tabs, navigation controllers, popovers, sheets, and
custom presentations. A feature should configure what it needs, but it should not
assume every presentation covers the whole screen.

## Current Context

Current-context presentations cover a specific part of the interface. The target
controller marks itself as the context owner:

```swift
definesPresentationContext = true
overlay.modalPresentationStyle = .overCurrentContext
present(overlay, animated: true)
```

Use this when an overlay belongs to one child area rather than the whole window.
If the presentation unexpectedly covers too much or too little, check which
controller defines the context and where the request is made.

## Popovers

Popovers are contextual. They should point to the object, button, or region that
caused them. UIKit needs source information:

```swift
menu.modalPresentationStyle = .popover
menu.popoverPresentationController?.sourceView = sender
menu.popoverPresentationController?.sourceRect = sender.bounds
present(menu, animated: true)
```

On compact widths, popovers may adapt to another presentation style. That means
the presented content must still have a way to dismiss and must still make sense
without a visible arrow or anchor.

## Sheets

Sheets are useful for focused tasks that keep some surrounding context. They can
be lightweight, but they still need clear lifecycle and dismissal behavior.
Modern sheets may support multiple sizes, scrolling interaction, and interactive
dismissal.

Pick sheet behavior from task risk. A filter panel may dismiss freely. A form
with unsaved input may need confirmation or draft persistence.

## Engineering Decisions

Use a popover for contextual choices tied to an onscreen object in regular
width. Use a sheet for a focused task that should not replace the whole
navigation context. Use full screen when the task requires complete attention,
privacy, or a major mode switch.

Custom presentations are powerful but add lifecycle, transition, adaptation, and
testing cost. Prefer standard UIKit presentations unless the product behavior
cannot be expressed with sheets, popovers, or full-screen styles.

## Production Application

Presentation bugs often come from missing source information, presenting from a
stale controller, or failing to handle adaptation. Test popovers and sheets in
compact and regular width, with multitasking, rotation, and interactive
dismissal.

For reusable features, expose the desired presentation behavior as configuration
or route metadata. Let the app shell decide whether that means popover, sheet,
push, or full-screen presentation in the current environment.

## References

- [UIPopoverPresentationController](https://developer.apple.com/documentation/uikit/uipopoverpresentationcontroller)
- [UISheetPresentationController](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller)
- [View Controller Programming Guide: Presenting a View Controller](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/PresentingaViewController.html)
- [View Controller Programming Guide: Creating Custom Presentations](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/DefiningCustomPresentations.html)
