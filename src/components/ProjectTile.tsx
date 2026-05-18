export default function ProjectTile({
  name,
  stack,
  description,
  repo,
  highlight,
  image,
  gradient = "from-gray-600 to-gray-700",
}: {
  name: string;
  stack: string;
  description: string;
  repo: string;
  highlight?: boolean;
  image?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg shadow-sm dark:shadow-xl hover:scale-105 bg-white border border-gray-200 dark:bg-gray-800/80 dark:border-transparent transition-transform overflow-hidden ${highlight ? "ring-2 ring-blue-500" : ""}`}
    >
      {image ? (
        <img src={image} alt={`${name} screenshot`} className="w-full h-32 object-cover" />
      ) : (
        <div className={`w-full h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-4xl font-bold text-white/20 select-none">{name[0]}</span>
        </div>
      )}
      <div className="p-4">
        <a
          href={repo}
          className="text-xl font-bold mb-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{stack}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
