import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, calculateAlcohol, calculateBeerLiters } from '../utils/drinks';
import { AddDrinkModal } from './AddDrinkModal';
import { DrinksList } from './DrinksList';

export const FriendDetailView = ({ friend, onBack }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { addDrinkToFriend, getFriendDrinksForDate, getFriendTodayAlcohol, getFriendTodayBeerLiters } = useApp();
  
  const todayDrinks = getFriendDrinksForDate(friend.id);
  const todayAlcohol = getFriendTodayAlcohol(friend.id);
  const todayBeerLiters = getFriendTodayBeerLiters(friend.id);

  const handleAddDrink = (drinkData) => {
    const alcohol = calculateAlcohol(drinkData.volume, drinkData.abv);
    const beerFactor = drinkData.beerFactor !== undefined ? drinkData.beerFactor : 0;
    const beerLiters = calculateBeerLiters(drinkData.volume, beerFactor);
    addDrinkToFriend(friend.id, {
      name: drinkData.name,
      icon: drinkData.icon,
      volume: drinkData.volume,
      abv: drinkData.abv,
      alcohol,
      beerLiters,
    });
    setIsAddOpen(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="flex items-center gap-4 pt-6">
        <button
          onClick={onBack}
          className="text-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Back"
        >
          ←
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="text-5xl">{friend.avatar}</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{friend.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">ALKOHOL</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatAlcohol(todayAlcohol)}<span className="text-xs ml-1">ml</span></div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">BIER</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatBeerLiters(todayBeerLiters)}<span className="text-xs ml-1">L</span></div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Heute hinzugefügt</h3>
        {todayDrinks.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 text-center py-8 text-sm">Noch keine Getränke heute</p>
        ) : (
          <DrinksList drinks={todayDrinks} friendId={friend.id} />
        )}
      </div>

      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-24 right-4 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 animate-fadeIn"
        aria-label="Add drink"
      >
        <span className="text-3xl">➕</span>
      </button>

      {isAddOpen && (
        <AddDrinkModal
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddDrink}
        />
      )}
    </div>
  );
};
