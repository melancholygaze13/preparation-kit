---
title: "Boundary Models and Data Mapping: Theory"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Boundary Models and Data Mapping"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - clean-architecture
  - data-mapping
  - boundary-models
---

# Boundary Models and Data Mapping: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A model is shaped by the problem its owner solves. An API response represents a wire
schema. A database record represents persistence and migration. A domain value protects
product rules. Presentation state represents what a screen can show.

One type used everywhere makes those concerns change together. Separate models and map
where their meanings or owners differ.

## Use Models for Their Boundary

| Model | Optimized for | Common concerns |
|---|---|---|
| Transport DTO | Encoding and API compatibility | Optional fields, versioning, server names |
| Persistence record | Queries and migration | Relationships, indexes, storage defaults |
| Domain value | Required product meaning | Valid construction, operations, stable identity |
| Use-case request/result | One application operation | Authorization, failure meaning, idempotency |
| Presentation state | Rendering and interaction | Localized text, loading phases, selection |

These are roles, not a demand for five copies of every struct. A simple immutable value
may safely cross several boundaries when its meaning and owner are the same.

## Validate at Entry

External values are untrusted and often incomplete:

```swift
struct UserResponse: Decodable {
    let id: String
    let displayName: String?
    let status: String
}

struct User: Equatable, Sendable {
    let id: UserID
    let name: NonEmptyName
    let status: Status
}

extension UserResponse {
    func domainValue() throws -> User {
        User(
            id: try UserID(rawValue: id),
            name: try NonEmptyName(displayName),
            status: try Status(serverValue: status)
        )
    }
}
```

The adapter decides how an unknown status, missing name, invalid identifier, or future
field behaves. Do not silently turn malformed required data into plausible defaults.
That hides contract failures and can create incorrect product decisions.

Distinguish absent, explicitly null, empty, and unchanged fields for patch APIs. A
single Swift optional may not preserve all wire meanings; use an explicit patch value
when required.

## Preserve Identity and Meaning

Mapping must preserve stable domain identity across remote, local, and UI models.
Using array indexes or database object identity as product identity breaks reordering,
sync, navigation, and restoration.

Translate units, date standards, currency, locale, and time zones explicitly. A `Double`
named `price` or `timestamp` does not state its meaning. Strong domain values prevent
adapters from disagreeing silently.

Errors also cross boundaries. Map HTTP and database failures into application outcomes
such as unavailable, unauthorized, conflict, or invalid data. Preserve technical cause
for diagnostics without exposing raw infrastructure messages to users.

## Choose the Mapping Location

Mapping belongs in the adapter or a mapper owned by that boundary. A network adapter
knows DTOs and domain ports. A persistence adapter knows records and domain values.
The domain does not import outer types.

Avoid a central mapper module that imports every feature and infrastructure package.
It becomes a dependency hub with unclear ownership. Keep mapping close to the schema
that forces it.

For large lists, mapping has CPU and allocation cost. Measure before removing the
boundary. Options include lazy mapping, pagination, focused projections, background
decoding, or caching stable results. Letting managed objects or response DTOs leak into
all views trades a visible local cost for widespread coupling.

## Support Evolution and Migration

External and stored schemas change independently. Adapters can support old and new
forms while the domain remains stable:

- decode additive fields with compatible defaults only when product meaning permits;
- version persisted records and run explicit migrations;
- support parallel API versions behind one port during rollout;
- record mapping failures and unknown values;
- remove compatibility code after measured adoption.

Do not assume domain stability forever. If product meaning changes, evolve the domain
and adapt each boundary deliberately rather than preserving an obsolete abstraction.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| External schema changes stay at adapters | More types and conversion code |
| Domain values can enforce required rules | Mapping large graphs costs CPU and memory |
| Persistence can evolve independently | Defaults can hide malformed data |
| Presentation avoids infrastructure concepts | Similar models can confuse ownership |
| Boundary failures become explicit | Mapper hubs can recreate broad coupling |

## Engineering Decisions

Test mapping with missing, malformed, unknown, boundary, and versioned values. Contract
tests use representative fixtures from the real API or store. Domain tests start from
valid domain values and do not depend on decoding.

At Staff scope, assign schema owners, publish compatibility rules, and instrument
decode and migration failures. Generate mechanical DTO code when useful, but keep
semantic validation and error policy explicit and reviewed.

## References

- [Hexagonal Architecture — original article](https://alistair.cockburn.us/hexagonal-architecture)
- [Encoding and Decoding Custom Types](https://developer.apple.com/documentation/foundation/archives_and_serialization/encoding_and_decoding_custom_types)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
