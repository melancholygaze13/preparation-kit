---
title: "Scroll Position and Programmatic Scrolling: Theory"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Scroll Position and Programmatic Scrolling"
page_type: theory
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

# Scroll Position and Programmatic Scrolling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Scrolling has two forms of state. A semantic target identifies meaningful content,
such as message 42. A geometric position describes an offset or anchor that can change
when content size, locale, Dynamic Type, or container width changes.

Prefer semantic state for navigation, deep links, and restoration. Use geometric state
only when the exact visual position is the product requirement.

## How It Works

### Targeted Scrolling

`ScrollViewReader` supplies a proxy for event-driven commands:

```swift
ScrollViewReader { proxy in
    List(messages) { message in
        MessageRow(message: message)
            .id(message.id)
    }
    .onChange(of: requestedMessageID) { _, id in
        guard let id else { return }
        withAnimation {
            proxy.scrollTo(id, anchor: .center)
        }
    }
}
```

The target must exist in the rendered data and have a matching stable ID. If a deep
link targets unloaded content, load and merge the page first, then issue the scroll
request. Arbitrary delays hide lifecycle races and fail on slower devices.

Use animation only when it helps maintain context and respect reduced-motion policy.
A large jump may be clearer without animation.

### Position Bindings

Modern scroll APIs can bind scroll position to an ID or position value and define
target layout. This is useful when application behavior needs to observe or restore
the current target. Keep the binding at the lowest owner that coordinates it.

Do not write high-frequency geometric changes into a broad app model. This can
invalidate unrelated views and create feedback loops when the model also commands
scrolling. Normalize to a semantic value or rate-limit downstream work when continuous
position is required.

### User versus Programmatic Changes

Distinguish a command from observed user movement. A model that sees position change
and immediately writes the same target back can fight the gesture. Consume one-shot
commands or track their origin until the request settles.

Examples of legitimate commands include “jump to unread,” “return to top,” and a deep
link target. Passive observation might update a “new messages below” control or save
a restoration anchor.

### Restoration

Exact pixel offsets are fragile when row heights or content change. Store the stable
ID of the leading meaningful item and, if needed, a relative anchor. After data loads,
validate that the item still exists and scroll to it. Fall back to a nearby valid item
or a documented default.

For a chat, product policy may instead restore the newest message, the first unread
message, or the user's last anchor. Choose the meaning explicitly; the framework
cannot infer it.

### Prepending and Live Updates

Inserting items above the viewport can shift visible content. Preserve stable IDs and
use scroll-position APIs to maintain the anchor when loading older pages. Avoid
blindly scrolling after every update, which prevents the user from reading earlier content.

For live feeds, auto-scroll only when the user is already near the latest item or
explicitly requests it. Otherwise show an affordance indicating new content. This
separates incoming data from the user's current reading intent.

### Geometry and Performance

Avoid preference and geometry pipelines that publish every offset unless the product
needs continuous geometry. They can create high-frequency state changes. Use
framework scroll-position and visibility APIs where available, and measure update cost.

Stable row height is not always possible or desirable. Dynamic Type and localization
change geometry, reinforcing why semantic IDs are stronger restoration state.

## Constraints and Guarantees

- Programmatic targets require matching IDs in the scroll content.
- Exact layout and animation timing remain framework-controlled.
- Content insertion, size changes, and filtering can move geometric offsets.
- Position observation can be high frequency and should not automatically become global state.
- Restoration must handle missing targets and changed data.

## Engineering Decisions

| Need | Approach |
|---|---|
| One event-driven jump | `ScrollViewReader` and stable target ID |
| Position is ongoing application state | Scroll-position binding at flow scope |
| Restore after content changes | Semantic item ID plus anchor |
| New chat messages arrive | Auto-scroll only when user intent permits |
| Load older items above | Preserve current semantic anchor |
| Continuous visual effect | Observe geometry narrowly and profile frequency |

## References

- [`ScrollViewReader`](https://developer.apple.com/documentation/swiftui/scrollviewreader)
- [`ScrollPosition`](https://developer.apple.com/documentation/swiftui/scrollposition)
- [`scrollPosition`](https://developer.apple.com/documentation/swiftui/view/scrollposition%28_%3A%29)
- [Beyond scroll views](https://developer.apple.com/videos/play/wwdc2023/10159/)
