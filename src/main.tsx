import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";
import { languageFromPath } from "./helpers/language";

const app = <Root language={languageFromPath(window.location.pathname)} />;
const container = document.getElementById("root")!;

// Production pages are prerendered (see scripts/prerender.ts); the dev server isn't.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
