import { useEffect, useState } from "react";
import "./App.css";
import ProjectTile from "./components/ProjectTile";
import ThemeToggle from "./components/ThemeToggle";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";

const skills = [
  "TypeScript", "PHP", "React", "Vue", "Next.js", "Inertia.js", "Laravel",
  "Symfony", "Tailwind CSS", "AI", "HTML", "CSS", "Tanstack Start",
];

const formatRange = (start: string, end: string | null, locale: string, present: string) => {
  const formatMonth = (value: string) => new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
  return `${formatMonth(start)} – ${end ? formatMonth(end) : present}`;
};

const experience = [
  {
    company: "Komodo Digital",
    period: ["2020-02", null] as const,
    roles: [
      { title: "Senior Software Engineer", dates: ["2026-03", null] as const },
      { title: "Software Engineer", dates: ["2023-04", "2026-03"] as const },
      { title: "Software QA Engineer", dates: ["2021-04", "2023-04"] as const },
      { title: "Associate Software Quality Assurance Engineer", dates: ["2020-02", "2021-04"] as const },
    ],
  },
  {
    company: "Accenture",
    period: ["2014-09", "2020-02"] as const,
    roles: [
      { title: "Application Support Engineer", dates: ["2017-09", "2020-02"] as const },
      { title: "Associate Software Engineer", type: "apprenticeship", dates: ["2014-09", "2017-09"] as const },
    ],
  },
];

function App() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "fr" ? "fr-FR" : "en-GB";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const featured = [
    { name: "BetaReadr", descriptionKey: "betareadr", href: "https://betareadr-dev.on-forge.com/", stack: "Laravel, Vue, Inertia, TypeScript", image: "betareadr.png", gradient: "from-purple-600 to-fuchsia-700", highlight: true },
    { name: "Cochonnet", descriptionKey: "cochonnet", href: "https://github.com/kyher/cochonnet", stack: "Vite, React, TypeScript", image: "cochonnet.png", gradient: "from-stone-500 to-amber-700" },
    { name: "C'est moi le chef", descriptionKey: "cest-moi-le-chef", href: "https://github.com/kyher/cest-moi-le-chef", stack: "Tanstack Start, TypeScript", image: "cestmoilechef.png", gradient: "from-orange-500 to-red-600" },
  ];
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kyle Heron home">KH<span>.</span></a>
        <div className="header-tools">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          <span className="h-5 w-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
          <LanguageSelect />
        </div>
      </header>

      <nav className="main-nav" aria-label={t("nav.ariaLabel")}>
        <a href="#about">{t("nav.home")}</a>
        <a href="#projects">{t("nav.projects")}</a>
        <a href="#contact">{t("nav.contact")}</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy-block" id="about">
          <p className="eyebrow">Kyle Heron</p>
          <h1>{t("hero.title")}</h1>
          <p className="hero-copy">{t("profile.description")}</p>
          <div className="hero-actions">
            <a className="button" href="mailto:kyleheron4@gmail.com">{t("contact.email")}</a>
            <a className="button button-secondary" href="#experience">{t("hero.viewExperience")}</a>
          </div>
        </div>
        <div className="hero-photo-wrap">
          <img src="profile.jpg" alt="Kyle Heron" className="hero-photo" />
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-heading">
          <div><p className="eyebrow">{t("experience.eyebrow")}</p><h2>{t("experience.title")}</h2></div>
        </div>
        <div className="experience-list">
          {experience.map((job) => (
            <article className="employer" key={job.company}>
              <div className="employer-heading">
                <h3>{job.company}</h3>
                <p>{formatRange(job.period[0], job.period[1], locale, t("experience.present"))}</p>
                <p>{t("experience.location")}</p>
              </div>
              <ol className="role-list">
                {job.roles.map((role) => (
                  <li className="role" key={role.title}>
                    <h4>{role.title}</h4>
                    {role.type && <p>{t(`experience.types.${role.type}`)}</p>}
                    <p>{formatRange(role.dates[0], role.dates[1], locale, t("experience.present"))}</p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
        <div className="education">
          <p className="eyebrow">{t("education.eyebrow")}</p>
          <h3>{t("education.university")}</h3>
          <p>{t("education.degree")}</p>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-heading">
          <div><p className="eyebrow">{t("projects.eyebrow")}</p><h2>{t("projects.title")}</h2><p>{t("projects.description")}</p></div>
        </div>
        <div className="featured-projects">
          <ProjectTile {...featured[0]} description={t(`projects.${featured[0].descriptionKey}`)} />
          <div className="featured-secondary">
            {featured.slice(1).map((project) => (
              <ProjectTile key={project.name} {...project} description={t(`projects.${project.descriptionKey}`)} />
            ))}
          </div>
        </div>
        <p className="github-more"><a className="text-link" href="https://github.com/kyher" target="_blank" rel="noopener noreferrer">{t("projects.github")}</a></p>
      </section>

      <section className="section" id="skills">
        <div className="section-heading">
          <div><p className="eyebrow">{t("skills.eyebrow")}</p><h2>{t("skills.title")}</h2></div>
        </div>
        <div className="skills-list">
          {skills.map((skill) => <span className="skill" key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="contact-panel">
          <div><p className="eyebrow">{t("contact.eyebrow")}</p><h2>{t("contact.title")}</h2><p>{t("contact.description")}</p></div>
          <div className="contact-links">
            <a className="button" href="mailto:kyleheron4@gmail.com">{t("contact.email")}</a>
            <a href="https://github.com/kyher" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/kyher/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>
      <footer className="site-footer">© {new Date().getFullYear()} Kyle Heron</footer>
    </main>
  );
}

export default App;
