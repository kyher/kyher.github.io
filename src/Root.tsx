import { StrictMode, useState } from "react";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import { createI18n } from "./i18n";
import type { SupportedLanguage } from "./helpers/language";

// Shared by the client entry and the prerenderer so both render the same tree.
export default function Root({ language }: { language: SupportedLanguage }) {
  const [i18n] = useState(() => createI18n(language));
  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StrictMode>
  );
}
