# Feishu single-paragraph copy observation

Observed on 2026-07-15 in a non-sensitive shared document. Document text and the
document identifier are intentionally omitted.

## Page facts

- The document route is `https://my.feishu.cn/wiki/<document-id>`.
- An ordinary body paragraph is represented by
  `.block.docx-text-block[data-block-type="text"]`.
- Its visible line is an `.ace-line` inside
  `.text-editor[contenteditable="false"]`.
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
and recognizes ordinary text blocks using the observed DOM structure. The same
structure is represented by the local Chromium fixture so compatibility logic is
covered without storing credentials or making the production document an
automated dependency.

Installing this build in Tampermonkey and validating the clipboard result and
absence of the host's failure UI on the real document remain manual acceptance
steps. The observation did not establish how that failure UI is scheduled, so
the local fixture models only its externally observable outcome after an
unhandled copy request.
