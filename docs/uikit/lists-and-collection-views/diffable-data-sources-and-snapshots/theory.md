---
title: "Diffable Data Sources and Snapshots: Theory"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Diffable Data Sources and Snapshots"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-01
---

# Diffable Data Sources and Snapshots: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Traditional table and collection updates require the backing store and UI
mutations to stay in exact sync. Diffable data sources replace that manual
coordination with snapshots. You describe the desired UI state using stable
section and item identifiers, then apply it.

The snapshot becomes the source of truth for the list's visible structure.

## Identifiers

Diffable data sources depend on stable `Hashable` identifiers. The identifier
answers "is this the same logical item across updates?" It should not change
just because the item's title, subtitle, image, or unread state changes.

```swift
struct MessageRow: Hashable {
    let id: Message.ID
    var title: String
    var isUnread: Bool

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
```

In real code, be careful when customizing `Hashable` and `Equatable`. If equality
uses all fields, changing content may make the item look like a different
identity. Many teams use a separate ID type for snapshot identity and keep full
content in a model cache.

## Snapshots

A snapshot contains ordered sections and ordered item identifiers in each
section. Applying a snapshot tells UIKit to compute the UI changes.

```swift
var snapshot = NSDiffableDataSourceSnapshot<Section, Message.ID>()
snapshot.appendSections([.inbox])
snapshot.appendItems(messages.map(\.id), toSection: .inbox)
dataSource.apply(snapshot, animatingDifferences: true)
```

Cell configuration then resolves the identifier to current content. This keeps
identity stable while allowing content to change.

## Reloading and Reconfiguring

Diffable data sources know identity and order. They do not automatically know
that every visible property changed if the identifier is the same. For content
changes, use the appropriate reload or reconfigure API for the platform version,
or apply a snapshot that explicitly marks changed items.

The key interview point is to separate structural changes from content changes:
insert, delete, and move are structural. Updating a title or image is content.

## Engineering Decisions

Use diffable data sources for dynamic lists where animated updates matter and
manual batch updates would be fragile. Manual data sources can still be fine for
static or tiny lists, but most modern UIKit list code benefits from stable
identity and snapshots.

For Staff and Principal scope, standardize identity rules. If every feature
defines `Hashable` differently, list updates become inconsistent and hard to
debug. Route, cache, analytics, and selection often need the same stable item ID.

## Production Application

Diffable does not remove all ordering problems. If two async responses build
snapshots from different model versions, the older response can still overwrite
newer UI state. Build snapshots from a single current store or gate responses
with sequence numbers.

Common bugs:

| Bug | Cause | Fix |
|---|---|---|
| Duplicate identifier crash | Same ID appears twice in a snapshot | Fix model identity or section modeling |
| Item animates as delete and insert | Identity changes with content | Use stable IDs |
| Cell content does not refresh | Snapshot structure unchanged | Reconfigure or reload changed item |
| Older results replace newer ones | Async snapshot race | Apply only latest model version |

## References

- [Updating collection views using diffable data sources](https://developer.apple.com/documentation/uikit/updating-collection-views-using-diffable-data-sources)
- [Advances in UI Data Sources](https://developer.apple.com/videos/play/wwdc2019/220/)
- [UITableViewDiffableDataSource](https://developer.apple.com/documentation/uikit/uitableviewdiffabledatasource)
- [UICollectionViewDiffableDataSource](https://developer.apple.com/documentation/uikit/uicollectionviewdiffabledatasource)
