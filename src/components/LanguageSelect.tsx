import { useTranslation } from "react-i18next";

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <label
        htmlFor="language-select"
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        {t("language.select")}
      </label>
      <select
        id="language-select"
        value={i18n.resolvedLanguage}
        className="text-sm bg-transparent text-gray-900 dark:text-white rounded hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        onChange={(e) => {
          i18n.changeLanguage(e.target.value);
        }}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}
