import React from 'react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { theme, setTheme, currentUser } = useApp();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍺</span>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">AlcoholTracker</h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-lg"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};
