import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const fixtureUrl = "http://127.0.0.1:4173";
const userscriptPath = path.resolve("copyability.user.js");
const copyabilityTest = test.extend<{ copyabilityPage: Page }>({
  copyabilityPage: async ({ browser }, use) => {
    const context = await browser.newContext({ permissions: ["clipboard-read"] });
    await context.addInitScript({ path: userscriptPath });
    const page = await context.newPage();
    await page.goto(fixtureUrl);

    await use(page);
    await context.close();
  },
});

const expectNoCopyabilityFeedback = async (page: Page) => {
  expect(await page.locator("[data-copyability-feedback]").count()).toBe(0);
};

const expectHostCopyEvents = async (page: Page, count: number) => {
  await expect(page.locator("#host-copy-events")).toHaveText(String(count));
};

for (const { name, shortcut } of [
  { name: "Ctrl+C", shortcut: "Control+C" },
  { name: "Cmd+C", shortcut: "Meta+C" },
]) {
  copyabilityTest(`${name} copies an exact Plain-text Copy Result and suppresses the host denial`, async ({
    copyabilityPage,
  }) => {
    await copyabilityPage.locator("#supported-selection .ace-line").selectText();
    await copyabilityPage.keyboard.press(shortcut);

    await expect
      .poll(() => copyabilityPage.evaluate(() => navigator.clipboard.readText()))
      .toBe("A complete paragraph for an authorized viewer.");
    await expect(copyabilityPage.locator("#host-denial")).toBeHidden();
    await expectNoCopyabilityFeedback(copyabilityPage);
    await expectHostCopyEvents(copyabilityPage, 0);
  });
}

for (const { blockType, selector, expectedText } of [
  {
    blockType: "heading1",
    selector: "#heading1-selection .ace-line",
    expectedText: "A visible level-one heading",
  },
  {
    blockType: "heading2",
    selector: "#heading-selection .ace-line",
    expectedText: "A visible section heading",
  },
  {
    blockType: "heading3",
    selector: "#heading3-selection .ace-line",
    expectedText: "A visible level-three heading",
  },
]) {
  copyabilityTest(`copies a ${blockType} as a Plain-text Copy Result`, async ({
    copyabilityPage,
  }) => {
    await copyabilityPage.locator(selector).selectText();
    await copyabilityPage.keyboard.press("Meta+C");

    await expect
      .poll(() => copyabilityPage.evaluate(() => navigator.clipboard.readText()))
      .toBe(expectedText);
    await expect(copyabilityPage.locator("#host-denial")).toBeHidden();
  });
}

copyabilityTest("copies an ordinary bullet item as a Plain-text Copy Result", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.locator("#bullet-selection .ace-line").selectText();
  await copyabilityPage.keyboard.press("Meta+C");

  await expect
    .poll(() => copyabilityPage.evaluate(() => navigator.clipboard.readText()))
    .toBe("A visible bullet item");
  await expect(copyabilityPage.locator("#host-denial")).toBeHidden();
});

copyabilityTest("copies a contiguous Supported Selection in reading order with meaningful line breaks", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.evaluate(() => {
    const firstLine = document.querySelector("#heading-selection .ace-line");
    const lastLine = document.querySelector("#second-bullet .ace-line");
    if (!firstLine || !lastLine) throw new Error("Fixture lines are missing");

    const range = document.createRange();
    range.setStart(firstLine, 0);
    range.setEnd(lastLine, lastLine.childNodes.length);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await copyabilityPage.keyboard.press("Meta+C");

  await expect
    .poll(() => copyabilityPage.evaluate(() => navigator.clipboard.readText()))
    .toBe(
      [
        "A visible section heading",
        "A complete paragraph for an authorized viewer.",
        "A second visible paragraph.",
        "A visible bullet item",
        "A second visible bullet item",
      ].join("\n"),
    );
  await expect(copyabilityPage.locator("#host-denial")).toBeHidden();
});

copyabilityTest("leaves a table descendant outside Supported Selection behavior", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.locator("#table-selection .ace-line").selectText();
  await copyabilityPage.keyboard.press("Meta+C");

  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectNoCopyabilityFeedback(copyabilityPage);
  await expectHostCopyEvents(copyabilityPage, 1);
});

copyabilityTest("leaves a selection crossing a non-line unsupported block to the host", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.evaluate(() => {
    const firstLine = document.querySelector("#before-code .ace-line");
    const lastLine = document.querySelector("#after-code .ace-line");
    if (!firstLine || !lastLine) throw new Error("Fixture lines are missing");

    const range = document.createRange();
    range.setStart(firstLine, 0);
    range.setEnd(lastLine, lastLine.childNodes.length);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await copyabilityPage.keyboard.press("Meta+C");

  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectNoCopyabilityFeedback(copyabilityPage);
  await expectHostCopyEvents(copyabilityPage, 1);
});

copyabilityTest("leaves the native copy behavior alone when there is no selection", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.keyboard.press("Meta+C");

  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectNoCopyabilityFeedback(copyabilityPage);
  await expectHostCopyEvents(copyabilityPage, 1);
});

copyabilityTest("leaves a whitespace-only selection outside Copy Request behavior", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.evaluate(() => {
    const line = document.querySelector("#supported-selection .ace-line");
    const text = line?.firstChild;
    if (!text?.textContent) throw new Error("Fixture text is missing");

    const range = document.createRange();
    range.setStart(text, text.textContent.length - 1);
    range.setEnd(text, text.textContent.length);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await copyabilityPage.keyboard.press("Meta+C");

  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectNoCopyabilityFeedback(copyabilityPage);
  await expectHostCopyEvents(copyabilityPage, 1);
});

for (const { structure, selector } of [
  { structure: "code block", selector: "#code-selection pre" },
  { structure: "comment", selector: "#comment-selection .ace-line" },
  { structure: "whiteboard", selector: "#whiteboard-selection .ace-line" },
  { structure: "embedded sheet", selector: "#sheet-selection .ace-line" },
  { structure: "embedded application", selector: "#app-selection .ace-line" },
]) {
  copyabilityTest(`leaves ${structure} text outside Supported Selection behavior`, async ({
    copyabilityPage,
  }) => {
    await copyabilityPage.locator(selector).selectText();
    await copyabilityPage.keyboard.press("Meta+C");

    await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
    await expectNoCopyabilityFeedback(copyabilityPage);
    await expectHostCopyEvents(copyabilityPage, 1);
  });
}

copyabilityTest("leaves image-only content outside Supported Selection behavior", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.evaluate(() => {
    const image = document.querySelector("#image-only-selection img");
    if (!image) throw new Error("Fixture image is missing");

    const range = document.createRange();
    range.selectNode(image);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await copyabilityPage.keyboard.press("Meta+C");

  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectNoCopyabilityFeedback(copyabilityPage);
  await expectHostCopyEvents(copyabilityPage, 1);
});

copyabilityTest("briefly reports a Copy Failure when a Supported Selection cannot be extracted", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.locator("#supported-selection .ace-line").selectText();
  await copyabilityPage.evaluate(() => {
    Selection.prototype.toString = () => {
      throw new DOMException("Fixture extraction failure");
    };
  });

  await copyabilityPage.keyboard.press("Meta+C");

  const failure = copyabilityPage.locator('[data-copyability-feedback="error"]');
  await expect(failure).toHaveText("Copy failed. Please try again.");
  await expect(failure).toBeVisible();
  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectHostCopyEvents(copyabilityPage, 1);
  await expect(failure).toBeHidden({ timeout: 3_000 });
});

copyabilityTest("briefly reports a Copy Failure when the clipboard write cannot run", async ({
  copyabilityPage,
}) => {
  await copyabilityPage.locator("#supported-selection .ace-line").selectText();
  await copyabilityPage.evaluate(() => {
    document.execCommand = () => false;
  });

  await copyabilityPage.keyboard.press("Meta+C");

  const failure = copyabilityPage.locator('[data-copyability-feedback="error"]');
  await expect(failure).toHaveText("Copy failed. Please try again.");
  await expect(failure).toBeVisible();
  await expect(copyabilityPage.locator("#host-denial")).toBeVisible();
  await expectHostCopyEvents(copyabilityPage, 1);
  await expect(failure).toBeHidden({ timeout: 3_000 });
});
