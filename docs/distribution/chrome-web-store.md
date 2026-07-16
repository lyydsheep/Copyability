# Chrome Web Store release

Copyability's primary carrier is the Manifest V3 extension in `extension/`.
Chrome Web Store publication turns installation into **Add to Chrome**, followed
by a reload of the open Feishu document.

## Build and validate

```sh
npm ci
npm run typecheck
npm test
npm run build:extension
```

Upload `dist/copyability-extension-0.2.2.zip`. The archive contains the manifest,
content script, and four local PNG icons, with `manifest.json` at its root.

For local validation, open `chrome://extensions`, enable **Developer mode**,
choose **Load unpacked**, and select `extension/`. Reload both the extension and
the Feishu document after changing a content script or manifest.

## Store listing copy

**Name**

Copyability

**Summary**

Turn a Supported Selection in a Feishu wiki document into a Plain-text Copy
Result.

**Single purpose**

Copyability converts an explicit Supported Selection that an Authorized Viewer
can already read in a Feishu wiki document into a local Plain-text Copy Result.

**Detailed description**

Copyability helps an Authorized Viewer copy selected Feishu wiki body text as
plain text with meaningful line breaks. It supports observed body paragraphs,
level 1–3 headings, and ordinary bullet lists. It does not grant document
access, export documents, read hidden content, run in the background, or send
content to a server.

## Site-access justification

The static content script is limited to `https://my.feishu.cn/wiki/*`. Access is
required to inspect the user's active DOM selection and handle the explicit
`Cmd+C` or `Ctrl+C` event. No broader host pattern or Chrome API permission is
declared.

## Privacy disclosure

- Data collection: none.
- Data transmission or sharing: none.
- Persistent storage: none.
- Analytics, advertising, telemetry, and remote code: none.
- Privacy policy URL:
  `https://github.com/lyydsheep/Copyability/blob/main/PRIVACY.md`

The disclosure must remain consistent with `PRIVACY.md` and the submitted
source.

## Dashboard checklist

1. Register or open the Chrome Web Store developer account and enable 2-Step
   Verification.
2. Create a new item and upload the generated ZIP.
3. Use the listing copy and privacy disclosures above.
4. Upload at least one current 1280×800 or 640×400 product screenshot and the
   required promotional artwork. The 128×128 extension icon is already packaged.
5. Choose private or unlisted visibility for the first reviewed release.
6. Submit for review and complete authenticated real-page validation after the
   reviewed build becomes installable.
7. Replace the placeholder wording in `README.md` with the final Chrome Web
   Store listing link.

Each later code or asset release must increment the manifest version, rebuild
the ZIP, rerun automated and real-page validation, and upload the new package.
