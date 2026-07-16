// ==UserScript==
// @name         Copyability
// @name:zh-CN   Copyability - 飞书文档复制助手
// @namespace    https://github.com/lyydsheep/Copyability
// @version      0.2.2
// @description  Copy a Supported Selection from a Feishu Wiki document as a Plain-text Copy Result.
// @description:zh-CN 将授权浏览者可见且可选中的飞书 Wiki 文本复制为纯文本。
// @author       lyydsheep
// @homepageURL  https://github.com/lyydsheep/Copyability
// @supportURL   https://github.com/lyydsheep/Copyability/issues
// @match        https://my.feishu.cn/wiki/*
// @run-at       document-start
// @grant        none
// @updateURL    https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js
// @downloadURL  https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js
// ==/UserScript==

(() => {
  "use strict";

  let pendingPlainText = null;
  let copySucceeded = false;
  let failureTimer = null;

  const showCopyFailure = () => {
    document.querySelector('[data-copyability-feedback="error"]')?.remove();

    const feedback = document.createElement("div");
    feedback.dataset.copyabilityFeedback = "error";
    feedback.setAttribute("role", "alert");
    feedback.textContent = "Copy failed. Please try again.";
    Object.assign(feedback.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      padding: "8px 12px",
      borderRadius: "6px",
      color: "white",
      background: "#c9372c",
      font: "14px/20px system-ui, sans-serif",
    });
    document.documentElement.append(feedback);

    if (failureTimer !== null) clearTimeout(failureTimer);
    failureTimer = setTimeout(() => {
      feedback.remove();
      failureTimer = null;
    }, 1_500);
  };

  const supportedBlockSelector = [
    '.block[data-block-type="text"]',
    '.block[data-block-type="heading1"]',
    '.block[data-block-type="heading2"]',
    '.block[data-block-type="heading3"]',
    '.block[data-block-type="bullet"]',
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
      .every(
        (block) =>
          block.dataset.blockType === "page" ||
          block.dataset.blockType === "callout" ||
          block.matches(supportedBlockSelector),
      );
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

    const selectedTextNodes = textNodes.filter(
      (node) => node.textContent?.trim() && range.intersectsNode(node),
    );
    return (
      selectedTextNodes.length > 0 &&
      selectedTextNodes.every((node) => supportedBlockFor(node))
    );
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

      let plainText;
      try {
        plainText = selection.toString();
      } catch {
        showCopyFailure();
        return;
      }
      if (!plainText.trim()) return;

      pendingPlainText = plainText;
      copySucceeded = false;
      try {
        document.execCommand("copy");
      } catch {
        // A rejected clipboard command is handled below as a Copy Failure.
      } finally {
        pendingPlainText = null;
      }

      if (copySucceeded) {
        event.preventDefault();
        event.stopImmediatePropagation();
      } else {
        showCopyFailure();
      }
    },
    true,
  );
})();
