---
title: "UI, Accessibility, and Interaction Testing: Theory"
domain: "UIKit"
topic: "Testing UIKit Features"
concept: "UI, Accessibility, and Interaction Testing"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
---

# UI, Accessibility, and Interaction Testing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An XCUI test launches the built app as a separate process. It interacts through
system automation and accessibility information. This proves integration that an
in-process test cannot prove: launch configuration, real navigation, exposed
accessible meaning, and user-visible interaction.

That confidence costs time and diagnostic precision. Keep rule matrices in unit
tests. Use UI tests for critical journeys and framework boundaries. Swift Testing
does not provide UI automation, so UI test targets use XCTest with XCUIAutomation.

## Build a Deterministic Test

A reliable UI test controls its starting state, finds controls by their purpose,
and waits for a visible or otherwise observable result.

```swift
import XCTest

final class CheckoutUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    @MainActor
    func testSubmittingOrderShowsConfirmation() {
        let app = XCUIApplication()
        app.launchArguments = ["-ui-testing", "-fixture", "checkout-ready"]
        app.launch()

        app.buttons["checkout.place-order"].tap()

        let confirmation = app.staticTexts["checkout.confirmation"]
        XCTAssertTrue(confirmation.waitForExistence(timeout: 5))
    }
}
```

Interpret test launch arguments or environment values where the app creates its
main dependencies. Choose disposable storage, stubbed services, a fixed account,
and a known clock there. Do not scatter `if isUITesting` branches through feature code.

Each test must establish its own state. Tests should not depend on execution order
or data left by another test. Use launch configuration for broad state and user
interaction for the behavior under test. If the fixture performs the action being
tested, the test proves too little.

## Query by Meaning

XCUI queries use accessible roles, labels, values, and identifiers. Prefer a control
type plus a stable user-facing label when the label is meaningful and not localized
for the test matrix. Add `accessibilityIdentifier` when an element is ambiguous,
dynamic, or translated.

Identifiers are automation hooks. They are not spoken by VoiceOver and must not
replace a useful `accessibilityLabel`, value, trait, or action. Keep identifiers
stable across visual refactors and name them by product meaning, such as
`checkout.place-order`, not hierarchy position, such as `stack.button.2`.

Avoid coordinates and collection indexes unless position is the behavior. These
queries couple tests to layout and ordering. Screen helpers can expose domain actions
such as `placeOrder()` or `openOrder(id:)`; they should not wrap every XCUI call.

## Wait for State, Not Time

Never use `sleep` as the normal synchronization method. Wait for an element to
exist, disappear, become hittable, or reach an expected value. An element can exist
while offscreen or covered, so existence does not imply that a tap can succeed.

Use a readiness element when launch performs controlled setup. For network-like
flows, the stub should complete deterministically and the test should wait for the
visible result. Large generic retry helpers often hide missing state boundaries.

System alerts and privacy prompts run outside the app's normal hierarchy. Configure
known permissions before the test when possible. Use interruption handlers for
interruptions you cannot avoid, and keep expected app alerts as direct assertions.

## Test Accessibility as a Product Contract

UI automation relies on accessibility information, but a passing tap flow is not
proof of accessibility. Verify what UIKit exposes and how it behaves:

- controls expose accurate labels, values, traits, and actions;
- grouped elements do not hide necessary child information;
- focus and reading order remain logical after updates;
- Dynamic Type keeps required content and actions usable;
- errors, loading changes, and modal transitions announce useful context;
- keyboard, Switch Control, Voice Control, and pointer paths remain reachable.

`XCUIApplication.performAccessibilityAudit()` checks categories of common issues in
a running app. Run it on representative states, including error and modal states.

```swift
@MainActor
func testCheckoutAccessibility() throws {
    let app = XCUIApplication()
    app.launchArguments = ["-ui-testing", "-fixture", "checkout-ready"]
    app.launch()

    try app.performAccessibilityAudit()
}
```

An issue handler can filter a confirmed false positive. Every exclusion should be
narrow, documented, and owned. Audits cannot judge product wording, workflow effort,
or whether a custom action is understandable. Manual testing with assistive
technologies closes that gap.

## Diagnose and Scope Failures

Keep each UI test focused on one journey or contract. On failure, preserve the
screenshot, accessibility hierarchy, app logs, and relevant signposts. Xcode records
test artifacts, and explicit `XCTAttachment` values can add domain-specific context.

Run a small smoke set on every change. Run broader device, locale, text-size, and
accessibility matrices on scheduled or release workflows. Select combinations by
risk because every dimension multiplies runtime.

A compact phone with a large content size often finds more layout defects than
repeating the default device. A right-to-left locale can expose navigation and
alignment assumptions. Do not claim broad coverage from many nearly identical
simulator runs.

## Engineering Decisions

UI tests should cover journeys whose broken wiring would matter to users: sign-in,
purchase, data creation, restoration, deep links, and essential settings. They are
poor tools for exhaustive validation rules or async race permutations.

At Staff scope, define ownership for fixtures, accessibility identifiers, audit
exceptions, simulator matrices, and flakes. Quarantining a failing test needs an
owner and removal condition. A permanently ignored test is not coverage.

## References

- [XCUIAutomation](https://developer.apple.com/documentation/xcuiautomation)
- [XCUIApplication](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication)
- [`XCUIElement.exists`](https://developer.apple.com/documentation/xcuiautomation/xcuielement/exists)
- [WWDC23: Perform accessibility audits for your app](https://developer.apple.com/videos/play/wwdc2023/10035/)
- [WWDC25: Record, replay, and review](https://developer.apple.com/videos/play/wwdc2025/344/)
