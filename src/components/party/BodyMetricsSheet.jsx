// ==============================================
// AlcoholTracker 2.0: BodyMetricsSheet (Promille-Setup)
// 100% lokales & privates Bottom-Sheet
// ==============================================

import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, Check, Trash2 } from 'lucide-react';
import { getBodyProfile, saveBodyProfile, clearBodyProfile } from '../../utils/bac';

export const BodyMetricsSheet = ({ isOpen, onClose, onSaved }) => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [shareInParty, setShareInParty] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getBodyProfile();
      if (existing) {
        setGender(existing.gender || 'male');
        setAge(existing.age || 25);
        setHeightCm(existing.heightCm || 175);
        setWeightKg(existing.weightKg || 70);
        setShareInParty(Boolean(existing.shareInParty));
        setHasExisting(true);
      } else {
        setHasExisting(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = saveBodyProfile({
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      shareInParty,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSaved) onSaved(saved);
      onClose();
    }, 400);
  };

  const handleClear = () => {
    if (window.confirm('Möchtest du deine hinterlegten Körperdaten wirklich rückstandslos von diesem Gerät löschen?')) {
      clearBodyProfile();
      setHasExisting(false);
      if (onSaved) onSaved(null);
      onClose();
    }
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 flex items-center justify-center text-neon-cyan">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="display-font text-2xl text-white leading-tight">Promille-Radar</h3>
              <p className="text-[10px] text-faint">Wissenschaftliche Watson-Schätzung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 flex-1 overflow-y-auto">
          {/* Privacy Guarantee Banner */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-neon-lime flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-dim leading-relaxed">
              <strong className="text-white font-bold">100% Datenschutz:</strong> Deine biometrischen Angaben (Gewicht, Größe etc.) werden ausschließlich lokal auf diesem Smartphone gespeichert und niemals an Server oder Dritte übertragen.
            </p>
          </div>

          {/* Biologisches Geschlecht */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-faint mb-1.5">
              Biologisches Geschlecht (Körperwasser-Berechnung)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'male', label: 'Männlich', icon: '👨' },
                { id: 'female', label: 'Weiblich', icon: '👩' },
                { id: 'other', label: 'Divers', icon: '🧑' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    gender === g.id
                      ? 'border-neon-cyan bg-neon-cyan/15 text-white shadow-glow-cyan/10'
                      : 'border-white/5 bg-surface-light text-dim hover:text-white'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alter, Größe & Gewicht */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-faint mb-1">
                Alter
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="16"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2.5 bg-surface-light border border-white/10 rounded-xl text-white font-bold text-sm text-center focus:outline-none focus:border-neon-cyan"
                  required
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-faint pointer-events-none">J.</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-faint mb-1">
                Größe
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full p-2.5 bg-surface-light border border-white/10 rounded-xl text-white font-bold text-sm text-center focus:outline-none focus:border-neon-cyan"
                  required
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-faint pointer-events-none">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-faint mb-1">
                Gewicht
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="35"
                  max="220"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full p-2.5 bg-surface-light border border-white/10 rounded-xl text-white font-bold text-sm text-center focus:outline-none focus:border-neon-cyan"
                  required
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-faint pointer-events-none">kg</span>
              </div>
            </div>
          </div>

          {/* Toggle: Mit Party teilen */}
          <div className="p-3.5 rounded-2xl bg-surface-light border border-white/5 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">Promillewert in der Party teilen</p>
              <p className="text-[10px] text-dim leading-snug">
                Nur die berechnete Zahl (z. B. ~0,8 ‰) wird für Freunde sichtbar, niemals deine biometrischen Daten.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShareInParty(!shareInParty)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                shareInParty ? 'bg-neon-lime' : 'bg-white/10'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 left-0.5 ${
                  shareInParty ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[9.5px] text-faint leading-normal italic text-center">
            Hinweis: Schätzwert nach Watson-Kinetik. Niemals als Rechtsgrundlage für Fahrtauglichkeit nutzen – am Steuer gilt immer 0,0 ‰!
          </p>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="btn-lime w-full py-3 flex items-center justify-center gap-2 text-xs font-bold"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Gespeichert!</span>
                </>
              ) : (
                <span>Körperdaten speichern & Pegel berechnen</span>
              )}
            </button>

            {hasExisting && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-2.5 text-[11px] font-bold text-neon-pink/70 hover:text-neon-pink flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Körperdaten vom Gerät löschen</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
