# Copyability

Copyability is a small Tampermonkey userscript that lets an Authorized Viewer
copy a Supported Selection from a Feishu wiki document as a Plain-text Copy
Result. It works only with text that the viewer can already open, read, and
select; it does not grant document access or reveal hidden content. A Manifest
V3 Chrome extension remains available as an optional carrier.

## Repository map

- [`copyability.user.js`](copyability.user.js) is the primary Tampermonkey
  userscript; [`extension/`](extension/) is the optional Chrome extension.
- [`tests/`](tests/) contains the Playwright fixtures and behavior checks.
- [`docs/observations/`](docs/observations/) records observed Feishu behavior;
  [`docs/validation/`](docs/validation/) records release validation, and
  [`docs/distribution/`](docs/distribution/) contains publishing guidance.
- [`CONTEXT.md`](CONTEXT.md) defines the project language, while
  [`MISSION.md`](MISSION.md) and [`RESOURCES.md`](RESOURCES.md) capture scope and
  source material.
- [`lessons/`](lessons/), [`reference/`](reference/), and
  [`learning-records/`](learning-records/) contain the supporting learning
  material.
- [`AGENTS.md`](AGENTS.md) and [`docs/agents/`](docs/agents/) describe the issue,
  triage, and domain conventions used by coding agents.
- [`PRIVACY.md`](PRIVACY.md) documents the local-only data boundary used for the
  Chrome Web Store privacy disclosure.

## Install

### Tampermonkey (recommended, free)

1. Install
   [Tampermonkey](https://www.tampermonkey.net/) from its official browser-store
   link.
2. In Chrome 138 or later, open Tampermonkey's extension settings and enable
   **Allow User Scripts**. On older Chrome versions, enable **Developer mode**
   on `chrome://extensions` if Tampermonkey requests it.
3. Open **[Install Copyability](https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js)**
   and approve Tampermonkey's installation prompt.
4. Reload the target `https://my.feishu.cn/wiki/...` document.

There is no script creation or source pasting step. Tampermonkey checks the
versioned install URL for later Copyability updates.

### Chrome extension (optional)

The repository also contains a Manifest V3 extension. For trusted local use,
open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**,
select this repository's `extension/` directory, and reload the Feishu document.

Run `npm run build:extension` to create the optional Chrome Web Store upload at
`dist/copyability-extension-0.2.2.zip`. A public store listing is not currently
available.

Only install the extension or userscript after reviewing its source and
confirming that this repository is the source you intend to trust.

## Disable

Switch **Copyability** off in the Tampermonkey dashboard, then reload any open
Feishu document tabs. For the optional extension carrier, use the equivalent
switch on `chrome://extensions`.

## Uninstall

Delete Copyability from the Tampermonkey dashboard. For the optional extension
carrier, choose **Remove** on `chrome://extensions` and confirm. Reload any open
Feishu document tabs after removal.

## Manual update

Tampermonkey checks the userscript's versioned update URL. You can also choose
**Check for userscript updates** in the Tampermonkey dashboard. After an update,
reload the Feishu document. A locally loaded extension must instead be replaced
or updated from the repository and reloaded on `chrome://extensions`.

## Privacy boundary

Copyability processes the active DOM selection locally in the current browser
tab and writes only the resulting plain text to the local clipboard after an
explicit `Cmd+C` or `Ctrl+C` Copy Request.

The distributed userscript and optional extension:

- declare no extension permissions or userscript grants and run only on
  `https://my.feishu.cn/wiki/*`;
- make no network requests and upload no document or selection data;
- do not persist content in browser storage, cookies, or IndexedDB;
- do not log document or selection content;
- load no third-party JavaScript and use no remote runtime dependencies.

Tampermonkey contacts the repository's GitHub URL to install Copyability and
check its declared version for updates. These distribution requests do not
contain document content, a Supported Selection, or a Plain-text Copy Result.

The script does not change Feishu permissions. Use it only as an Authorized
Viewer and only where copying the Visible Text is permitted by the document
sharing policy, your organization, and applicable policy or law.

## Supported selections

A Supported Selection is contiguous Visible Text in observed Feishu wiki body
paragraphs, level 1–3 headings, or ordinary bullet-list items. Select the text
and press `Cmd+C` on macOS or `Ctrl+C` on other platforms. The clipboard result
is plain text in reading order with meaningful line breaks; formatting, link
metadata, images, and table styling are intentionally excluded from the
Plain-text Copy Result.

## Copy Failure behavior

On success, Copyability suppresses the host denial associated with that Copy
Request. If text extraction or the clipboard command results in a Copy Failure, a brief
“Copy failed. Please try again.” message appears and the host event remains
available. Empty or unsupported selections are left entirely to the page's
native behavior.

## Known limitations

- Compatibility is based on the currently observed Feishu DOM and may break if
  Feishu changes its markup.
- Tables, code blocks, comments, whiteboards, embedded sheets or applications,
  image-only content, and ordered lists are not supported.
- Rich text, images, bulk export, background capture, and automatic harvesting
  are out of scope.
- The route is intentionally limited to the `my.feishu.cn` wiki host; other
  Feishu or Lark hosts are not claimed to work.
- Tampermonkey itself must be installed first, and current Chrome versions may
  require the separate **Allow User Scripts** setting.

## Development validation

Run `npm install`, then `npm run typecheck`, `npm test`, and
`npm run build:extension`. Automated Chromium tests load the real extension and
cover supported and unsupported selections, success and Copy Failure behavior,
distribution metadata, packaging, and the static privacy boundary. Real Feishu
validation remains a manual release step because it depends on an Authorized
Viewer's authenticated session and a non-sensitive test document.
