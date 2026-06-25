import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters } from '../utils/drinks';

export const EveningPodium = ({ onClose, onConfirm }) => {
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showPodium, setShowPodium] = useState(false);
  const { currentUser, friends, getTodayAlcohol, getTodayBeerLiters, getFriendTodayAlcohol, getFriendTodayBeerLiters } = useApp();

  const people = [
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      alcohol: getTodayAlcohol(),
      beerLiters: getTodayBeerLiters(),
    },
    ...friends.map(friend => ({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      alcohol: getFriendTodayAlcohol(friend.id),
      beerLiters: getFriendTodayBeerLiters(friend.id),
    })),
  ];

  const sortedPeople = [...people].sort((a, b) => b.alcohol - a.alcohol);
  const top3 = sortedPeople.slice(0, 3);
  const others = sortedPeople.slice(3);

  const handleConfirmEnd = () => {
    setConfirmEnd(false);
    setShowPodium(true);
    onConfirm();
  };

  if (showPodium) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full mx-4 max-h-96 overflow-y-auto animate-slideIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">🎉 Abend vorbei!</h2>
            <p className="text-slate-600 dark:text-slate-400">Hier sind die Top Trinker</p>
          </div>

          <div className="space-y-4 mb-6">
            {top3.map((person, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const positions = ['1. Platz', '2. Platz', '3. Platz'];
              return (
                <div key={person.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl">👑</div>
                  )}
                  <div className={`p-4 rounded-lg border-2 ${
                    index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
                    index === 1 ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600' :
                    'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                  }`}>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{medals[index]}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{person.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{person.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{positions[index]}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">{formatAlcohol(person.alcohol)}ml</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{formatBeerLiters(person.beerLiters)}L</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {others.length > 0 && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Weitere Trinker</div>
              <div className="space-y-2">
                {others.map((person, index) => (
                  <div key={person.id} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                    <span className="text-xl">{person.avatar}</span>
                    <span className="flex-1 font-medium text-slate-900 dark:text-white">{person.name}</span>
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{formatAlcohol(person.alcohol)}ml</div>
                      <div className="text-slate-600 dark:text-slate-400">{formatBeerLiters(person.beerLiters)}L</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="btn-primary w-full mt-6"
          >
            Fertig
          </button>
        </div>
      </div>
    );
  }

  if (confirmEnd) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full mx-4 animate-slideIn">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Abend wirklich beenden?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Dies zeigt das Leaderboard für heute an.</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmEnd(false)}
              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirmEnd}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ja, beenden
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full mx-4 animate-slideIn">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">🎊 Abend beenden</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Möchtest du den Abend beenden und das Leaderboard für heute sehen?</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Nein
          </button>
          <button
            onClick={() => setConfirmEnd(true)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ja, beenden
          </button>
        </div>
      </div>
    </div>
  );
};
