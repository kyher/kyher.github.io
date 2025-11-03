export default function ProjectTile({
  name,
  link,
  stack,
  description,
  repo,
}: {
  name: string;
  link: string;
  stack: string;
  description: string;
  repo: string;
}) {
  return (
    <div className="flex flex-col rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-gray-800/50">
      <a
        href={link}
        className="text-xl font-bold mb-2 hover:underline"
        target="_blank"
      >
        {name}
      </a>
      <a href={repo} target="_blank" className="hover:underline">
        GitHub Repo
      </a>
      <p className="text-gray-600 mb-2">{stack}</p>
      <p>{description}</p>
    </div>
  );
}
