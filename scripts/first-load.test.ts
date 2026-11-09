// Runs the inline first-load script from index.html against stubbed browser
// globals. Expected behaviour: specs/001-fix-small-bugs/contracts/first-load-behaviour.md
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import vm from "node:vm";

const html = readFileSync(path.resolve(import.meta.dirname, "../index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "inline first-load script not found in index.html");

type Scenario = {
  url: string;
  saved?: Record<string, string>;
  storageBlocked?: boolean;
  browserLanguage?: string;
  prefersDark?: boolean;
};

const runFirstLoad = ({
  url,
  saved = {},
  storageBlocked = false,
  browserLanguage = "en-GB",
  prefersDark = false,
}: Scenario) => {
  const start = new URL(url, "https://example.test");
  const location = {
    pathname: start.pathname,
    search: start.search,
    hash: start.hash,
    replace: (target: string) => {
      redirectedTo = target;
    },
  };
  let redirectedTo: string | null = null;

  const store = new Map(Object.entries(saved));
  const blocked = () => {
    throw new Error("storage is blocked");
  };
  const localStorage = {
    getItem: storageBlocked ? blocked : (key: string) => store.get(key) ?? null,
    setItem: storageBlocked ? blocked : (key: string, value: string) => void store.set(key, value),
  };

  const classes = new Set<string>();

  vm.runInNewContext(script, {
    location,
    localStorage,
    navigator: { language: browserLanguage },
    matchMedia: () => ({ matches: prefersDark }),
    document: { documentElement: { classList: { add: (name: string) => classes.add(name) } } },
    history: {
      replaceState: (_state: unknown, _title: string, target: string) => {
        const next = new URL(target, "https://example.test");
        location.pathname = next.pathname;
        location.search = next.search;
        location.hash = next.hash;
      },
    },
    URLSearchParams,
  });

  return {
    redirectedTo,
    saved: Object.fromEntries(store),
    address: location.pathname + location.search + location.hash,
    dark: classes.has("dark"),
  };
};

describe("language at /", () => {
  const rows: Array<Scenario & { name: string; redirectedTo: string | null }> = [
    { name: "lang=en beats saved fr and a French browser", url: "/?lang=en", saved: { language: "fr" }, browserLanguage: "fr-FR", redirectedTo: null },
    { name: "lang=fr beats saved en and an English browser", url: "/?lang=fr", saved: { language: "en" }, redirectedTo: "/fr/" },
    { name: "saved en beats a French browser", url: "/", saved: { language: "en" }, browserLanguage: "fr-FR", redirectedTo: null },
    { name: "saved fr beats an English browser", url: "/", saved: { language: "fr" }, redirectedTo: "/fr/" },
    { name: "an invalid lang falls back to saved en", url: "/?lang=de", saved: { language: "en" }, browserLanguage: "fr-FR", redirectedTo: null },
    { name: "an invalid lang falls back to saved fr", url: "/?lang=de", saved: { language: "fr" }, redirectedTo: "/fr/?lang=de" },
    { name: "nothing saved follows a French browser", url: "/", browserLanguage: "fr-FR", redirectedTo: "/fr/" },
    { name: "storage blocked follows a French browser", url: "/", storageBlocked: true, browserLanguage: "fr-FR", redirectedTo: "/fr/" },
    { name: "nothing saved stays on English for other browsers", url: "/", browserLanguage: "de-DE", redirectedTo: null },
    { name: "storage blocked stays on English for other browsers", url: "/", storageBlocked: true, browserLanguage: "de-DE", redirectedTo: null },
    { name: "storage blocked still honours lang=en", url: "/?lang=en", storageBlocked: true, browserLanguage: "fr-FR", redirectedTo: null },
  ];

  for (const { name, redirectedTo, ...scenario } of rows) {
    test(name, () => assert.equal(runFirstLoad(scenario).redirectedTo, redirectedTo));
  }

  test("a valid lang is saved", () => {
    assert.equal(runFirstLoad({ url: "/?lang=en", saved: { language: "fr" } }).saved.language, "en");
  });

  test("an invalid lang is not saved", () => {
    assert.equal(runFirstLoad({ url: "/?lang=de" }).saved.language, undefined);
  });
});

describe("language at /fr/", () => {
  test("never redirects, even with English saved", () => {
    assert.equal(runFirstLoad({ url: "/fr/", saved: { language: "en" } }).redirectedTo, null);
  });

  test("saves a valid lang", () => {
    const result = runFirstLoad({ url: "/fr/?lang=fr" });
    assert.equal(result.redirectedTo, null);
    assert.equal(result.saved.language, "fr");
  });
});

describe("address handling", () => {
  test("removes lang and keeps other parameters and the anchor once saved", () => {
    assert.equal(runFirstLoad({ url: "/?lang=en&a=1#x" }).address, "/?a=1#x");
  });

  test("leaves no stray characters when lang was the only parameter", () => {
    assert.equal(runFirstLoad({ url: "/?lang=en" }).address, "/");
  });

  test("keeps lang in the address when it could not be saved", () => {
    assert.equal(runFirstLoad({ url: "/?lang=en", storageBlocked: true }).address, "/?lang=en");
  });

  test("leaves an invalid lang in the address", () => {
    assert.equal(runFirstLoad({ url: "/?lang=de" }).address, "/?lang=de");
  });

  test("a redirect keeps query parameters and the anchor", () => {
    assert.equal(runFirstLoad({ url: "/?a=1#x", browserLanguage: "fr-FR" }).redirectedTo, "/fr/?a=1#x");
  });

  test("a redirect adds no stray characters", () => {
    assert.equal(runFirstLoad({ url: "/", browserLanguage: "fr-FR" }).redirectedTo, "/fr/");
  });
});

describe("theme", () => {
  test("storage blocked follows a dark system", () => {
    assert.equal(runFirstLoad({ url: "/", storageBlocked: true, prefersDark: true }).dark, true);
  });

  test("storage blocked follows a light system", () => {
    assert.equal(runFirstLoad({ url: "/", storageBlocked: true, prefersDark: false }).dark, false);
  });

  test("saved light beats a dark system", () => {
    assert.equal(runFirstLoad({ url: "/", saved: { theme: "light" }, prefersDark: true }).dark, false);
  });

  test("saved dark beats a light system", () => {
    assert.equal(runFirstLoad({ url: "/", saved: { theme: "dark" }, prefersDark: false }).dark, true);
  });

  test("nothing saved follows the system", () => {
    assert.equal(runFirstLoad({ url: "/", prefersDark: true }).dark, true);
    assert.equal(runFirstLoad({ url: "/", prefersDark: false }).dark, false);
  });
});
