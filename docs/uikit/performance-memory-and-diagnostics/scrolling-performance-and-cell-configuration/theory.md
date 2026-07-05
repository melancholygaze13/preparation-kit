---
title: "Scrolling Performance and Cell Configuration: Theory"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Scrolling Performance and Cell Configuration"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 9
status: reviewed
last_reviewed: 2026-07-05
---

# Scrolling Performance and Cell Configuration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Scrolling performance is the cost of repeated small decisions. UIKit asks for
visible cells while the user is moving. If configuration does synchronous image
decoding, layout churn, network work, or complex formatting, the main thread can
miss frames.

The interview answer is: make cell configuration a fast projection from model to
view state, move expensive work earlier or off the main path, and reject async
results that no longer match the reused cell.

## How It Works

Table views and collection views reuse cells. A cell instance that showed one
model may later show another model. That means the cell must not assume its old
image, task, selected state, or callback still belongs to the next model.

```swift
final class AvatarCell: UITableViewCell {
    private var representedID: User.ID?
    private var imageTask: Task<Void, Never>?

    override func prepareForReuse() {
        super.prepareForReuse()
        representedID = nil
        imageTask?.cancel()
        imageTask = nil
        imageView?.image = UIImage(named: "avatar-placeholder")
        textLabel?.text = nil
    }

    func configure(with user: User, imageLoader: ImageLoader) {
        imageTask?.cancel()
        representedID = user.id
        textLabel?.text = user.displayName

        imageTask = Task { [weak self, id = user.id] in
            guard let image = try? await imageLoader.avatar(for: id) else {
                return
            }
            await MainActor.run {
                guard self?.representedID == id else { return }
                self?.imageView?.image = image
            }
        }
    }
}
```

The identity check matters because cancellation is cooperative. A task may finish
after reuse even if cancellation was requested.

Modern collection-view and table-view APIs often put configuration in a cell
registration or content configuration. The rule is the same: the registration
should bind already-available state quickly. It should not become a hidden
service layer.

## Constraints and Guarantees

UIKit calls data source and layout methods on the main thread. They must return
quickly. Expensive work in these methods directly competes with input handling,
layout, and rendering.

Reuse does not reset custom state automatically. UIKit calls `prepareForReuse`
before a reused cell is returned. You are responsible for clearing transient
state that would be wrong for the next model.

Prefetching is a hint, not a guarantee. UIKit may ask for data before cells are
visible, and it may cancel prefetching when scrolling changes direction. Use it
for work that can be cancelled or reused, such as image requests and lightweight
data warming.

## Engineering Decisions

Good scrolling code separates three concerns:

| Concern | Good location | Avoid |
|---|---|---|
| Model diffing | View model or data source snapshot | Rebuilding all visible rows for one change |
| Cell binding | Cell registration or `configure` method | Network calls or database fetches in configuration |
| Image loading | Loader with cache and cancellation | One uncached request per reuse event |
| Expensive formatting | Precomputed display model | Date, number, or text layout work every frame |

Estimated heights and self-sizing cells are useful, but they can be expensive if
constraints are unstable. Give the layout enough information to predict size.
For complex feeds, cache measured sizes when content is stable and invalidate
that cache only when inputs change.

For Staff and Principal roles, call out ownership of list performance. A shared
image pipeline, consistent placeholder policy, and standard cell-state model
prevent every product team from solving reuse and cancellation differently.

## Production Application

When a list stutters, measure before changing architecture. Common fixes are:

| Symptom | Likely cause | First check |
|---|---|---|
| Hitch when new cells appear | Work in configuration | Time Profiler around cell creation and binding |
| Wrong image after fast scroll | Async result applied to reused cell | Model identity check and task cancellation |
| Memory spike while scrolling | Unbounded image cache or full-size images | Downsampling and cache limits |
| Frequent layout passes | Constraint changes during reuse | Constraint setup once, constants only during binding |

Smooth scrolling is rarely one trick. It is usually the result of cheap binding,
bounded image memory, predictable layout, and measured changes.

## References

- [UITableViewDataSourcePrefetching](https://developer.apple.com/documentation/uikit/uitableviewdatasourceprefetching)
- [UICollectionViewDataSourcePrefetching](https://developer.apple.com/documentation/uikit/uicollectionviewdatasourceprefetching)
- [UITableViewCell.prepareForReuse()](https://developer.apple.com/documentation/uikit/uitableviewcell/prepareforreuse())
- [UICollectionView.CellRegistration](https://developer.apple.com/documentation/uikit/uicollectionview/cellregistration)
