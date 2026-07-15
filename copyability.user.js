// ==UserScript==
// @name         Copyability
// @namespace    https://github.com/lyydsheep/Copyability
// @version      0.1.0
// @description  Copy selected visible paragraph text as plain text.
// @match        https://*.feishu.cn/docx/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  let pendingPlainText = null;
  let copySucceeded = false;

  document.addEventListener(
    "copy",
    (event) => {
      if (pendingPlainText === null || !event.clipboardData) return;

      event.clipboardData.setData("text/plain", pendingPlainText);
      event.preventDefault();
      event.stopImmediatePropagation();
      copySucceeded = true;
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      const isCopyRequest =
        event.key.toLowerCase() === "c" &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey;
      if (!isCopyRequest) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const ancestor =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
      if (!ancestor?.closest("p")) return;

      const plainText = selection.toString();
      if (!plainText) return;

      pendingPlainText = plainText;
      copySucceeded = false;
      document.execCommand("copy");
      pendingPlainText = null;

      if (copySucceeded) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
})();
