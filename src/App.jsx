import { Header } from './components/Header';
import { CombinedProfileView } from './components/CombinedProfileView';
import { IdentitySetupModal } from './components/IdentitySetupModal';
import { useApp } from './context/AppContext';
import './index.css';

function App() {
  const { needsIdentitySetup } = useApp();

  return (
    <div className="app-container">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <CombinedProfileView />
      </main>

      {needsIdentitySetup && <IdentitySetupModal />}
    </div>
  );
}

export default App;
