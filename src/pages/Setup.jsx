// ==============================================
// AlcoholTracker 2.0: Setup Page (Name & Avatar)
// ==============================================

import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

const EMOJI_OPTIONS = [
  '😎', '🥳', '🤠', '🍺', '🍸',
  '🦊', '🐻', '🐼', '🦁', '🐸',
  '👨‍🦱', '👩‍🦱', '👨', '👩', '🧑'
];

const COLOR_OPTIONS = [
  { name: 'Lime', hex: '#C6FF3D' },
  { name: 'Pink', hex: '#FF2E93' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Cyan', hex: '#00F0FF' },
  { name: 'Amber', hex: '#FFB800' },
];

export const Setup = ({ onDone }) => {
  const { saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('😎');
  const [color, setColor] = useState('#C6FF3D');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await saveProfile({
        name: name.trim(),
        emoji,
        color,
      });
      if (onDone) onDone();
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-bg text-white flex flex-col justify-between p-6">
      {/* Header */}
      <div className="pt-8 text-center">
        <h1 className="display-font text-5xl tracking-wide text-white mb-2">
          Dein <span className="text-neon-lime">Profil</span>
        </h1>
        <p className="text-xs text-dim">
          Wähle einen Namen und Style für deine Runden mit Freunden.
        </p>

        {/* Live Preview Avatar */}
        <div className="mt-6 flex justify-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl border-2 transition-all shadow-2xl"
            style={{
              backgroundColor: `${color}18`,
              borderColor: color,
              boxShadow: `0 0 25px -5px ${color}55`,
            }}
          >
            {emoji}
          </div>
        </div>
        <p className="font-bold text-white text-base mt-2">
          {name.trim() || 'Dein Name'}
        </p>
      </div>

      {/* Formular */}
      <form onSubmit={handleSubmit} className="space-y-6 my-auto py-6">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
            Dein Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Alex, Tom, Lisa..."
            maxLength={25}
            className="w-full p-4 bg-surface-light border border-white/10 rounded-2xl text-white font-bold placeholder-dim focus:outline-none focus:border-neon-lime text-base transition-colors"
            autoFocus
            required
          />
        </div>

        {/* Emoji Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
            Emoji wählen
          </label>
          <div className="grid grid-cols-5 gap-2">
            {EMOJI_OPTIONS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`p-3 text-2xl rounded-2xl border transition-all ${
                  emoji === em
                    ? 'border-white bg-white/20 scale-105 shadow-md'
                    : 'border-white/5 bg-surface-light hover:bg-surface-hover'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Farbe wählen */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
            Deine Akzentfarbe
          </label>
          <div className="flex gap-3 justify-center">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-10 h-10 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  color === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || submitting}
          className="btn-lime w-full text-base py-4 font-black tracking-wide"
        >
          {submitting ? 'Speichere...' : "Los geht's 🚀"}
        </button>
      </form>

      <div className="pb-4 text-center text-[11px] text-faint">
        Kein Passwort nötig · Gespeichert auf deinem Gerät
      </div>
    </div>
  );
};
