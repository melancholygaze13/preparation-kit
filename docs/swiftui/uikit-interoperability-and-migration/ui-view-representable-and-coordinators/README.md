---
title: "UIViewRepresentable and Coordinators"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
---

# UIViewRepresentable and Coordinators

> `UIViewRepresentable` is the boundary adapter for using a UIKit view inside
> SwiftUI. SwiftUI owns the wrapper value and update cycle; UIKit owns the
> concrete view instance and delegate-style callbacks.

## Quick Recall

- Check current native SwiftUI and framework views first; on iOS 26+, WebKit provides `WebView` and `WebPage`.
- Use `makeUIView` for one-time construction and `updateUIView` to synchronize
  changing SwiftUI inputs into the existing UIKit view.
- Use a coordinator when UIKit needs a delegate, data source, target, or callback
  object with stable identity.
- Keep ownership clear: the representable translates state and events, while the
  parent SwiftUI view owns the source of truth.
- Avoid feedback loops by checking whether a UIKit callback actually represents a
  new user action before writing back into SwiftUI state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
