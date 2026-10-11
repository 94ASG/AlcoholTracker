// ==============================================
// AlcoholTracker 2.0: Symbol Keypad Modal (Wii U Pairing)
// ==============================================

import React, { useState } from 'react';
import { CARD_SYMBOLS, CARD_SYMBOLS_MAP, verifySymbolCode } from '../../utils/symbols';
import { X, Delete, Lock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SymbolKeypadModal = ({ targetCode, partyName, onClose, onSuccess }) => {
  const [entered, setEntered] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const triggerHaptic = () => {
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(25);
    }
  };

  const playMicroClick = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const handleSymbolTap = (symbolId) => {
    if (entered.length >= 4) return;
    triggerHaptic();
    playMicroClick();
    setErrorMsg('');

    const next = [...entered, symbolId];
    setEntered(next);

    // Wenn 4 Symbole vollständig eingegeben sind: Verifizieren
    if (next.length === 4) {
      const isValid = verifySymbolCode(next, targetCode);
      if (isValid) {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#FF2E93', '#FFB800', '#C6FF3D'],
        });
        setTimeout(() => {
          onSuccess();
        }, 300);
      } else {
        // Fehler-Effekt (Shake)
        setTimeout(() => {
          setIsShaking(true);
          setErrorMsg('Falsche Symbol-Kombination! Frag den Host.');
          if (window.navigator?.vibrate) {
            window.navigator.vibrate([40, 40, 40]);
          }
          setTimeout(() => {
            setIsShaking(false);
            setEntered([]);
          }, 800);
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic();
    playMicroClick();
    setErrorMsg('');
    setEntered((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    triggerHaptic();
    setErrorMsg('');
    setEntered([]);
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet flex flex-col max-h-[90dvh] border-neon-cyan/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20">
              <Lock className="w-4 h-4" />
            </span>
            <h3 className="display-font text-2xl text-white">Code eingeben</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-5 flex-1 overflow-y-auto text-center">
          <div>
            <h4 className="font-bold text-white text-base">
              {partyName || 'Party geschützt'}
            </h4>
            <p className="text-xs text-dim mt-0.5">
              Gib die 4 Symbole in der richtigen Reihenfolge ein:
            </p>
          </div>

          {/* 4 Eingabe-Slots (Wii U Style) */}
          <div className={`grid grid-cols-4 gap-3 max-w-[260px] mx-auto transition-transform ${isShaking ? 'animate-bounce' : ''}`}>
            {[0, 1, 2, 3].map((slotIdx) => {
              const symbolId = entered[slotIdx];
              const symbolObj = symbolId ? CARD_SYMBOLS_MAP[symbolId] : null;

              if (symbolObj) {
                return (
                  <div
                    key={slotIdx}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all scale-105 ${symbolObj.borderClass} ${symbolObj.bgClass} ${symbolObj.glowClass}`}
                  >
                    <span className="text-3xl font-black leading-none drop-shadow-md" style={{ color: symbolObj.color }}>
                      {symbolObj.symbol}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={slotIdx}
                  className="aspect-square rounded-2xl flex items-center justify-center border border-white/10 bg-white/[0.02]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-neon-pink font-bold animate-pulse">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 4 Große Kartensymbol-Buttons */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
            {CARD_SYMBOLS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSymbolTap(s.id)}
                disabled={entered.length >= 4}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all active:scale-95 hover:brightness-110 ${s.borderClass} ${s.bgClass} ${s.glowClass}`}
              >
                <span className="text-3xl font-black drop-shadow" style={{ color: s.color }}>
                  {s.symbol}
                </span>
                <span className="font-extrabold text-white text-base tracking-wide">
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Controls: Löschen & Reset */}
          <div className="flex justify-center gap-4 pt-1 text-xs">
            <button
              type="button"
              onClick={handleDelete}
              disabled={entered.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-dim hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <Delete className="w-4 h-4" />
              <span>Letztes löschen</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={entered.length === 0}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-dim hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
