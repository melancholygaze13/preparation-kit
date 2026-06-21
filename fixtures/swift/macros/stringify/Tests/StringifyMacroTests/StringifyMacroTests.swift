import StringifyMacro
import StringifyMacroPlugin
import SwiftSyntaxMacros
import SwiftSyntaxMacrosTestSupport
import Testing

private let macros: [String: Macro.Type] = [
    "stringify": StringifyMacro.self,
]

@Test
func expansionIsStable() {
    assertMacroExpansion(
        "#stringify(20 + 22)",
        expandedSource: "(20 + 22, \"20 + 22\")",
        macros: macros
    )
}

@Test
func consumerReceivesValueAndSource() {
    let result = #stringify(20 + 22)

    #expect(result.value == 42)
    #expect(result.source == "20 + 22")
}
