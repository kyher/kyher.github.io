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
          ? "border-purple-400 text-white font-semibold"
          : "border-transparent text-gray-400 hover:text-purple-300"
      }`}
      onClick={onClick}
    >
      {label}
    </li>
  );
}
