// Tiny static server for out/ with clean URLs (/page -> page.html), like Vercel. Sends the same headers as vercel.json, so tests run under the live CSP. No packages.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.argv[2] ?? 3411);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json", ".ico": "image/x-icon" };

const headers = Object.fromEntries(JSON.parse(await readFile(join(process.cwd(), "vercel.json"), "utf8")).headers[0].headers.map((h) => [h.key, h.value]));

const isFile = (p) => stat(p).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const base = join(root, normalize(url).replace(/^(\.\.[/\\])+/, ""));
  for (const p of [base, `${base}.html`, join(base, "index.html")]) {
    if (p.startsWith(root) && (await isFile(p))) {
      res.writeHead(200, { ...headers, "content-type": types[extname(p)] ?? "application/octet-stream" });
      return res.end(await readFile(p));
    }
  }
  res.writeHead(404, { ...headers, "content-type": "text/html" });
  res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
}).listen(port, "127.0.0.1", () => console.log(`out/ on http://127.0.0.1:${port}`));
