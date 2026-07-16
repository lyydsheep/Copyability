# Copyability

Copyability concerns transferring text that an authorized viewer can already read and select in a shared document into their local clipboard.

## Language

**Authorized Viewer（授权浏览者）**:
A user who has been granted permission to open and read a shared document through the third-party product.
_Avoid_: Document owner, unauthorized user

**Visible Text（可见文本）**:
Text rendered to an Authorized Viewer and available for direct visual inspection and selection within the shared document.
_Avoid_: Hidden content, inaccessible content, decrypted content

**Copy Restriction（复制限制）**:
A product-level rule that prevents selected Visible Text from being transferred to the Authorized Viewer's clipboard while leaving the text readable and selectable.
_Avoid_: Access control, viewing permission, DRM bypass

**Plain-text Copy Result（纯文本复制结果）**:
The textual representation of selected Visible Text, preserving meaningful line breaks while excluding fonts, colors, link metadata, images, and table styling.
_Avoid_: Rich-text copy, document export, screenshot

**Copy Request（复制请求）**:
An explicit clipboard action initiated by an Authorized Viewer with the standard `Cmd+C` or `Ctrl+C` shortcut while a non-empty text selection exists in the target document.
_Avoid_: Automatic harvesting, background capture, bulk export

**Supported Selection（受支持选区）**:
A contiguous text selection within document body paragraphs, headings, or ordinary lists.
_Avoid_: Tables, code blocks, comments, whiteboards, embedded sheets, image text

**Copy Failure（复制失败）**:
The outcome of a valid Copy Request when no Plain-text Copy Result can be produced or the result cannot be placed on the Authorized Viewer's clipboard.
_Avoid_: Empty selection, unsupported content, denied viewing access
