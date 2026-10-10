// ==============================================
// AlcoholTracker 2.0: DrinkSheet (1-Tap & Mischen)
// ==============================================

import React, { useState } from 'react';
import { DRINKS_DB, DRINKS_SECTIONS, SPIRITS_DB, MIX_RATIOS, MIX_SIZES, calculateAlcoholGrams } from '../../utils/drinks';
import { X, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DrinkSheet = ({ members, currentProfile, onClose, onLog }) => {
  const [selectedProfileIds, setSelectedProfileIds] = useState([currentProfile?.id]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'mix' | 'custom'

  // Mischen Konfiguration
  const [mixSpirit, setMixSpirit] = useState('vodka');
  const [mixRatio, setMixRatio] = useState('30-70');
  const [mixSize, setMixSize] = useState(250);

  // Eigenes Getränk
  const [customName, setCustomName] = useState('');
  const [customVolume, setCustomVolume] = useState(330);
  const [customAbv, setCustomAbv] = useState(5.0);
  const [customIcon, setCustomIcon] = useState('🍹');
  const [customBeerFactor, setCustomBeerFactor] = useState(0);

  // Trigger Haptic Feedback wenn auf Smartphone
  const triggerHaptic = () => {
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(30);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#C6FF3D', '#FF2E93', '#8B5CF6'],
    });
  };

  // Avatar-Auswahl toggeln
  const toggleProfile = (id) => {
    triggerHaptic();
    if (selectedProfileIds.includes(id)) {
      if (selectedProfileIds.length === 1) return; // Mindestens eine Person muss ausgewählt sein
      setSelectedProfileIds(selectedProfileIds.filter((pId) => pId !== id));
    } else {
      setSelectedProfileIds([...selectedProfileIds, id]);
    }
  };

  const selectAll = () => {
    triggerHaptic();
    setSelectedProfileIds(members.map((m) => m.id));
  };

  const selectOnlyMe = () => {
    triggerHaptic();
    setSelectedProfileIds([currentProfile.id]);
  };

  // 1-Tap Log
  const handleTileTap = (drinkKey) => {
    const item = DRINKS_DB[drinkKey];
    if (item.isCustomMix) {
      setViewMode('mix');
      return;
    }

    triggerHaptic();
    triggerConfetti();

    onLog({
      profileIds: selectedProfileIds,
      drink: {
        key: item.key,
        name: item.name,
        icon: item.icon,
        category: item.category,
        volume: item.volume,
        abv: item.defaultAbv,
        beerFactor: item.beerFactor || 0,
      },
    });

    onClose();
  };

  // Mischen loggen
  const handleMixSubmit = () => {
    const spirit = SPIRITS_DB[mixSpirit];
    const ratioObj = MIX_RATIOS.find((r) => r.value === mixRatio) || MIX_RATIOS[2];
    const effectiveAbv = Number((spirit.abv * ratioObj.ratio).toFixed(1));

    triggerHaptic();
    triggerConfetti();

    onLog({
      profileIds: selectedProfileIds,
      drink: {
        key: 'mischen',
        name: `Mischen ${spirit.name} (${ratioObj.value})`,
        icon: '🥤',
        category: 'mix',
        volume: mixSize,
        abv: effectiveAbv,
        beerFactor: 0,
      },
    });

    onClose();
  };

  // Custom Drink loggen
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    triggerHaptic();
    triggerConfetti();

    onLog({
      profileIds: selectedProfileIds,
      drink: {
        key: 'custom',
        name: customName.trim(),
        icon: customIcon || '🍹',
        category: 'other',
        volume: Number(customVolume) || 300,
        abv: Number(customAbv) || 5,
        beerFactor: Number(customBeerFactor) || 0,
      },
    });

    onClose();
  };

  const isRound = selectedProfileIds.length > 1;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="display-font text-3xl text-white tracking-wide leading-none">
              {viewMode === 'mix'
                ? 'Mischen Konfigurieren'
                : viewMode === 'custom'
                ? 'Eigenes Getränk'
                : 'Getränk wählen'}
            </h2>
            <p className="text-xs text-dim mt-0.5">
              {isRound
                ? `Runde für ${selectedProfileIds.length} Personen 🍻`
                : '1 Tap = sofort geloggt'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wer trinkt? (Avatar Leiste) */}
        <div className="py-3 border-b border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-faint">
              Für wen?
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectOnlyMe}
                className="text-[11px] text-neon-lime hover:underline font-semibold"
              >
                Nur ich
              </button>
              {members.length > 1 && (
                <>
                  <span className="text-white/20">·</span>
                  <button
                    onClick={selectAll}
                    className="text-[11px] text-neon-pink hover:underline font-semibold"
                  >
                    Runde für alle ({members.length})
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1">
            {members.map((m) => {
              const isSelected = selectedProfileIds.includes(m.id);
              const isMe = m.id === currentProfile?.id;
              return (
                <button
                  key={m.id}
                  onClick={() => toggleProfile(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-neon-lime/15 border-neon-lime text-white shadow-glow-lime'
                      : 'bg-surface-light border-white/5 text-dim'
                  }`}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span>{isMe ? 'Du' : m.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-neon-lime ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {viewMode === 'grid' && (
            <div className="space-y-5">
              {DRINKS_SECTIONS.map((section, sIdx) => (
                <div key={section.id} className={sIdx > 0 ? 'pt-4 border-t border-white/[0.08]' : ''}>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-faint mb-2.5">
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                  </div>

                  {section.id === 'mix' ? (
                    <button
                      onClick={() => setViewMode('mix')}
                      className="w-full p-3.5 bg-surface-light hover:bg-surface-hover border border-white/[0.08] hover:border-neon-lime/40 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl transform group-hover:scale-110 transition-transform">🥤</span>
                        <div>
                          <p className="font-bold text-white text-xs">Mischen konfigurieren</p>
                          <p className="text-[10px] text-dim">Wodka, Korn, Springer · Verhältnis & Glasgröße</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-neon-lime/10 text-neon-lime text-[11px] font-bold">
                        Öffnen &rarr;
                      </span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {section.drinks.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => handleTileTap(item.key)}
                          className="p-3 bg-surface-light hover:bg-surface-hover border border-white/[0.06] hover:border-neon-lime/40 rounded-2xl flex items-center gap-2.5 text-left transition-all active:scale-95 group"
                        >
                          <span className="text-2xl transform group-hover:scale-110 transition-transform flex-shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-xs leading-tight truncate">
                              {item.name}
                            </p>
                            <p className="font-mono text-[10px] text-faint mt-0.5">
                              {item.volume}ml · {item.defaultAbv}%
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => setViewMode('custom')}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] text-dim hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4 text-neon-lime" />
                  <span>Anderes / Eigenes Getränk eintragen</span>
                </button>
              </div>
            </div>
          )}

          {/* MISCHEN-KONFIGURATOR */}
          {viewMode === 'mix' && (
            <div className="space-y-4">
              {/* Spirituose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
                  Spirituose
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(SPIRITS_DB).map(([k, s]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setMixSpirit(k)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        mixSpirit === k
                          ? 'border-neon-lime bg-neon-lime/10 text-white font-bold'
                          : 'border-white/5 bg-surface-light text-dim'
                      }`}
                    >
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-xs">{s.name}</div>
                      <div className="text-[10px] text-faint">{s.abv}%</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mischungsverhältnis */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
                  Mischungsverhältnis (Alkohol – Softdrink)
                </label>
                <div className="space-y-1.5">
                  {MIX_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setMixRatio(r.value)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        mixRatio === r.value
                          ? 'border-neon-lime bg-neon-lime/10 text-white font-bold'
                          : 'border-white/5 bg-surface-light text-dim'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="font-mono text-faint">{r.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glasgröße */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-faint mb-2">
                  Glasgröße (ml)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MIX_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setMixSize(sz)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        mixSize === sz
                          ? 'border-neon-lime bg-neon-lime/10 text-white font-bold'
                          : 'border-white/5 bg-surface-light text-dim'
                      }`}
                    >
                      {sz} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="text-dim">Reiner Alkohol pro Glas:</span>
                <span className="font-mono font-bold text-neon-lime text-sm">
                  {calculateAlcoholGrams(
                    mixSize,
                    SPIRITS_DB[mixSpirit].abv * (MIX_RATIOS.find((r) => r.value === mixRatio)?.ratio || 0.3)
                  )} g
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className="btn-secondary flex-1 py-3"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  onClick={handleMixSubmit}
                  className="btn-lime flex-1 py-3"
                >
                  Mischen eintragen
                </button>
              </div>
            </div>
          )}

          {/* EIGENES GETRÄNK */}
          {viewMode === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-faint mb-1">
                  Name des Getränks
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="z.B. Cuba Libre, Gin Basil Smash..."
                  className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-dim focus:outline-none focus:border-neon-lime"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-faint mb-1">
                    Menge (ml)
                  </label>
                  <input
                    type="number"
                    value={customVolume}
                    onChange={(e) => setCustomVolume(e.target.value)}
                    className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-lime"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-faint mb-1">
                    Alkohol (% Vol.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customAbv}
                    onChange={(e) => setCustomAbv(e.target.value)}
                    className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-lime"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-faint mb-1">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white text-center text-lg"
                    maxLength="2"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-faint mb-1">
                    Bierfaktor
                  </label>
                  <select
                    value={customBeerFactor}
                    onChange={(e) => setCustomBeerFactor(Number(e.target.value))}
                    className="w-full p-3 bg-surface-light border border-white/10 rounded-xl text-white"
                  >
                    <option value={0}>0 (Kein Bier)</option>
                    <option value={0.5}>0.5 (Radler)</option>
                    <option value={1}>1.0 (Volles Bier)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className="btn-secondary flex-1 py-3"
                >
                  Zurück
                </button>
                <button type="submit" className="btn-lime flex-1 py-3">
                  Eintragen
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
