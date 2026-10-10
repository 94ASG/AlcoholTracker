// ==============================================
// AlcoholTracker 2.0: Home Screen (Laufende Partys)
// ==============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useProfile } from '../context/ProfileContext';
import { formatTimeRemaining } from '../utils/drinks';
import { Plus, ArrowRight, X } from 'lucide-react';

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
  const [creating, setCreating] = useState(false);

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
      const created = await api.createParty({
        name: newPartyName.trim(),
        emoji: newPartyEmoji,
        hostId: profile.id,
      });

      setIsCreateOpen(false);
      navigate(`/p/${created.id}`);
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

  return (
    <div className="app-container p-5 pb-24">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-2 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🍺</span>
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
                    onClick={() => handleJoinParty(p.id)}
                    className={`glass-card p-4 transition-all active:scale-[0.99] cursor-pointer hover:border-white/20 ${
                      isMember ? 'border-neon-lime/30 bg-surface/95' : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/5 flex items-center justify-center text-2xl">
                          {p.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base leading-tight">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-faint font-mono mt-0.5">
                            noch {timeStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-neon-lime text-xs font-bold pt-1">
                        <span>{isMember ? 'Öffnen' : 'Beitreten'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Mitglieder Avatare */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
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
                      <span className="text-xs text-dim font-medium ml-1">
                        {members.length} {members.length === 1 ? 'Teilnehmer' : 'Teilnehmer'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: NEUE PARTY STARTEN */}
      {isCreateOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setIsCreateOpen(false)} />
          <div className="bottom-sheet">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="display-font text-3xl text-white">Party starten</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateParty} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
                  Party-Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PARTY_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewPartyEmoji(em)}
                      className={`p-2.5 text-2xl rounded-2xl border text-center transition-all ${
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
                  autoFocus
                  required
                />
              </div>

              <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 text-[11px] text-faint leading-relaxed">
                ⏰ <b>Automatisches Ende:</b> Die Party endet nach maximal 10 Stunden bzw. am nächsten Morgen um 10:00 Uhr. Danach erhalten alle das Spotify-Wrapped!
              </div>

              <button
                type="submit"
                disabled={!newPartyName.trim() || creating}
                className="btn-lime w-full py-4 text-sm font-black"
              >
                {creating ? 'Erstelle...' : 'Party jetzt eröffnen 🎉'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
