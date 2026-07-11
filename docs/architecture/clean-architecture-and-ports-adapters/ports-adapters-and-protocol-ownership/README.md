---
title: "Ports, Adapters, and Protocol Ownership"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - ports-and-adapters
  - protocols
  - dependency-inversion
---

# Ports, Adapters, and Protocol Ownership

> A port is an application-facing contract; an adapter translates a specific external
> mechanism to or from that contract. The side being protected should shape the port.

## Quick Recall

- Driving ports let UI, tests, deep links, or other systems invoke application behavior.
- Driven ports describe capabilities the application needs from external systems.
- Adapters contain framework, schema, lifecycle, error, and concurrency translation.
- Consumer-owned protocols stay narrow and use domain terms; provider-shaped mirrors
  preserve coupling behind another name.
- Use concrete types when there is no valuable boundary. Protocols are tools, not a
  layer requirement.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
