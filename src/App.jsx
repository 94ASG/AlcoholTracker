import { useState } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { ProfileView } from './components/ProfileView';
import { FriendsView } from './components/FriendsView';
import { StatsView } from './components/StatsView';
import { useSwipe } from './hooks/useSwipe';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSwipeLeft = () => {
    const tabs = ['profile', 'friends', 'stats'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handleSwipeRight = () => {
    const tabs = ['profile', 'friends', 'stats'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className="app-container">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'friends' && <FriendsView />}
        {activeTab === 'stats' && <StatsView />}
      </main>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
