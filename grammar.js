module.exports = grammar({
  name: "tcatdump",

  rules: {
    source_file: ($) => repeat($.file_block),

    file_block: ($) =>
      seq(
        $.file_header,
        $.file_body,
        $.file_end
      ),

    file_header: ($) =>
      seq(
        "===== FILE: ",
        field("path", $.file_path),
        " =====",
        $.newline
      ),

    file_end: ($) =>
      seq(
        "===== END FILE: ",
        field("path", $.file_path),
        " =====",
        optional($.newline)
      ),

    file_path: (_) => token(/[^\n=]+/),

    file_body: ($) =>
      repeat(
        choice(
          $.line,
          $.newline
        )
      ),

    line: (_) => token(/[^\n]*\n/),
    newline: (_) => "\n",
  },
});
