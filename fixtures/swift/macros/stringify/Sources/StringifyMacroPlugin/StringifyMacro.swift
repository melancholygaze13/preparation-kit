import SwiftCompilerPlugin
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

public struct StringifyMacro: ExpressionMacro {
    public static func expansion(
        of node: some FreestandingMacroExpansionSyntax,
        in context: some MacroExpansionContext
    ) throws -> ExprSyntax {
        guard let argument = node.arguments.first?.expression else {
            throw StringifyMacroError.missingArgument
        }

        return "(\(argument), \(literal: argument.description))"
    }
}

private enum StringifyMacroError: Error, CustomStringConvertible {
    case missingArgument

    var description: String { "#stringify requires one expression" }
}

@main
struct StringifyMacroPlugin: CompilerPlugin {
    let providingMacros: [Macro.Type] = [StringifyMacro.self]
}
