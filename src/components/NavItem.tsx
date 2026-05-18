export default function NavItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <li
      className={`text-lg cursor-pointer pb-1 transition-colors border-b-2 ${
        isActive
          ? "border-purple-600 dark:border-purple-400 text-gray-900 dark:text-white font-semibold"
          : "border-transparent text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300"
      }`}
      onClick={onClick}
    >
      {label}
    </li>
  );
}
