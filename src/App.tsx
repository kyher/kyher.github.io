import { useState } from "react";
import "./App.css";
import { TABS } from "./helpers/consts";
import AppSection from "./components/AppSection";
import NavItem from "./components/NavItem";
import ProjectTile from "./components/ProjectTile";

function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  return (
    <main className="max-w-3xl m-auto p-4">
      <h1 className="text-3xl hover:font-bold">Kyle Heron</h1>
      <nav>
        <ul className="flex gap-4 mt-4 justify-center">
          <NavItem
            label="Home"
            isActive={activeTab === TABS.HOME}
            onClick={() => setActiveTab(TABS.HOME)}
          />
          <NavItem
            label="Contact"
            isActive={activeTab === TABS.CONTACT}
            onClick={() => setActiveTab(TABS.CONTACT)}
          />
          <NavItem
            label="Projects"
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
          <p className="hover:font-bold">
            A diligent, driven software engineer with a passion for improving
            processes and providing value. Experienced in planning, designing,
            developing and deploying web applications across a multitude of
            technologies.
          </p>
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
              Email me!
            </a>
          </div>
        </AppSection>
      )}
      {activeTab === TABS.PROJECTS && (
        <AppSection>
          <div className="flex flex-col gap-4">
            <ProjectTile
              name="CoupleMDB"
              description="A movie database app for couples to compare their reviewed movies - 🚧 Work in progress 🚧"
              link="https://couplemdb.vercel.app/"
              repo="https://github.com/kyher/couplemdb"
              stack="Next, TypeScript, TailwindCSS, Drizzle, NextAuth"
            />
            <ProjectTile
              name="I can't type french"
              description="Basic react app for copying french keyboard characters to clipboard"
              link="https://i-cant-type-french.vercel.app"
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
