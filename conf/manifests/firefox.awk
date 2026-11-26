BEGIN {
  target = "firefox"
  include_block = 1
  inside_block = 0
}

{
  marker = "// @browser-target:"
  if (index($0, marker) == 1) {
    directive = substr($0, length(marker) + 1)
    suffix = ":begin"
    if (length(directive) > length(suffix) &&
        substr(directive, length(directive) - length(suffix) + 1) == suffix) {
      if (inside_block) {
        print "Nested browser target marker" > "/dev/stderr"
        exit 2
      }
      selected_target = substr(directive, 1, length(directive) - length(suffix))
      if (selected_target != "chromium" && selected_target != "edge" && selected_target != "firefox") {
        print "Unknown browser target marker: " selected_target > "/dev/stderr"
        exit 2
      }
      inside_block = 1
      include_block = selected_target == target
      next
    }
    if ($0 == "// @browser-target:end") {
      if (!inside_block) {
        print "Unmatched browser target end marker" > "/dev/stderr"
        exit 2
      }
      inside_block = 0
      include_block = 1
      next
    }
  }
  if (include_block) {
    print
  }
}

END {
  if (inside_block) {
    print "Unclosed browser target marker" > "/dev/stderr"
    exit 2
  }
}
