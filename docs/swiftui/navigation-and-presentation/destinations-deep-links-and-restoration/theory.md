---
title: "Destinations, Deep Links, and Restoration: Theory"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "Destinations, Deep Links, and Restoration"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - deep-links
  - state-restoration
  - routing
---

# Destinations, Deep Links, and Restoration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A deep link and a restored session are inputs to navigation state. Parse the input,
validate it against current application rules, then replace the relevant tab,
selection, modal, and path state as one operation.

```text
external input -> parse -> validate -> resolve app route -> apply navigation state
```

Do not reproduce a route by triggering UI actions in sequence. Describe the desired
state directly so the same routing logic works from a cold launch, an active scene,
or a restored session.

## How It Works

### Use an Application Route Boundary

URLs, user activities, notifications, Spotlight results, and widgets have different
transport formats. Convert them into a transport-independent route:

```swift
enum AppRoute: Equatable {
    case product(Product.ID)
    case order(Order.ID)
    case search(query: String)
}

func route(for url: URL) throws -> AppRoute
```

Parsing answers whether the input is structurally recognized. Validation answers
whether the current user and application can open it. Keep these decisions out of
destination views so every entry point receives the same behavior.

Treat all external values as untrusted. Validate the scheme and host, decode path
components safely, constrain payload sizes, and reject unknown actions. After
parsing, check authentication, authorization, feature flags, account or tenant,
and whether referenced content still exists.

Define canonical routes and normalize equivalent inputs before analytics or state
changes. Query-item order, trailing slashes, and legacy aliases should not create
different application meanings. Keep credentials and one-time tokens out of the
long-lived navigation path; exchange them at a security boundary and retain only
the resulting safe intent.

### Translate Routes into Complete State

A route often changes more than a stack path. Opening an order might require the
account tab, an order-list sidebar selection, and an order detail. Model the result
as a coherent navigation state rather than several delayed mutations.

```swift
struct AppNavigationState: Equatable {
    var tab: Tab = .home
    var accountPath: [AccountRoute] = []
    var presentedSheet: SheetRoute?
}

mutating func open(_ route: AppRoute) {
    switch route {
    case .order(let id):
        tab = .account
        presentedSheet = nil
        accountPath = [.orders, .order(id)]
    // ...
    }
}
```

This makes conflict policy explicit. A product link received while checkout is
presented might dismiss checkout, queue the route, or ask the user before losing
work. No framework API can choose that product policy automatically.

### Resolve Current Data at the Destination

Routes should carry identifiers and small immutable arguments. The destination
resolves current data and renders loading, unavailable, unauthorized, or success
states. A deep link can outlive an object, and restored state can refer to data that
changed while the app was terminated.

Do not assume successful parsing means successful navigation. A route can be valid
but no longer resolvable. Define a safe fallback, such as the containing list or a
clear unavailable screen. Avoid silently showing a different user's or tenant's
data after an account change.

### Restoration

Restoration persists enough state to reconstruct user intent. Depending on the
product, that can include selected tab, stable sidebar and detail IDs, stack route
values, and an eligible modal route. It should not include destination views,
ephemeral loading flags, fetched model snapshots, or secrets.

A typed route model that conforms to `Codable` can be encoded directly.
`NavigationPath` offers a codable representation only when every stored value is
codable. A typed route array is easier to inspect, migrate, and validate.

Persisted navigation needs a schema version independent from implementation type
names. On decode:

1. Read the supported schema version.
2. Decode route values defensively.
3. Migrate known older cases.
4. Validate routes against the active account and current data.
5. Keep the longest valid prefix or fall back to a safe root.

Restoration is best effort. Product data may be deleted, permissions revoked,
features removed, and route shapes changed. Never make launch depend on decoding an
old path perfectly.

Restoration frequency is also an engineering decision. Persist after meaningful
navigation changes or scene lifecycle events, but avoid synchronous disk work on
every minor update. Serialize a snapshot of navigation state, write it atomically,
and tolerate an older valid snapshot after a crash. Domain repositories remain the
authority for content; the restoration payload only points back to them.

### Scene Ownership and Timing

In a multiwindow application, each scene normally owns its own navigation state and
restoration payload. An incoming route needs an explicit policy: target the active
scene, create a new scene, or choose a scene that already represents the resource.

Cold-start routing also requires timing discipline. Parse the input early, but
apply it only after required session and dependency state is known. Represent a
pending route in the model instead of scheduling arbitrary delays. When sign-in
finishes, revalidate and consume the route once.

When several inputs arrive, define ordering and deduplication. For example, the
latest user-initiated link might replace an older pending link, while a completed
notification action must be acknowledged exactly once. Store normalized typed
routes with a small amount of source metadata rather than retaining raw transport
objects throughout the application.

### Destination Registration

Keep route-to-view mapping near the flow owner. Register destinations where the
`NavigationStack` can always see them, outside lazy containers. A destination
builder should select and compose a screen, not perform URL parsing or global state
mutation.

Universal links also depend on an association between the web domain and the app.
Treat that configuration as part of the end-to-end contract and test both the
associated-domain handoff and in-app parsing. A parser unit test cannot detect an
expired entitlement, incorrect hosted association file, or a route that the website
now emits differently.

## Constraints and Guarantees

- SwiftUI can bind a stack to codable route values, but it does not define your URL
  schema, authorization policy, conflict handling, or migrations.
- `NavigationPath.codable` is unavailable if any path element is not codable.
- Persisted bytes are not proof that a route is still valid or authorized.
- Scene restoration is separate from durable domain persistence.
- Applying a path requests a hierarchy; data loading and destination availability
  remain application responsibilities.

## Engineering Decisions

| Situation | Policy to define |
|---|---|
| Link requires authentication | Store pending typed route, sign in, then revalidate |
| Current modal contains edits | Reject, queue, or confirm before replacement |
| Entity was deleted | Show unavailable state or valid parent destination |
| Restored route schema is old | Migrate known cases; discard unsupported suffix |
| User changed account | Revalidate every account-scoped identifier |
| Several scenes exist | Choose target scene explicitly |

## Production Application

Use table-driven tests for every supported URL, malformed input, authorization
case, old schema, and missing entity. Test cold launch, foreground delivery, signed
out delivery, account switching, and restoration after an app upgrade.

Record privacy-safe routing telemetry: source category, normalized route case,
parse result, validation result, and final outcome. Never log raw URLs containing
tokens or user content.

Use failure categories that lead to action: unrecognized schema, malformed payload,
authentication required, authorization denied, entity missing, migration failed,
and presentation conflict. A single “deep link failed” counter cannot distinguish a
producer regression from normal stale content.

At Staff and Principal scope, treat the route schema as a product interface shared
by web, notifications, widgets, and multiple feature teams. Assign ownership,
document compatibility, stage migrations, and monitor failures by application
version. A link is not complete when it parses; it is complete when it reaches the
intended valid state or a deliberate fallback.

## References

- [Bringing robust navigation structure to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2022/10054/)
- [`NavigationPath`](https://developer.apple.com/documentation/swiftui/navigationpath)
- [Restoring your app's state with SwiftUI](https://developer.apple.com/documentation/swiftui/restoring-your-app-s-state-with-swiftui)
- [`onOpenURL(perform:)`](https://developer.apple.com/documentation/swiftui/view/onopenurl%28perform%3A%29)
- [Managing scenes in your SwiftUI app](https://developer.apple.com/documentation/swiftui/managing-scenes-in-your-swiftui-app)
