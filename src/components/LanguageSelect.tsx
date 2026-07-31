import { useTranslation } from "react-i18next";

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <label
        htmlFor="language-select"
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        {t("language.select")}
      </label>
      <select
        id="language-select"
        value={i18n.resolvedLanguage}
        className="text-xs bg-gray-100 text-gray-900 border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-transparent rounded p-1 hover:cursor-pointer"
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
