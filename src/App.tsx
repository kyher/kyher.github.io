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
      <img
        src="profile.jpg"
        alt="Profile image of Kyle Heron"
        className="rounded-xl w-64 m-auto my-4 "
      />
      <h1>Kyle Heron</h1>
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
        <AppSection title="Home">
          <p>
            A diligent, driven software engineer with a passion for improving
            processes and providing value. Experienced in planning, designing,
            developing and deploying web applications across a multitude of
            technologies.
          </p>
        </AppSection>
      )}
      {activeTab === TABS.CONTACT && (
        <AppSection title="Contact">
          <div className="flex flex-col gap-2">
            <a href="https://github.com/kyher">GitHub</a>
            <a href="mailto:kyle.heron@proton.me">Email me!</a>
          </div>
        </AppSection>
      )}
      {activeTab === TABS.PROJECTS && (
        <AppSection title="Projects">
          <ProjectTile
            name="I can't type french"
            description="Basic react app for copying french keyboard characters to clipboard"
            link="https://i-cant-type-french.vercel.app"
            stack="Vite, React, TypeScript"
          />
        </AppSection>
      )}
    </main>
  );
}

export default App;
