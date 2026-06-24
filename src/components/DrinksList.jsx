import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters } from '../utils/drinks';

export const DrinksList = ({ drinks, friendId = null }) => {
  const { removeDrink, removeDrinkFromFriend } = useApp();

  if (!drinks || drinks.length === 0) {
    return <p className="text-slate-600 dark:text-slate-400 text-sm">Keine Getränke</p>;
  }

  const handleRemove = (drinkId) => {
    if (friendId) {
      removeDrinkFromFriend(friendId, drinkId);
    } else {
      removeDrink(drinkId);
    }
  };

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
              <span className="font-medium text-slate-900 dark:text-white text-sm">{drink.name}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">({drink.abv}%)</span>
            </div>
            <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span>{drink.volume}ml</span>
              <span>→ {formatAlcohol(drink.alcohol)}ml | {formatBeerLiters(drink.beerLiters || 0)}L</span>
            </div>
          </div>
          
          <button
            onClick={() => handleRemove(drink.id)}
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
