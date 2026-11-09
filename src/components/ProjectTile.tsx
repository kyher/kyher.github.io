import { useTranslation } from "react-i18next";

export default function ProjectTile({
  name,
  stack,
  description,
  href,
  highlight,
  image,
}: {
  name: string;
  stack: string;
  description: string;
  href?: string;
  highlight?: boolean;
  image: string;
}) {
  const { t } = useTranslation();
  const className = `project-card ${highlight ? "project-featured" : ""}`;
  const content = (
    <>
      <img
        src={`/${image}`}
        alt={t("a11y.projectScreenshot", { name })}
        className="project-image"
        width={1200}
        height={640}
        loading="lazy"
        decoding="async"
      />
      <div className="project-body">
        <h3 className="project-name">{name}</h3>
        <p className="project-stack">{stack}</p>
        <p className="project-description">{description}</p>
      </div>
    </>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
