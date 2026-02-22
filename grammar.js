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
      seq("===== FILE:", field("path", $.file_path), "=====", $.newline),

    file_end: ($) =>
      seq("===== END FILE:", field("path", $.file_path), "=====", $.newline),

    // Supports paths like ./.zed/settings.json without eating the delimiter
    file_path: (_) => token(/[^\s=]+/),

    blank_lines: (_) => /\r?\n+/,
    newline: (_) => /\r?\n/,

    // Body lines are provided by the external scanner and stop at the next marker
    file_body: ($) => repeat1($.body_line),
  },
});
