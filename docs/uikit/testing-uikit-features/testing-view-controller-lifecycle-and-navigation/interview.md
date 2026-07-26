---
title: "Testing View Controller Lifecycle and Navigation: Interview Questions"
domain: "UIKit"
topic: "Testing UIKit Features"
concept: "Testing View Controller Lifecycle and Navigation"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-26
---

# Testing View Controller Lifecycle and Navigation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you test `viewDidLoad` and appearance behavior?](#q1-lifecycle) | Senior | Valid lifecycle setup |
| [How do you test navigation without fragile mocks?](#q2-navigation) | Senior | Policy and UIKit wiring |
| [When should a controller test become a UI test?](#q3-test-level) | Senior | Test-layer choice |
| [How would you improve a flaky UIKit integration suite?](#q4-flaky-suite) | Staff | Test infrastructure |

---

<a id="q1-lifecycle"></a>
## Q1: How do you test `viewDidLoad` and appearance behavior?

### Short Answer

I call `loadViewIfNeeded()` for view-loading behavior. For appearance behavior, I
place the controller in a valid hierarchy and drive a balanced appearance transition.

### Expanded Answer

Constructing a controller does not load its view. `loadViewIfNeeded()` triggers view
loading and `viewDidLoad`, but not appearance. For `viewWillAppear` or
`viewDidAppear`, I use a container or test window and call matching
`beginAppearanceTransition` and `endAppearanceTransition` when explicit forwarding
is appropriate.

I assert the outcome, such as a refresh command or rendered state. I do not manually
call lifecycle hooks in an order UIKit would never create.

---

<a id="q2-navigation"></a>
## Q2: How do you test navigation without fragile mocks?

### Short Answer

I test the destination decision as a typed route or coordinator command. Then I use a real
navigation or presenting controller in a smaller integration test for UIKit wiring.

### Expanded Answer

A tap test can assert `.checkout(productID:)` on a router spy. A coordinator test can
send that route to a real `UINavigationController` and inspect the resulting stack.
This separates product policy from framework behavior.

I normally disable animation because it is not part of the contract. A broad mock
navigation controller misses containment and appearance behavior that UIKit owns.

### Trade-offs

Typed routes add an explicit boundary and some wiring. Direct pushes are simpler on
small screens, but they couple destination choice, construction, and UIKit transition
into one harder-to-test method.

---

<a id="q3-test-level"></a>
## Q3: When should a controller test become a UI test?

### Short Answer

I use a UI test when the behavior depends on the built app, process launch, real
transition integration, or user-visible navigation across several screens.

### Expanded Answer

An in-process controller test is better for view loading, rendering, target-action,
containment, and a single navigation seam. A UI test is appropriate for a deep link,
restoration, system permission, or critical journey where app composition matters.

I do not move a large validation matrix into UI tests. The slower layer should prove
wiring that the faster layer cannot.

---

<a id="q4-flaky-suite"></a>
## Q4: How would you improve a flaky UIKit integration suite?

### Short Answer

I would remove timing guesses and shared state, use small helpers that create valid
lifecycle sequences, control dependencies, and test rule combinations below UIKit.

### Expanded Answer

First I classify failures: invalid hierarchy, unawaited async work, leaked global
state, animation timing, or a real product race. I replace delays with completion
points and give each test independent fixtures. Shared window or navigation helpers
must preserve real UIKit sequences and stay small.

I measure runtime and flake ownership. Quarantining a test requires an owner and a
clear condition for restoring it. Otherwise the suite teaches the team to ignore
failures.
