# Mission: Browser userscripts for Copyability

## Why

Understand whether a Tampermonkey userscript is an appropriate first delivery mechanism for Copyability, so the project can prototype browser-side behavior on authorized, visible text without prematurely building a full Chrome extension.

## Success looks like

- Explain the difference between Tampermonkey, a userscript, and a Chrome extension.
- Read a userscript metadata block and identify which pages it can run on.
- Decide whether Copyability should begin as a userscript or a packaged extension.

## Constraints

- Initial environment: Google Chrome and Feishu Docs on the web.
- Keep permissions limited to the intended document domain.
- Work only with text the user is authorized to view and select.

## Out of scope

- General Chrome extension development.
- DRM, encryption, authentication, paywalls, or unauthorized content access.
