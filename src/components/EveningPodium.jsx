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
    const medals = ['🥇', '🥈', '🥉'];
    const positions = ['1. Platz', '2. Platz', '3. Platz'];
    return (
      <>
        <div className="sheet-backdrop" />
        <div className="fixed inset-0 z-50 max-w-md mx-auto flex flex-col bg-bg animate-fadeIn overflow-y-auto">
          <div className="pt-12 pb-8 px-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="display text-4xl text-paper">Abend vorbei!</h2>
            <p className="text-dim mt-1">Die Top-Trinker der Runde</p>
          </div>

          <div className="px-6 space-y-3 flex-1">
            {top3.map((person, index) => (
              <div
                key={person.id}
                className={`card p-4 flex items-center gap-4 ${
                  index === 0 ? 'ring-1 ring-amber/40 shadow-glow' : ''
                }`}
              >
                <span className="text-4xl leading-none">{medals[index]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{person.avatar}</span>
                    <div className="min-w-0">
                      <div className="display text-xl text-paper truncate leading-none">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-faint uppercase tracking-wider mt-0.5">
                        {positions[index]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="display text-2xl text-amber leading-none">{formatAlcohol(person.alcohol)}</div>
                  <div className="text-[10px] text-faint uppercase tracking-wider">g</div>
                </div>
              </div>
            ))}

            {others.length > 0 && (
              <>
                <div className="divider my-4" />
                <p className="eyebrow mb-2">Weitere Trinker</p>
                <div className="space-y-2">
                  {others.map((person) => (
                    <div key={person.id} className="flex items-center gap-3 p-3 bg-surface border border-line/10 rounded-xl">
                      <span className="text-xl leading-none">{person.avatar}</span>
                      <span className="flex-1 font-semibold text-paper truncate">{person.name}</span>
                      <div className="text-right font-mono text-xs">
                        <div className="text-paper">{formatAlcohol(person.alcohol)}g</div>
                        <div className="text-faint">{formatBeerLiters(person.beerLiters)}L</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 pb-10">
            <button onClick={onClose} className="btn-primary w-full">
              Fertig
            </button>
          </div>
        </div>
      </>
    );
  }

  if (confirmEnd) {
    return (
      <>
        <div className="sheet-backdrop" onClick={() => setConfirmEnd(false)} />
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-5">
          <div className="card p-6 animate-pop">
            <h2 className="display text-2xl text-paper mb-3">Abend wirklich beenden?</h2>
            <p className="text-dim mb-5">Dies zeigt das Leaderboard für heute an.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmEnd(false)} className="flex-1 btn-secondary py-2.5">
                Abbrechen
              </button>
              <button onClick={handleConfirmEnd} className="flex-1 btn-primary py-2.5">
                Ja, beenden
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-5">
        <div className="card p-6 animate-pop">
          <div className="text-4xl mb-3">🎊</div>
          <h2 className="display text-2xl text-paper mb-2">Abend beenden</h2>
          <p className="text-dim mb-5">Möchtest du den Abend beenden und das Leaderboard für heute sehen?</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-secondary py-2.5">
              Nein
            </button>
            <button onClick={() => setConfirmEnd(true)} className="flex-1 btn-primary py-2.5">
              Ja, beenden
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
