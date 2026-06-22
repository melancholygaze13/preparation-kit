---
title: "UIKit"
page_type: domain-index
status: draft
last_reviewed: 2026-06-22
---

# UIKit

## Stack

1. App, scene, and window
2. View controllers and containment
3. Views, layers, and rendering
4. Auto Layout and adaptation
5. Controls, events, gestures, and accessibility
6. Navigation, lists, state, and architecture
7. Concurrency, performance, memory, and testing

## Rapid Review

1. [View Controller Lifecycle and Containment](view-controller-lifecycle-and-containment/README.md)
2. [Views, Layers, and Rendering](views-layers-and-rendering/README.md)
3. [Auto Layout and Adaptive Layout](auto-layout-and-adaptive-layout/README.md)
4. [Navigation and Presentation](navigation-and-presentation/README.md)
5. [Lists and Collection Views](lists-and-collection-views/README.md)
6. [State, Architecture, and Dependencies](state-architecture-and-dependencies/README.md)
7. [Concurrency and UI Lifecycle](concurrency-and-ui-lifecycle/README.md)
8. [Performance, Memory, and Diagnostics](performance-memory-and-diagnostics/README.md)

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
| [Accessibility and Adaptive UI](accessibility-and-adaptive-ui/README.md) | Ensures UIKit interfaces remain semantic and usable across content sizes, locales, and preferences. |
| [Animation, Transitions, and Interaction](animation-transitions-and-interaction/README.md) | Covers interruptible property animation, controller transitions, and interactive system behaviors. |
| [Testing UIKit Features](testing-uikit-features/README.md) | Separates deterministic logic, lifecycle integration, accessibility flows, and visual regression testing. |

### Role-Specific Depth

| Topic | Use it when |
|---|---|
| [App, Scene, Window, and System Integration](app-scene-window-and-system-integration/README.md) | Covers process and scene lifecycle, multiwindow restoration, and system chrome. |
| [SwiftUI Interoperability and Migration](swiftui-interoperability-and-migration/README.md) | Covers hosting, representable boundaries, and staged migration ownership. |
| [Custom Drawing, Graphics, and Media](custom-drawing-graphics-and-media/README.md) | Provides role-specific depth for drawing, image pipelines, and advanced composition. |
