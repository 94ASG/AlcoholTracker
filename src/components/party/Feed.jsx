// ==============================================
// AlcoholTracker 2.0: Party Live Feed & Reactions
// ==============================================

import React, { useMemo } from 'react';
import { formatGrams } from '../../utils/drinks';

const REACTION_EMOJIS = ['🔥', '🍻', '😵', '🫡', '💧'];

export const Feed = ({ drinks, reactions, members, currentProfile, onToggleReaction }) => {
  // Erstelle Map der Mitglieder für schnelle Namensauflösung
  const memberMap = useMemo(() => {
    const map = new Map();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  // Gruppiere Drinks nach round_id falls vorhanden (Runde ausgegeben)
  const feedItems = useMemo(() => {
    const rounds = new Map();
    const singles = [];

    drinks.forEach((d) => {
      if (d.round_id) {
        if (!rounds.has(d.round_id)) {
          rounds.set(d.round_id, {
            type: 'round',
            id: d.round_id,
            drink: d,
            drinkIds: [d.id],
            recipients: [d.profile_id],
            loggedBy: d.logged_by,
            createdAt: d.created_at,
          });
        } else {
          const r = rounds.get(d.round_id);
          r.drinkIds.push(d.id);
          if (!r.recipients.includes(d.profile_id)) {
            r.recipients.push(d.profile_id);
          }
        }
      } else {
        singles.push({
          type: 'single',
          id: d.id,
          drink: d,
          drinkIds: [d.id],
          profileId: d.profile_id,
          loggedBy: d.logged_by,
          createdAt: d.created_at,
        });
      }
    });

    // Nur echte Runden mit > 1 Personen als Runde behandeln
    const actualRounds = [];
    rounds.forEach((r) => {
      if (r.recipients.length > 1) {
        actualRounds.push(r);
      } else {
        singles.push({
          type: 'single',
          id: r.drinkIds[0],
          drink: r.drink,
          drinkIds: r.drinkIds,
          profileId: r.recipients[0],
          loggedBy: r.loggedBy,
          createdAt: r.createdAt,
        });
      }
    });

    const combined = [...actualRounds, ...singles];
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return combined;
  }, [drinks]);

  const getTimeAgo = (dateStr) => {
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 60) return 'gerade eben';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `vor ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    return `vor ${diffHours} h`;
  };

  if (feedItems.length === 0) {
    return (
      <div className="py-16 text-center text-dim text-sm">
        <span className="text-3xl block mb-2">🧊</span>
        Noch keine Aktivität. Wer trinkt den ersten Schluck?
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedItems.map((item) => {
        const timeAgo = getTimeAgo(item.createdAt);

        // Reaktionen für dieses Item berechnen (zusammengefasst über drinkIds)
        const itemReactions = reactions.filter((r) => item.drinkIds.includes(r.drink_id));

        return (
          <div key={item.id} className="glass-card p-3.5 border-white/[0.06]">
            {item.type === 'round' ? (
              // RUNDE AUSGEGEBEN (MEHRERE PERSONEN)
              (() => {
                const hostProfile = memberMap.get(item.loggedBy) || { name: 'Jemand', emoji: '👤' };
                const isMeHost = item.loggedBy === currentProfile?.id;

                return (
                  <div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-neon-pink/15 border border-neon-pink/30 flex items-center justify-center text-lg flex-shrink-0">
                        {item.drink.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white leading-snug">
                          <span className="font-extrabold text-neon-pink">
                            {isMeHost ? 'Du' : hostProfile.name}
                          </span>{' '}
                          hat eine Runde{' '}
                          <span className="font-bold text-white">{item.drink.name}</span> für{' '}
                          <span className="font-bold text-neon-lime">
                            {item.recipients.length} Personen
                          </span>{' '}
                          ausgegeben! 🎉
                        </p>
                        <p className="text-[10px] text-faint font-mono mt-0.5">{timeAgo}</p>
                      </div>
                    </div>

                    {/* Empfänger-Avatare */}
                    <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-white/[0.04] overflow-x-auto">
                      <span className="text-[10px] text-faint mr-1">Runde für:</span>
                      {item.recipients.map((recId) => {
                        const rec = memberMap.get(recId);
                        if (!rec) return null;
                        return (
                          <span
                            key={recId}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/[0.05] text-[10px] text-dim"
                          >
                            <span>{rec.emoji}</span>
                            <span>{rec.id === currentProfile?.id ? 'Du' : rec.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            ) : (
              // EINZELNER DRINK
              (() => {
                const drinker = memberMap.get(item.profileId) || { name: 'Jemand', emoji: '👤' };
                const isMe = item.profileId === currentProfile?.id;
                const isLoggedByOther = item.loggedBy && item.loggedBy !== item.profileId;
                const logger = memberMap.get(item.loggedBy) || { name: 'Jemand', emoji: '👤' };

                let actionText;
                if (isMe) {
                  if (isLoggedByOther) {
                    actionText = (
                      <>
                        <span className="font-bold text-white">{logger.name}</span> hat dir ein{' '}
                        <span className="font-bold text-neon-lime">{item.drink.name}</span> eingetragen
                      </>
                    );
                  } else {
                    actionText = (
                      <>
                        <span className="font-bold text-white">Du</span> trinkst{' '}
                        <span className="font-bold text-neon-lime">{item.drink.name}</span>
                      </>
                    );
                  }
                } else {
                  if (item.loggedBy === currentProfile?.id) {
                    actionText = (
                      <>
                        <span className="font-bold text-white">Du</span> hast für{' '}
                        <span className="font-bold text-white">{drinker.name}</span> ein{' '}
                        <span className="font-bold text-neon-lime">{item.drink.name}</span> eingetragen
                      </>
                    );
                  } else {
                    actionText = (
                      <>
                        <span className="font-bold text-white">{drinker.name}</span> trinkt{' '}
                        <span className="font-bold text-neon-lime">{item.drink.name}</span>
                      </>
                    );
                  }
                }

                return (
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-surface-light border border-white/5 flex items-center justify-center text-lg flex-shrink-0">
                      {item.drink.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white">
                          {actionText}
                        </p>
                        <span className="font-mono text-[10px] font-bold text-neon-lime ml-2">
                          +{formatGrams(item.drink.alcohol_g)}g
                        </span>
                      </div>
                      <p className="text-[10px] text-faint font-mono mt-0.5">
                        {item.drink.volume_ml}ml ({item.drink.abv}%) · {timeAgo}
                      </p>
                    </div>
                  </div>
                );
              })()
            )}

            {/* REAKTIONSLEISTE */}
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/[0.04]">
              {REACTION_EMOJIS.map((emoji) => {
                const count = itemReactions.filter((r) => r.emoji === emoji).length;
                const hasReacted = itemReactions.some(
                  (r) => r.emoji === emoji && r.profile_id === currentProfile?.id
                );

                // Nimm die erste drink_id für das Toggeln
                const targetDrinkId = item.drinkIds[0];

                return (
                  <button
                    key={emoji}
                    onClick={() => onToggleReaction(targetDrinkId, emoji)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                      hasReacted
                        ? 'bg-neon-lime/20 border border-neon-lime/40 text-white'
                        : 'bg-white/[0.03] border border-white/[0.05] text-dim hover:text-white'
                    }`}
                  >
                    <span>{emoji}</span>
                    {count > 0 && <span className="text-[10px] font-mono">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
