import { useEffect, useState } from "react";
import "./App.css";
import { TABS } from "./helpers/consts";
import AppSection from "./components/AppSection";
import NavItem from "./components/NavItem";
import ProjectTile from "./components/ProjectTile";
import ThemeToggle from "./components/ThemeToggle";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";

const skills = [
  "TypeScript",
  "PHP",
  "React",
  "Vue",
  "Next.js",
  "Inertia.js",
  "Laravel",
  "Symfony",
  "Tailwind CSS",
  "AI",
  "HTML",
  "CSS",
  "Tanstack Start",
];

const tabId = (tab: string) => `tab-${tab.toLowerCase()}`;
const panelId = (tab: string) => `panel-${tab.toLowerCase()}`;

function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const { t } = useTranslation();

  const handleTabListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    let newIndex: number;
    switch (e.key) {
      case "ArrowRight":
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    tabs[newIndex].focus();
    tabs[newIndex].click();
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <main className="max-w-3xl m-auto p-4">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Kyle Heron</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-1">
            <span className="text-purple-600 dark:text-purple-400">›</span>{" "}
            Senior Software Engineer
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          <div
            className="h-5 w-px bg-gray-300 dark:bg-gray-600"
            aria-hidden="true"
          />
          <LanguageSelect />
        </div>
      </div>
      <nav>
        <ul
          role="tablist"
          aria-label={t("nav.ariaLabel")}
          className="flex gap-4 mt-4 justify-center"
          onKeyDown={handleTabListKeyDown}
        >
          <NavItem
            id={tabId(TABS.HOME)}
            controls={panelId(TABS.HOME)}
            label={t("nav.home")}
            isActive={activeTab === TABS.HOME}
            onClick={() => setActiveTab(TABS.HOME)}
          />
          <NavItem
            id={tabId(TABS.PROJECTS)}
            controls={panelId(TABS.PROJECTS)}
            label={t("nav.projects")}
            isActive={activeTab === TABS.PROJECTS}
            onClick={() => setActiveTab(TABS.PROJECTS)}
          />
          <NavItem
            id={tabId(TABS.CONTACT)}
            controls={panelId(TABS.CONTACT)}
            label={t("nav.contact")}
            isActive={activeTab === TABS.CONTACT}
            onClick={() => setActiveTab(TABS.CONTACT)}
          />
        </ul>
      </nav>

      <div
        key={activeTab}
        id={panelId(activeTab)}
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
        tabIndex={0}
        className="tab-content"
      >
        {activeTab === TABS.HOME && (
          <AppSection>
            <img
              src="profile.jpg"
              alt="Profile image of Kyle Heron"
              className="rounded-xl w-64 m-auto my-4 hover:scale-105 transition-transform ring-1 ring-gray-300 dark:ring-gray-600"
            />
            <h2 className="text-purple-600 dark:text-purple-400 text-lg mb-3">
              {t("profile.title")}
            </h2>
            <p>{t("profile.description")}</p>
            <div className="mt-6">
              <h2 className="text-purple-600 dark:text-purple-400 text-lg mb-3">
                {t("skills.title")}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-gray-700 dark:bg-gray-800/60 dark:border-gray-600 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AppSection>
        )}
        {activeTab === TABS.CONTACT && (
          <AppSection>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/kyher"
                className="text-lg underline underline-offset-4 hover:font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="mailto:kyleheron4@gmail.com"
                className="text-lg underline underline-offset-4 hover:font-bold"
              >
                {t("contact.email")}
              </a>
            </div>
          </AppSection>
        )}
        {activeTab === TABS.PROJECTS && (
          <AppSection>
            <div className="my-6">
              <h2 className="text-purple-600 dark:text-purple-400 text-lg mb-3">
                {t("projects.currentTitle")}
              </h2>
              <ProjectTile
                name="BetaReadr"
                description={t("projects.betareadr")}
                href="https://betareadr-dev.on-forge.com/"
                linkLabel={t("projects.developmentPreview")}
                stack="Laravel, Vue, Inertia, TypeScript"
                gradient="from-purple-600 to-fuchsia-700"
                image="betareadr.png"
                highlight
              />
            </div>
            <div className="my-6">
              <h2 className="text-purple-600 dark:text-purple-400 text-lg mb-3">
                {t("projects.otherTitle")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ProjectTile
                  name="Cochonnet"
                  description={t("projects.cochonnet")}
                  href="https://github.com/kyher/cochonnet"
                  stack="Vite, React, TypeScript"
                  gradient="from-stone-500 to-amber-700"
                  image="cochonnet.png"
                />
                <ProjectTile
                  name="C'est moi le chef"
                  description={t("projects.cest-moi-le-chef")}
                  href="https://github.com/kyher/cest-moi-le-chef"
                  stack="Tanstack Start, TypeScript"
                  gradient="from-orange-500 to-red-600"
                  image="cestmoilechef.png"
                />
                <ProjectTile
                  name="myhours"
                  description={t("projects.myhours")}
                  href="https://github.com/kyher/myhours"
                  stack="Tanstack Start, TypeScript, Prisma"
                  gradient="from-violet-600 to-purple-700"
                  image="myhours.png"
                />
                <ProjectTile
                  name="Standupr"
                  description={t("projects.standupr")}
                  href="https://github.com/kyher/standupr"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-blue-600 to-indigo-700"
                  image="standupr.jpg"
                />
                <ProjectTile
                  name="HealthDash"
                  description={t("projects.healthdash")}
                  href="https://github.com/kyher/health-dash"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-emerald-500 to-teal-700"
                />
                <ProjectTile
                  name="Budgetr"
                  description={t("projects.budgetr")}
                  href="https://github.com/kyher/budgetr"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-green-600 to-emerald-800"
                />
                <ProjectTile
                  name="CoupleMDB"
                  description={t("projects.couplemdb")}
                  href="https://github.com/kyher/couplemdb"
                  stack="Next, TypeScript, TailwindCSS, Drizzle, NextAuth"
                  gradient="from-rose-500 to-pink-700"
                />
                <ProjectTile
                  name="I can't type french"
                  description={t("projects.icanttypefrench")}
                  href="https://github.com/kyher/i-cant-type-french"
                  stack="Vite, React, TypeScript"
                  gradient="from-blue-400 to-sky-600"
                />
                <ProjectTile
                  name="TrackStats"
                  description={t("projects.trackstats")}
                  href="https://github.com/kyher/track-stats"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-red-600 to-orange-700"
                />
                <ProjectTile
                  name="EmojiChat"
                  description={t("projects.emojichat")}
                  href="https://github.com/kyher/emoji-chat"
                  stack="Laravel (with Reverb), Vue, Inertia, TypeScript"
                  gradient="from-amber-400 to-yellow-600"
                />
              </div>
            </div>
          </AppSection>
        )}
      </div>
    </main>
  );
}

export default App;
