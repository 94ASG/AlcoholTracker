import React from 'react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { theme, setTheme, currentUser } = useApp();

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
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-dim">
              <span className="text-lg leading-none">{currentUser.avatar}</span>
              <span className="font-semibold text-paper">{currentUser.name}</span>
            </span>
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
    </header>
  );
};
