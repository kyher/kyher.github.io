import { useState } from 'react';
import './App.css'
import { TABS } from './helpers/consts';
import AppSection from './components/AppSection';
import NavItem from './components/NavItem';

function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  return (
    <>
      <img src="profile.jpg" alt="Profile image of Kyle Heron" className='rounded-xl w-64 m-auto my-4 ' />
      <h1>Kyle Heron</h1>
      <nav>
        <ul className='flex gap-4 mt-4 justify-center'>
          <NavItem label="Home" isActive={activeTab === TABS.HOME} onClick={() => setActiveTab(TABS.HOME)} />
          <NavItem label="About" isActive={activeTab === TABS.ABOUT} onClick={() => setActiveTab(TABS.ABOUT)} />
          <NavItem label="Contact" isActive={activeTab === TABS.CONTACT} onClick={() => setActiveTab(TABS.CONTACT)} />
        </ul>
      </nav>
      {activeTab === TABS.HOME && (
        <AppSection title="Home">
          <p>Welcome to my personal website!</p>
        </AppSection>
      )}
      {activeTab === TABS.ABOUT && (
        <AppSection title="About">
          <p>This is the about section.</p>
        </AppSection>
      )}
      {activeTab === TABS.CONTACT &&
        <AppSection title="Contact">
          <p>Get in touch!</p>
        </AppSection>
      }
    </>
  )
}

export default App
