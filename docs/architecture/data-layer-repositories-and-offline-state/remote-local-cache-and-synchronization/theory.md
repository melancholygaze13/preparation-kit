---
title: "Remote, Local, Cache, and Synchronization: Theory"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Remote, Local, Cache, and Synchronization"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - caching
  - synchronization
  - local-first
---

# Remote, Local, Cache, and Synchronization: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Multiple copies of data require a consistency policy. “Use a cache” is incomplete until
the design names which copy is authoritative, how stale a result may be, what triggers
refresh, and what happens when the network or local store fails.

Choose a source model per capability:

| Model | Read path | Fits | Main risk |
|---|---|---|---|
| Remote-only | Request server for each load | Small, always-online, volatile data | Latency and no offline access |
| Cache-aside | Cache hit, otherwise remote then store | Read-heavy data with simple freshness | Invalidation and duplicate loads |
| Cache-then-network | Show cached value, refresh, show newer value | Fast UI with tolerated staleness | Visible replacement and ordering |
| Local-first | Observe durable local store; sync in background | Offline use and shared local changes | Sync and conflict complexity |

The most complex model is not automatically the best. Offline-first behavior adds a
protocol, operational state, migrations, and user-facing conflict decisions.

## Distinguish Cache Types

A memory cache avoids repeated work during one process lifetime. It is fast and
discardable. An HTTP cache follows response metadata and request cache policy. Apple's
`URLCache` stores eligible responses in memory and on disk, but iOS may purge its disk
content. It is not a durable product database.

A local database supports domain queries, relationships, durable drafts, migrations,
and observation. Treat it as a cache only if every record can be rebuilt and deletion is
safe. Otherwise it is persistent user state and needs backup, migration, and recovery
policy.

Do not add a second custom cache without a measured need. URL loading, image frameworks,
and persistence layers may already cache. Stacked caches create several invalidation
points and make freshness difficult to explain.

## Define Freshness as a Contract

Freshness can depend on age, version, app lifecycle, user intent, and data sensitivity.
A practical query policy might be:

- return local data immediately if present;
- refresh when older than five minutes on normal entry;
- always contact the server for pull-to-refresh;
- allow stale read during connectivity loss with a visible timestamp;
- never use stale authorization or payment state to approve an operation.

Store server version or validation metadata when available. Time-to-live alone says
when to ask again, not whether the representation changed. HTTP validators can let the
server confirm an existing response without sending the complete body.

The feature should know whether a value is loading, stale, refreshing, or unavailable
when those states change product behavior. Do not reduce them all to an optional array.

## Build a Local-First Loop

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 272" title="Remote, Local, Cache, and Synchronization — Build a Local-First Loop" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Remote, Local, Cache, and Synchronization — Build a Local-First Loop diagram</a></figcaption>
</figure>

The UI reads one local source of truth. The sync coordinator performs remote I/O outside
the store transaction, maps the result, then writes a complete page or batch locally.
Local observation publishes committed changes.

For incremental pull:

1. read the last committed change token;
2. request the next remote page;
3. map and validate the page;
4. apply records and the new token in one local transaction;
5. repeat until caught up.

If the transaction fails, keep the old token so the same page can be fetched again. The
apply operation must tolerate replay. If a token expires, use a defined full-resync path
that preserves pending local intents and does not briefly erase valid UI state.

Core Data persistent history and SwiftData history can track store transactions for
incremental consumers. These framework logs describe local changes; the application
still defines remote protocol, retention, cursor ownership, and conflict policy.

## Coordinate Concurrent Refreshes

Two screens can request the same refresh. Deduplicate in-flight work by query or resource
when sharing is correct. Decide whether cancelling one waiter cancels the shared request
or only stops that caller from waiting.

An actor can serialize mutable sync state, but actor reentrancy still applies. After an
`await`, another refresh may have advanced the cursor or invalidated the account. Capture
the requested generation, then verify current state before committing a response. Do not
assume entering an actor once makes the entire async method atomic.

Persistence frameworks have their own isolation rules. Perform work in the correct model
actor or context, and cross the boundary with values or persistent identifiers rather
than live managed objects.

## Design for Interrupted Background Work

Mobile background execution is limited and can end early. Sync small batches, commit
checkpoints, and resume safely. Cancellation should stop network and CPU work where safe,
but it must not advance a cursor for an unapplied batch.

Measure last successful sync, cursor age, records pulled and applied, duration, retry
class, token resets, and local-store failures. A “sync completed” log without counts and
checkpoint identity is weak evidence during an incident.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Fast reads and reduced network use | Staleness and invalidation policy |
| Local-first UI works across connectivity loss | Sync protocol and migrations |
| Incremental pull reduces transfer and processing | Cursor expiry and replay handling |
| One observed local source simplifies presentation | Remote state is eventually consistent |

At Staff scope, define the source-of-truth matrix by capability, not one global rule.
Version the sync protocol, assign ownership for client and server changes, and stage
rollouts so old clients remain compatible while cursors and schemas evolve.

## References

- [`URLCache`](https://developer.apple.com/documentation/foundation/urlcache)
- [Accessing cached data](https://developer.apple.com/documentation/foundation/accessing-cached-data)
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [Core Data persistent history](https://developer.apple.com/documentation/coredata/persistent-history)
- [SwiftData concurrency support](https://developer.apple.com/documentation/swiftdata/concurrencysupport)
