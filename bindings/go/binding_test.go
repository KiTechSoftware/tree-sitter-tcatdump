package tree_sitter_tcatdump_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tcatdump "github.com/kitechsoftware/tree-sitter-tcatdump/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tcatdump.Language())
	if language == nil {
		t.Errorf("Error loading Tcatdump grammar")
	}
}
