import React, { useState } from 'react';
import { DRINKS_DB } from '../utils/drinks';

export const AddDrinkModal = ({ onClose, onAdd }) => {
  const [selectedTab, setSelectedTab] = useState('quick');
  const [customDrink, setCustomDrink] = useState({
    name: '',
    volume: 500,
    abv: 5,
    icon: '🍹',
    beerFactor: 0,
  });

  const handleQuickAdd = (drinkKey) => {
    const drink = DRINKS_DB[drinkKey];
    onAdd({
      name: drink.name,
      icon: drink.icon,
      volume: drink.volume,
      abv: drink.defaultAbv,
      beerFactor: drink.beerFactor || 0,
    });
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (customDrink.name.trim()) {
      onAdd(customDrink);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 max-w-md mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full rounded-t-2xl p-6 animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Getränk hinzufügen</h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedTab('quick')}
            className={`pb-3 font-medium text-sm ${
              selectedTab === 'quick'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Schnellauswahl
          </button>
          <button
            onClick={() => setSelectedTab('custom')}
            className={`pb-3 font-medium text-sm ${
              selectedTab === 'custom'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Benutzerdefiniert
          </button>
        </div>

        {selectedTab === 'quick' && (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {Object.entries(DRINKS_DB).map(([key, drink]) => (
              <button
                key={key}
                onClick={() => handleQuickAdd(key)}
                className="p-3 card text-center hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="text-3xl mb-2">{drink.icon}</div>
                <div className="font-medium text-slate-900 dark:text-white text-sm">{drink.name}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{drink.defaultAbv}%</div>
              </button>
            ))}
          </div>
        )}

        {selectedTab === 'custom' && (
          <form onSubmit={handleCustomAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                Getränkename
              </label>
              <input
                type="text"
                value={customDrink.name}
                onChange={(e) => setCustomDrink({ ...customDrink, name: e.target.value })}
                className="input-field"
                placeholder="z.B. Mojito"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                Menge (ml)
              </label>
              <input
                type="number"
                value={customDrink.volume}
                onChange={(e) => setCustomDrink({ ...customDrink, volume: parseInt(e.target.value) || 0 })}
                className="input-field"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                Alkoholgehalt (%)
              </label>
              <input
                type="number"
                value={customDrink.abv}
                onChange={(e) => setCustomDrink({ ...customDrink, abv: parseFloat(e.target.value) || 0 })}
                className="input-field"
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                Bier-Faktor
              </label>
              <select
                value={customDrink.beerFactor}
                onChange={(e) => setCustomDrink({ ...customDrink, beerFactor: parseFloat(e.target.value) })}
                className="input-field"
              >
                <option value={0}>Keine Bier (Spirituosen, Wein)</option>
                <option value={0.5}>Halbes Bier (Radler)</option>
                <option value={1}>Volles Bier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                Emoji
              </label>
              <input
                type="text"
                value={customDrink.icon}
                onChange={(e) => setCustomDrink({ ...customDrink, icon: e.target.value })}
                className="input-field"
                maxLength="2"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Hinzufügen
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

