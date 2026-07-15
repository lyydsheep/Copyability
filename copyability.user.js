// ==UserScript==
// @name         Copyability
// @namespace    https://github.com/lyydsheep/Copyability
// @version      0.1.0
// @description  Copy a Supported Selection as a Plain-text Copy Result.
// @match        https://my.feishu.cn/wiki/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  let pendingPlainText = null;
  let copySucceeded = false;

  const supportedBlockSelector = [
    '.block.docx-text-block[data-block-type="text"]',
    '.block.docx-heading1-block[data-block-type="heading1"]',
    '.block.docx-heading2-block[data-block-type="heading2"]',
    '.block.docx-heading3-block[data-block-type="heading3"]',
    '.block.docx-bullet-block[data-block-type="bullet"]',
  ].join(",");

  const containingElement = (node) =>
    node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;

  const supportedBlockFor = (node) => {
    const line = containingElement(node)?.closest(".ace-line");
    if (!line?.closest('.text-editor[contenteditable="false"]')) return null;
    return line.closest(supportedBlockSelector);
  };

  const isSupportedSelection = (range) => {
    if (
      !supportedBlockFor(range.startContainer) ||
      !supportedBlockFor(range.endContainer)
    ) {
      return false;
    }

    const blocksAreSupported = [
      ...document.querySelectorAll(".block[data-block-type]"),
    ]
      .filter((block) => range.intersectsNode(block))
      .every((block) => block.matches(supportedBlockSelector));
    if (!blocksAreSupported) return false;

    const root = range.commonAncestorContainer;
    const textNodes = [];
    if (root.nodeType === Node.TEXT_NODE) {
      textNodes.push(root);
    } else {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        textNodes.push(node);
      }
    }

    return textNodes
      .filter(
        (node) => node.textContent?.trim() && range.intersectsNode(node),
      )
      .every((node) => supportedBlockFor(node));
  };

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
      if (!isSupportedSelection(range)) return;

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
