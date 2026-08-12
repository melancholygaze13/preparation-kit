---
title: "Offline Conflicts, Idempotency, and Retries: Theory"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Offline Conflicts, Idempotency, and Retries"
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
  - offline
  - idempotency
  - conflict-resolution
---

# Offline Conflicts, Idempotency, and Retries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Offline mutation separates local acceptance from remote confirmation. The app may know
that the user intended to send a message while not knowing whether the server applied
the latest attempt. Lost responses make the outcome ambiguous: the request may have
failed before processing or succeeded before the connection disappeared.

Design for replay instead of assuming exactly-once delivery. Persist intent, identify
the logical operation, retry only when safe, and reconcile the server's authoritative
result.

## Persist an Outbox Entry

Write the local state change and its outbox entry in one local transaction. A useful
entry contains:

- stable operation and account identity;
- operation type and versioned payload;
- target entity and base server version;
- dependency or ordering information;
- creation time and user-visible state;
- attempt count, next eligible time, and last failure class.

The sync worker claims an eligible entry, sends it, and records acknowledgement. If the
process stops after the server commits but before local acknowledgement, the same entry
will run again. That is why its remote operation must be idempotent.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Offline Conflicts, Idempotency, and Retries — Persist an Outbox Entry" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Offline Conflicts, Idempotency, and Retries — Persist an Outbox Entry diagram</a></figcaption>
</figure>

The lost response makes delivery ambiguous. Reusing the same operation ID lets the
server return the original result instead of applying the business operation twice.

Do not serialize arbitrary Swift objects into a permanent queue. Store a versioned
schema that future app versions can migrate, reject, or compensate. Encrypt sensitive
payloads at rest and avoid keeping secrets that the operation can obtain safely later.

## Make Repetition Safe

HTTP defines safe and idempotent method behavior, but the endpoint's product operation
still matters. A `POST /payments` is not safe to repeat merely because the client retries
carefully. Use an idempotency key or an operation ID that the server records with the
result. Every attempt for the same logical payment uses the same key; a new payment uses
a new key.

The server contract must define key scope, retention, payload mismatch behavior, and the
response returned for a duplicate. Client-side deduplication alone cannot prevent two
devices from sending the same business operation.

Stable resource IDs can also make creation idempotent. For example, “put this draft at
ID X” is easier to replay than “create an anonymous new draft.” Deletes need tombstones
or a versioned delete record when an older remote copy could reappear during sync.

## Retry by Failure Class

Retry when the failure is likely temporary and replay is safe. Examples include a lost
connection, selected service failures, rate limits, or a server-provided retry time.
Do not retry invalid input, unsupported schema, revoked authorization, or a semantic
conflict without changing something.

A robust policy uses:

- exponential backoff with jitter;
- a maximum delay and attempt or elapsed-time budget;
- `Retry-After` or service-specific guidance when valid;
- connectivity as a wake-up hint, not proof the endpoint works;
- one shared budget so several layers do not multiply retries.

URLSession can wait for connectivity while establishing a connection. That feature does
not resolve dropped connections, response ambiguity, idempotency, or product retry
policy.

Cancellation is cooperative and local. If the app already committed an offline intent,
dismissing a screen usually stops that screen from waiting; it should not silently delete
the outbox entry. A separate user command can cancel or compensate the business operation
when the server protocol supports it.

## Detect Conflicts with Versions

Attach the version read by the editor to its mutation. For HTTP, an entity tag with
`If-Match` can make the write conditional; a failed precondition tells the client that
the representation changed. CloudKit's default unchanged-record save policy similarly
uses record change tags and returns the client, server, and ancestor records for merging.

A conflict contains at least:

1. the base version the user edited;
2. the local proposed change;
3. the current server version.

Without the base, the client cannot distinguish a field the user changed from a field
that merely differs now.

## Choose Conflict Policy by Meaning

| Policy | Fits | Risk |
|---|---|---|
| Server wins | Derived or centrally controlled values | Discards local intent |
| Client wins | Rare single-owner preference | Overwrites newer work |
| Last write wins | Low-value replaceable state with trusted ordering | Clock and data loss |
| Three-way field merge | Independent fields with a known base | Invalid cross-field combinations |
| Operation merge | Counters, sets, or append-like events | Requires server protocol support |
| User resolution | High-value edits with meaningful alternatives | UX and pending-state cost |

Do not apply one global policy. A profile biography may support field merge. Inventory,
money, permissions, and ordered workflows usually need server validation or domain
operations. A conflict-free data type helps only when its merge behavior matches the
product rule.

Dependent outbox entries also need ordering. If an update refers to a locally created
record, either use the final stable ID from the start or wait for creation acknowledgement.
When one entry becomes permanently blocked, surface its dependents instead of retrying
them forever.

## Preserve User Trust and Operations

Show whether a mutation is pending, confirmed, failed, or needs attention when that
distinction matters. Optimistic UI should be reversible. Do not display “sent” when the
system only knows “queued.”

Track queue age, attempts, acknowledgements, duplicate responses, conflicts by type,
manual resolutions, and permanently blocked entries. Protect privacy in payload logging.
An offline system without a way to inspect stuck intent is difficult to operate.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Durable intent survives process and network loss | Queue schema and migration work |
| Idempotency makes ambiguous retries safe | Requires server cooperation and retention |
| Version checks prevent silent overwrites | Conflict resolution adds product decisions |
| Optimistic UI improves responsiveness | Pending and rollback states become visible |

At Staff scope, idempotency and conflict behavior are cross-system contracts. Version
them with backend teams, test old-client replay, stage policy changes, and define who
handles stuck or incompatible operations during incidents.

## References

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [CloudKit `serverRecordChanged`](https://developer.apple.com/documentation/cloudkit/ckerror/serverrecordchanged)
- [CloudKit record save policy](https://developer.apple.com/documentation/cloudkit/ckmodifyrecordsoperation/savepolicy)
- [`URLSessionConfiguration.waitsForConnectivity`](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/waitsforconnectivity)
