import files from "virtual:lookbook-files";
import { lookbook as lookbookMeta } from "./data";

const FOLDER_TITLES = {
  Designs: { en: "Designs", ar: "تصميمات" },
  "From Reality": { en: "From Reality", ar: "من الواقع" },
};

function folderOf(section) {
  return section.folder ?? section.title.replace(/\s*&\s*/g, " and ");
}

function key(name) {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/es$/, "")
    .replace(/s$/, "");
}

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function displayName(folder) {
  return folder.replace(/_/g, " ");
}

function titlesFor(folder, meta = {}) {
  const mapped = FOLDER_TITLES[folder];
  return {
    title: meta.title ?? mapped?.en ?? displayName(folder),
    titleAr: meta.titleAr ?? mapped?.ar ?? displayName(folder),
  };
}

function toSlides(id, title, urls) {
  return (urls || []).map((src, i) => ({
    id: `${id}-${i}`,
    src,
    alt: `${title} ${i + 1}`,
  }));
}

function findNode(tree, section) {
  const want = folderOf(section);
  if (tree[want]) return { name: want, node: tree[want] };
  const wantKey = key(want);
  for (const [name, node] of Object.entries(tree)) {
    if (key(name) === wantKey) return { name, node };
  }
  return null;
}

function hydrate(id, folder, node, meta = {}) {
  const { title, titleAr } = titlesFor(folder, meta);
  const children = Object.entries(node.children || {}).map(([name, child]) =>
    hydrate(`${id}/${slug(name)}`, name, child)
  );
  return {
    id,
    folder,
    title,
    titleAr,
    slides: toSlides(id, title, node.images),
    children,
  };
}

export function gloriesSections() {
  const tree = files && typeof files === "object" ? files : {};
  const known = new Set();
  const sections = lookbookMeta.map((s) => {
    const found = findNode(tree, s);
    const folder = found?.name ?? folderOf(s);
    known.add(key(folder));
    const node = found?.node ?? { images: [], children: {} };
    return hydrate(s.id, folder, node, s);
  });

  for (const name of Object.keys(tree).sort((a, b) => a.localeCompare(b))) {
    if (known.has(key(name))) continue;
    sections.push(hydrate(slug(name), name, tree[name]));
  }

  return sections;
}

export function leafOf(section, subId, partId) {
  const subs = section.children || [];
  const sub = subs.find((s) => s.id === subId) ?? subs[0];
  if (!sub) return section;
  const parts = sub.children || [];
  const part = parts.find((p) => p.id === partId) ?? parts[0];
  return part ?? sub;
}
