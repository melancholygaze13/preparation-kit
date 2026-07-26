---
title: "Application, Scene, and Window Lifecycle: Theory"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
concept: "Application, Scene, and Window Lifecycle"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Application, Scene, and Window Lifecycle: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A UIKit app has one process and can have several independent UI sessions. UIKit
represents each UI session with a `UIScene`, normally a `UIWindowScene`. A window
belongs to one window scene, and view controllers own screen-level behavior inside
that window.

The scene lifecycle is useful even when an app shows only one window. Starting
with the iOS 27 SDK, [Apple requires apps to adopt it][scene-transition] or they
fail to launch. The useful interview distinction is scope:

| Owner | Responsibility |
|---|---|
| `UIApplicationDelegate` | Process-wide setup, shared services, scene configuration, app-level events |
| `UIWindowSceneDelegate` | One UI session, its window, route owner, and scene lifecycle |
| `UIViewController` | One screen or contained region, view loading, appearance, and local interaction |

A scene may enter the background while another scene remains active. A controller
may disappear while its scene stays active. Do not use one callback as a substitute
for another scope.

## Connect a Scene and Its Window

The app delegate launches once. Use it to initialize shared data infrastructure,
register process-wide services, and return a `UISceneConfiguration` for each new
session. Do not construct the visible controller hierarchy there for a scene-based
app.

UIKit then calls the scene delegate with a scene, session, and connection options.
When the app creates its UI in code, attach the window to the provided window scene:

```swift
@MainActor
final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private var coordinator: SceneCoordinator?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let coordinator = SceneCoordinator(
            sessionID: session.persistentIdentifier
        )
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = coordinator.start()

        self.coordinator = coordinator
        self.window = window
        window.makeKeyAndVisible()

        coordinator.handle(connectionOptions)
    }
}
```

Retain the window and the scene-owned coordinator for the connected lifetime. If a
storyboard declares the scene configuration, UIKit can create the window and root
interface instead; do not create a second hierarchy.

`UIScene.ConnectionOptions` explains why the scene connected. It can include URLs,
user activities, quick actions, or notification responses. Handle these after the
route owner and window exist. Later deliveries arrive through scene delegate methods
such as `scene(_:openURLContexts:)` and `scene(_:continue:)`.

## Treat Lifecycle States as Independent

Use scene callbacks for work scoped to one UI session:

| Callback | Typical responsibility |
|---|---|
| `sceneWillEnterForeground` | Refresh stale scene-level state and prepare presentation |
| `sceneDidBecomeActive` | Resume interaction, observation, and active-only work |
| `sceneWillResignActive` | Pause input-sensitive work for a temporary interruption |
| `sceneDidEnterBackground` | Save scene state and release costly visible-only resources |
| `sceneDidDisconnect` | Tear down resources owned by the disconnected scene object |

Resigning active does not mean backgrounding; an interruption may be brief. Entering
the background does not promise long execution time. Save important drafts as they
change. Use the background callback for a final short save, and request background
execution only when the work genuinely needs more time.

Disconnection is also not permanent deletion. UIKit may disconnect a scene while
retaining its `UISceneSession`, then reconnect it later. Release the scene object,
window, observers, and presentation resources, but keep durable restoration data.
The app delegate's `application(_:didDiscardSceneSessions:)` callback means the
sessions were permanently discarded and their saved per-session data can be removed.

## Avoid Global Window Selection

In a multi-scene app, `connectedScenes.first` and a global key-window helper do not
identify the scene that owns an action. The first scene may be backgrounded or may
show a different document.

Carry scene context from the source instead:

- use `view.window?.windowScene` for a visible view;
- use the scene passed to a delegate callback;
- inject the scene's router or presenter into feature code;
- choose a target scene with explicit product policy for app-level events.

A shared model or account session can live at process scope. Navigation stacks,
selected documents, temporary presentations, and scene observers belong to the
scene. This boundary prevents one window from navigating or dismissing another.

## Engineering Decisions

Keep app and scene delegates thin. They translate system events into owned services
and coordinators; they should not become global stores for every feature. Test route
and lifecycle policy as ordinary state transitions, then keep a small integration
test around window and delegate wiring.

At Staff scope, define which services are process-wide, scene-wide, and screen-wide.
Also define how an app-level event selects a scene. These rules matter before an app
adds a second window because they remove hidden global UI ownership.

## References

- [Transitioning to the UIKit scene-based life cycle][scene-transition]
- [Managing your app's life cycle](https://developer.apple.com/documentation/uikit/managing-your-app-s-life-cycle)
- [`UIApplicationDelegate`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate)
- [`UIWindowSceneDelegate`](https://developer.apple.com/documentation/uikit/uiwindowscenedelegate)
- [`UIWindow`](https://developer.apple.com/documentation/uikit/uiwindow)

[scene-transition]: https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle
