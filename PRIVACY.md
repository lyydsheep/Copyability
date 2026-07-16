# Copyability Privacy Policy

Last updated: 2026-07-16

Copyability is a Tampermonkey userscript, with an optional Chrome extension
carrier, that turns an explicit Supported Selection in a matching Feishu wiki
document into a Plain-text Copy Result.

## Data handled

Copyability processes only the Visible Text actively selected by the user when
the user presses `Cmd+C` or `Ctrl+C`. Processing happens locally in the current
browser tab.

## Collection, transmission, and sharing

Copyability does not collect, transmit, sell, or share document content,
selections, clipboard content, browsing history, identity data, or usage data.
Its runtime contains no network requests, analytics, advertising, telemetry, or
remote code.

When the Tampermonkey carrier is installed or checked for an update,
Tampermonkey requests `copyability.user.js` from this project's GitHub
repository. That distribution request is handled by Tampermonkey and GitHub; it
does not contain Visible Text, a Supported Selection, or a Plain-text Copy
Result. The Copyability runtime itself performs no network request.

## Storage and retention

Copyability does not store document or selection content in extension storage,
browser storage, cookies, IndexedDB, or a remote service. The selected plain
text is held only long enough to complete the explicit Copy Request. The result
then remains in the user's operating-system clipboard under the user's control.

## Site access

Both carriers run only on `https://my.feishu.cn/wiki/*`. The userscript requests
no privileged userscript APIs, and the extension requests no Chrome extension
API permissions. They use site access only to read the active DOM selection and
participate in that page's copy event.

## Changes and contact

Material changes to these practices will be reflected in this policy and the
disclosures for any active distribution channel before release. Questions or
reports can be opened in the
[Copyability issue tracker](https://github.com/lyydsheep/Copyability/issues).
