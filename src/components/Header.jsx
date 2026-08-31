import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfileModal } from './ProfileModal';

export const Header = () => {
  const { theme, setTheme, currentUser } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-line/10">
      <div className="max-w-md mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">🍺</span>
          <h1 className="display text-2xl tracking-wide text-paper leading-none">
            Alcohol<span className="text-amber">Tracker</span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {currentUser && (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-surface transition-colors active:scale-95"
              aria-label="Profil bearbeiten"
            >
              <span className="text-2xl leading-none">{currentUser.avatar}</span>
              <span className="font-semibold text-paper text-sm max-w-[80px] truncate">
                {currentUser.name}
              </span>
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface border border-line/10 flex items-center justify-center text-lg transition-all active:scale-95"
            aria-label="Theme wechseln"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </header>
  );
};
