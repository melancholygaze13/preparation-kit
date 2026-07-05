---
title: "Gesture Recognizer Coordination: Theory"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Gesture Recognizer Coordination"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-05
---

# Gesture Recognizer Coordination: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A gesture recognizer observes touches and decides whether they match a gesture.
UIKit owns the raw touch delivery. The recognizer owns the interpretation.

Gesture bugs usually come from conflict. Two recognizers want the same touches,
a custom recognizer competes with a scroll view, or a recognizer cancels touches
that a control needed. A strong answer explains the intended priority.

## How It Works

Gesture recognizers have states. Discrete gestures, such as tap, usually go from
possible to recognized or failed. Continuous gestures, such as pan and pinch,
move through began, changed, ended, cancelled, or failed.

```swift
final class PhotoViewController: UIViewController, UIGestureRecognizerDelegate {
    private lazy var pan = UIPanGestureRecognizer(
        target: self,
        action: #selector(handlePan(_:))
    )

    override func viewDidLoad() {
        super.viewDidLoad()
        pan.delegate = self
        imageView.addGestureRecognizer(pan)
    }

    @objc private func handlePan(_ recognizer: UIPanGestureRecognizer) {
        let translation = recognizer.translation(in: view)
        switch recognizer.state {
        case .began, .changed:
            imageView.transform = CGAffineTransform(
                translationX: translation.x,
                y: translation.y
            )
        case .ended, .cancelled, .failed:
            finishInteraction()
        default:
            break
        }
    }
}
```

The handler should respond to state transitions. It should not assume the gesture
will always end normally; cancellation happens during interruptions, competing
recognizers, or system changes.

## Coordination Rules

Use delegate methods for coordination:

| Need | API direction |
|---|---|
| Two gestures can both recognize | Allow simultaneous recognition in the delegate |
| One gesture should wait for another to fail | Use a failure requirement |
| Gesture should ignore some touches | Filter in `gestureRecognizer(_:shouldReceive:)` |
| Gesture should start only in a valid state | Return false from `gestureRecognizerShouldBegin(_:)` |

Failure requirements are useful for tap conflicts. For example, a single tap can
wait for a double tap to fail. Simultaneous recognition is useful when gestures
are independent, such as pinch and rotate on the same image.

Scroll views are special because they already use pan, pinch, and other
recognizers. A custom gesture inside a scroll view should have a clear policy:
does it recognize with scrolling, block scrolling, or start only in a specific
direction?

## Controls and Touch Delivery

Gesture recognizers can delay or cancel touch delivery to views. The default
behavior is often correct for gestures, but it can surprise buttons and controls.
If a tap recognizer on a container prevents a button from receiving taps, check
the recognizer delegate and properties such as `cancelsTouchesInView`.

Do not solve every conflict by disabling cancellation. If the gesture truly owns
the interaction, cancellation may be correct. If the gesture is just an
background tap-to-dismiss keyboard behavior, it should usually ignore controls.

## Production Application

When a gesture conflict appears, write the policy first:

1. Which recognizer should win?
2. Can the recognizers run together?
3. Should one wait for the other to fail?
4. Should certain views or controls be excluded?
5. What happens if the gesture is cancelled?

For Staff and Principal roles, shared interaction components need documented
gesture policies. A bottom sheet, carousel, map, and scroll view can all compete
for pans. Without clear rules, teams add local delegate exceptions that regress
other screens.

## References

- [UIGestureRecognizer](https://developer.apple.com/documentation/uikit/uigesturerecognizer)
- [UIGestureRecognizerDelegate](https://developer.apple.com/documentation/uikit/uigesturerecognizerdelegate)
- [Handling UIKit gestures](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/handling_uikit_gestures)
- [UIScrollView](https://developer.apple.com/documentation/uikit/uiscrollview)
