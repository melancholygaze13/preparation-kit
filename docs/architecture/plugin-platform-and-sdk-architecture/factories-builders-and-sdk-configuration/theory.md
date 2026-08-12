---
title: "Factories, Builders, and SDK Configuration: Theory"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
concept: "Factories, Builders, and SDK Configuration"
page_type: theory
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
tags:
  - sdk-configuration
  - factories
  - builders
---

# Factories, Builders, and SDK Configuration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

SDK construction defines what is required, which choices are supported, and who owns the
created resources. The common path should produce a valid instance without exposing the
SDK's internal object graph.

Start with an initializer. Add a configuration type, builder, or factory only when it
encodes a real rule that the initializer cannot express clearly.

## Construction Flow

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Factories, Builders, and SDK Configuration — Construction Flow" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Factories, Builders, and SDK Configuration — Construction Flow diagram</a></figcaption>
</figure>

Setup establishes stable facts and resource ownership for one instance. Runtime APIs
accept information that changes per account or operation.

## Pattern Selection

| Pattern | Best use | Avoid when |
|---|---|---|
| Initializer | A few required values with clear types | Parameters become a long menu of optional choices |
| Configuration value | Stable client-supplied settings that belong together | It becomes a mutable bag shared across instances |
| Builder | Many optional choices, staged input, or cross-field validation | It only forwards two values to an initializer |
| Factory | Internal implementation selection and dependency assembly | Clients use it to locate arbitrary services |
| Provider protocol | The client must supply changing behavior, such as an auth token | It exposes internal SDK services as customization points |

Use the patterns together only when each has one job. For example, immutable configuration
holds environment settings, an optional builder adds client providers, and an internal
factory selects concrete implementations behind the public facade.

This compact example shows those jobs without exposing the SDK's internal graph:

```swift
import Foundation

struct SDKConfiguration: Sendable {
    let appID: String
    let endpoint: URL
}

enum SDKSetupError: Error {
    case missingEndpoint
}

final class ExampleSDK {
    let configuration: SDKConfiguration

    fileprivate init(configuration: SDKConfiguration) {
        self.configuration = configuration
    }
}

private enum SDKFactory {
    static func make(configuration: SDKConfiguration) -> ExampleSDK {
        ExampleSDK(configuration: configuration)
    }
}

struct SDKBuilder {
    private let appID: String
    private var endpoint: URL?

    init(appID: String) {
        self.appID = appID
    }

    func endpoint(_ value: URL) -> Self {
        var copy = self
        copy.endpoint = value
        return copy
    }

    func build() throws -> ExampleSDK {
        guard let endpoint else { throw SDKSetupError.missingEndpoint }
        let configuration = SDKConfiguration(appID: appID, endpoint: endpoint)
        return SDKFactory.make(configuration: configuration)
    }
}
```

The configuration is a stable value. The builder collects and validates client input.
The factory remains private and chooses the concrete implementation.

## Validation and Lifecycle

Fail before starting work for missing credentials, unsupported environments, invalid
URLs, unavailable entitlements, or incompatible options. A throwing initializer or
`build()` method is appropriate when the failure is local and deterministic. Network
authentication and service availability remain runtime outcomes.

Separate these concerns:

| Concern | Construction owner |
|---|---|
| Required static values | Configuration initializer or builder validation |
| Optional customization | Builder methods with documented defaults |
| Implementation selection | Factory or composition root |
| Sessions, caches, observers, and tasks | SDK instance lifecycle and shutdown policy |
| Per-request data | Runtime method input, not global configuration |

Do not store user or request data in process-wide configuration unless the whole instance
is explicitly scoped to that user or request. Account switching must define cancellation,
cache separation, observer updates, and the fate of in-flight work.

## Engineering Decisions

Prefer immutable configuration after construction. If a client must reconfigure a live
instance, expose one explicit operation with documented isolation, validation,
cancellation, and rollback. Silent mutation makes concurrent behavior hard to reason
about.

Provider protocols should express client-owned behavior, not leak the internal dependency
graph. A token provider or logging sink is reasonable. A general resolver couples clients
to implementation names and hides required dependencies.

Do not assume a builder makes every future change compatible. Adding a builder method may
be source-additive, but changing defaults or validation can still change behavior.

## Benefits and Costs

| Benefits | Costs and risks |
|---|---|
| Valid setup becomes one explicit path | Extra patterns can obscure simple construction |
| Factories hide implementation choice | A global factory can become a service locator |
| Immutable configuration supports reasoning | Reconfiguration may require a new instance |
| Typed validation improves integration feedback | More options expand the support and test matrix |

## Production Application

Test defaults, each required field, incompatible combinations, repeated construction,
resource release, and account or environment transitions. Errors should state what the
client can change and include safe context such as SDK version and capability names. Never
log credentials, tokens, or user data.

The sample app should use the recommended path. If the first example needs a custom
transport, several providers, and manual shutdown coordination, simplify the public setup
or make advanced configuration clearly optional.

## References

- [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
