// Local-only HTTP server. The repository prefix intentionally mirrors GitHub Pages.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const prefix = "/battery-panic-game/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname,
  );
  if (pathname === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }
  if (!pathname.startsWith(prefix)) {
    res.writeHead(404);
    return res.end("Use " + prefix);
  }
  const file = path.resolve(
    root,
    pathname.slice(prefix.length) || "index.html",
  );
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
server.listen(4173, "127.0.0.1", () =>
  console.log("Local arcade: http://127.0.0.1:4173" + prefix),
);
