---
title: "Image Loading, Deduplication, and Caching: Theory"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Image Loading, Deduplication, and Caching"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-26
---

# Image Loading, Deduplication, and Caching: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Image loading is one of the easiest ways to make a UIKit list feel broken. The
work is expensive, many cells request images at once, and cells are reused while
network, disk, decode, and resizing work finish later.

A production image pipeline needs four separate decisions:

1. Who owns the shared request?
2. What is cached?
3. When is work cancelled?
4. Which visible item may receive the result?

## Loader Ownership

Cells should not be the global owner of image work. A cell can express interest
in an image for its current item, but a loader should own shared fetch,
deduplication, and cache state.

An actor is a good fit for mutable in-flight request state:

```swift
import UIKit

enum ImageError: Error {
    case invalidData
}

actor ImageLoader {
    private let cache: NSCache<NSURL, UIImage> = {
        let cache = NSCache<NSURL, UIImage>()
        cache.countLimit = 200
        return cache
    }()
    private var inFlight: [URL: Task<UIImage, Error>] = [:]

    func image(for url: URL) async throws -> UIImage {
        if let cached = cache.object(forKey: url as NSURL) { return cached }
        if let task = inFlight[url] { return try await task.value }

        let task = Task {
            let (data, _) = try await URLSession.shared.data(from: url)
            guard let image = UIImage(data: data) else {
                throw ImageError.invalidData
            }
            return image.preparingForDisplay() ?? image
        }

        inFlight[url] = task
        do {
            let image = try await task.value
            cache.setObject(image, forKey: url as NSURL)
            inFlight[url] = nil
            return image
        } catch {
            inFlight[url] = nil
            throw error
        }
    }
}
```

The important part is storing the in-flight task before awaiting it. If two
callers request the same URL, the second caller can await the existing task
instead of starting a duplicate download.

The small `NSCache` limit keeps this teaching example from growing without bound.
A production limit should come from measured memory use. `NSCache` may remove
objects under memory pressure, so callers must treat every lookup as optional.

## Caching

Cache policy depends on product needs and memory budget:

| Cache | Purpose | Trade-off |
|---|---|---|
| URL cache | Reuse network responses | May not store decoded image |
| Memory image cache | Fast repeated display | Uses RAM and must evict |
| Disk image cache | Offline or long-lived reuse | Adds invalidation complexity |
| Prepared/resized image cache | Faster scrolling | More variants to key correctly |

For scrolling performance, caching raw `Data` is often not enough. Decoding,
resizing, or preparing for display can still happen too late and cause hitches.
Cache the form the UI actually needs when images are reused often.

## Cancellation and Interest

There is a difference between cancelling a cell's interest and cancelling shared
work. If five visible cells need the same image and one cell scrolls away, the
loader should not necessarily cancel the underlying request for everyone.

Common designs:

- Let callers cancel their own task while the shared task continues.
- Track interested callers and cancel the shared task when no one remains.
- Keep small cache fills running if the result is likely to be reused soon.

The right answer depends on cost. Large downloads and paid APIs should be
cancelled aggressively. Small thumbnails may be cheap enough to finish and cache.

## UI Assignment

The loader should not decide which cell gets the image. The screen or cell must
verify the current identity before assignment:

```swift
let image = try await imageLoader.image(for: item.avatarURL)
await MainActor.run {
    guard cell.representedID == item.id else { return }
    cell.imageView.image = image
}
```

In a collection view, prefer applying results through the current model or cell
registration when possible. Direct cell mutation should still guard identity.

## Production Application

Image loading bugs usually show up under fast scrolling, poor networks, and low
memory:

| Bug | Cause | Fix |
|---|---|---|
| Same image downloads many times | No in-flight deduplication | Store tasks by URL or cache key |
| Wrong avatar appears | Result applied after reuse | Check represented item ID |
| Scrolling hitches | Decode or resize on main actor | Prepare image off UI path |
| Memory grows without bound | Cache has no eviction policy | Use limits and respond to memory pressure |

For Staff and Principal interviews, mention operational limits: shared requests,
retry behavior, cache invalidation, metrics for hit rate and decode time, and a
clear owner for cache policy.

## References

- [UIImage.preparingForDisplay()](https://developer.apple.com/documentation/uikit/uiimage/preparingfordisplay%28%29)
- [URLSession.data(from:delegate:)](https://developer.apple.com/documentation/foundation/urlsession/data%28from%3Adelegate%3A%29)
- [URLCache](https://developer.apple.com/documentation/foundation/urlcache)
- [NSCache](https://developer.apple.com/documentation/foundation/nscache)
