export default function NavItem({
  id,
  controls,
  label,
  isActive,
  onClick,
}: {
  id: string;
  controls: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <li role="presentation">
      <button
        id={id}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={controls}
        tabIndex={isActive ? 0 : -1}
        className={`text-lg cursor-pointer pb-1 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm ${
          isActive
            ? "border-purple-600 dark:border-purple-400 text-gray-900 dark:text-white font-semibold"
            : "border-transparent text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300"
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  );
}
