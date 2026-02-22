#include <tree_sitter/parser.h>
#include <stdbool.h>
#include <string.h>

enum TokenType {
  BODY_LINE,
};

void *tree_sitter_tcatdump_external_scanner_create() { return NULL; }
void tree_sitter_tcatdump_external_scanner_destroy(void *p) {}
void tree_sitter_tcatdump_external_scanner_reset(void *p) {}
unsigned tree_sitter_tcatdump_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_tcatdump_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

static bool starts_with_end_marker(TSLexer *lexer) {
  const char *marker = "===== END FILE: ";
  for (unsigned i = 0; marker[i]; i++) {
    if (lexer->lookahead != marker[i]) {
      return false;
    }
    lexer->advance(lexer, false);
  }
  return true;
}

bool tree_sitter_tcatdump_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (!valid_symbols[BODY_LINE]) return false;

  // EOF → nothing to scan
  if (lexer->eof(lexer)) return false;

  // Check if line starts with end marker
  if (lexer->lookahead == '=') {
    TSLexer snapshot = *lexer;
    if (starts_with_end_marker(&snapshot)) {
      return false; // let grammar match file_end
    }
  }

  // Otherwise consume until newline
  while (!lexer->eof(lexer) && lexer->lookahead != '\n') {
    lexer->advance(lexer, false);
  }

  // Consume newline if present
  if (lexer->lookahead == '\n') {
    lexer->advance(lexer, false);
  }

  lexer->result_symbol = BODY_LINE;
  return true;
}
