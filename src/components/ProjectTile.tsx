export default function ProjectTile({
  name,
  stack,
  description,
  repo,
  highlight,
}: {
  name: string;
  stack: string;
  description: string;
  repo: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg p-4 shadow-xl hover:scale-105 bg-gray-800/80 transition-transform ${highlight ? "ring-2 ring-blue-500" : ""}`}
    >
      <a
        href={repo}
        className="text-xl font-bold mb-2 hover:underline"
        target="_blank"
      >
        {name}
      </a>
      <p className="text-gray-400 mb-2">{stack}</p>
      <p>{description}</p>
    </div>
  );
}
