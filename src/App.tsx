import { useState } from 'react';
import './App.css'
import { TABS } from './helpers/consts';
import AppSection from './components/AppSection';

function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  return (
    <>
      <h1>Kyle Heron</h1>
      <nav>
        <ul className='flex gap-4 mt-4 justify-center'>
          <li className='hover:underline cursor-pointer' onClick={() => setActiveTab(TABS.HOME)}>Home</li>
          <li className='hover:underline cursor-pointer' onClick={() => setActiveTab(TABS.ABOUT)}>About</li>
          <li className='hover:underline cursor-pointer' onClick={() => setActiveTab(TABS.CONTACT)}>Contact</li>
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
