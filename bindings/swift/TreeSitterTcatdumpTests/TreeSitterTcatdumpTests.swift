import XCTest
import SwiftTreeSitter
import TreeSitterTcatdump

final class TreeSitterTcatdumpTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tcatdump())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tcatdump grammar")
    }
}
