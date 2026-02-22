export default grammar({
  name: "tcatdump",

  // Do NOT include \n in extras, or you’ll destroy line structure.
  extras: ($) => [/[ \t]/],

  rules: {
    source_file: ($) => repeat($.file_block),

    file_block: ($) =>
      seq(
        $.file_header,
        optional($.blank_lines),
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

    // A body line is ANY line except a line that starts with "===== END FILE: "
    // We can’t do negative lookahead, so we spell out safe alternatives.
    body_line: ($) =>
      token(
        choice(
          // Lines not starting with '='
          /[^\n=][^\n]*\n/,

          // Lines starting with '=' but NOT the end marker prefix.
          // We exclude exactly "===== END FILE: " by forcing a divergence at some char.
          /=([^\n=][^\n]*\n)?/, // a single '=' then not '=' (or blank)
          /==([^\n=][^\n]*\n)?/,
          /===([^\n=][^\n]*\n)?/,
          /====([^\n=][^\n]*\n)?/,

          // Now the tricky part: line starts with 5 '='.
          // If it’s "=====" then next char must NOT allow the exact prefix " END FILE: "
          // So we allow either:
          // - anything not a space, OR
          // - space followed by a char that is not 'E', OR
          // - " E" followed by char not 'N', ... etc.
          /=====[^\n \r][^\n]*\n/,
          /===== [^\nE][^\n]*\n/,
          /===== E[^\nN][^\n]*\n/,
          /===== EN[^\nD][^\n]*\n/,
          /===== END[^\n ][^\n]*\n/,
          /===== END [^\nF][^\n]*\n/,
          /===== END F[^\nI][^\n]*\n/,
          /===== END FI[^\nL][^\n]*\n/,
          /===== END FIL[^\nE][^\n]*\n/,
          /===== END FILE[^\n:][^\n]*\n/,
          /===== END FILE:[^\n ][^\n]*\n/,
          /===== END FILE: [^\n][^\n]*\n/, // space present but not followed by nothing; still not the exact end rule because end rule continues with path + ' ====='
        ),
      ),
  },
});
