---
title: "Application, Scene, and Window Lifecycle: Interview Questions"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
concept: "Application, Scene, and Window Lifecycle"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Application, Scene, and Window Lifecycle: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do app, scene, and controller lifecycles differ?](#q1-lifecycle-scope) | Senior | Ownership scope |
| [Where should a scene-based app create its window?](#q2-window-creation) | Senior | Scene composition |
| [Does scene disconnection mean the session was discarded?](#q3-disconnect-vs-discard) | Senior | Session lifetime |
| [How would you remove global-window assumptions?](#q4-global-window) | Staff | Multi-scene migration |

---

<a id="q1-lifecycle-scope"></a>
## Q1: How do app, scene, and controller lifecycles differ?

### Short Answer

The app delegate owns process-wide setup and scene configuration. A scene delegate
owns one UI session and its window. A view controller owns one screen or contained
region inside that scene.

### Expanded Answer

The process can host several scenes with different activation states. A scene may
background while another remains active. A controller may disappear because another
screen covers it while the scene remains active.

I place shared services at app scope, route and window state at scene scope, and
visible-only work at controller scope. Scene-based lifecycle is required for apps
built with the latest iOS 27 SDK.

---

<a id="q2-window-creation"></a>
## Q2: Where should a scene-based app create its window?

### Short Answer

For programmatic UI, I create the window in the scene delegate's connection callback
with `UIWindow(windowScene:)`, install the root controller, retain the window, and
make it key and visible.

### Expanded Answer

The provided `UIWindowScene` identifies the UI session that owns the window. I build
and retain a scene coordinator before handling URLs or activities from the connection
options. If a storyboard scene configuration creates the window, I use that hierarchy
instead of constructing a duplicate one.

---

<a id="q3-disconnect-vs-discard"></a>
## Q3: Does scene disconnection mean the session was discarded?

### Short Answer

No. Disconnection removes the current scene object and is a cleanup boundary, but its
session may reconnect later. Discard means the session is permanently removed.

### Expanded Answer

On disconnect I release the window, observers, and other scene-owned presentation
resources while preserving durable route or document identity. When the app delegate
receives `didDiscardSceneSessions`, I can delete saved data tied only to those session
identifiers.

Treating disconnect as deletion loses restoration state. Treating it as a pause can
leak the old scene hierarchy.

---

<a id="q4-global-window"></a>
## Q4: How would you remove global-window assumptions?

### Short Answer

I would pass the owning scene, router, or presenter from the event source and replace
"first connected scene" lookups with explicit scene-selection policy.

### Expanded Answer

A view can use `view.window?.windowScene`; a scene callback already supplies its
scene. Feature code should receive a scene-owned route boundary rather than search
`UIApplication.shared.connectedScenes`.

For app-level events, I define whether to use the requesting scene, activate an
existing scene for the target content, or create a new one. I migrate call sites
incrementally and add diagnostics that include session identifiers.

### Trade-offs

Explicit scene context adds plumbing, but it prevents one window from presenting into
or navigating another and makes multiwindow behavior testable.
