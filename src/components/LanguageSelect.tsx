import { useTranslation } from "react-i18next";

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  return (
    <select
      className="bg-gray-700 text-white rounded p-1 mb-4 hover:cursor-pointer"
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
      }}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
