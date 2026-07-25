---
title: "UIViewRepresentable and Coordinators"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
---

# UIViewRepresentable and Coordinators

> `UIViewRepresentable` adapts a UIKit view for use inside SwiftUI. A coordinator is
> an optional reference object for delegates, data sources, targets, and callbacks.
> SwiftUI owns the update cycle; UIKit owns the concrete view instance.

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
