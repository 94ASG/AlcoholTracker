// ==============================================
// AlcoholTracker 2.0: Party Code Reveal Modal (Wii U Style)
// ==============================================

import React from 'react';
import { parseSymbolCode } from '../../utils/symbols';
import { X, Lock, Sparkles } from 'lucide-react';

export const PartyCodeRevealModal = ({ symbolCode, partyName, onClose, onProceed, isJustCreated = false }) => {
  const symbols = parseSymbolCode(symbolCode);

  if (!symbols || symbols.length !== 4) return null;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet flex flex-col max-h-[85dvh] border-neon-cyan/30 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20">
              <Lock className="w-4 h-4" />
            </span>
            <h3 className="display-font text-2xl text-white">Party-Code</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-6 flex-1 overflow-y-auto text-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-pink/15 text-neon-pink text-xs font-bold uppercase tracking-wider mb-2 border border-neon-pink/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wii U Pairing Code</span>
            </div>
            <h4 className="font-extrabold text-white text-lg">
              {isJustCreated ? 'Party erfolgreich erstellt! 🎉' : partyName || 'Party-Code'}
            </h4>
            <p className="text-xs text-dim max-w-xs mx-auto mt-1">
              Zeige diesen 4-Symbol-Code deinen Freunden im Raum, damit sie beitreten können:
            </p>
          </div>

          {/* Die 4 leuchtenden Symbol-Karten */}
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
            {symbols.map((s, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${s.borderClass} ${s.bgClass} ${s.glowClass}`}
              >
                <span className="text-3xl font-black leading-none drop-shadow-md" style={{ color: s.color }}>
                  {s.symbol}
                </span>
                <span className="text-[10px] font-mono font-bold mt-1 uppercase tracking-wider text-dim">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-[11px] text-faint max-w-xs mx-auto leading-relaxed">
            💡 <b>Tipp:</b> Du kannst diesen Code auch während der Party jederzeit oben über den <b>[🔒 Code]</b>-Button im Header aufrufen.
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2 pb-1 flex-shrink-0">
          <button
            onClick={onProceed || onClose}
            className="btn-lime w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime"
          >
            <span>{isJustCreated ? 'Alles klar, zur Party 🚀' : 'Schließen'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
