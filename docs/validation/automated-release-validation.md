# Automated release validation

Validated on 2026-07-16 against the userscript prototype at version `0.1.3`.

## Commands and results

- `node --check copyability.user.js` — passed.
- `npm run typecheck` — passed with TypeScript 5.9.3.
- `npm test` — 23 Playwright tests passed in headless Chromium.

The suite covers exact plain-text copying for the supported keyboard shortcuts
and block types, cross-block reading order, unsupported and empty selections,
and both controlled Copy Failure paths. Distribution checks additionally verify
that the shipped metadata has exactly one narrow
`https://my.feishu.cn/wiki/*` match and `@grant none`, with no update, resource,
connection, or dependency directives.

The distributed script body is statically guarded against network and upload
APIs, persistent browser storage, content logging, userscript privileged APIs,
and third-party JavaScript loading. These checks protect the documented privacy
boundary from accidental capability expansion; they are not a substitute for
source review.

## Manual release gate

Authenticated validation in a non-sensitive Feishu test document is deliberately
not automated. Installation, single- and cross-block clipboard results,
repeated Copy Requests, native behavior for empty or unsupported selections,
and visible Copy Failure feedback must be checked manually before release.
