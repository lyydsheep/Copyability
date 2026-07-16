import { expect, test } from "@playwright/test";
import AdmZip from "adm-zip";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

test("builds a Chrome Web Store upload with only extension runtime files", async () => {
  await execFileAsync("npm", ["run", "build:extension"], {
    cwd: path.resolve("."),
  });

  const archive = new AdmZip(
    path.resolve("dist/copyability-extension-0.2.1.zip"),
  );
  expect(archive.getEntries().map(({ entryName }) => entryName).sort()).toEqual([
    "content.js",
    "icons/icon-128.png",
    "icons/icon-16.png",
    "icons/icon-32.png",
    "icons/icon-48.png",
    "manifest.json",
  ]);

  const manifest = JSON.parse(
    archive.readAsText(archive.getEntry("manifest.json")!),
  );
  expect(manifest).toMatchObject({
    manifest_version: 3,
    name: "Copyability",
    version: "0.2.1",
  });
});
