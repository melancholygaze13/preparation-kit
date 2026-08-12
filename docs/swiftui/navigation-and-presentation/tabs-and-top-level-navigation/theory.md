---
title: "Tabs and Top-Level Navigation: Theory"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "Tabs and Top-Level Navigation"
page_type: theory
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 10
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tabs
  - tab-view
  - navigation
  - adaptive-ui
---

# Tabs and Top-Level Navigation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A tab container chooses one peer destination from a small stable set:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram-1.html" style="--schematic-aspect: 960 / 248" title="Tabs and Top-Level Navigation" loading="lazy"></iframe>
  <figcaption><a href="../diagram-1.html">Open the Tabs and Top-Level Navigation diagram</a></figcaption>
</figure>

Tab selection and navigation within a tab are different state dimensions. Switching
tabs should not accidentally replace a flow's path, draft, or selection. The owner at
the tab boundary coordinates cross-tab events; each feature remains responsible for
its internal navigation.

A **tab** is one selectable top-level destination. **Top-level navigation** is the
choice among the app's main peer areas. It is not the ordered history inside one area.

## Modern Tab API

Use an enum for selection so the compiler keeps the selection values and tab declarations
consistent:

```swift
enum AppTab: Hashable {
    case home
    case library
    case search
}

struct AppRoot: View {
    @State private var selection: AppTab = .home

    var body: some View {
        TabView(selection: $selection) {
            Tab("Home", systemImage: "house", value: .home) {
                HomeFlow()
            }

            Tab("Library", systemImage: "books.vertical", value: .library) {
                LibraryFlow()
            }

            Tab(value: .search, role: .search) {
                SearchFlow()
            }
        }
    }
}
```

The `Tab` API keeps label, value, role, and content in one declaration. Prefer it over
the older pattern that attaches `tabItem` and `tag` modifiers to unrelated content.
Stable enum cases are easier to test and restore than integer or string tags.

`Tab`, `TabSection`, sidebar adaptation, and tab customization arrived with iOS 18,
iPadOS 18, macOS 15, tvOS 18, and visionOS 2. If the app supports older releases, keep
the same typed selection model and use the earlier syntax:

```swift
TabView(selection: $selection) {
    HomeFlow()
        .tabItem { Label("Home", systemImage: "house") }
        .tag(AppTab.home)

    LibraryFlow()
        .tabItem { Label("Library", systemImage: "books.vertical") }
        .tag(AppTab.library)
}
```

The syntax changes, but the ownership rule does not. The selection value belongs at
the top-level boundary, and each tab still owns its internal flow.

Use a search-role tab when search is truly a top-level destination. The system can give
it platform-appropriate placement and behavior. Do not add roles only to force a visual
position; roles communicate meaning to the framework.

## Choosing the Information Architecture

Tabs fit destinations that are peers and useful from many app states. They are a poor
fit for ordered steps, a long category list, or actions that do not represent destinations.
A checkout sequence belongs in one navigation flow. A compose action belongs in a button
or presentation. A large hierarchy usually needs a sidebar, list, or search.

Keep the tab set stable enough that users can learn it. Authorization or account state
may change available destinations, but frequently inserting and removing tabs can change
identity and move controls unexpectedly. When access changes, decide whether to keep the
tab and show a signed-out state, or remove it as a deliberate product transition.

## Independent Navigation State

Each tab commonly contains its own `NavigationStack`. The feature owning that stack also
owns its typed path:

```swift
struct LibraryFlow: View {
    @State private var path: [LibraryRoute] = []

    var body: some View {
        NavigationStack(path: $path) {
            LibraryView(onOpen: { id in
                path.append(.book(id))
            })
            .navigationDestination(for: LibraryRoute.self) { route in
                // Build the validated destination.
            }
        }
    }
}
```

As long as the tab content keeps the same identity, switching selection lets SwiftUI
preserve that flow's state. Do not add changing `.id` values or recreate model ownership
to force refreshes. Those choices can reset path, focus, tasks, and local drafts.

An app-level router may own per-tab paths when it must coordinate restoration, external
routes, or cross-feature navigation. That does not justify one mixed global path for every
feature. A useful root model can store the selected tab and delegate route state to typed
feature routers.

## Deep Links and Cross-Tab Events

An external route should be parsed and authorized before it mutates UI state. The routing
operation then selects the owning tab and builds the route inside that flow:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram-2.html" style="--schematic-aspect: 656 / 572; --schematic-width: 656px" title="Tabs and Top-Level Navigation — Deep Links and Cross-Tab Events" loading="lazy"></iframe>
  <figcaption><a href="../diagram-2.html">Open the Tabs and Top-Level Navigation — Deep Links and Cross-Tab Events diagram</a></figcaption>
</figure>

Apply the related changes as one owned transition so the app does not briefly show a
destination in the wrong tab. Define behavior when the requested entity is missing or the
user lacks access. A deep link should never construct a view directly or insert an invalid
payload merely because it conforms to `Hashable`.

Cross-tab feature events should also use typed intents. For example, a purchase completion
can request “show receipt ID” from the root coordinator. The root selects the account tab,
then asks that flow to present the receipt. Leaf views should not reach into unrelated tab
paths through a global service locator.

## Tab Identity and Availability

The tab declaration and its selection value must stay coherent. If account state removes
the currently selected destination, choose a valid fallback as part of the same owned
transition. Leaving selection pointed at a value with no matching tab creates ambiguous
presentation and restoration behavior.

Treat conditional tabs as product state, not incidental view branching. A signed-out app
may keep an account tab and show its authentication state, which preserves a familiar
destination. If policy requires removing protected tabs, the root should clear sensitive
feature paths and drafts, select an allowed destination, and only then publish the new tab
set. Tests should cover sign-in, sign-out, account switching, and permission changes while
each affected tab is selected.

Stable selection values do not need to match visible order. Reordering tabs for adaptation
or user customization should preserve their semantic enum cases and customization IDs.
Changing those identities is a migration because saved selection and customization may
still refer to the old values.

## Adaptive Tabs and Customization

The `.sidebarAdaptable` style lets a tab hierarchy use platform-appropriate tab-bar or
sidebar presentation. The same feature state should work in every representation. Avoid
assuming that a tab is always a bottom-bar item or that a section header is always visible.

`TabSection` can organize related secondary destinations when the hierarchy justifies it.
Sections do not make an unlimited number of destinations easy to navigate. Keep the most
important destinations visible and move deeper hierarchy into the selected feature.

User customization is a product contract. `TabViewCustomization` can let people reorder
or hide supported destinations and persist that choice. Give every customizable tab a
stable customization identity. Protect required destinations from removal, and migrate
persisted customization when tabs are renamed, split, or retired.

Only the `.sidebarAdaptable` style supports `TabViewCustomization`. Passing a non-`nil`
customization binding enables it. A tab or section that participates needs a
customization ID. Changing the declared default order does not automatically replace an
existing saved order; reset or migrate saved customization deliberately.

Do not store sensitive state in `AppStorage`. Tab customization is presentation preference;
authentication, account identifiers, and private user data need their appropriate secure
or durable owner.

## Selection Effects and Ownership

Selection is ordinary state, but changing it can trigger work. Keep analytics, refresh,
and navigation policy in the tab owner or feature model rather than hiding side effects in
a custom binding setter. An `onChange` handler can report a completed selection change when
that event is truly needed.

Avoid refreshing every time a user revisits a tab unless freshness policy requires it.
Feature models should own cache age, cancellation, and deduplication. A tab switch is a UI
event, not proof that data is stale.

If the product defines reselecting the active tab as pop-to-root or scroll-to-top, model
that as a separate intent. A selection binding alone cannot distinguish “selected a new
tab” from “activated the already selected tab” in every interaction path.

## Accessibility and Adaptation

Use meaningful text and system images in each `Tab` label. The system control provides
selection semantics and suitable interaction behavior. Do not replace it with a custom
row of tap gestures merely to match a visual design.

Keep destination names short, localizable, and distinct. Test right-to-left layout,
Dynamic Type, VoiceOver, Voice Control, keyboard navigation, and platform-specific tab
representations. If a tab contains a badge, ensure the important state is also available
inside the destination rather than communicated only by color or a small number.

## Constraints and Guarantees

- A selection binding identifies the active tab; it does not own each feature's path.
- Stable tab and route values preserve continuity across updates and restoration.
- A tab style can change presentation across platforms without changing feature state.
- Customization requires stable IDs and an evolution policy for persisted preferences.
- System tab controls provide semantics that a custom gesture-based bar must recreate.
- Selecting a tab does not automatically define refresh, pop-to-root, or scroll behavior.

## Engineering Decisions

| Requirement | Prefer |
|---|---|
| Small stable set of peer destinations | `TabView` with typed `Tab` values |
| Independent drill-down per destination | One owned `NavigationStack` per tab flow |
| External route into a feature | Validate, select tab, then set that feature's route |
| Adaptive tab/sidebar hierarchy | `.tabViewStyle(.sidebarAdaptable)` |
| User-reorderable secondary tabs | `TabViewCustomization` with stable IDs |
| Ordered task or wizard | One navigation flow, not tabs |
| Many hierarchical destinations | Sidebar, list, or search |

## Production Application

Test switching among tabs after pushing routes, editing drafts, starting tasks, and
changing account state. Verify deep links from cold launch and while another tab is active.
Test restoration with retired or unauthorized routes and customization with renamed tabs.

Measure only after a user-visible problem appears. Eager work in every tab root, unstable
identity, oversized models, and unbounded image tasks can make tab switching expensive.
Keep tab root construction cheap and give each feature explicit task and cache ownership.

At Staff scope, define which team owns top-level information architecture, cross-feature
routing, customization identifiers, and tab deprecation. Feature teams should expose typed
entry intents rather than mutate the global tab container directly.

## References

- [Enhancing your app's content with tab navigation](https://developer.apple.com/documentation/swiftui/enhancing-your-app-content-with-tab-navigation)
- [`TabView`](https://developer.apple.com/documentation/swiftui/tabview)
- [`Tab`](https://developer.apple.com/documentation/swiftui/tab)
- [`SidebarAdaptableTabViewStyle`](https://developer.apple.com/documentation/swiftui/sidebaradaptabletabviewstyle)
- [`TabViewCustomization`](https://developer.apple.com/documentation/swiftui/tabviewcustomization)
- [`tabViewCustomization`](https://developer.apple.com/documentation/swiftui/view/tabviewcustomization%28_%3A%29)
- [Elevate your tab and sidebar experience in iPadOS](https://developer.apple.com/videos/play/wwdc2024/10147/)
