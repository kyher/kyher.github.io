// Fills the built index.html with each language's rendered markup and head
// tags, writing dist/index.html (English) and dist/fr/index.html (French).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type Page = { language: string; path: string; title: string; head: string; html: string };

const root = path.resolve(import.meta.dirname, "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const entry = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;
const { renderPages } = (await import(entry)) as { renderPages: () => Page[] };
const template = await readFile(path.join(distDir, "index.html"), "utf8");

// Fail the build loudly if index.html drifts away from what we expect.
const replaceOnce = (html: string, search: string | RegExp, value: string) => {
  if (!html.match(search)) throw new Error(`prerender: ${search} not found in index.html`);
  return html.replace(search, () => value);
};

for (const page of renderPages()) {
  let html = template;
  html = replaceOnce(html, '<html lang="en">', `<html lang="${page.language}">`);
  html = replaceOnce(html, /<title>.*?<\/title>/, `<title>${page.title}</title>`);
  html = replaceOnce(html, "<!--app-head-->", page.head);
  html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${page.html}</div>`);

  const outDir = path.join(distDir, page.path);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html);
  console.log(`prerendered ${page.path}`);
}

await rm(ssrDir, { recursive: true, force: true });
