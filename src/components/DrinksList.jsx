import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters } from '../utils/drinks';

export const DrinksList = ({ drinks, friendId = null }) => {
  const { removeDrink, removeDrinkFromFriend } = useApp();

  if (!drinks || drinks.length === 0) {
    return <p className="text-dim text-sm">Keine Getränke</p>;
  }

  const handleRemove = (drinkId) => {
    if (friendId) {
      removeDrinkFromFriend(friendId, drinkId);
    } else {
      removeDrink(drinkId);
    }
  };

  return (
    <div className="space-y-1.5">
      {drinks.map(drink => (
        <div
          key={drink.id}
          className="flex items-center justify-between bg-surface border border-line/10 rounded-xl px-3 py-2.5 animate-pop"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl leading-none">{drink.icon || '🍹'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-paper text-sm truncate">{drink.name}</span>
                <span className="text-[10px] text-faint font-mono">({drink.abv}%)</span>
              </div>
              <div className="font-mono text-[11px] text-faint">
                {drink.volume}ml → {formatAlcohol(drink.alcohol)}g · {formatBeerLiters(drink.beerLiters || 0)}L
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRemove(drink.id)}
            className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label="Getränk entfernen"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
