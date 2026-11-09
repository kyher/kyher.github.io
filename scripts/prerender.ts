// Fills the built index.html with each language's rendered markup and head
// tags, writing dist/index.html (English), dist/fr/index.html (French) and
// dist/404.html (both languages, with no client JavaScript).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type Page = { language: string; output: string; title: string; head: string; html: string; hydrate: boolean };

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
  if (!page.hydrate) html = replaceOnce(html, /<script type="module"[^>]*><\/script>\s*/, "");

  const outFile = path.join(distDir, page.output);
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, html);
  console.log(`prerendered ${page.output}`);
}

await rm(ssrDir, { recursive: true, force: true });
