import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, calculateAlcohol, calculateBeerLiters } from '../utils/drinks';
import { AddDrinkModal } from './AddDrinkModal';
import { AddFriendModal } from './AddFriendModal';
import { DrinksList } from './DrinksList';

export const CombinedProfileView = () => {
  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [addDrinkFor, setAddDrinkFor] = useState(null);
  const { 
    currentUser, 
    friends, 
    addDrink, 
    addDrinkToFriend,
    addFriend,
    getTodayAlcohol, 
    getTodayBeerLiters, 
    getDrinksForDate,
    getFriendDrinksForDate,
    getFriendTodayAlcohol,
    getFriendTodayBeerLiters,
    removeFriend,
  } = useApp();

  const handleAddDrink = (drinkData) => {
    const alcohol = calculateAlcohol(drinkData.volume, drinkData.abv);
    const beerFactor = drinkData.beerFactor !== undefined ? drinkData.beerFactor : 0;
    const beerLiters = calculateBeerLiters(drinkData.volume, beerFactor);
    
    if (addDrinkFor === 'self') {
      addDrink({
        name: drinkData.name,
        icon: drinkData.icon,
        volume: drinkData.volume,
        abv: drinkData.abv,
        alcohol,
        beerLiters,
      });
    } else {
      addDrinkToFriend(addDrinkFor, {
        name: drinkData.name,
        icon: drinkData.icon,
        volume: drinkData.volume,
        abv: drinkData.abv,
        alcohol,
        beerLiters,
      });
    }
    setIsAddDrinkOpen(false);
    setAddDrinkFor(null);
  };

  const handleAddFriend = (friendData) => {
    addFriend(friendData);
    setIsAddFriendOpen(false);
  };

  if (selectedPersonId) {
    const isCurrentUser = selectedPersonId === currentUser.id;
    const person = isCurrentUser ? currentUser : friends.find(f => f.id === selectedPersonId);
    const drinks = isCurrentUser 
      ? getDrinksForDate() 
      : getFriendDrinksForDate(selectedPersonId);

    return (
      <div className="pb-24 pt-4 px-4 space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <button
            onClick={() => setSelectedPersonId(null)}
            className="text-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="text-5xl">{person.avatar}</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{person.name}</h2>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Alle Getränke</h3>
          {drinks.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8 text-sm">Noch keine Getränke</p>
          ) : (
            <DrinksList 
              drinks={drinks} 
              friendId={isCurrentUser ? null : selectedPersonId} 
            />
          )}
        </div>
      </div>
    );
  }

  const people = [
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      beerLiters: getTodayBeerLiters(),
      alcohol: getTodayAlcohol(),
      isCurrentUser: true,
    },
    ...friends.map(friend => ({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      beerLiters: getFriendTodayBeerLiters(friend.id),
      alcohol: getFriendTodayAlcohol(friend.id),
      isCurrentUser: false,
    })),
  ];

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Personen</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Verwalte Getränke für alle</p>
      </div>

      <div className="space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="card flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors animate-slideIn"
          >
            <button
              onClick={() => setSelectedPersonId(person.id)}
              className="flex-1 text-left flex items-center gap-4"
            >
              <div className="text-4xl">{person.avatar}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{person.name}</h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-900 dark:text-white">{formatBeerLiters(person.beerLiters)}</span>L
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-900 dark:text-white">{formatAlcohol(person.alcohol)}</span>ml
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setAddDrinkFor(person.id);
                setIsAddDrinkOpen(true);
              }}
              className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-blue-600 dark:text-blue-400 font-bold text-lg ml-2"
              aria-label="Add drink"
            >
              +
            </button>

            {!person.isCurrentUser && (
              <button
                onClick={() => removeFriend(person.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400 ml-2"
                aria-label="Remove friend"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setAddDrinkFor('self');
            setIsAddDrinkOpen(true);
          }}
          className="btn-primary w-full py-3"
        >
          ➕ Getränk für mich hinzufügen
        </button>

        <button
          onClick={() => setIsAddFriendOpen(true)}
          className="btn-secondary w-full py-3"
        >
          👥 Freund hinzufügen
        </button>
      </div>

      {isAddDrinkOpen && (
        <AddDrinkModal
          onClose={() => {
            setIsAddDrinkOpen(false);
            setAddDrinkFor(null);
          }}
          onAdd={handleAddDrink}
        />
      )}

      {isAddFriendOpen && (
        <AddFriendModal
          onClose={() => setIsAddFriendOpen(false)}
          onAdd={handleAddFriend}
        />
      )}
    </div>
  );
};
