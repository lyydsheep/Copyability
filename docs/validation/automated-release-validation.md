# Automated release validation

Validated on 2026-07-16 against the primary userscript and optional Chrome
extension at version `0.2.2`.

## Commands and results

- `node --check copyability.user.js` and `node --check extension/content.js` —
  passed.
- `npm run typecheck` — passed with TypeScript 5.9.3.
- `npm test` — 28 Playwright tests passed in headless Chromium.
- `npm run build:extension` — produced the Chrome Web Store upload archive with
  its manifest at the ZIP root.

The suite covers exact plain-text copying for the supported keyboard shortcuts
and block types, cross-block reading order, unsupported and empty selections,
and both controlled Copy Failure paths. The suite also loads the real Manifest
V3 extension without Tampermonkey and verifies an exact clipboard result.
Distribution checks verify that both carriers have exactly one narrow
`https://my.feishu.cn/wiki/*` match, no extension permissions, `@grant none`, no
resource, connection, or dependency directives, and only the declared GitHub
install/update URLs.

Both distributed runtime files are statically guarded against network and
upload APIs, persistent browser storage, content logging, userscript privileged
APIs, and third-party JavaScript loading. A parity check prevents the optional
extension and primary userscript runtimes from drifting. These checks protect the
documented privacy boundary from accidental capability expansion; they are not
a substitute for source review.

## Manual release gate

Authenticated validation in a non-sensitive Feishu test document is deliberately
not automated. Installation, single- and cross-block clipboard results,
repeated Copy Requests, native behavior for empty or unsupported selections,
and visible Copy Failure feedback must be checked manually before release.
