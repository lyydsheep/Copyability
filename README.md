# Copyability

Copyability is a small Chrome extension that lets an Authorized Viewer copy a
Supported Selection from a Feishu wiki document as a Plain-text Copy Result. It
works only with text that the viewer can already open, read, and select; it does
not grant document access or reveal hidden content. The original Tampermonkey
userscript remains available as a fallback carrier.

## Repository map

- [`extension/`](extension/) is the Chrome extension; [`copyability.user.js`](copyability.user.js)
  is the fallback userscript.
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

### Chrome Web Store (recommended)

The intended end-user path is a Chrome Web Store listing. After the listing is
published, the complete setup is: choose **Add to Chrome**, approve access to
`my.feishu.cn`, and reload the open Feishu document. Tampermonkey, script
creation, and manual configuration are not required.

The store listing is not live yet. The repository already contains the
Manifest V3 extension and produces the upload archive required for review.

### Local extension validation

Use this path only for development or trusted pre-release testing:

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository's `extension/` directory.
4. Reload the target `https://my.feishu.cn/wiki/...` document.

Run `npm run build:extension` to create the Chrome Web Store upload at
`dist/copyability-extension-0.2.0.zip`.

### Tampermonkey fallback

If Tampermonkey is already installed, open the repository's
[`copyability.user.js`](https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js)
and approve the installation prompt. Manual script creation and source pasting
are no longer necessary. Reload the target Feishu document after installation.

Only install the extension or userscript after reviewing its source and
confirming that this repository is the source you intend to trust.

## Disable

Open `chrome://extensions` and switch **Copyability** off, then reload any open
Feishu document tabs. For the fallback carrier, use the equivalent switch in
the Tampermonkey dashboard.

## Uninstall

Open `chrome://extensions`, choose **Remove** on Copyability, and confirm. For
the fallback carrier, delete Copyability from the Tampermonkey dashboard.
Reload any open Feishu document tabs after removal.

## Manual update

Chrome Web Store installations update automatically after a reviewed release
is published. A locally loaded extension must be reloaded from
`chrome://extensions`, followed by a reload of the Feishu document. To update
the Tampermonkey fallback, reopen the raw userscript link and approve the newer
version.

## Privacy boundary

Copyability processes the active DOM selection locally in the current browser
tab and writes only the resulting plain text to the local clipboard after an
explicit `Cmd+C` or `Ctrl+C` Copy Request.

The distributed extension and fallback userscript:

- declare no extension permissions or userscript grants and run only on
  `https://my.feishu.cn/wiki/*`;
- make no network requests and upload no document or selection data;
- does not persist content in browser storage, cookies, or IndexedDB;
- does not log document or selection content;
- loads no third-party JavaScript and uses no remote dependencies.

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
- One-click installation depends on publishing the prepared archive through
  Chrome Web Store review; local validation still uses **Load unpacked**.

## Development validation

Run `npm install`, then `npm run typecheck`, `npm test`, and
`npm run build:extension`. Automated Chromium tests load the real extension and
cover supported and unsupported selections, success and Copy Failure behavior,
distribution metadata, packaging, and the static privacy boundary. Real Feishu
validation remains a manual release step because it depends on an Authorized
Viewer's authenticated session and a non-sensitive test document.
