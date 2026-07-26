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
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-26
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

Treat action sheets as contextual presentations too. [On iOS 26 and later, they
can appear anchored to their source on iPhone as well as iPad][uikit-design].
Supply a `sourceItem`,
bar button item, or source view on every device. This gives UIKit the correct
placement and also prevents a missing-anchor failure in regular width.

## Sheets

Sheets are useful for focused tasks that keep some surrounding context. They can
be lightweight, but they still need clear lifecycle and dismissal behavior.
Modern sheets may support multiple sizes, scrolling interaction, and interactive
dismissal.

Configure those choices through `UISheetPresentationController` after setting the
presentation style and before presenting:

```swift
editor.modalPresentationStyle = .pageSheet

if let sheet = editor.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.selectedDetentIdentifier = .medium
    sheet.prefersGrabberVisible = true
}

present(editor, animated: true)
```

Detents describe allowed sizes, not business state. Do not infer that a task was
completed because a sheet reached a particular detent. If scrolling and resizing
compete, test the actual content hierarchy and decide whether scrolling at an edge
should expand the sheet.

Pick sheet behavior from task risk. A filter panel may dismiss freely. A form
with unsaved input may need confirmation or draft persistence. Use
`isModalInPresentation` to prevent interactive dismissal when cancellation is not
safe, or use the adaptive presentation delegate to ask for confirmation. Keep the
same policy for explicit Close actions so gesture and button behavior agree.

On supported systems, standard presentations can use a zoom transition connected
to their source item. Prefer it only when the source-to-destination relationship is
real. The transition does not change who owns presentation, dismissal, or state.

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
- [UIAdaptivePresentationControllerDelegate](https://developer.apple.com/documentation/uikit/uiadaptivepresentationcontrollerdelegate)
- [View Controller Programming Guide: Presenting a View Controller](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/PresentingaViewController.html)
- [View Controller Programming Guide: Creating Custom Presentations](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/DefiningCustomPresentations.html)
- [Build a UIKit app with the new design][uikit-design]

[uikit-design]: https://developer.apple.com/videos/play/wwdc2025/284/
