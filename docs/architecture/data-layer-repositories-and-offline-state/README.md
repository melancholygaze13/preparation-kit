---
title: "Data Layer, Repositories, and Offline State"
domain: "Architecture"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-07-11
---

# Data Layer, Repositories, and Offline State

## Learning Path

1. [Repository Boundaries and Query Ownership](repository-boundaries-and-query-ownership/README.md)
2. [Remote, Local, Cache, and Synchronization](remote-local-cache-and-synchronization/README.md)
3. [Offline Conflicts, Idempotency, and Retries](offline-conflicts-idempotency-and-retries/README.md)
4. [Domain, Transport, and Persistence Mapping](domain-transport-and-persistence-mapping/README.md)

## Preparation Paths

- **Rapid review:** Read all four overviews, then rehearse the short answers about
  repository boundaries, source authority, idempotent retries, and model mapping.
- **Standard preparation:** Complete all four bundles in order. They cover the common
  data-layer decisions expected in Senior iOS architecture interviews.
- **Role-specific depth:** Staff and Principal candidates should focus on sync protocol
  ownership, schema evolution, rollout, observability, and cross-team contracts.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Repository Boundaries and Query Ownership](repository-boundaries-and-query-ownership/README.md) | Shapes data access around consumer needs rather than storage APIs. | High | 10 min |
| [Remote, Local, Cache, and Synchronization](remote-local-cache-and-synchronization/README.md) | Defines authority and freshness across multiple data sources. | High | 11 min |
| [Offline Conflicts, Idempotency, and Retries](offline-conflicts-idempotency-and-retries/README.md) | Preserves correctness through disconnection and repeated work. | High | 11 min |
| [Domain, Transport, and Persistence Mapping](domain-transport-and-persistence-mapping/README.md) | Keeps external schemas from controlling domain models. | High | 10 min |
