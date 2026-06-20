---
title: "String Indexing and Substrings: Theory"
domain: "Swift"
topic: "Strings and Characters"
concept: "String Indexing and Substrings"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - string-index
  - substring
  - slicing
  - performance
---

# String Indexing and Substrings: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `String.Index` identifies a valid Unicode boundary in a particular string;
> it is not an integer character offset. Derive it from the current string and
> keep it coupled to the string version it indexes.

- Use `startIndex`, `endIndex`, `indices`, `firstIndex`, and index-navigation APIs.
- `endIndex` is an exclusive boundary and can't be subscripted.
- Mutation can invalidate saved indices and ranges.
- Repeatedly advancing from `startIndex` can turn a linear algorithm quadratic.
- `Substring` is a short-lived view that can retain the original string's storage;
  convert to `String` for independent long-term ownership.

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

## Failure Modes

- **Using `0..<text.count`:** Produces integers, not `String.Index` values.
- **Subscripting `endIndex`:** Traps at the exclusive boundary.
- **Reusing an index after mutation:** Applies a stale position to changed
  grapheme layout.
- **Applying an index or range to different content:** Violates its string-relative
  meaning.
- **Persisting native indices:** Stores process-local implementation detail rather
  than a versioned domain position.
- **Repeatedly offsetting from the beginning:** Creates quadratic traversal.
- **Holding tiny substrings in caches:** Retains large source storage.
- **Converting every intermediate substring:** Adds avoidable copies and
  allocations.
- **Treating `NSRange` as character offsets:** Splits UTF-16 sequences or selects
  the wrong text.
- **Validating then mutating elsewhere:** Creates a time-of-check/time-of-use range
  failure.

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

## Production Considerations

### Performance

Prefer single-pass iteration and searches returning indices. A loop that asks for
the nth character by advancing from `startIndex` on every iteration can perform
quadratic work.

Substring use shifts cost: slicing may avoid allocation now but retain memory
later. Measure allocation, traversal, bridging, and retained storage with realistic
Unicode text and payload sizes.

### Concurrency and Thread Safety

Keep a string and its indices within one immutable snapshot or isolation domain.
A range checked against actor-owned text can become stale if the actor mutates
before applying it.

For work outside isolation, capture the string value and derive indices from that
snapshot. Before committing edits to newer state, revalidate against a version or
transform positions according to the editing model.

### Testing

Test:

- Empty, one-character, prefix, suffix, and full-string ranges.
- Combining sequences, emoji, flags, and mixed scripts.
- Movement exactly to `endIndex` and one element beyond the allowed limit.
- Index use before and after mutations that change segmentation.
- Successful and failed `NSRange` conversion at UTF-16 boundaries.
- Temporary slice behavior and durable conversion at storage boundaries.
- Large inputs that expose quadratic traversal or retained-memory problems.

### Observability and Debugging

Record the position unit, string version, and sanitized lengths when conversion
fails. An integer without its encoding and source version is not useful diagnostic
context.

Use allocation and memory-graph tools to find long-lived substrings retaining
large sources. Use performance traces to distinguish segmentation traversal from
encoding conversion and Foundation bridging.

### Compatibility and Migration

Changing a persisted position from UTF-16 to UTF-8 or grapheme offsets requires a
versioned migration; the numeric values aren't reinterpretations of one another.
Content edits also require position rebasing or invalidation.

When modernizing an Objective-C boundary, convert `NSRange` once at the adapter and
expose `Range<String.Index>` or semantic results to native Swift code.

## Staff and Principal Perspective

### System Impact

Text positions cross layers in annotations, search highlights, rich text, logs,
media captions, and collaborative editing. A range contract without units and a
content version is incomplete and eventually corrupts selections.

### Decision Framework

For shared text positions, define:

1. Encoding or element unit.
2. Inclusive or exclusive endpoint convention.
3. Source content identity and version.
4. Valid-boundary and malformed-range behavior.
5. Edit rebasing or invalidation rules.
6. Ownership and lifetime of sliced content.
7. Conversion owner, metrics, rollout, and compatibility plan.

### Organizational Impact

Provide one checked range adapter per platform and shared fixtures containing
multibyte and multi-scalar text. Keep UTF-16 legacy conventions at explicit
Foundation boundaries. Give long-lived text-position schemas an owner because
editing and Unicode evolution affect every producer and consumer.

## Common Mistakes

### “String.Index is an integer offset”

**Why it is wrong:** It represents a valid boundary tied to string content, not a
portable count from zero.

**Better approach:** Derive native indices from the current string and declare
units for external offsets.

### “Substring is just a smaller String”

**Why it is wrong:** It is a subsequence view that can retain the source's storage
and indices.

**Better approach:** Use it temporarily and convert to `String` at durable
ownership boundaries.

### “An NSRange can subscript a Swift string directly”

**Why it is wrong:** Foundation ranges commonly use UTF-16 units that can end
inside a Swift grapheme boundary.

**Better approach:** Convert with `Range(nsRange, in: string)` and handle failure.

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
