#include <tree_sitter/parser.h>
#include <stdbool.h>

static bool scan_literal(TSLexer *lexer, const char *literal) {
  for (unsigned i = 0; literal[i] != '\0'; i++) {
    if (lexer->lookahead != literal[i]) return false;
    lexer->advance(lexer, false);
  }
  return true;
}

enum TokenType {
  BODY_LINE,
};

void *tree_sitter_tcatdump_external_scanner_create() { return NULL; }
void tree_sitter_tcatdump_external_scanner_destroy(void *p) {}
void tree_sitter_tcatdump_external_scanner_reset(void *p) {}
unsigned tree_sitter_tcatdump_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_tcatdump_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

bool tree_sitter_tcatdump_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  (void)payload;
  if (!valid_symbols[BODY_LINE] || lexer->eof(lexer)) return false;

  if (lexer->lookahead == '=') {
    lexer->mark_end(lexer);
    if (scan_literal(lexer, "===== FILE:") || scan_literal(lexer, "===== END FILE:")) {
      return false;
    }
  }

  bool consumed_any = false;
  while (!lexer->eof(lexer) && lexer->lookahead != '\n') {
    lexer->advance(lexer, false);
    consumed_any = true;
  }

  if (lexer->lookahead == '\n') {
    lexer->advance(lexer, false);
    consumed_any = true;
  }

  if (consumed_any) {
    lexer->result_symbol = BODY_LINE;
    return true;
  }

  return false;
}
