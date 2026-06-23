---
title: "UI and Accessibility Testing: Theory"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
concept: "UI and Accessibility Testing"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
---

# UI and Accessibility Testing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A UI test launches the built app as another process and interacts through system
automation. It provides confidence in integration that a model test cannot provide:
real navigation registration, presentation, accessibility exposure, and process
launch behavior. That confidence costs runtime and diagnostic precision.

Use UI tests for critical journeys and framework boundaries. Keep business-rule
matrices in Swift Testing. Swift Testing does not provide UI automation, so UI test
targets continue to use XCTest with XCUIAutomation.

## Build a Stable UI Test

A reliable test controls initial state, performs actions by meaning, and waits for
observable conditions:

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

        app.buttons["Place order"].tap()

        let confirmation = app.staticTexts["Order confirmed"]
        XCTAssertTrue(confirmation.waitForExistence(timeout: 5))
    }
}
```

The app should interpret test launch configuration at its composition root. Replace
live networking, animation policy, or persistent storage with deterministic test
implementations without adding test branches throughout feature code. Use disposable
accounts and storage. A test must not depend on another test's mutations.

Query by accessible role and label when they are stable and meaningful. Add
`accessibilityIdentifier` for ambiguous or localized elements that need a durable
automation hook. An identifier is not spoken by VoiceOver and must not replace a
useful label, value, hint, or action.

Avoid coordinates and index-based queries unless location itself is the behavior.
Avoid `sleep`. Wait for existence, hittability, disappearance, or a state predicate.
If every test needs a large retry helper, the app or fixture lacks a clear readiness
signal.

## Accessibility Is More Than Element Discovery

UI automation operates through accessibility information, but a passing flow is not
proof that the experience is accessible. Verify both semantics and interaction:

- controls have accurate roles, labels, values, and actions;
- reading and focus order remains logical after updates and presentation;
- Dynamic Type does not truncate required content or hide actions;
- color is not the only signal and contrast remains sufficient;
- Reduce Motion and Reduce Transparency settings produce usable alternatives;
- Voice Control names are practical and switch or keyboard focus can reach actions.

`XCUIApplication.performAccessibilityAudit` can detect categories of common issues
in a running UI. Run audits on representative screens and states, not only the launch
screen. An issue handler can suppress a documented false positive, but broad
exclusions turn the audit into a weak signal.

```swift
@MainActor
func testCheckoutAccessibility() throws {
    let app = XCUIApplication()
    app.launchArguments = ["-ui-testing", "-fixture", "checkout-ready"]
    app.launch()

    try app.performAccessibilityAudit()
}
```

Audits cannot judge whether a label communicates the correct product meaning, whether
a workflow is efficient with VoiceOver, or whether an announcement occurs at the
right moment. Manual testing with real assistive settings closes that gap. Include
disabled, loading, error, empty, and modal states because accessibility defects often
appear during transitions.

## Scope and Failure Diagnosis

A UI test should prove one journey or contract. Collect screenshots, element
hierarchies, logs, and app-side signposts when a failure occurs. Keep page or screen
helpers focused on domain actions such as `placeOrder()` rather than wrapping every
XCUI query. Excessive abstraction hides the failing interaction.

Run a small smoke set on every change and broader device, locale, text-size, and
accessibility matrices on scheduled or pre-release workflows. Matrix dimensions
multiply quickly, so select combinations by risk. A compact phone with a large text
size often exposes more layout risk than repeating the default device.

At Staff scope, accessibility is a delivery standard, not a specialist cleanup step.
Assign owners for audit exceptions, shared component semantics, test fixtures, and
manual release checks. Track flakes separately from product failures; quarantining a
test must create an owner and removal condition.

## References

- [XCUIApplication](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication)
- [Performing accessibility audits for your app](https://developer.apple.com/documentation/accessibility/performing-accessibility-audits-for-your-app)
- [WWDC23: Perform accessibility audits for your app](https://developer.apple.com/videos/play/wwdc2023/10035/)
- [Accessibility](https://developer.apple.com/accessibility/)
