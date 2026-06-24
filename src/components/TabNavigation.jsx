import React from 'react';

export const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'friends', label: 'Freunde', icon: '👥' },
    { id: 'stats', label: 'Statistiken', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto transition-colors duration-300 safe-area-inset-bottom">
      <div className="flex">
        {tabs.map(tab => (
          <div key={tab.id} className="flex-1 relative">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`w-full py-4 px-2 flex flex-col items-center gap-1.5 font-medium text-xs transition-colors min-h-[60px] ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
            </button>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
