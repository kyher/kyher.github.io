export default function ProjectTile({
  name,
  stack,
  description,
  href,
  highlight,
  image,
  gradient = "from-gray-600 to-gray-700",
}: {
  name: string;
  stack: string;
  description: string;
  href: string;
  highlight?: boolean;
  image?: string;
  gradient?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card ${highlight ? "project-featured" : ""}`}
    >
      {image ? (
        <img
          src={image}
          alt={`${name} screenshot`}
          className="project-image"
        />
      ) : (
        <div
          className={`project-art bg-gradient-to-br ${gradient}`}
          aria-hidden="true"
        >
          {name[0]}
        </div>
      )}
      <div className="project-body">
        <h3 className="project-name">{name}</h3>
        <p className="project-stack">{stack}</p>
        <p className="project-description">{description}</p>
      </div>
    </a>
  );
}
