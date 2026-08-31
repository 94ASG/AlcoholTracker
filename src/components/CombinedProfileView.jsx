import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, calculateAlcohol, calculateBeerLiters } from '../utils/drinks';
import { AddDrinkModal } from './AddDrinkModal';
import { AddFriendModal } from './AddFriendModal';
import { DrinksList } from './DrinksList';
import { EveningPodium } from './EveningPodium';
import { ResetModal } from './ResetModal';
import { OnboardingModal } from './OnboardingModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const CombinedProfileView = () => {
  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [expandedPersonId, setExpandedPersonId] = useState(null);
  const [addDrinkFor, setAddDrinkFor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isEveningPodiumOpen, setIsEveningPodiumOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
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
    loadError,
  } = useApp();

  if (loadError) {
    return (
      <div className="pb-28 pt-6 px-5">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">🕯️</div>
          <h2 className="display text-2xl text-paper mb-2">Keine Verbindung</h2>
          <p className="text-sm text-dim mb-2">Verbindung zu Supabase fehlgeschlagen.</p>
          <p className="text-xs text-faint break-words">{loadError}</p>
          <p className="text-xs text-faint mt-2">
            Prüfe deine VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY in der .env-Datei.
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="pb-28 pt-6 px-5">
        <div className="pt-10 text-center">
          <div className="text-3xl mb-3 animate-pulse">🍺</div>
          <p className="text-dim">Wird geladen...</p>
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

  // The Round tally — total drinks tonight across everyone
  const selfDrinks = getDrinksForDate();
  const totalDrinks = people.reduce((sum, p) => {
    const drinks = p.isCurrentUser ? selfDrinks : getFriendDrinksForDate(p.id);
    return sum + drinks.length;
  }, 0);

  const leader = people.reduce((best, p) => (p.alcohol > best.alcohol ? p : best), people[0]);
  const hasDrinks = totalDrinks > 0;

  return (
    <div className="pb-8 pt-5 px-5 space-y-5">
      {/* Hero: the Round tally */}
      <section className="card p-6 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber to-transparent" />
        <p className="eyebrow mb-1">Die Runde</p>
        <div key={totalDrinks} className="display text-7xl leading-none text-amber animate-tally mt-1">
          {totalDrinks}
        </div>
        <p className="text-sm text-dim mt-1">Getränke heute</p>

        <div className="divider my-4" />

        <div className="flex items-center justify-center gap-2 text-sm">
          {hasDrinks ? (
            <>
              <span className="text-lg leading-none">{leader.avatar}</span>
              <span className="text-dim">Führend:</span>
              <span className="font-bold text-paper">{leader.name}</span>
              <span className="chip bg-amber/15 text-amber">{formatAlcohol(leader.alcohol)}g</span>
            </>
          ) : (
            <span className="text-sober">Noch niemand hat getrunken — mach den Anfang 🍻</span>
          )}
        </div>
      </section>

      {/* Ledger header */}
      <div className="flex items-end justify-between px-1">
        <h2 className="display text-2xl text-paper">Die Runde</h2>
        <span className="eyebrow">{people.length} {people.length === 1 ? 'Person' : 'Personen'}</span>
      </div>

      {/* Ledger of people */}
      <div className="space-y-2.5">
        {people.map((person) => {
          const isExpanded = expandedPersonId === person.id;
          const drinks = person.isCurrentUser
            ? getDrinksForDate()
            : getFriendDrinksForDate(person.id);

          return (
            <div
              key={person.id}
              className={`card overflow-hidden transition-colors ${
                person.isCurrentUser ? 'ring-1 ring-amber/30' : ''
              }`}
            >
              <div className="p-3.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedPersonId(isExpanded ? null : person.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <span className="text-3xl leading-none flex-shrink-0">{person.avatar}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="display text-xl text-paper leading-none truncate">
                          {person.name}
                        </span>
                        {person.isCurrentUser && (
                          <span className="chip bg-amber text-bg text-[10px]">Du</span>
                        )}
                      </span>
                      <span className="font-mono text-xs mt-0.5 block">
                        <span className="font-bold text-amber">{formatAlcohol(person.alcohol)}g Alk</span>
                        <span className="text-faint"> · {formatBeerLiters(person.beerLiters)}L Bier</span>
                      </span>
                    </span>
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xl leading-none transition-all flex-shrink-0 ${
                        isExpanded
                          ? 'bg-amber/15 text-amber rotate-180'
                          : 'bg-surface text-dim border border-line/15'
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setAddDrinkFor(person.isCurrentUser ? 'self' : person.id);
                      setIsAddDrinkOpen(true);
                    }}
                    className="w-11 h-11 rounded-xl bg-amber text-bg text-2xl leading-none flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
                    aria-label={`Getränk für ${person.name} hinzufügen`}
                  >
                    +
                  </button>
                </div>

                {!person.isCurrentUser && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setDeleteConfirmId(person.id)}
                      className="text-xs text-faint hover:text-red-400 transition-colors"
                    >
                      Entfernen
                    </button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-line/10 bg-bg/40 px-3.5 py-3">
                  <p className="eyebrow mb-2">Getränke heute</p>
                  {drinks.length === 0 ? (
                    <p className="text-dim text-sm text-center py-3">Noch keine Getränke</p>
                  ) : (
                    <DrinksList
                      drinks={drinks}
                      friendId={person.isCurrentUser ? null : person.id}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="btn-secondary w-full"
        >
          <span className="text-lg leading-none">🧭</span> So funktioniert's
        </button>

        <button
          onClick={() => setIsAddFriendOpen(true)}
          className="btn-secondary w-full"
        >
          <span className="text-lg leading-none">👥</span> Freund hinzufügen
        </button>

        <button
          onClick={() => setIsEveningPodiumOpen(true)}
          className="btn-primary w-full"
        >
          <span className="text-lg leading-none">🎊</span> Abend beenden
        </button>

        <button
          onClick={() => setIsResetModalOpen(true)}
          className="w-full py-3 text-sm text-faint hover:text-red-400 transition-colors"
        >
          Runde zurücksetzen
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

      {isOnboardingOpen && (
        <OnboardingModal
          onClose={() => setIsOnboardingOpen(false)}
        />
      )}

      {deleteConfirmId && (
        <ConfirmDeleteModal
          title="Person entfernen?"
          message={`Möchtest du "${friends.find((f) => f.id === deleteConfirmId)?.name || 'diese Person'}" wirklich entfernen? Alle ihre Getränke werden dauerhaft gelöscht.`}
          confirmLabel="Ja, entfernen"
          onConfirm={() => handleDeleteFriend(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
};
