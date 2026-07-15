# Feishu Supported Selection observations

Observed on 2026-07-15 in a non-sensitive shared document. Document text and the
document identifier are intentionally omitted.

## Page facts

- The document route is `https://my.feishu.cn/wiki/<document-id>`.
- An ordinary body paragraph is represented by
  `.block.docx-text-block[data-block-type="text"]`.
- Headings are represented by `.block.docx-heading1-block`,
  `.block.docx-heading2-block`, or `.block.docx-heading3-block`, paired with the
  corresponding `heading1`, `heading2`, or `heading3` `data-block-type`.
- An observed ordinary list item is represented by
  `.block.docx-bullet-block[data-block-type="bullet"]`. No ordered-list block
  was observed, so ordered lists are not part of the current compatibility
  claim.
- Its visible line is an `.ace-line` inside
  `.text-editor[contenteditable="false"]`.
- The same `.ace-line` structure appears in the observed headings and bullet
  list items.
- The document also contains `table` and `table_cell` blocks. A table cell can
  contain a nested `docx-text-block`, so recognizing the nearest text block
  alone would incorrectly treat table content as supported.
- A selected body paragraph exposes a non-empty DOM `Selection` and `Range`; the
  observed range boundary was the `.ace-line` element.
- A native `Cmd+C` emitted capture- and bubble-phase `keydown` events with
  `defaultPrevented === false`. It emitted no `copy` event and did not change the
  clipboard.

## Implementation consequence

The userscript must respond synchronously to the explicit copy `keydown`, derive
the Plain-text Copy Result from the active DOM selection, and initiate the copy
operation itself. Waiting for a host-generated `copy` event cannot work on the
observed restricted page.

The production userscript is therefore scoped to `https://my.feishu.cn/wiki/*`
and recognizes observed text, heading, and bullet blocks using their block type
and visible-line structure. A contiguous selection is a Supported Selection
only when both boundaries, every selected non-empty text node, and every
intersected typed block belong to those structures. This rejects `table` and
`table_cell` ancestors as well as unsupported structures that do not use an
`.ace-line`, while allowing inline presentation elements inside a supported
visible line. The same structures are represented by the local Chromium fixture
so compatibility logic is covered without storing credentials or making the
production document an automated dependency.

Installing this build in Tampermonkey and validating individual heading, body,
and bullet selections plus one contiguous cross-block selection remain manual
acceptance steps. Clipboard text must be checked in a plain-text editor for
reading order, meaningful line breaks, completeness, and uniqueness. The
observation did not establish how the host's failure UI is scheduled, so the
local fixture models only its externally observable outcome after an unhandled
copy request.
