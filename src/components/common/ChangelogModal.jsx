// ==============================================
// AlcoholTracker: Changelog & Release Notes Modal
// ==============================================

import React from 'react';
import { X, CheckCircle2, History } from 'lucide-react';
import { APP_VERSION, APP_RELEASE_DATE, RELEASES } from '../../config/version';

export const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="sheet-backdrop z-50" onClick={onClose} />
      <div className="bottom-sheet z-[55] flex flex-col max-h-[85dvh] border-neon-cyan/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20">
              <History className="w-4 h-4" />
            </span>
            <div>
              <h3 className="display-font text-2xl text-white leading-none">Versionshinweise</h3>
              <p className="text-[10px] text-faint font-mono">
                Aktuell: v{APP_VERSION} · {APP_RELEASE_DATE}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-dim hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Release List */}
        <div className="py-4 space-y-4 flex-1 overflow-y-auto">
          {RELEASES.map((rel) => (
            <div
              key={rel.version}
              className={`p-4 rounded-2xl border transition-all ${
                rel.badge
                  ? 'bg-surface-light border-neon-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-neon-lime">
                    v{rel.version}
                  </span>
                  {rel.badge && (
                    <span className="px-2 py-0.2 rounded-full bg-neon-cyan/15 text-neon-cyan text-[10px] font-bold">
                      {rel.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-faint font-mono">{rel.date}</span>
              </div>

              <h4 className="font-bold text-white text-sm mb-2">{rel.title}</h4>

              <ul className="space-y-1.5">
                {rel.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-dim leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neon-lime mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 pb-1 flex-shrink-0">
          <button
            onClick={onClose}
            className="btn-lime w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime cursor-pointer"
          >
            <span>Schließen</span>
          </button>
        </div>
      </div>
    </>
  );
};
