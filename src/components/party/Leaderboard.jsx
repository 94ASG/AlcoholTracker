// ==============================================
// AlcoholTracker 2.0: Party Leaderboard
// ==============================================

import React, { useState, useMemo } from 'react';
import { formatGrams, computeBadges, getGroupMilestoneInfo } from '../../utils/drinks';
import { Crown, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const Leaderboard = ({ leaderboard, drinks = [], currentProfile, onDeleteDrink }) => {
  const [expandedId, setExpandedId] = useState(null);

  const leaderMaxAlcohol = leaderboard.length > 0 ? Math.max(1, leaderboard[0].totalAlcoholGrams) : 1;

  // Dynamische Badges
  const members = useMemo(() => leaderboard.map((l) => l.profile), [leaderboard]);
  const badgeMap = useMemo(() => computeBadges(drinks, members), [drinks, members]);

  // Gruppen-Meilenstein
  const totalGroupAlcohol = useMemo(() => {
    return drinks.reduce((sum, d) => sum + (Number(d.alcohol_g) || 0), 0);
  }, [drinks]);

  const milestone = useMemo(() => getGroupMilestoneInfo(totalGroupAlcohol), [totalGroupAlcohol]);

  const toggleExpand = (profileId) => {
    setExpandedId(expandedId === profileId ? null : profileId);
  };

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="py-12 text-center text-dim text-sm">
        Noch keine Teilnehmer in dieser Party.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Kollektives Gruppen-Ziel / Meilenstein */}
      <div className="card p-4 bg-gradient-to-br from-[#18182C] via-surface to-[#10101C] border border-white/10 space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-lg flex-shrink-0">
              {milestone.nextMilestone.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xs">
                  {milestone.nextMilestone.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-dim">
                  Ziel: {milestone.nextMilestone.target}g
                </span>
              </div>
              <p className="text-[11px] text-dim">
                Noch {milestone.gramsRemaining}g Reinalkohol bis zum Meilenstein 🔥
              </p>
            </div>
          </div>
          <span className="font-mono font-bold text-neon-lime text-xs">
            {milestone.percent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-neon-lime via-[#E2FF66] to-neon-pink rounded-full transition-all duration-500"
            style={{ width: `${milestone.percent}%` }}
          />
        </div>
      </div>
      {leaderboard.map((item) => {
        const isMe = item.profile.id === currentProfile?.id;
        const isLeader = item.rank === 1 && item.totalAlcoholGrams > 0;
        const percentOfLeader = Math.min(100, (item.totalAlcoholGrams / leaderMaxAlcohol) * 100);
        const isExpanded = expandedId === item.profile.id;

        // Drinks für dieses Profil
        const userDrinks = drinks.filter((d) => d.profile_id === item.profile.id);
        const userBadges = badgeMap.get(item.profile.id) || [];

        return (
          <div
            key={item.profile.id}
            className={`glass-card overflow-hidden transition-all duration-200 ${
              isMe
                ? 'border-neon-lime/40 bg-surface/95 shadow-glow-lime'
                : isLeader
                ? 'border-neon-pink/40 shadow-glow-pink'
                : 'border-white/[0.06]'
            }`}
          >
            {/* Header / Zeile */}
            <div
              onClick={() => toggleExpand(item.profile.id)}
              className="p-3.5 flex items-center gap-3 cursor-pointer select-none"
            >
              {/* Rang & Medaille */}
              <div className="w-7 text-center font-display text-xl flex-shrink-0">
                {isLeader ? (
                  <Crown className="w-5 h-5 text-neon-pink mx-auto animate-pulse" />
                ) : (
                  <span
                    className={
                      item.rank === 2
                        ? 'text-gray-300'
                        : item.rank === 3
                        ? 'text-amber-600'
                        : 'text-faint'
                    }
                  >
                    #{item.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${item.profile.color || '#C6FF3D'}22` }}
              >
                {item.profile.emoji}
              </div>

              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm truncate">
                    {item.profile.name}
                  </span>
                  {isMe && (
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-neon-lime text-black">
                      Du
                    </span>
                  )}
                  {item.profile.is_guest && (
                    <span className="text-[10px] font-semibold text-faint bg-white/5 px-1 rounded">
                      Gast
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-dim mt-0.5 font-mono">
                  <span>{item.totalDrinksCount} {item.totalDrinksCount === 1 ? 'Drink' : 'Drinks'}</span>
                  {item.totalBeerLiters > 0 && (
                    <>
                      <span>·</span>
                      <span>{item.totalBeerLiters.toFixed(1)}L Bier</span>
                    </>
                  )}
                </div>

                {/* Progress Bar relativ zum Leader */}
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLeader
                        ? 'bg-gradient-to-r from-neon-pink to-neon-purple'
                        : 'bg-neon-lime/80'
                    }`}
                    style={{ width: `${percentOfLeader}%` }}
                  />
                </div>

                {/* Dynamic Badges */}
                {userBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {userBadges.map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border leading-none"
                        style={{
                          backgroundColor: `${b.color}18`,
                          borderColor: `${b.color}35`,
                          color: b.color,
                        }}
                      >
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gramm Alkohol rechts */}
              <div className="text-right flex-shrink-0">
                <div className="font-display text-2xl text-white tracking-wide leading-none">
                  {formatGrams(item.totalAlcoholGrams)}
                  <span className="text-xs font-sans text-neon-lime ml-0.5 font-bold">g</span>
                </div>
                <div className="text-[10px] text-faint uppercase font-bold tracking-wider mt-0.5">
                  Alkohol
                </div>
              </div>

              {/* Chevron */}
              <div className="text-faint pl-1">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Aufgeklappte Getränke-Historie */}
            {isExpanded && (
              <div className="border-t border-white/[0.06] bg-black/40 p-3 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-faint mb-2">
                  Getränke ({userDrinks.length})
                </p>

                {userDrinks.length === 0 ? (
                  <p className="text-xs text-dim py-2 text-center">Noch keine Getränke geloggt.</p>
                ) : (
                  userDrinks.map((drink) => {
                    // Löschberechtigung: Eigene Getränke ODER Getränke, die man selbst für diesen Gast eingetragen hat
                    const canDelete =
                      drink.profile_id === currentProfile?.id ||
                      drink.logged_by === currentProfile?.id;

                    const timeStr = new Date(drink.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={drink.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.04] text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{drink.icon}</span>
                          <span className="font-semibold text-white truncate">{drink.name}</span>
                          <span className="text-[10px] text-dim font-mono">
                            ({drink.volume_ml}ml · {drink.abv}%)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                          <span className="text-neon-lime font-bold">
                            {formatGrams(drink.alcohol_g)}g
                          </span>
                          <span className="text-faint">{timeStr}</span>

                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteDrink(drink.id);
                              }}
                              className="p-1 hover:text-neon-pink text-faint transition-colors"
                              title="Löschen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
