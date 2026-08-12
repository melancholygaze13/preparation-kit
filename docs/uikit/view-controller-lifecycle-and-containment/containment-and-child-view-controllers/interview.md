---
title: "Containment and Child View Controllers: Interview Questions"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "Containment and Child View Controllers"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# Containment and Child View Controllers: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you correctly add a child view controller?](#q1-add-child) | Senior | Containment sequence |
| [When would you use containment instead of a custom view?](#q2-containment-vs-view) | Senior | Design judgment |
| [How do appearance callbacks work with child controllers?](#q3-appearance-forwarding) | Senior | Lifecycle forwarding |
| [How should parent and child controllers communicate?](#q4-parent-child-communication) | Staff | Ownership boundaries |

---

<a id="q1-add-child"></a>
## Q1: How do you correctly add a child view controller?

### Short Answer

Call `addChild(_:)`, add the child's root view to the parent's view hierarchy,
install layout, then call `didMove(toParent:)` on the child. For removal, call
`willMove(toParent: nil)`, remove parent-installed constraints and the view, then
call `removeFromParent()`.

### Expanded Answer

Containment has two linked relationships: the controller hierarchy and the view
hierarchy. Both need to be correct. `addChild(_:)` tells UIKit about the
parent-child relationship. Adding the child view makes the interface visible.
`didMove(toParent:)` completes the transition.

If you only add the view, the child controller may not receive the lifecycle and
appearance behavior UIKit expects. If you only add the controller, the child is
owned but not visible.

<a id="q2-containment-vs-view"></a>
## Q2: When would you use containment instead of a custom view?

### Short Answer

I use containment when the region needs controller-level ownership: lifecycle,
dependencies, navigation, child presentation, or independently testable state. I
use a custom view when it is only display and local interaction.

### Expanded Answer

A custom view is cheaper and simpler. It is the right choice for reusable
controls, layout components, and display regions. A child controller is useful
when the region behaves like a feature: it starts work, reacts to appearance,
owns a list, presents another controller, or has its own dependencies.

The trade-off is complexity. Containment adds lifecycle paths and communication
between parent and child. I would not add it just to reduce file size.

<a id="q3-appearance-forwarding"></a>
## Q3: How do appearance callbacks work with child controllers?

### Short Answer

UIKit containers normally forward appearance callbacks to child controllers.
Custom containers get automatic forwarding by default, but can opt into manual
forwarding when they need custom transition control.

### Expanded Answer

For most custom containers, I rely on default forwarding. Manual forwarding uses
`beginAppearanceTransition(_:animated:)` and `endAppearanceTransition()`, and the
calls must be balanced. It is easy to get wrong during interactive transitions or
when swapping children quickly.

If a child is missing expected appearance callbacks, I would first check whether
containment was established correctly and whether the child view is actually in
the hierarchy.

<a id="q4-parent-child-communication"></a>
## Q4: How should parent and child controllers communicate?

### Short Answer

The parent should coordinate placement and high-level events. The child should
own its internal UI and state. Communication should use an explicit boundary such
as a weak delegate, closure output, shared model, or coordinator.

### Expanded Answer

I avoid parent controllers reaching into a child's private views or state. That
creates tight coupling and makes the child hard to reuse. The child can expose
events like selection, completion, or cancellation. The parent can decide how
those events affect the larger flow.

At team scale, feature modules should document what their controller needs and
what it emits. That keeps containment from becoming an informal dependency graph.
