// ==============================================
// AlcoholTracker 2.0: App Entry & Router
// ==============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { InstallGate } from './components/InstallGate';
import { Setup } from './pages/Setup';
import { Home } from './pages/Home';
import { Party } from './pages/Party';
import { Wrapped } from './pages/Wrapped';
import { Me } from './pages/Me';
import { Guide } from './pages/Guide';

function AppContent() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-bg flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <span className="text-4xl animate-bounce inline-block">🍺</span>
          <p className="text-xs text-dim font-bold tracking-widest uppercase">Starten...</p>
        </div>
      </div>
    );
  }

  // Erstmalige Einrichtung (Profil noch nicht angelegt)
  if (!profile) {
    return <Setup />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:id" element={<Party />} />
        <Route path="/p/:id/wrapped" element={<Wrapped />} />
        <Route path="/me" element={<Me />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <InstallGate>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </InstallGate>
  );
}

export default App;
