export const languageLocales = { en: "en-GB", fr: "fr-FR" } as const;
export type SupportedLanguage = keyof typeof languageLocales;

export const resolveLanguage = (language?: string): SupportedLanguage =>
  language === "fr" ? "fr" : "en";
