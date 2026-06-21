import StringifyMacro

let result = #stringify(20 + 22)
precondition(result.value == 42)
precondition(result.source == "20 + 22")

print("\(result.value) from \(result.source)")
