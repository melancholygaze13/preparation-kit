---
title: "String Indexing and Substrings: Theory"
domain: "Swift"
topic: "Strings and Characters"
concept: "String Indexing and Substrings"
page_type: theory
interview_priority: high
estimated_read_minutes: 7
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - string-index
  - substring
  - slicing
  - performance
---

# String Indexing and Substrings: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A string index is a cursor at a valid boundary, not a distance:

```text
String value/version ── owns meaning of ──> String.Index
       │
       └─ slice range ──> Substring view ── may retain base storage
```

Keep three concepts separate:

- **Index:** A position valid for one string view and content version.
- **Offset:** A distance measured in a declared unit.
- **Slice:** A subsequence view with its own lifetime and retained-storage cost.

Converting between them requires the original string and a clear unit contract.

## How It Works

### Why Strings Don't Use Integer Subscripts

Swift strings contain variable-width extended grapheme clusters. The character at
an apparent offset may require scanning encoded content and applying Unicode
segmentation rules. Integer subscripting would suggest constant-time random access
and portable offsets that the model can't guarantee.

Use native indices:

```swift
let text = "A🇯🇵é"
let first = text.startIndex
let second = text.index(after: first)

precondition(text[first] == "A")
precondition(text[second] == "🇯🇵")
```

### Index Navigation

Important APIs include:

- `startIndex` and `endIndex`.
- `index(after:)` and `index(before:)`.
- `index(_:offsetBy:)`.
- `index(_:offsetBy:limitedBy:)` for bounded movement.
- `distance(from:to:)` for a distance in the collection's element units.
- `indices` and direct iteration.

`endIndex` is the position after the last character. It is valid as a range bound
but not as a character subscript.

Prefer searches that return indices over counting from the beginning:

```swift
let greeting = "Hello, world!"
if let comma = greeting.firstIndex(of: ",") {
    let nameStart = greeting.index(after: comma)
    let suffix = greeting[nameStart...]
    print(suffix)
}
```

Use limited movement for external or optional offsets:

```swift
func prefix<C: Collection>(
    _ count: Int,
    of collection: C
) -> C.SubSequence? {
    guard count >= 0 else { return nil }
    guard let end = collection.index(
        collection.startIndex,
        offsetBy: count,
        limitedBy: collection.endIndex
    ) else { return nil }
    return collection[..<end]
}
```

### Index Validity and Mutation

An index is meaningful only when it is valid for the exact string content and
view being indexed. Treat indices and ranges as invalid after mutations that can
change layout or grapheme boundaries:

```swift
var text = "cafe"
let oldEnd = text.endIndex
text.append("́")
// Derive new positions from the mutated text; don't reuse oldEnd.
```

The appended combining mark can join the preceding character, demonstrating why
mutation isn't merely adding one independently indexed element.

Don't persist `String.Index`, send it across a process boundary, or apply it to a
separately fetched string. Persist a domain anchor or an explicitly defined
encoded offset plus the content version, then validate conversion when used.

### Slicing Strings

Range subscripting returns `Substring`:

```swift
let greeting = "Hello, world!"
let comma = greeting.firstIndex(of: ",") ?? greeting.endIndex
let beginning = greeting[..<comma] // Substring
```

`Substring` supports most string operations and conforms with `String` to
`StringProtocol`. It is designed for temporary parsing and transformation without
an immediate copy.

The slice preserves indices compatible with its region. It doesn't become a
zero-based integer-indexed string, and its storage can remain connected to the
original string.

### Substring Ownership and Retained Storage

A small `Substring` can reuse the storage of a much larger source. This avoids a
copy during local processing but can retain the entire source allocation while the
substring lives.

Convert at an ownership boundary:

```swift
struct ParsedRecord {
    let identifier: String
}

func makeRecord(from line: String) -> ParsedRecord {
    let token = line.prefix { $0 != "," }
    return ParsedRecord(identifier: String(token))
}
```

The explicit conversion communicates that the record owns a durable text value.
Don't convert every intermediate slice automatically; doing so defeats the local
allocation benefit.

### Mutation and Range Replacement

`String` supports insertion, removal, and range replacement at valid indices:

```swift
var message = "Hello world"
if let space = message.firstIndex(of: " ") {
    message.replaceSubrange(space..., with: ", Swift!")
}
```

After mutation, derive any subsequent index from the new string. Batch edits need
a deliberate coordinate strategy: apply validated nonoverlapping edits from the
end toward the beginning, or update ranges after each mutation. The correct policy
depends on whether positions refer to original or evolving content.

### Foundation `NSRange` Interoperability

Many Foundation APIs use `NSRange` over UTF-16 code units. Convert relative to the
exact string:

```swift
import Foundation

let text = "Hi 👋"
let native = text.startIndex..<text.endIndex
let foundation = NSRange(native, in: text)

guard let roundTrip = Range(foundation, in: text) else {
    fatalError("Range isn't valid for this string")
}
precondition(text[roundTrip] == text)
```

The failable conversion rejects ranges that don't map to valid Swift string
boundaries. Never treat `location` and `length` as `Character` offsets, and don't
reuse the range with changed text.

### Core Invariants

- A valid index identifies a boundary in the associated string content and view.
- `endIndex` can terminate a range but can't be subscripted.
- Native string range bounds must be valid and ordered for that string.
- Mutation can change grapheme segmentation and invalidate saved positions.
- `Substring` is a view optimized for temporary use, not a promise of independent
  storage.
- Foundation integer ranges require string-relative UTF-16 conversion.

### Constraints and Guarantees

- String index movement doesn't promise constant-time random access.
- Integer character offsets aren't a native string-indexing contract.
- `StringProtocol` can accept both `String` and `Substring`, but it doesn't erase
  their lifetime and storage differences.
- Range validation against one string doesn't validate the range against another
  version.
- Copying a substring into `String` establishes a durable value contract at an
  allocation and copy cost.

## Engineering Judgment

### Navigation Checklist

Before manipulating a position, establish:

1. The unit: grapheme, scalar, UTF-8, or UTF-16.
2. The exact string and content version.
3. Whether the position is an index, offset, or external range.
4. Whether movement is bounded and what failure means.
5. Whether mutation occurs before the position is consumed.
6. Whether the resulting slice is temporary or retained.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Direct iteration/search | Linear, Unicode-correct traversal | Less random-access syntax | Most string algorithms |
| Native `String.Index` | Valid grapheme-boundary navigation | String-relative and invalidatable | In-memory editing and slicing |
| Encoded offset plus version | Portable for a defined protocol | Conversion and validation required | Persistence and cross-process boundaries |
| Temporary `Substring` | Avoids immediate copy | Can retain source storage | Parsing pipelines |
| Owned `String` result | Independent lifetime | Allocation and copy | Models, caches, and API boundaries |

### Alternatives

- Parse bytes before decoding when a protocol is byte-oriented.
- Use a text-edit model with versioned positions for collaborative or incremental
  editing rather than raw `String.Index` persistence.
- Return a semantic result instead of exposing internal ranges when callers don't
  need positions.
- Use `StringProtocol` generics for read-only utilities that genuinely benefit
  from accepting both strings and substrings.

## References

- [Accessing and Modifying a String](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#Accessing-and-Modifying-a-String)
- [String Indices](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#String-Indices)
- [Inserting and Removing](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#Inserting-and-Removing)
- [Substrings](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#Substrings)
- [Swift Standard Library: String.Index](https://developer.apple.com/documentation/swift/string/index)
- [Swift Standard Library: Substring](https://developer.apple.com/documentation/swift/substring)
- [Swift Standard Library: StringProtocol](https://developer.apple.com/documentation/swift/stringprotocol)
- [Foundation: NSRange](https://developer.apple.com/documentation/foundation/nsrange)
- [Foundation: Converting NSRange to Range](https://developer.apple.com/documentation/swift/range/init(_:in:)-7vtwh)
