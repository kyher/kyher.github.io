import { useSyncExternalStore } from "react";
import "./App.css";
import ProjectTile from "./components/ProjectTile";
import ThemeToggle from "./components/ThemeToggle";
import { Trans, useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";
import { languageLocales, resolveLanguage } from "./helpers/language";
import { formatRange } from "./helpers/date";
import { experience, featured, skills } from "./data/portfolio";

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const isDarkTheme = () => document.documentElement.classList.contains("dark");

const setTheme = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Storage can be unavailable; the theme still applies for this visit.
  }
};

function App() {
  const isDark = useSyncExternalStore(subscribeToTheme, isDarkTheme, () => false);
  const { t, i18n } = useTranslation();
  const locale = languageLocales[resolveLanguage(i18n.resolvedLanguage)];

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top">KH<span aria-hidden="true">.</span><span className="sr-only"> — {t("a11y.home")}</span></a>
        <div className="header-tools">
          <ThemeToggle isDark={isDark} onToggle={() => setTheme(!isDark)} />
          <span className="h-5 w-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
          <LanguageSelect />
        </div>
      </header>

      <nav className="main-nav" aria-label={t("nav.ariaLabel")}>
        <a href="#about">{t("nav.home")}</a>
        <a href="#experience">{t("nav.experience")}</a>
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
          <img src="/profile.webp" alt="Kyle Heron" className="hero-photo" width={660} height={880} fetchPriority="high" />
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
                    {"type" in role && <p>{t(`experience.types.${role.type}`)}</p>}
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
          <div><p className="eyebrow">{t("projects.eyebrow")}</p><h2>{t("projects.title")}</h2><p><Trans i18nKey="projects.description" components={{ specKit: <a href="https://github.com/github/spec-kit" target="_blank" rel="noopener noreferrer" />, grillWithDocs: <a href="https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs" target="_blank" rel="noopener noreferrer" /> }} /></p></div>
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
      <footer className="site-footer" suppressHydrationWarning>© {new Date().getFullYear()} Kyle Heron</footer>
    </main>
  );
}

export default App;
