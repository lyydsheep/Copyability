import { chromium, expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

test("installed Chrome extension completes a Copy Request without Tampermonkey", async () => {
  const extensionPath = path.resolve("extension");
  const fixture = await readFile(
    path.resolve("tests/fixture/index.html"),
    "utf8",
  );
  const context = await chromium.launchPersistentContext("", {
    channel: "chromium",
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  try {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: "https://my.feishu.cn",
    });
    await context.route(
      "https://my.feishu.cn/wiki/copyability-extension-test",
      (route) =>
        route.fulfill({
          body: fixture,
          contentType: "text/html",
          status: 200,
        }),
    );

    const page = await context.newPage();
    await page.goto("https://my.feishu.cn/wiki/copyability-extension-test");
    await page.locator("#supported-selection .ace-line").selectText();
    await page.keyboard.press("Control+C");

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("A complete paragraph for an authorized viewer.");
    await expect(page.locator("#host-denial")).toBeHidden();
    await expect(page.locator("#host-copy-events")).toHaveText("0");
  } finally {
    await context.close();
  }
});
