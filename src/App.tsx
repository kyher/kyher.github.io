import { useState } from "react";
import "./App.css";
import { TABS } from "./helpers/consts";
import AppSection from "./components/AppSection";
import NavItem from "./components/NavItem";
import ProjectTile from "./components/ProjectTile";
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
  "Vite",
];

function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const { t } = useTranslation();
  return (
    <main className="max-w-3xl m-auto p-4">
      <LanguageSelect />
      <h1 className="text-3xl hover:font-bold">Kyle Heron</h1>
      <nav>
        <ul className="flex gap-4 mt-4 justify-center">
          <NavItem
            label={t("nav.home")}
            isActive={activeTab === TABS.HOME}
            onClick={() => setActiveTab(TABS.HOME)}
          />
          <NavItem
            label={t("nav.contact")}
            isActive={activeTab === TABS.CONTACT}
            onClick={() => setActiveTab(TABS.CONTACT)}
          />
          <NavItem
            label={t("nav.projects")}
            isActive={activeTab === TABS.PROJECTS}
            onClick={() => setActiveTab(TABS.PROJECTS)}
          />
        </ul>
      </nav>

      <div key={activeTab} className="tab-content">
        {activeTab === TABS.HOME && (
          <AppSection>
            <img
              src="profile.jpg"
              alt="Profile image of Kyle Heron"
              className="rounded-xl w-64 m-auto my-4 hover:scale-105 transition-transform"
            />
            <p className="hover:font-bold">{t("profile")}</p>
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-3">{t("skills.title")}</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-gray-800/80 px-3 py-1 rounded-full text-gray-300"
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
                href="mailto:kyle.heron@proton.me"
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
              <h2 className="text-xl font-bold my-4">
                {t("projects.currentTitle")}
              </h2>
              <ProjectTile
                name="Standupr"
                description={t("projects.standupr")}
                repo="https://github.com/kyher/standupr"
                stack="Laravel, Vue, Inertia, TypeScript"
                gradient="from-blue-600 to-indigo-700"
                image="standupr.jpg"
                highlight
              />
            </div>
            <div className="my-6">
              <h2 className="text-xl font-bold my-4">
                {t("projects.otherTitle")}
              </h2>
              <div className="flex flex-col gap-4">
                <ProjectTile
                  name="HealthDash"
                  description={t("projects.healthdash")}
                  repo="https://github.com/kyher/health-dash"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-emerald-500 to-teal-700"
                />
                <ProjectTile
                  name="Budgetr"
                  description={t("projects.budgetr")}
                  repo="https://github.com/kyher/budgetr"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-green-600 to-emerald-800"
                />
                <ProjectTile
                  name="CoupleMDB"
                  description={t("projects.couplemdb")}
                  repo="https://github.com/kyher/couplemdb"
                  stack="Next, TypeScript, TailwindCSS, Drizzle, NextAuth"
                  gradient="from-rose-500 to-pink-700"
                />
                <ProjectTile
                  name="I can't type french"
                  description={t("projects.icanttypefrench")}
                  repo="https://github.com/kyher/i-cant-type-french"
                  stack="Vite, React, TypeScript"
                  gradient="from-blue-400 to-sky-600"
                />
                <ProjectTile
                  name="TrackStats"
                  description={t("projects.trackstats")}
                  repo="https://github.com/kyher/track-stats"
                  stack="Laravel, Vue, Inertia, TypeScript"
                  gradient="from-red-600 to-orange-700"
                />
                <ProjectTile
                  name="EmojiChat"
                  description={t("projects.emojichat")}
                  repo="https://github.com/kyher/emoji-chat"
                  stack="Laravel (with Reverb), Vue, Inertia, TypeScript"
                  gradient="from-amber-400 to-yellow-600"
                />
                <ProjectTile
                  name="Recetterie"
                  description={t("projects.recetterie")}
                  repo="https://github.com/kyher/recetterie"
                  stack="Symfony"
                  gradient="from-orange-500 to-amber-700"
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
