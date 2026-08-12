---
title: "UIKit"
page_type: domain-index
interview_priority: core
status: reviewed
last_reviewed: 2026-08-12
---

# UIKit

UIKit is Apple's object-based framework for building event-driven interfaces on
iPhone, iPad, and related platforms. A `UIView` displays and receives interaction
for a rectangular region. A `UIViewController` manages a view hierarchy and joins
it to navigation, presentation, and lifecycle events. UIKit objects that affect
the interface belong on the main actor.

UIKit interviews test whether you can reason about those mutable objects,
controller and scene lifetimes, container ownership, event delivery, layout, and
main-actor UI work. Prepare the common production boundaries first. Add specialized
framework detail only when it matches the role.

If UIKit is new to you, follow the rapid-review path in order. It starts with the
objects and lifecycles that later topics assume. The concept overviews provide the
one-minute answer; each theory page teaches normal use before production trade-offs.

## Rapid Review

Use this path for an imminent Senior or Staff interview:

1. [View Controller Lifecycle and Containment](view-controller-lifecycle-and-containment/README.md)
2. [Views, Layers, and Rendering](views-layers-and-rendering/README.md)
3. [Auto Layout and Adaptive Layout](auto-layout-and-adaptive-layout/README.md)
4. [Navigation and Presentation](navigation-and-presentation/README.md)
5. [Lists and Collection Views](lists-and-collection-views/README.md)
6. [State, Architecture, and Dependencies](state-architecture-and-dependencies/README.md)
7. [Concurrency and UI Lifecycle](concurrency-and-ui-lifecycle/README.md)
8. [Performance, Memory, and Diagnostics](performance-memory-and-diagnostics/README.md)

## Standard Preparation

Complete the rapid-review path, then add these high-priority topics:

1. [Controls, Events, Gestures, and Focus](controls-events-gestures-and-focus/README.md)
2. [Text Input, Keyboard, and Forms](text-input-keyboard-and-forms/README.md)
3. [Accessibility and Adaptive UI](accessibility-and-adaptive-ui/README.md)
4. [Animation, Transitions, and Interaction](animation-transitions-and-interaction/README.md)
5. [Testing UIKit Features](testing-uikit-features/README.md)
6. [App, Scene, Window, and System Integration](app-scene-window-and-system-integration/README.md)

## Role-Specific Depth

Choose these topics when they match the job description, product, or interview
format. They are not prerequisites for the standard path.

1. [SwiftUI Interoperability and Migration](swiftui-interoperability-and-migration/README.md)
2. [Custom Drawing, Graphics, and Media](custom-drawing-graphics-and-media/README.md)

## Topics

### Core

| Topic | Why it matters |
|---|---|
| [View Controller Lifecycle and Containment](view-controller-lifecycle-and-containment/README.md) | Defines controller ownership, appearance, containment, and lifecycle boundaries. |
| [Views, Layers, and Rendering](views-layers-and-rendering/README.md) | Explains hierarchy, geometry, event targeting, layout passes, and Core Animation backing. |
| [Auto Layout and Adaptive Layout](auto-layout-and-adaptive-layout/README.md) | Covers constraint solving, intrinsic sizing, safe areas, and runtime adaptation. |
| [Navigation and Presentation](navigation-and-presentation/README.md) | Covers stack ownership, modal flows, adaptive navigation, and presentation context. |
| [Lists and Collection Views](lists-and-collection-views/README.md) | Targets reusable cells, stable identity, modern data sources, layout, and scrolling cost. |
| [State, Architecture, and Dependencies](state-architecture-and-dependencies/README.md) | Frames controller boundaries, state flow, communication patterns, and modular ownership. |
| [Concurrency and UI Lifecycle](concurrency-and-ui-lifecycle/README.md) | Connects main-actor isolation, cancellation, reuse, caching, and result ordering. |
| [Performance, Memory, and Diagnostics](performance-memory-and-diagnostics/README.md) | Covers retain cycles, scrolling responsiveness, rendering cost, and evidence-based diagnosis. |

### High Priority

| Topic | Why it matters |
|---|---|
| [Controls, Events, Gestures, and Focus](controls-events-gestures-and-focus/README.md) | Explains UIKit event routing, control actions, gesture arbitration, and non-touch input. |
| [Text Input, Keyboard, and Forms](text-input-keyboard-and-forms/README.md) | Covers text editing boundaries, keyboard coordination, validation, and secure input. |
| [Accessibility and Adaptive UI](accessibility-and-adaptive-ui/README.md) | Keeps interfaces meaningful and usable across content sizes, locales, and preferences. |
| [Animation, Transitions, and Interaction](animation-transitions-and-interaction/README.md) | Covers interruptible property animation, controller transitions, and interactive system behaviors. |
| [Testing UIKit Features](testing-uikit-features/README.md) | Separates deterministic logic, lifecycle integration, accessibility flows, and visual regression testing. |
| [App, Scene, Window, and System Integration](app-scene-window-and-system-integration/README.md) | Separates process and scene ownership for the required scene-based lifecycle. |

### Role-Specific Depth

| Topic | Use it when |
|---|---|
| [SwiftUI Interoperability and Migration](swiftui-interoperability-and-migration/README.md) | Covers hosting, representable boundaries, and staged migration ownership. |
| [Custom Drawing, Graphics, and Media](custom-drawing-graphics-and-media/README.md) | Provides role-specific depth for drawing, image pipelines, and advanced composition. |
