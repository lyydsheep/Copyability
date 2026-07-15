import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const fixturePath = fileURLToPath(new URL("./index.html", import.meta.url));

createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  createReadStream(fixturePath).pipe(response);
}).listen(4173, "127.0.0.1");
