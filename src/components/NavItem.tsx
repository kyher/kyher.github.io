export default function NavItem({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <li className={`hover:bg-purple-700 rounded text-lg cursor-pointer p-4 ${isActive ? 'font-bold bg-purple-900' : ''}`} onClick={onClick}>
            {label}
        </li>
    );
}