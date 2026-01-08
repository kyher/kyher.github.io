import { useState } from "react";
import "./App.css";
import { TABS } from "./helpers/consts";
import AppSection from "./components/AppSection";
import NavItem from "./components/NavItem";
import ProjectTile from "./components/ProjectTile";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";

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

      {activeTab === TABS.HOME && (
        <AppSection>
          <img
            src="profile.jpg"
            alt="Profile image of Kyle Heron"
            className="rounded-xl w-64 m-auto my-4 hover:scale-105 transition-transform"
          />
          <p className="hover:font-bold">{t("profile")}</p>
        </AppSection>
      )}
      {activeTab === TABS.CONTACT && (
        <AppSection>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/kyher"
              className="text-lg underline underline-offset-4 hover:font-bold"
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
          <div className="flex flex-col gap-4">
            <ProjectTile
              name="CoupleMDB"
              description={t("projects.couplemdb")}
              repo="https://github.com/kyher/couplemdb"
              stack="Next, TypeScript, TailwindCSS, Drizzle, NextAuth"
            />
            <ProjectTile
              name="I can't type french"
              description={t("projects.icanttypefrench")}
              repo="https://github.com/kyher/i-cant-type-french"
              stack="Vite, React, TypeScript"
            />
          </div>
        </AppSection>
      )}
    </main>
  );
}

export default App;
