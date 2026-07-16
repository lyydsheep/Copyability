import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const readRepositoryText = (name: string) =>
  readFile(path.resolve(name), "utf8");

const readUserscript = async () => {
  const source = await readRepositoryText("copyability.user.js");
  const metadataMatch = source.match(
    /\/\/ ==UserScript==\n(?<metadata>[\s\S]*?)\/\/ ==\/UserScript==/,
  );
  if (!metadataMatch?.groups) throw new Error("Userscript metadata block is missing");

  const metadata = metadataMatch.groups.metadata;
  const body = source.slice(metadataMatch.index! + metadataMatch[0].length);
  return { metadata, body };
};

test("distribution documentation covers the complete manual lifecycle", async () => {
  const readme = await readRepositoryText("README.md");

  for (const heading of [
    "## Install",
    "## Disable",
    "## Uninstall",
    "## Manual update",
    "## Privacy boundary",
    "## Supported selections",
    "## Copy Failure behavior",
    "## Known limitations",
  ]) {
    expect(readme, `missing ${heading}`).toContain(heading);
  }
});

test("distribution documentation presents direct Tampermonkey installation as the primary carrier", async () => {
  const readme = await readRepositoryText("README.md");
  const privacy = await readRepositoryText("PRIVACY.md");
  const validation = await readRepositoryText(
    "docs/validation/automated-release-validation.md",
  );

  expect(readme).toContain("### Tampermonkey (recommended, free)");
  expect(readme).toContain("Install Copyability");
  expect(readme).toContain("Allow User Scripts");
  expect(readme).toContain("### Chrome extension (optional)");
  expect(readme).toContain("npm run build:extension");
  expect(privacy).toContain(
    "Tampermonkey userscript, with an optional Chrome extension",
  );
  expect(validation).toContain("primary userscript and optional Chrome");
});

test("distributed metadata grants no privileges and matches only Feishu wiki pages", async () => {
  const { metadata } = await readUserscript();
  const directives = [...metadata.matchAll(/^\/\/\s+@(\S+)\s+(.+)$/gm)].map(
    ([, name, value]) => ({ name, value: value.trim() }),
  );

  expect(directives.filter(({ name }) => name === "match")).toEqual([
    { name: "match", value: "https://my.feishu.cn/wiki/*" },
  ]);
  expect(directives.filter(({ name }) => name === "grant")).toEqual([
    { name: "grant", value: "none" },
  ]);
  expect(directives.filter(({ name }) => name === "version")).toEqual([
    { name: "version", value: "0.2.1" },
  ]);
  expect(
    directives.filter(({ name }) => ["updateURL", "downloadURL"].includes(name)),
  ).toEqual([
    {
      name: "updateURL",
      value:
        "https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js",
    },
    {
      name: "downloadURL",
      value:
        "https://github.com/lyydsheep/Copyability/raw/main/copyability.user.js",
    },
  ]);
  expect(
    directives.filter(({ name }) =>
      ["connect", "require", "resource"].includes(name),
    ),
  ).toEqual([]);
});

test("Chrome extension installs with only intended Feishu access", async () => {
  const manifest = JSON.parse(
    await readRepositoryText("extension/manifest.json"),
  );

  expect(manifest.manifest_version).toBe(3);
  expect(manifest.name).toBe("Copyability");
  expect(manifest.permissions ?? []).toEqual([]);
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(manifest.background).toBeUndefined();
  expect(manifest.icons).toEqual({
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  });
  expect(manifest.content_scripts).toEqual([
    {
      matches: ["https://my.feishu.cn/wiki/*"],
      js: ["content.js"],
      run_at: "document_start",
    },
  ]);
});

test("distributed body has no network, persistence, logging, or remote-code capability", async () => {
  const { body: userscriptBody } = await readUserscript();
  const carriers = {
    "Chrome extension": await readRepositoryText("extension/content.js"),
    "Tampermonkey userscript": userscriptBody,
  };
  const forbiddenCapabilities: Array<[string, RegExp]> = [
    [
      "network or upload API",
      /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b|navigator\.sendBeacon/,
    ],
    [
      "persistent browser storage",
      /\b(?:localStorage|sessionStorage|indexedDB)\b|document\.cookie/,
    ],
    ["content logging", /\bconsole\s*\./],
    ["userscript privileged API", /\bGM(?:\.|_)/],
    [
      "third-party JavaScript loading",
      /\bimportScripts\s*\(|\bimport\s*(?:\(|["'{*])|\brequire\s*\(|createElement\(\s*["']script["']|<script\b[^>]*\bsrc\s*=/i,
    ],
  ];

  for (const [carrier, source] of Object.entries(carriers)) {
    for (const [capability, pattern] of forbiddenCapabilities) {
      expect(source, `${carrier}: unexpected ${capability}`).not.toMatch(pattern);
    }
  }
});

test("extension and userscript carriers contain the same runtime", async () => {
  const { body } = await readUserscript();
  const extensionRuntime = await readRepositoryText("extension/content.js");

  expect(extensionRuntime.trim()).toBe(body.trim());
});
