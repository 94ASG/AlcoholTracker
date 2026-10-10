// ==============================================
// AlcoholTracker 2.0: Party Menü & Gast-Hinzufügen
// ==============================================

import React, { useState } from 'react';
import { X, Share2, UserPlus, Flag, Check, AlertTriangle } from 'lucide-react';

const GUEST_EMOJIS = ['👨', '👩', '👦', '👧', '🧔', '👱', '🦊', '🐻', '🐼', '🐸'];

export const PartyMenu = ({ party, isHost, onClose, onAddGuest, onEndParty }) => {
  const [mode, setMode] = useState('menu'); // 'menu' | 'add_guest' | 'confirm_end'
  const [guestName, setGuestName] = useState('');
  const [guestEmoji, setGuestEmoji] = useState('👤');
  const [copied, setCopied] = useState(false);

  // Link teilen
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AlcoholTracker: ${party.name}`,
          text: `Tritt der Party „${party.name}“ bei und tracke deine Drinks!`,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onAddGuest({
      name: guestName.trim(),
      emoji: guestEmoji,
      color: '#8B5CF6',
    });
    onClose();
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <h3 className="display-font text-2xl text-white">Party-Optionen</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">
          {mode === 'menu' && (
            <div className="space-y-2.5">
              {/* Teilen */}
              <button
                onClick={handleShare}
                className="w-full p-3.5 rounded-2xl bg-surface-light border border-white/5 flex items-center justify-between text-left transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 flex items-center justify-center text-neon-cyan">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Party-Link teilen</p>
                    <p className="text-xs text-dim">Lade Freunde mit einem Link ein</p>
                  </div>
                </div>
                {copied && <Check className="w-4 h-4 text-neon-lime" />}
              </button>

              {/* Gast ohne Handy */}
              <button
                onClick={() => setMode('add_guest')}
                className="w-full p-3.5 rounded-2xl bg-surface-light border border-white/5 flex items-center gap-3 text-left transition-all active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-neon-purple/15 flex items-center justify-center text-neon-purple">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Gast ohne Handy hinzufügen</p>
                  <p className="text-xs text-dim">Trage jemanden ein, der selbst kein Handy hat</p>
                </div>
              </button>

              {/* Party beenden (Nur Host) */}
              {isHost && (
                <button
                  onClick={() => setMode('confirm_end')}
                  className="w-full p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-left transition-all active:scale-95 mt-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-red-400 text-sm">Abend / Party jetzt beenden</p>
                    <p className="text-xs text-red-300/70">
                      Schaltet das Spotify-Wrapped Leaderboard frei
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* GAST HINZUFÜGEN */}
          {mode === 'add_guest' && (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
                  Avatar wählen
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {GUEST_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setGuestEmoji(em)}
                      className={`p-2.5 rounded-xl text-2xl border text-center transition-all ${
                        guestEmoji === em
                          ? 'border-neon-purple bg-neon-purple/20'
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
                  Name des Gastes
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="z.B. Lukas"
                  className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-purple text-sm"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="btn-secondary flex-1 py-3 text-xs"
                >
                  Zurück
                </button>
                <button type="submit" className="btn-lime flex-1 py-3 text-xs">
                  Gast hinzufügen
                </button>
              </div>
            </form>
          )}

          {/* BESTÄTIGUNG PARTY BEENDEN */}
          {mode === 'confirm_end' && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="display-font text-2xl text-white">Party wirklich beenden?</h4>
                <p className="text-xs text-dim mt-1 max-w-xs mx-auto">
                  Das beendet die Party für alle Teilnehmer und startet sofort das Wrapped-Highlight!
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="btn-secondary flex-1 py-3 text-xs"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEndParty();
                    onClose();
                  }}
                  className="px-5 py-3 rounded-2xl bg-red-500 text-white font-bold flex-1 text-xs"
                >
                  Ja, beenden 🎉
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
