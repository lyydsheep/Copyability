# Copyability

Copyability is a small Tampermonkey userscript that lets an Authorized Viewer
copy a Supported Selection from a Feishu wiki document as a Plain-text Copy
Result. It only
works with text that the viewer can already open, read, and select; it does not
grant document access or reveal hidden content.

## Repository map

- [`copyability.user.js`](copyability.user.js) is the installable userscript.
- [`tests/`](tests/) contains the Playwright fixtures and behavior checks.
- [`docs/observations/`](docs/observations/) records observed Feishu behavior;
  [`docs/validation/`](docs/validation/) records release validation.
- [`CONTEXT.md`](CONTEXT.md) defines the project language, while
  [`MISSION.md`](MISSION.md) and [`RESOURCES.md`](RESOURCES.md) capture scope and
  source material.
- [`lessons/`](lessons/), [`reference/`](reference/), and
  [`learning-records/`](learning-records/) contain the supporting learning
  material.
- [`AGENTS.md`](AGENTS.md) and [`docs/agents/`](docs/agents/) describe the issue,
  triage, and domain conventions used by coding agents.

## Install

1. Install Tampermonkey in Chrome from its official browser-store listing.
2. Open the Tampermonkey dashboard and choose **Create a new script**.
3. Replace the editor contents with the complete contents of
   `copyability.user.js` from this repository.
4. Save the script and confirm that **Copyability** is enabled in the dashboard.
5. Reload the target `https://my.feishu.cn/wiki/...` document.

Only install a script after reviewing its source and confirming that this
repository is the source you intend to trust.

## Disable

Open the Tampermonkey dashboard and switch **Copyability** off. Reload any open
Feishu document tabs. The script remains installed but will no longer run.

## Uninstall

Open the Tampermonkey dashboard, locate **Copyability**, choose its delete or
trash action, and confirm removal. Reload any open Feishu document tabs.

## Manual update

This prototype does not configure automatic updates. To update it, review the
new `copyability.user.js`, open the installed Copyability script in the
Tampermonkey editor, replace the entire old source, and save. Reload the Feishu
document and repeat the validation appropriate to the change. The version in
the metadata block identifies the installed build.

## Privacy boundary

Copyability processes the active DOM selection locally in the current browser
tab and writes only the resulting plain text to the local clipboard after an
explicit `Cmd+C` or `Ctrl+C` Copy Request.

The distributed userscript:

- has `@grant none` and runs only on `https://my.feishu.cn/wiki/*`;
- makes no network requests and uploads no document or selection data;
- does not persist content in browser storage, cookies, or IndexedDB;
- does not log document or selection content;
- loads no third-party JavaScript and uses no remote dependencies.

The script does not change Feishu permissions. Use it only as an Authorized
Viewer and only where copying the Visible Text is permitted by the document
owner, your organization, and applicable policy or law.

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
- Automatic updates and browser-extension or marketplace packaging are deferred
  until after this userscript prototype is validated.

## Development validation

Run `npm install`, then `npm run typecheck` and `npm test`. Automated Chromium
tests cover supported and unsupported selections, success and Copy Failure
behavior, the distribution metadata, and the static privacy boundary. Real
Feishu validation remains a manual release step because it depends on an
Authorized Viewer's authenticated session and a non-sensitive test document.
