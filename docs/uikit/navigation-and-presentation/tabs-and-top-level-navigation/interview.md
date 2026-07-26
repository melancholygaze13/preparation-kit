---
title: "Tabs and Top-Level Navigation: Interview Questions"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Tabs and Top-Level Navigation"
page_type: interview
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
tags:
  - tabs
  - tab-bar-controller
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should an app use tabs rather than a navigation stack?](#q1-tabs-vs-stack) | Senior | Navigation meaning |
| [How would you preserve navigation state across tabs?](#q2-preserve-tab-state) | Senior | Container ownership |
| [How should a deep link target content inside another tab?](#q3-deep-link-routing) | Staff | Route composition |
| [What would you consider before building a custom tab bar?](#q4-custom-tab-bar) | Staff | Platform trade-offs |

---

<a id="q1-tabs-vs-stack"></a>
## Q1: When should an app use tabs rather than a navigation stack?

### Short Answer

I use tabs for a small set of equally important top-level destinations. I use a navigation
stack for deeper screens or ordered steps inside one destination. Switching tabs
changes context; pushing keeps the user in the same task hierarchy.

### Expanded Answer

Home, Library, and Settings can be tabs because none is the child of another. A
book detail belongs on the Library stack because Back should return to the library.

I avoid using a tab as a command or a Next button. That makes selection state
unclear and breaks the user's expectation that a selected tab identifies the
current app area.

<a id="q2-preserve-tab-state"></a>
## Q2: How would you preserve navigation state across tabs?

### Short Answer

I give each tab its own long-lived root flow, often a navigation controller. The
tab controller switches which flow is visible without recreating it, so each tab
keeps its stack, scroll position, and local state.

### Expanded Answer

The tab bar controller owns selection. Each navigation controller owns its stack,
and the screen or feature models own durable state. I reset a tab only when the
product defines that behavior, such as an explicit reselect-to-root action.

For memory pressure, I can release reproducible view resources, but I do not make
the visible controller tree the only source of important user state.

<a id="q3-deep-link-routing"></a>
## Q3: How should a deep link target content inside another tab?

### Short Answer

The scene-level router validates the link, selects the owning tab by stable
identifier, and then asks that tab's flow owner to build the route. I do not push
onto whichever navigation controller is currently visible.

### Expanded Answer

For a link to a saved book, I first select Library. Then the Library flow builds a
coherent stack, such as Library root followed by Book detail. This keeps Back
navigation meaningful and prevents one feature's controller from appearing inside
another feature's stack.

### Trade-offs

Preserving the tab's existing stack keeps context but may place the linked content
on top of unrelated history. Replacing it gives predictable Back behavior but
discards that history. The route policy should choose deliberately.

<a id="q4-custom-tab-bar"></a>
## Q4: What would you consider before building a custom tab bar?

### Short Answer

I first check whether `UITabBarController` can express the behavior. A custom bar
must reproduce containment, safe areas, accessibility, pointer and keyboard input,
restoration, adaptive sidebar behavior, and platform appearance changes.

### Expanded Answer

Standard UIKit tabs now support stable tab models, adaptive tab and sidebar
presentation, search, minimization, and accessories. Those behaviors are expensive
to recreate correctly.

I choose a custom surface only for a required interaction that the container cannot
provide. I keep the route and selection model independent from the visual bar so the
custom UI does not become the owner of application navigation state.
