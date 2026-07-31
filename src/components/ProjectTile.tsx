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
    <a
      href={repo}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-lg shadow-sm dark:shadow-xl hover:scale-105 bg-white border border-gray-200 dark:bg-gray-800/80 dark:border-transparent transition-transform overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
    >
      {image ? (
        <img
          src={image}
          alt={`${name} screenshot`}
          className={`w-full object-cover object-top ${highlight ? "h-64" : "h-32"}`}
        />
      ) : (
        <div
          className={`w-full bg-gradient-to-br ${gradient} flex items-center justify-center ${highlight ? "h-64" : "h-32"}`}
        >
          <span className="text-4xl font-bold text-white/20 select-none">
            {name[0]}
          </span>
        </div>
      )}
      <div className="p-4">
        <span className="block text-xl font-bold mb-2 group-hover:underline">
          {name}
        </span>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{stack}</p>
        <p>{description}</p>
      </div>
    </a>
  );
}
