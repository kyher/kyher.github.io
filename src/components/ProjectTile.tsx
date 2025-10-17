export default function ProjectTile({ name, link, stack, description }: { name: string; link: string; stack: string; description: string; }) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
            <p className="text-xl font-bold mb-2">{name}</p>
            <a href={link}>Link</a>
            <p className="text-gray-600 mb-2">{stack}</p>
            <p>{description}</p>
        </div>
    )
}   