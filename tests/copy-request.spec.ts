import { expect, test } from "@playwright/test";
import path from "node:path";

const fixtureUrl = "http://127.0.0.1:4173";
const userscriptPath = path.resolve("copyability.user.js");

for (const { name, shortcut } of [
  { name: "Ctrl+C", shortcut: "Control+C" },
  { name: "Cmd+C", shortcut: "Meta+C" },
]) {
  test(`${name} copies an exact Plain-text Copy Result and suppresses the host denial`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ permissions: ["clipboard-read"] });
    await context.addInitScript({ path: userscriptPath });
    const page = await context.newPage();
    await page.goto(fixtureUrl);

    await page.locator("#supported-selection").selectText();
    await page.keyboard.press(shortcut);

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("A complete paragraph for an authorized viewer.");
    await expect(page.locator("#host-denial")).toBeHidden();

    await context.close();
  });
}
