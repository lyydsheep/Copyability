# Browser Userscript Resources

## Knowledge

- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
  Official reference for userscript metadata and Tampermonkey-provided APIs. Use for: `@match`, `@grant`, execution timing, and clipboard APIs.
- [Tampermonkey FAQ](https://www.tampermonkey.net/faq.php)
  Official installation and troubleshooting guidance. Use for: how scripts are installed, recognized, enabled, and debugged.
- [Chrome: Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
  Chrome's official explanation of scripts that execute inside matching web pages. Use for: the browser security model and the relationship between page code and injected code.
- [Chrome: `scripting` API](https://developer.chrome.com/docs/extensions/reference/api/scripting)
  Chrome's official API for programmatic script injection. Use for: comparing a packaged Chrome extension with a Tampermonkey prototype.
- [MDN: Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
  Reference for reading the user's current selection, checking whether it is empty, retrieving its `Range`, and extracting text.
- [MDN: `copy` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event)
  Reference for replacing the browser's default clipboard payload with `text/plain` during a real copy action.
- [MDN: `Range.intersectsNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Range/intersectsNode)
  Reference for deciding which Feishu DOM nodes intersect the selected range.
- [MDN: `Document.createTreeWalker()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker)
  Reference for walking every text node inside a multi-block selection instead of validating only its endpoints.
- [MDN: `Document.execCommand()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
  Compatibility reference for the prototype's `copy` trigger. The API is deprecated, so this is an explicit migration risk rather than a recommended new general-purpose API.

## Wisdom (Communities)

- [Tampermonkey issue tracker](https://github.com/Tampermonkey/tampermonkey/issues)
  Maintainer and user discussions about real browser compatibility problems. Use for: confirming whether unexpected behavior is a known Tampermonkey limitation.
