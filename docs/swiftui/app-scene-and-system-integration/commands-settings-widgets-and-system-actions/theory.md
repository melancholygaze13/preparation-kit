---
title: "Commands, Settings, Widgets, and System Actions: Theory"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "Commands, Settings, Widgets, and System Actions"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
tags:
  - commands
  - widgets
  - app-intents
---

# Commands, Settings, Widgets, and System Actions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Commands, settings, widgets, shortcuts, and system actions are alternate entry points
into product capabilities. They should reuse domain operations and authorization, while
adapting lifecycle and presentation to each platform surface.

## Commands and Focus

The `commands` scene modifier adds or replaces menu commands on supported platforms.
`CommandMenu` creates a menu, while `CommandGroup` places commands relative to standard
groups. Keyboard shortcuts remain discoverable menu actions rather than hidden global
event handling.

In a multiwindow app, a command such as Save or Duplicate must target the focused
scene. Focused values and focused bindings let the active view hierarchy publish a
capability or action upward to command definitions. Define custom focused entries with
the `@Entry` macro. Disable a command when the focused scene cannot perform it.

Do not capture the first document model created by the app. That works in one window
and mutates the wrong document when focus changes. Keep validation in the application
operation because commands can be invoked through menus, shortcuts, automation, or
other entry points.

A `Settings` scene provides platform-integrated app settings, especially on macOS.
Store small preferences in an appropriate settings store and inject a typed interface
into features. Settings that trigger migration, sign-out, or destructive work need an
explicit operation and failure presentation, not only a property-wrapper assignment.

## Widgets and Timelines

A WidgetKit extension is a separate system-managed target with a constrained execution
and rendering model. A provider supplies placeholder, snapshot, and timeline entries;
SwiftUI renders an entry for the widget family and environment. The system decides when
to run the extension and when to refresh.

Timeline policy should describe when data becomes stale. A reload request is a hint,
not a guarantee of immediate execution. Keep entries small, make rendering deterministic,
and show a useful stale or unavailable state when shared data cannot be read.

The app and widget can exchange approved data through an App Group or another shared
service designed for extensions. Coordinate schema evolution because the app and
extension may run different installed versions during rollout. Never assume they are
alive together or can share an in-memory singleton.

Interactive widget buttons and toggles execute App Intents. The intent validates its
parameters, performs a bounded operation, persists the result, and returns an outcome.
The widget then displays data from a subsequent entry; it does not own a long-lived
mutable view model.

## App Intents and Environment Actions

App Intents expose typed capabilities to system surfaces such as Shortcuts, Spotlight,
Siri, controls, and widgets. Parameters form a public integration boundary. Use stable
identifiers, resolve current entities at execution time, check authorization, and make
retry behavior safe. Keep sensitive values out of titles, logs, and donated metadata.

Within SwiftUI, environment actions such as `openURL`, `dismiss`, `openWindow`, and
`dismissWindow` let the containing system context perform presentation. Prefer them to
reaching for platform application singletons. Handle failure where an action reports a
result, and avoid assuming that a URL or window request completed synchronously.

## Production Decisions

Test commands while focus moves between windows and controls. Test widget rendering for
every family, placeholder and redaction state, stale data, locked devices, failed shared
storage, and schema mismatch. Test App Intents without launching the main UI, including
expired credentials, repeated execution, and deleted entities.

At Staff or Principal scope, define one capability layer with adapters for app UI,
commands, widgets, and intents. Establish ownership for shared schemas, rollout order,
telemetry, privacy review, and backward compatibility. Do not force every capability
onto every surface; execution time, interaction, and disclosure constraints differ.

## References

- [`commands`](https://developer.apple.com/documentation/swiftui/scene/commands%28content%3A%29)
- [`FocusedValues`](https://developer.apple.com/documentation/swiftui/focusedvalues)
- [`Settings`](https://developer.apple.com/documentation/swiftui/settings)
- [WidgetKit](https://developer.apple.com/documentation/widgetkit)
- [Creating a widget extension](https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension)
- [App Intents](https://developer.apple.com/documentation/appintents)
- [`OpenURLAction`](https://developer.apple.com/documentation/swiftui/openurlaction)
