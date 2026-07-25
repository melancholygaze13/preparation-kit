---
title: "Adaptive Layout, Size Classes, and Input: Theory"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
concept: "Adaptive Layout, Size Classes, and Input"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-25
tags:
  - adaptive-layout
  - size-classes
  - input
---

# Adaptive Layout, Size Classes, and Input: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

**Adaptive layout** changes arrangement to fit current content and available space.
A **size class** is a coarse horizontal or vertical environment category. **Input** is
how a user interacts, including touch, pointer, keyboard, remote, and assistive technology.

An interface adapts to its current container, content, platform conventions, and input
capabilities. Device model and full-screen bounds do not describe a resizable window,
split view, sheet, widget, or nested component.

Keep feature state stable while selecting a presentation that fits the environment.

## How It Works

### Available Space

Use flexible stacks, grids, `ViewThatFits`, container-relative sizing, safe areas, and
the `Layout` protocol before reaching for global screen measurements. A child should
respond to its parent proposal rather than assume it owns the display.

Size classes are coarse environmental hints. They can help choose navigation or
composition, but they are not “iPhone versus iPad.” Different windows on one device
can expose different space, and similar classes can still have meaningfully different widths.

Read one when it represents a real composition decision:

```swift
@Environment(\.horizontalSizeClass) private var horizontalSizeClass

var body: some View {
    if horizontalSizeClass == .compact {
        CompactAccountView()
    } else {
        AccountColumns()
    }
}
```

This is a coarse navigation or composition choice. A reusable card should usually
respond to its proposal instead of assuming `.regular` means a particular width.

### Content-Driven Adaptation

Choose breakpoints from when content no longer works, not from named devices. Long
localization and Dynamic Type can require vertical composition even in a wide window.
Conversely, concise content can fit horizontally in a compact region.

Avoid fixed frames unless content and scaling are controlled. Define minimum, ideal,
maximum, overflow, and reflow behavior for shared components.

`ViewThatFits` can select the first candidate that fits the proposed space:

```swift
ViewThatFits {
    HStack { AccountFields() }
    VStack(alignment: .leading) { AccountFields() }
}
```

Put the preferred composition first. Both candidates must remain semantically correct,
because localization and Dynamic Type may select the fallback at any window size.

### Navigation

`NavigationSplitView` can present columns in wide contexts and collapse in compact
ones. Use one coherent selection and route model so compact and expanded layouts are
two projections of the same state.

Do not maintain independent phone and tablet navigation histories unless workflows
are genuinely different. Deep links and restoration should translate to the same
semantic selections and routes.

### Input Methods

Support touch, pointer, keyboard, focus, remote, and assistive technology according to
the platform. Standard controls provide much of this behavior. Hover cannot be the
only way to reveal an important action, and right-click cannot be its only entry point.

Keyboard users need logical focus order, shortcuts that do not conflict with text
entry, and visible focus. Pointer targets can be visually small, but touch targets
must remain adequate.

### Orientation and Window Changes

Avoid storing orientation-derived UI state that can disagree with the actual
container. Let layout respond to proposals. If composition changes structurally,
preserve semantic state and focus where possible.

Test live resize and rotation, not only launch snapshots. Async work should not restart
merely because presentation changed unless its inputs or owner changed.

### Input and Layout Together

Keyboard presentation reduces usable space. Forms should scroll focused fields and
actions into reach rather than calculate offsets from screen height. Pointer and
keyboard toolbars may justify commands not visible in compact touch UI, but the core
operation remains accessible elsewhere.

Drag-and-drop should have menu or button alternatives when it performs essential work.
Contextual actions route through the same feature policy regardless of input source.

### Testing Matrix

Select representative combinations rather than multiplying every variable blindly:
small and large windows, largest text, long RTL localization, touch and keyboard,
VoiceOver, reduced motion, empty/error/loading states, and multicolumn collapse.

Previews accelerate layout review. Device testing verifies focus, input, resizing,
performance, and assistive technology behavior.

Record supported combinations as reusable test scenarios so shared components and
feature screens are reviewed against the same adaptation expectations.

## Constraints and Guarantees

- Size classes are environmental categories, not stable device identifiers.
- Container space can change while the feature remains alive.
- Layout proposals are local; global screen bounds can be unrelated to a component.
- Input methods can coexist, so one platform is not limited to one interaction mode.
- Presentation adaptation should not duplicate or corrupt feature state.
- Size-class values can change while a view is alive. They are environment input, not
  durable model state.

## Engineering Decisions

| Need | Approach |
|---|---|
| Choose horizontal or vertical composition | Content-driven adaptive layout |
| Multicolumn navigation | One selection model with `NavigationSplitView` |
| Proportional child sizing | Container-relative sizing |
| Complex reusable placement | `Layout` protocol |
| Keyboard form avoidance | Scrollable focus-aware form |
| Essential drag action | Provide button/menu/accessibility alternative |

## References

- [View layout](https://developer.apple.com/documentation/swiftui/view-layout)
- [`ViewThatFits`](https://developer.apple.com/documentation/swiftui/viewthatfits)
- [`NavigationSplitView`](https://developer.apple.com/documentation/swiftui/navigationsplitview)
- [Build a multi-platform app with SwiftUI](https://developer.apple.com/videos/play/wwdc2022/10062/)
