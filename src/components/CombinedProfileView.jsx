import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, calculateAlcohol, calculateBeerLiters } from '../utils/drinks';
import { AddDrinkModal } from './AddDrinkModal';
import { AddFriendModal } from './AddFriendModal';
import { DrinksList } from './DrinksList';
import { EveningPodium } from './EveningPodium';
import { ResetModal } from './ResetModal';

export const CombinedProfileView = () => {
  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [expandedPersonId, setExpandedPersonId] = useState(null);
  const [addDrinkFor, setAddDrinkFor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isEveningPodiumOpen, setIsEveningPodiumOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
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

  if (!currentUser) {
    return (
      <div className="pb-24 pt-4 px-4 space-y-6">
        <div className="pt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">Wird geladen...</p>
        </div>
      </div>
    );
  }

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
    } else if (addDrinkFor) {
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

  const handleDeleteFriend = (friendId) => {
    removeFriend(friendId);
    setDeleteConfirmId(null);
  };

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
        {people.map((person) => {
          const isExpanded = expandedPersonId === person.id;
          const drinks = person.isCurrentUser 
            ? getDrinksForDate() 
            : getFriendDrinksForDate(person.id);

          return (
            <div key={person.id}>
              <div
                className={`card rounded-xl p-3 overflow-hidden animate-slideIn ${
                  person.isCurrentUser
                    ? 'bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-purple-50 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700'
                    : ''
                }`}
              >
                <div className="space-y-2">
                  <button
                    onClick={() => setExpandedPersonId(isExpanded ? null : person.id)}
                    className="w-full text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-3xl flex-shrink-0">{person.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <h3 className={`font-bold text-base ${
                            person.isCurrentUser
                              ? 'text-blue-900 dark:text-blue-200'
                              : 'text-slate-900 dark:text-white'
                          }`}>{person.name}</h3>
                          {person.isCurrentUser && (
                            <span className="px-2 py-0.5 bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold rounded-full">Du</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-lg transition-transform flex-shrink-0 ml-2" style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>

                  <div className="bg-slate-100 dark:bg-slate-700/40 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      🍺 {formatBeerLiters(person.beerLiters)}L <span className="text-xs text-slate-500">-</span> 💧 {formatAlcohol(person.alcohol)}ml
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    {!person.isCurrentUser && (
                      <>
                        <div className="relative">
                          {deleteConfirmId === person.id ? (
                            <div className="absolute left-0 top-full mt-1 bg-red-500 text-white rounded-lg p-2 whitespace-nowrap z-50 text-xs">
                              <div className="mb-1 font-semibold">Wirklich löschen?</div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDeleteFriend(person.id)}
                                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 rounded text-xs font-bold"
                                >
                                  Ja
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-0.5 bg-red-400 hover:bg-red-500 rounded text-xs"
                                >
                                  Nein
                                </button>
                              </div>
                            </div>
                          ) : null}
                          <button
                            onClick={() => setDeleteConfirmId(person.id)}
                            className="p-1.5 text-red-600 dark:text-red-400 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            aria-label="Remove friend"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-lg text-slate-300 dark:text-slate-600">|</div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setAddDrinkFor(person.isCurrentUser ? 'self' : person.id);
                        setIsAddDrinkOpen(true);
                      }}
                      className="p-1.5 text-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                      aria-label="Add drink"
                      title="Getränk hinzufügen"
                    >
                      ➕
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 -mx-3 mt-2 px-3 pt-2">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Getränke heute</h3>
                    {drinks.length === 0 ? (
                      <p className="text-slate-600 dark:text-slate-400 text-center py-4 text-xs">Noch keine Getränke</p>
                    ) : (
                      <DrinksList 
                        drinks={drinks} 
                        friendId={person.isCurrentUser ? null : person.id} 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setIsAddFriendOpen(true)}
          className="btn-secondary w-full py-3 text-lg"
        >
          👥 Freund hinzufügen
        </button>

        <button
          onClick={() => setIsEveningPodiumOpen(true)}
          className="btn-primary w-full py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          🎊 Abend beenden
        </button>

        <button
          onClick={() => setIsResetModalOpen(true)}
          className="btn-secondary w-full py-3 text-lg bg-red-500 hover:bg-red-600 text-white"
        >
          🔄 Reset
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

      {isEveningPodiumOpen && (
        <EveningPodium
          onClose={() => setIsEveningPodiumOpen(false)}
          onConfirm={() => {}}
        />
      )}

      {isResetModalOpen && (
        <ResetModal
          onClose={() => setIsResetModalOpen(false)}
        />
      )}
    </div>
  );
};
