import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOOKBOOK_ROOT = path.join(__dirname, "public", "lookbook");
const VIRTUAL = "virtual:lookbook-files";
const RESOLVED = "\0" + VIRTUAL;
const IMAGE = /\.(png|jpe?g|webp|gif)$/i;

function publicUrl(parts) {
  return "/" + parts.map(encodeURIComponent).join("/");
}

function scanNode(abs, urlParts) {
  if (!fs.existsSync(abs)) return { images: [], children: {} };
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  const images = entries
    .filter((e) => e.isFile() && IMAGE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((name) => publicUrl([...urlParts, name]));
  const children = {};
  for (const dir of entries) {
    if (!dir.isDirectory() || dir.name.startsWith("_")) continue;
    children[dir.name] = scanNode(path.join(abs, dir.name), [...urlParts, dir.name]);
  }
  return { images, children };
}

function scanLookbook() {
  if (!fs.existsSync(LOOKBOOK_ROOT)) return {};
  const tree = {};
  for (const dir of fs.readdirSync(LOOKBOOK_ROOT, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith("_")) continue;
    tree[dir.name] = scanNode(path.join(LOOKBOOK_ROOT, dir.name), ["lookbook", dir.name]);
  }
  return tree;
}

function lookbookPlugin() {
  const isLookbook = (file) =>
    path.normalize(file).startsWith(path.normalize(LOOKBOOK_ROOT));

  return {
    name: "lookbook-files",
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED;
    },
    load(id) {
      if (id !== RESOLVED) return;
      return `export default ${JSON.stringify(scanLookbook())}`;
    },
    configureServer(server) {
      server.watcher.add(LOOKBOOK_ROOT);
      const reload = (file) => {
        if (!isLookbook(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.reloadModule(mod);
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
      server.watcher.on("addDir", reload);
      server.watcher.on("unlinkDir", reload);
    },
  };
}

export default defineConfig({
  plugins: [react(), lookbookPlugin()],
});
