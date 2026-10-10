// ==============================================
// AlcoholTracker 2.0: 5-Sekunden Undo Toast
// ==============================================

import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const UndoToast = ({ drinkInfo, onUndo, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 Sekunden

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onDismiss]);

  if (!drinkInfo) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 bg-[#161622] border border-white/15 rounded-2xl p-3.5 shadow-2xl animate-pop">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl leading-none">{drinkInfo.icon || '🍺'}</span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {drinkInfo.name} eingetragen
            </p>
            <p className="text-[10px] text-dim">
              {drinkInfo.isRound ? 'Runde ausgegeben' : 'Gerade geloggt'}
            </p>
          </div>
        </div>

        <button
          onClick={onUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink text-xs font-bold transition-all active:scale-95 flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rückgängig</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2.5">
        <div
          className="h-full bg-neon-pink transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
