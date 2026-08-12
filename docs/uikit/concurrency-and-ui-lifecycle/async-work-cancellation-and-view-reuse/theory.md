---
title: "Async Work, Cancellation, and View Reuse: Theory"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Async Work, Cancellation, and View Reuse"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
---

# Async Work, Cancellation, and View Reuse: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit views have lifetimes. A view controller can disappear, a cell can be
reused, and a user can start a newer request before an older one finishes.
Async work must respect those lifetimes.

Cancellation in Swift concurrency is cooperative. Calling `cancel()` marks a
task as cancelled; it does not stop the task immediately. The task must check its
status, call `Task.checkCancellation()`, or await an operation that responds to
cancellation. An arbitrary `await` is only a suspension point and does not promise
to stop cancelled work.

## Screen-Scoped Work

Store task handles when work should be cancelled later:

```swift
@MainActor
final class SearchViewController: UIViewController {
    private var searchTask: Task<Void, Never>?

    func search(query: String) {
        searchTask?.cancel()
        searchTask = Task { [weak self, service] in
            do {
                let results = try await service.search(query)
                guard let self else { return }
                render(results)
            } catch is CancellationError {
                return
            } catch {
                guard let self else { return }
                showError(error)
            }
        }
    }

    // Cancel again from the owner's teardown path.
}
```

This pattern prevents older searches from continuing after a newer search
starts or after the controller is released. It also avoids showing an error for
normal cancellation.

Use `viewWillDisappear` cancellation when the work is only useful while the
screen is visible. Use `deinit` cancellation when the work can continue while a
screen is temporarily covered but should stop when the owner is gone.

## Reusable Views

Cells are reused for different model identities. A cell-level task must either
be cancelled in `prepareForReuse()` or guarded by identity before applying a
result.

```swift
final class AvatarCell: UICollectionViewCell {
    private var representedID: User.ID?
    private var imageTask: Task<Void, Never>?

    func configure(with user: User, loader: ImageLoading) {
        representedID = user.id
        imageView.image = nil
        imageTask?.cancel()

        imageTask = Task { [weak self, userID = user.id, url = user.avatarURL] in
            do {
                let image = try await loader.image(for: url)
                await MainActor.run {
                    guard let self else { return }
                    guard self.representedID == userID else { return }
                    self.imageView.image = image
                }
            } catch is CancellationError {
                return
            } catch {
                return
            }
        }
    }

    override func prepareForReuse() {
        super.prepareForReuse()
        representedID = nil
        imageTask?.cancel()
        imageTask = nil
        imageView.image = nil
    }
}
```

In production, many teams keep loading outside cells and let the cell render a
configuration. The same rules still apply: cancel obsolete work and validate the
identity that the result belongs to.

## Engineering Decisions

Cancellation ownership should match the work:

| Work | Owner |
|---|---|
| Search request for current screen | View controller or view model |
| Image request for a visible item | Image loader plus visible item owner |
| Prefetch request | List data source or prefetch coordinator |
| Shared cache fill | Cache actor or service, not a cell |

Do not create unstructured tasks in loops for many items. Use task groups for
bounded batch work, or use a service that deduplicates and limits requests.

## Production Application

Watch for these failure modes:

| Bug | Cause | Fix |
|---|---|---|
| Cancelled request shows alert | `CancellationError` handled like failure | Filter cancellation first |
| Wrong image in cell | Async result applied after reuse | Cancel and check identity |
| Duplicate requests | New task starts without cancelling old one | Store and cancel task handle |
| Task keeps object alive | Stored task strongly captures owner | Cancel on teardown and review captures |

Cancellation is not a substitute for identity checks. A request may finish just
before cancellation is observed, or shared work may continue for another owner.
Always verify that the result still belongs to the current screen or item.

## References

- [Task](https://developer.apple.com/documentation/swift/task)
- [CancellationError](https://developer.apple.com/documentation/swift/cancellationerror)
- [UITableViewCell.prepareForReuse()](https://developer.apple.com/documentation/uikit/uitableviewcell/prepareforreuse%28%29)
- [UICollectionReusableView.prepareForReuse()](https://developer.apple.com/documentation/uikit/uicollectionreusableview/prepareforreuse%28%29)
