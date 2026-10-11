// ==============================================
// AlcoholTracker 2.0: Home Screen (Laufende Partys)
// ==============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useProfile } from '../context/ProfileContext';
import { formatTimeRemaining } from '../utils/drinks';
import { generateRandomSymbolCode } from '../utils/symbols';
import { SymbolKeypadModal } from '../components/party/SymbolKeypadModal';
import { PartyCodeRevealModal } from '../components/party/PartyCodeRevealModal';
import { Plus, ArrowRight, X, Lock, Users } from 'lucide-react';

const PARTY_EMOJIS = ['🎉', '🍺', '🍻', '🍹', '🍾', '🌴', '🔥', '🕺', '💃', '🚀'];

export const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [activeParties, setActiveParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Neues Party-Formular
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyEmoji, setNewPartyEmoji] = useState('🎉');
  const [useCodeProtection, setUseCodeProtection] = useState(false);
  const [creating, setCreating] = useState(false);

  // Password Modals
  const [createdPartyWithCode, setCreatedPartyWithCode] = useState(null);
  const [unlockingParty, setUnlockingParty] = useState(null);

  const fetchParties = async () => {
    try {
      const list = await api.listActiveParties();
      setActiveParties(list);
    } catch (err) {
      console.error('Fehler beim Laden der Partys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleCreateParty = async (e) => {
    e.preventDefault();
    if (!newPartyName.trim() || creating) return;

    setCreating(true);
    try {
      const symbolCode = useCodeProtection ? generateRandomSymbolCode() : null;

      const created = await api.createParty({
        name: newPartyName.trim(),
        emoji: newPartyEmoji,
        hostId: profile.id,
        symbolCode,
      });

      setIsCreateOpen(false);
      setNewPartyName('');
      setUseCodeProtection(false);

      if (symbolCode) {
        setCreatedPartyWithCode({ ...created, symbol_code: symbolCode });
      } else {
        navigate(`/p/${created.id}`);
      }
    } catch (err) {
      alert('Fehler beim Erstellen: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinParty = async (partyId) => {
    try {
      await api.joinParty(partyId, profile.id);
      navigate(`/p/${partyId}`);
    } catch (err) {
      console.error(err);
      navigate(`/p/${partyId}`);
    }
  };

  const handlePartyCardClick = (p) => {
    const members = (p.party_members || []).map((m) => m.profiles).filter(Boolean);
    const isMember = members.some((m) => m.id === profile?.id);

    if (isMember) {
      navigate(`/p/${p.id}`);
      return;
    }

    if (p.symbol_code) {
      setUnlockingParty(p);
      return;
    }

    handleJoinParty(p.id);
  };

  return (
    <div className="app-container px-5 pb-24 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8 rounded-xl shadow-glow-lime object-cover" />
          <h1 className="display-font text-3xl text-white tracking-wide leading-none">
            Alcohol<span className="text-neon-lime">Tracker</span>
          </h1>
        </div>

        {/* Profil Button */}
        <button
          onClick={() => navigate('/me')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-light border border-white/5 text-white hover:border-white/20 transition-all active:scale-95"
        >
          <span className="text-lg">{profile?.emoji}</span>
          <span className="text-xs font-bold truncate max-w-[80px]">
            {profile?.name}
          </span>
        </button>
      </header>

      {/* Hauptbereich */}
      <main className="space-y-6">
        {/* Banner / Start CTA */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#181828] via-[#10101C] to-bg border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-neon-lime/10 blur-3xl rounded-full" />
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neon-lime">
              Gemeinsam Trinken
            </span>
            <h2 className="display-font text-4xl text-white tracking-wide leading-none">
              Bereit für die nächste Runde?
            </h2>
            <p className="text-xs text-dim max-w-xs leading-relaxed">
              Starte ein Event oder tritt einer laufenden Party deiner Freunde bei.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-lime w-full text-sm font-black py-4 mt-2 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Neue Party starten</span>
            </button>
          </div>
        </div>

        {/* Laufende Partys Liste */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="display-font text-2xl text-white tracking-wide">
              Laufende Partys ({activeParties.length})
            </h3>
            <button
              onClick={fetchParties}
              className="text-xs text-neon-lime hover:underline font-bold"
            >
              Aktualisieren
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-dim text-xs">Partys laden...</div>
          ) : activeParties.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-2 border-dashed border-white/10">
              <span className="text-4xl block mb-2">🍹</span>
              <p className="font-bold text-white text-sm">Gerade läuft keine Party.</p>
              <p className="text-xs text-dim max-w-xs mx-auto">
                Erstelle jetzt eine, damit deine Freunde direkt beitreten können!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeParties.map((p) => {
                const members = (p.party_members || []).map((m) => m.profiles).filter(Boolean);
                const isMember = members.some((m) => m.id === profile?.id);
                const timeStr = formatTimeRemaining(p.ends_at);

                return (
                  <div
                    key={p.id}
                    onClick={() => handlePartyCardClick(p)}
                    className={`glass-card p-4 transition-all active:scale-[0.99] cursor-pointer hover:border-white/20 ${
                      isMember ? 'border-neon-lime/30 bg-surface/95' : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                          {p.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base leading-tight">
                              {p.name}
                            </h4>
                            {p.symbol_code && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan text-[10px] font-bold border border-neon-cyan/25">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Code-geschützt</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-faint font-mono mt-0.5">
                            noch {timeStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold pt-1">
                        <span className={isMember ? 'text-neon-lime' : p.symbol_code ? 'text-neon-cyan' : 'text-neon-lime'}>
                          {isMember ? 'Öffnen' : p.symbol_code ? 'Entsperren 🔒' : 'Beitreten'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-dim" />
                      </div>
                    </div>

                    {/* Mitglieder Avatare & Teilnehmerzahl */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {members.slice(0, 6).map((m, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-full bg-surface-light border-2 border-surface flex items-center justify-center text-xs"
                              title={m.name}
                            >
                              {m.emoji}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-dim font-bold ml-1">
                          <Users className="w-3.5 h-3.5 text-neon-lime" />
                          <span>{members.length} {members.length === 1 ? 'Teilnehmer' : 'Teilnehmer'}</span>
                        </div>
                      </div>

                      {isMember && (
                        <span className="text-[10px] font-bold text-neon-lime bg-neon-lime/10 px-2 py-0.5 rounded-full border border-neon-lime/20">
                          Dabei ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* App Guide Button / Teaser */}
        <div className="pt-1">
          <button
            onClick={() => navigate('/guide')}
            className="w-full card p-4 flex items-center justify-between group hover:border-neon-lime/30 transition-all text-left active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                💡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm group-hover:text-neon-lime transition-colors">
                    So funktioniert's
                  </h4>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md bg-neon-lime/10 text-neon-lime border border-neon-lime/20">
                    Guide
                  </span>
                </div>
                <p className="text-xs text-dim mt-0.5">
                  Erfahre alles über Partys, Runden & den Story-Rückblick
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-dim group-hover:text-neon-lime group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        </div>
      </main>

      {/* MODAL: NEUE PARTY STARTEN */}
      {isCreateOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setIsCreateOpen(false)} />
          <div className="bottom-sheet flex flex-col max-h-[85dvh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] flex-shrink-0">
              <h3 className="display-font text-3xl text-white">Party starten</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateParty} className="py-3 space-y-3.5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-1.5">
                  Party-Emoji
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {PARTY_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewPartyEmoji(em)}
                      className={`p-2 text-xl rounded-xl border text-center transition-all ${
                        newPartyEmoji === em
                          ? 'border-neon-lime bg-neon-lime/10'
                          : 'border-white/5 bg-surface-light'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-1">
                  Name der Party
                </label>
                <input
                  type="text"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="z.B. Geburtstagsfeier, WG-Abend..."
                  maxLength={40}
                  className="w-full p-3.5 bg-surface-light border border-white/10 rounded-2xl text-white font-bold placeholder-dim focus:outline-none focus:border-neon-lime text-sm"
                  autoComplete="off"
                  required
                />
              </div>

              {/* Passwort / Symbol-Code Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-surface-light border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 flex items-center justify-center text-base flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-white text-xs">Mit Zufalls-Code schützen</p>
                    <p className="text-[10px] text-dim">Andere benötigen eine PIN, um beizutreten</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseCodeProtection(!useCodeProtection)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0 ${
                    useCodeProtection ? 'bg-neon-cyan' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      useCodeProtection ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 text-[11px] text-faint leading-relaxed">
                ⏰ <b>Automatisches Ende:</b> Die Party endet nach maximal 10 Stunden bzw. am nächsten Morgen um 10:00 Uhr. Danach erhalten alle den Story-Rückblick des Abends!
              </div>

              <div className="pt-1 pb-3">
                <button
                  type="submit"
                  disabled={!newPartyName.trim() || creating}
                  className="btn-lime w-full py-4 text-sm font-black"
                >
                  {creating ? 'Erstelle...' : 'Party jetzt eröffnen 🎉'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* MODAL: CODE EINGEBEN BEIM BEITRETEN */}
      {unlockingParty && (
        <SymbolKeypadModal
          targetCode={unlockingParty.symbol_code}
          partyName={unlockingParty.name}
          onClose={() => setUnlockingParty(null)}
          onSuccess={() => {
            const pId = unlockingParty.id;
            setUnlockingParty(null);
            handleJoinParty(pId);
          }}
        />
      )}

      {/* MODAL: CODE ANZEIGEN NACH ERSTELLUNG */}
      {createdPartyWithCode && (
        <PartyCodeRevealModal
          symbolCode={createdPartyWithCode.symbol_code}
          partyName={createdPartyWithCode.name}
          isJustCreated={true}
          onClose={() => {
            const pId = createdPartyWithCode.id;
            setCreatedPartyWithCode(null);
            navigate(`/p/${pId}`);
          }}
          onProceed={() => {
            const pId = createdPartyWithCode.id;
            setCreatedPartyWithCode(null);
            navigate(`/p/${pId}`);
          }}
        />
      )}
    </div>
  );
};
