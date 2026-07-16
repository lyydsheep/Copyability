import AdmZip from "adm-zip";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const extensionDirectory = path.join(root, "extension");
const manifest = JSON.parse(
  await readFile(path.join(extensionDirectory, "manifest.json"), "utf8"),
);
const outputDirectory = path.join(root, "dist");
const outputPath = path.join(
  outputDirectory,
  `copyability-extension-${manifest.version}.zip`,
);

await mkdir(outputDirectory, { recursive: true });

const archive = new AdmZip();
for (const name of [
  "manifest.json",
  "content.js",
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
]) {
  archive.addFile(name, await readFile(path.join(extensionDirectory, name)));
}
archive.writeZip(outputPath);

console.log(path.relative(root, outputPath));
