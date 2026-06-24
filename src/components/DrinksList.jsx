import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol } from '../utils/drinks';

export const DrinksList = ({ drinks }) => {
  const { removeDrink } = useApp();

  if (!drinks || drinks.length === 0) {
    return <p className="text-slate-600 dark:text-slate-400 text-sm">Keine Getränke</p>;
  }

  return (
    <div className="space-y-2">
      {drinks.map(drink => (
        <div
          key={drink.id}
          className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-slideIn"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{drink.icon || '🍹'}</span>
              <span className="font-medium text-slate-900 dark:text-white">{drink.name}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">({drink.abv}%)</span>
            </div>
            <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span>{drink.volume}ml</span>
              <span>→ {formatAlcohol(drink.alcohol)}ml</span>
            </div>
          </div>
          
          <button
            onClick={() => removeDrink(drink.id)}
            className="ml-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
            aria-label="Remove drink"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
