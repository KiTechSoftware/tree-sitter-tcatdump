export default grammar({
  name: "tcatdump",

  extras: ($) => [/[ \t]/],

  externals: ($) => [$.body_line],

  rules: {
    source_file: ($) => repeat($.file_block),

    file_block: ($) =>
      seq(
        $.file_header,
        optional($.file_body),
        $.file_end,
        optional($.blank_lines),
      ),

    file_header: ($) =>
      seq("===== FILE: ", field("path", $.file_path), " =====", "\n"),

    file_end: ($) =>
      seq("===== END FILE: ", field("path", $.file_path), " =====", "\n"),

    file_path: (_) => token(/[^\n=]+/),

    blank_lines: (_) => token(/\n+/),

    file_body: ($) => repeat1($.body_line),
  },
});
