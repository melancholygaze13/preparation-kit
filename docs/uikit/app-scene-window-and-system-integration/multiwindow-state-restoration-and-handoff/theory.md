---
title: "Multiwindow, State Restoration, and Handoff: Theory"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
concept: "Multiwindow, State Restoration, and Handoff"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Multiwindow, State Restoration, and Handoff: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A scene session is one independent user activity, such as editing a document or
viewing an account. Its route, selection, and temporary UI are scene-local. Durable
documents and account data remain in shared stores.

`NSUserActivity` carries information between these layers. It stores small,
versioned facts that let the receiving scene load current data and rebuild a route.
It is not a database, a controller archive, or the document itself.

## Activate Content in a Scene

Declare the window-scene configuration and enable multiple-window support before
requesting another session. A request can fail, so scene creation is not a guaranteed
synchronous operation.

On iOS 17 and later, create a
[`UISceneSessionActivationRequest`][activation-request] and ask
`UIApplication` to activate it. UIKit may reuse a suitable session or create one:

```swift
let activity = NSUserActivity(
    activityType: "com.example.editor.open-document"
)
activity.targetContentIdentifier = documentID
activity.userInfo = [
    "version": 1,
    "documentID": documentID
]

let request = UISceneSessionActivationRequest(
    role: .windowApplication,
    userActivity: activity,
    options: nil
)

UIApplication.shared.activateSceneSession(for: request) { error in
    logger.error("Scene activation failed: \(error)")
}
```

For an iOS 17-or-later deployment target, prefer this API over
`requestSceneSessionActivation`. Pass a specific session when reopening a known
window. Otherwise, use stable target content identity and scene activation
conditions so UIKit can select a suitable session. A request does not guarantee a
new window.

The scene receives initial activity in its connection options and later activity
through `scene(_:continue:)`. Route the activity through the scene's coordinator so
it cannot change another window.

## Restore Each Scene Independently

For scene-based restoration, return an activity that represents the current scene:

```swift
func stateRestorationActivity(for scene: UIScene) -> NSUserActivity? {
    coordinator?.makeRestorationActivity()
}

func scene(
    _ scene: UIScene,
    restoreInteractionStateWith activity: NSUserActivity
) {
    coordinator?.restore(from: activity)
}
```

Save stable identifiers, route components, selected tab, draft ID, and meaningful
editing position. Keep payload versions so older activities can be migrated or
rejected. On restore, resolve identifiers against current permissions and data. If a
document disappeared, fall back to its collection instead of rebuilding an invalid
controller stack.

UIKit stores the returned activity on the `UISceneSession`. Scene restoration data
may be unavailable while the device is locked, so the app still needs a valid default
route and a later update path.

## Use Handoff for Continuity, Not Storage

Handoff uses the same `NSUserActivity` type but serves a different boundary: another
device or platform continues the task. Declare supported activity types in
`NSUserActivityTypes`, make the relevant activity current, and implement the scene
delegate continuation callbacks.

Keep `userInfo` small. [Apple recommends less than 3 KB for Handoff][handoff].
Send a document ID, activity version, route, and selection. Sync the actual
document through an appropriate store such as CloudKit or iCloud Drive. Never include credentials,
unnecessary personal data, or a large document snapshot.

The receiving device may have different capabilities, data freshness, or account
state. Validate the activity type and version, authenticate current access, load the
model, and show a recoverable error when continuation is impossible.

## Coordinate Shared Data Across Windows

Scenes can edit the same model at the same time. Use a shared repository or document
coordination layer for durable writes and conflict policy. Keep each scene's route,
selection, undo context, and presentations separate unless the product explicitly
shares them.

At Staff scope, define activity schemas, ownership, versioning, privacy review, and
conflict behavior across platforms. Test activation reuse, new-scene creation,
restoration with missing data, incompatible payload versions, and simultaneous edits.

## References

- [Supporting multiple windows on iPad](https://developer.apple.com/documentation/uikit/supporting-multiple-windows-on-ipad)
- [`UISceneSessionActivationRequest`][activation-request]
- [`UISceneDelegate.stateRestorationActivity(for:)`](https://developer.apple.com/documentation/uikit/uiscenedelegate/staterestorationactivity(for:))
- [Restoring your app's state](https://developer.apple.com/documentation/uikit/restoring-your-app-s-state)
- [Implementing Handoff in your app][handoff]

[handoff]: https://developer.apple.com/documentation/foundation/implementing-handoff-in-your-app
[activation-request]: https://developer.apple.com/documentation/uikit/uiscenesessionactivationrequest-swift.struct
