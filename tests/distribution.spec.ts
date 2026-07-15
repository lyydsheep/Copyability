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
  expect(
    directives.filter(({ name }) =>
      ["connect", "downloadURL", "require", "resource", "updateURL"].includes(
        name,
      ),
    ),
  ).toEqual([]);
});

test("distributed body has no network, persistence, logging, or remote-code capability", async () => {
  const { body } = await readUserscript();
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

  for (const [capability, pattern] of forbiddenCapabilities) {
    expect(body, `unexpected ${capability}`).not.toMatch(pattern);
  }
});
