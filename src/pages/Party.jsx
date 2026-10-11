// ==============================================
// AlcoholTracker 2.0: Party Screen (Ranking & Feed)
// ==============================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParty } from '../hooks/useParty';
import { useProfile } from '../context/ProfileContext';
import { Leaderboard } from '../components/party/Leaderboard';
import { Feed } from '../components/party/Feed';
import { DrinkSheet } from '../components/party/DrinkSheet';
import { PartyMenu } from '../components/party/PartyMenu';
import { UndoToast } from '../components/party/UndoToast';
import { formatTimeRemaining, getGroupMilestoneInfo } from '../utils/drinks';
import { ArrowLeft, MoreVertical, Plus, Sparkles, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyHeaderFx } from '../components/party/PartyHeaderFx';
import { PartyCodeRevealModal } from '../components/party/PartyCodeRevealModal';
import { SymbolKeypadModal } from '../components/party/SymbolKeypadModal';
import { api } from '../lib/api';

export const Party = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const {
    party,
    members,
    drinks,
    reactions,
    leaderboard,
    lastDrinkOfUser,
    totalPartyDrinks,
    totalPartyAlcoholGrams,
    loading,
    error,
    isHost,
    isEnded,
    logDrink,
    deleteDrink,
    toggleReaction,
    addGuest,
    endParty,
    refresh,
  } = useParty(id);

  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'feed'
  const [isDrinkSheetOpen, setIsDrinkSheetOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isDirectJoinModalOpen, setIsDirectJoinModalOpen] = useState(true);
  const [undoItem, setUndoItem] = useState(null); // { drinkIds, name, icon, isRound }

  const isMember = useMemo(() => {
    return (members || []).some((m) => m.id === profile?.id);
  }, [members, profile?.id]);

  // Offene Partys automatisch beitreten, falls Direktlink aufgerufen wurde
  useEffect(() => {
    if (loading || !party || !profile) return;
    if (!isMember && !party.symbol_code) {
      api.joinParty(id, profile.id).then(() => {
        refresh();
      }).catch(console.error);
    }
  }, [loading, party, profile, isMember, id, refresh]);

  // Countdown State
  const [timeRemaining, setTimeRemaining] = useState('');

  // Gruppen-Meilenstein Konfetti
  const prevAchievedRef = useRef(null);
  const milestoneInfo = useMemo(() => getGroupMilestoneInfo(totalPartyAlcoholGrams), [totalPartyAlcoholGrams]);

  useEffect(() => {
    if (loading) return;
    if (prevAchievedRef.current === null) {
      prevAchievedRef.current = milestoneInfo.achievedCount;
      return;
    }
    if (milestoneInfo.achievedCount > prevAchievedRef.current) {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#C6FF3D', '#FF2E93', '#FFB800'],
      });
      prevAchievedRef.current = milestoneInfo.achievedCount;
    }
  }, [milestoneInfo.achievedCount, loading]);

  useEffect(() => {
    if (!party?.ends_at) return;
    const updateCountdown = () => {
      setTimeRemaining(formatTimeRemaining(party.ends_at));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // alle 60 Sek
    return () => clearInterval(interval);
  }, [party?.ends_at]);

  // Wenn Party beendet ist und der Nutzer noch kein Wrapped gesehen hat, Banner anzeigen
  const handleOpenWrapped = () => {
    navigate(`/p/${id}/wrapped`);
  };

  const handleLogDrinks = async ({ profileIds, drink, createdAt }) => {
    try {
      const logged = await logDrink({ profileIds, drink, createdAt });
      if (logged && logged.length > 0) {
        setUndoItem({
          drinkIds: logged.map((d) => d.id),
          name: drink.name,
          icon: drink.icon,
          isRound: profileIds.length > 1,
        });
      }
    } catch (err) {
      console.error('Fehler beim Eintragen:', err);
    }
  };

  const handleQuickRepeat = async () => {
    if (!lastDrinkOfUser) return;
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.9 },
      colors: ['#C6FF3D', '#FF2E93'],
    });

    handleLogDrinks({
      profileIds: [profile.id],
      drink: {
        key: lastDrinkOfUser.drink_key,
        name: lastDrinkOfUser.name,
        icon: lastDrinkOfUser.icon,
        category: lastDrinkOfUser.category,
        volume: Number(lastDrinkOfUser.volume_ml),
        abv: Number(lastDrinkOfUser.abv),
        beerFactor: Number(lastDrinkOfUser.beer_liters > 0 ? 1 : 0),
      },
    });
  };

  const handleUndo = async () => {
    if (!undoItem) return;
    for (const dId of undoItem.drinkIds) {
      await deleteDrink(dId);
    }
    setUndoItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-bg flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <span className="text-4xl animate-bounce inline-block">🍺</span>
          <p className="text-xs text-dim font-bold tracking-wider uppercase">Lade Party...</p>
        </div>
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-bg p-6 flex flex-col justify-center text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h2 className="display-font text-3xl text-white mb-2">Party nicht gefunden</h2>
        <p className="text-xs text-dim mb-6">Diese Party existiert nicht oder wurde gelöscht.</p>
        <button onClick={() => navigate('/')} className="btn-lime">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  // Direktlink-Schutz für Partys mit Symbol-Code, falls noch kein Mitglied
  if (party.symbol_code && !isMember) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <PartyHeaderFx />
        <div className="w-16 h-16 rounded-3xl bg-surface-light border border-neon-lime/30 flex items-center justify-center text-3xl shadow-glow-lime/20 mb-4 animate-pulse">
          🔒
        </div>
        <h2 className="display-font text-3xl text-white mb-2">{party.name}</h2>
        <p className="text-xs text-dim mb-6 max-w-xs">
          Diese Party ist mit einem 4-teiligen Symbol-Code geschützt. Gib die 4 Symbole ein, um beizutreten!
        </p>
        <button
          onClick={() => setIsDirectJoinModalOpen(true)}
          className="btn-lime w-full"
        >
          Symbol-Code eingeben
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-xs text-faint hover:text-dim"
        >
          Zurück zur Übersicht
        </button>

        <SymbolKeypadModal
          partyName={party.name}
          targetSymbolCode={party.symbol_code}
          isOpen={isDirectJoinModalOpen}
          onClose={() => navigate('/')}
          onSuccess={async () => {
            setIsDirectJoinModalOpen(false);
            await api.joinParty(id, profile.id);
            await refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-container pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-white/[0.08] px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] relative overflow-hidden">
        {/* Gemini Live Soundwave Fx */}
        <PartyHeaderFx />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl bg-surface-light border border-white/5 flex items-center justify-center text-dim hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight flex items-center gap-1.5">
                <span>{party.emoji}</span>
                <span className="truncate max-w-[150px] xs:max-w-[180px]">{party.name}</span>
              </h1>
              <p className="text-[11px] text-faint font-mono">
                {members.length} {members.length === 1 ? 'Person' : 'Personen'} ·{' '}
                {isEnded ? (
                  <span className="text-neon-pink font-bold">Party beendet</span>
                ) : (
                  <span>noch {timeRemaining}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Party-Code Button (falls Code-geschützt) */}
            {party.symbol_code && (
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="h-9 px-2.5 rounded-xl bg-surface-light border border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-glow-lime/10"
                title="Party-Code ansehen"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden xs:inline">Code</span>
              </button>
            )}

            {isEnded ? (
              <button
                onClick={handleOpenWrapped}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white text-xs font-bold flex items-center gap-1 shadow-glow-pink animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wrapped</span>
              </button>
            ) : null}

            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-9 h-9 rounded-xl bg-surface-light border border-white/5 flex items-center justify-center text-dim hover:text-white"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Ranking vs Live-Feed */}
        <div className="relative z-10 flex bg-surface-light rounded-xl p-1 mt-3 border border-white/5">
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ranking'
                ? 'bg-neon-lime text-black shadow-glow-lime'
                : 'text-dim hover:text-white'
            }`}
          >
            🏆 Live-Ranking
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-neon-pink text-white shadow-glow-pink'
                : 'text-dim hover:text-white'
            }`}
          >
            <span>⚡ Live-Feed</span>
            {totalPartyDrinks > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {totalPartyDrinks}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-5">
        {activeTab === 'ranking' ? (
          <Leaderboard
            leaderboard={leaderboard}
            drinks={drinks}
            currentProfile={profile}
            onDeleteDrink={deleteDrink}
          />
        ) : (
          <Feed
            drinks={drinks}
            reactions={reactions}
            members={members}
            currentProfile={profile}
            onToggleReaction={toggleReaction}
          />
        )}
      </main>

      {/* DAUMENZONE (Floating Action Leiste unten) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 p-5 pointer-events-none">
        <div className="flex items-center justify-end gap-3 pointer-events-auto">
          {/* Quick Repeat Button ("Nochmal [Drink]") */}
          {lastDrinkOfUser && !isEnded && (
            <button
              onClick={handleQuickRepeat}
              className="px-4 py-3.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-white/15 text-white font-bold text-xs flex items-center gap-2 shadow-2xl active:scale-95 transition-all"
            >
              <span className="text-lg leading-none">{lastDrinkOfUser.icon}</span>
              <span>Nochmal {lastDrinkOfUser.name}</span>
            </button>
          )}

          {/* Großer Neon Plus Button */}
          {!isEnded && (
            <button
              onClick={() => setIsDrinkSheetOpen(true)}
              className="w-16 h-16 rounded-2xl bg-neon-lime text-black flex items-center justify-center shadow-glow-lime active:scale-90 transition-all flex-shrink-0"
              aria-label="Getränk hinzufügen"
            >
              <Plus className="w-9 h-9 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Undo Toast */}
      {undoItem && (
        <UndoToast
          drinkInfo={undoItem}
          onUndo={handleUndo}
          onDismiss={() => setUndoItem(null)}
        />
      )}

      {/* Drink Sheet */}
      {isDrinkSheetOpen && (
        <DrinkSheet
          members={members}
          currentProfile={profile}
          onClose={() => setIsDrinkSheetOpen(false)}
          onLog={handleLogDrinks}
        />
      )}

      {/* Party Options Menu */}
      {isMenuOpen && (
        <PartyMenu
          party={party}
          isHost={isHost}
          onClose={() => setIsMenuOpen(false)}
          onAddGuest={addGuest}
          onEndParty={endParty}
          onShowCode={() => setIsCodeModalOpen(true)}
        />
      )}

      {/* Party-Code Reveal Modal */}
      {party?.symbol_code && isCodeModalOpen && (
        <PartyCodeRevealModal
          isOpen={isCodeModalOpen}
          partyName={party.name}
          symbolCode={party.symbol_code}
          onClose={() => setIsCodeModalOpen(false)}
        />
      )}
    </div>
  );
};
