export const languageLocales = { en: "en-GB", fr: "fr-FR" } as const;
export type SupportedLanguage = keyof typeof languageLocales;

// Each language is served from its own URL so it can be prerendered and indexed.
export const languagePaths: Record<SupportedLanguage, string> = { en: "/", fr: "/fr/" };
export const languages = Object.keys(languagePaths) as SupportedLanguage[];

export const resolveLanguage = (language?: string): SupportedLanguage =>
  language === "fr" ? "fr" : "en";

export const languageFromPath = (pathname: string): SupportedLanguage =>
  pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
