---
title: "Testing Presentation and View Model Logic: Theory"
domain: "UIKit"
topic: "Testing UIKit Features"
concept: "Testing Presentation and View Model Logic"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
---

# Testing Presentation and View Model Logic: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Most UIKit feature decisions do not need UIKit to be tested. Test each behavior in
the smallest part of the code that can prove it:

| Behavior | Lowest useful boundary |
|---|---|
| Validation, formatting, sorting | Pure function or value type |
| Loading, error, and retry transitions | View model or presenter |
| A tap emits a route or command | Controller integration test |
| A route pushes the correct controller | Coordinator or navigation integration test |
| The complete journey works | UI test |

This split gives precise failures and fast feedback. It also prevents tests from
constructing a view hierarchy only to check a business rule.

## Design a Testable Presentation Boundary

A view model or presenter should accept user intent, call explicit dependencies,
and expose state the controller can render. It should not reach through global
singletons or manipulate UIKit objects in hidden callbacks.

```swift
@MainActor
final class ProfileViewModel {
    enum State: Equatable {
        case idle
        case loading
        case loaded(name: String)
        case failed(message: String)
    }

    private(set) var state: State = .idle
    private let loadProfile: @Sendable () async throws -> String

    init(loadProfile: @escaping @Sendable () async throws -> String) {
        self.loadProfile = loadProfile
    }

    func refresh() async {
        state = .loading

        do {
            state = .loaded(name: try await loadProfile())
        } catch {
            state = .failed(message: "Please try again.")
        }
    }
}
```

The dependency is a closure because it has one capability. A protocol can be
clearer when the feature needs several related operations. The key requirement is
control: the test chooses success, failure, cancellation, and ordering.

```swift
import Testing

@MainActor
struct ProfileViewModelTests {
    @Test func successfulRefreshShowsName() async {
        let model = ProfileViewModel(loadProfile: { "Amina" })

        await model.refresh()

        #expect(model.state == .loaded(name: "Amina"))
    }
}
```

Use `#require` when a failed precondition makes later assertions meaningless.
Use parameterized tests for a real input matrix, such as validation cases. New
Swift unit and integration tests should normally use Swift Testing. Existing
XCTest tests can run beside them and need not be rewritten only for consistency.

## Control Inputs That Can Change

Hidden inputs make tests slow or flaky. Inject the capability that varies:

- a clock or `now` closure for deadlines;
- an ID generator for stable commands and analytics;
- a repository or operation for network and persistence;
- an explicit locale and calendar for display policy;
- a per-test store for cached or drafted values.

Do not use a live server in a presentation test. Do not make a test sleep until a
callback probably finishes. Prefer an `async` operation the test can await. For
older completion-based code, adapt the completion with a continuation in the test
or expose a completion handle.

Async tests must also control ordering. Cancellation alone may not stop a
dependency that ignores cancellation. A feature may need a request identity check
so an old response cannot replace newer state. Test that sequence with a dependency
that suspends until the test releases it.

Swift Testing may run tests in parallel. Each test must own its fixtures and must
not mutate shared singletons. Serial execution can hide an ownership problem; it
does not make shared mutable state safe.

## Assert Contracts, Not Implementation

Strong assertions cover visible state, emitted commands, stored values, and calls
across an owned boundary. Weak assertions mirror private methods or require calls
in an incidental order.

A spy is useful when the interaction is the contract. For example, a presenter may
emit `.showCheckout(orderID:)` to a router. A mock that records every internal call
usually couples the test to the implementation and makes refactoring expensive.

Test doubles should communicate intent:

| Double | Use |
|---|---|
| Stub | Returns controlled data or errors |
| Spy | Records a meaningful interaction for later assertion |
| Fake | Provides a small working implementation, such as in-memory storage |

Avoid protocols for every concrete type. Add a controllable dependency where the
feature crosses time, I/O, ownership, or another module.

## Connect the Controller

A small controller test can prove that UIKit input reaches the tested boundary and
that state reaches the views. It does not need to repeat every view-model case.

For example, load the controller's view, send `.touchUpInside` to a button, and
assert that a router spy received the expected route. In another focused test,
provide a known state and assert the label, button enabled state, and error view.

Keep these tests on the main actor. If the controller requires extensive setup for
every state, improve the rendering boundary. A method such as `render(_:)` can make
the controller a clear adapter without turning production code into test-only code.

## Engineering Decisions

Use many deterministic presentation tests, fewer controller integration tests, and
a small set of UI journeys. The exact ratio follows risk, not a fixed testing
pyramid.

At Staff scope, standardize ownership of test data, dependency boundaries, and failure
diagnostics across features. Measure suite duration and flaky tests. A test layer
has little value when teams cannot trust failures or identify the hidden dependency
that caused them.

## References

- [Swift Testing](https://developer.apple.com/documentation/testing)
- [Expectations and confirmations](https://developer.apple.com/documentation/testing/expectations)
- [WWDC24: Meet Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10179/)
- [WWDC24: Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/)
