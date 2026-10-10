// ==============================================
// AlcoholTracker 2.0: PWA Installation Gate
// ==============================================

import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, Smartphone, ShieldCheck } from 'lucide-react';

export const InstallGate = ({ children }) => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [bypass, setBypass] = useState(false);

  useEffect(() => {
    // 1. Prüfe ob Standalone Modus aktiv ist
    const checkStandalone = () => {
      const standaloneQuery = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = window.navigator.standalone === true;
      return standaloneQuery || iosStandalone;
    };

    setIsStandalone(checkStandalone());

    // 2. iOS Erkennung
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Android / Chrome Install Prompt abfangen
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Auf Display-Mode Wechsel lauschen
    const matchMediaHandler = (e) => {
      if (e.matches) setIsStandalone(true);
    };
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', matchMediaHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      mediaQuery.removeEventListener('change', matchMediaHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsStandalone(true);
    }
  };

  // Wenn bereits als App installiert oder im Testmodus bypassed: App anzeigen
  if (isStandalone || bypass) {
    return children;
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-bg text-white flex flex-col justify-between px-6 pb-6 pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] select-none">
      {/* Header */}
      <div className="text-center">
        <img src="/favicon.svg" alt="Logo" className="w-16 h-16 rounded-2xl shadow-glow-lime object-cover mb-4 mx-auto" />
        <h1 className="display-font text-4xl tracking-wider text-white mb-2">
          Alcohol<span className="text-neon-lime">Tracker</span>
        </h1>
        <p className="text-sm text-dim max-w-xs mx-auto leading-relaxed">
          Bitte füge die App zu deinem Home-Bildschirm hinzu, um gemeinsam live zu tracken und Push-Meldungen zu empfangen.
        </p>
      </div>

      {/* Anleitungs-Box */}
      <div className="my-auto py-6">
        <div className="glass-card p-6 border-white/10 space-y-5">
          <div className="flex items-center gap-3 text-neon-lime font-bold text-xs uppercase tracking-widest">
            <Smartphone className="w-4 h-4" />
            <span>Installation in 10 Sekunden</span>
          </div>

          {isIOS ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    Tippe auf Teilen <Share className="w-4 h-4 text-neon-cyan inline" />
                  </p>
                  <p className="text-dim text-xs mt-0.5">
                    (Das Viereck mit Pfeil nach oben in der Safari-Leiste)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    Wähle „Zum Home-Bildschirm“ <PlusSquare className="w-4 h-4 text-neon-lime inline" />
                  </p>
                  <p className="text-dim text-xs mt-0.5">
                    Scrolle im Menü etwas herunter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-white font-semibold">Tippe oben rechts auf „Hinzufügen“</p>
                  <p className="text-dim text-xs mt-0.5">
                    Öffne danach die App direkt vom Home-Bildschirm!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="btn-lime w-full text-base py-4"
                >
                  App jetzt installieren
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-dim text-xs">
                    Tippe im Browser-Menü (oben rechts auf die 3 Punkte <b>⋮</b>) und wähle:
                  </p>
                  <div className="p-3 bg-surface-light rounded-xl border border-white/5 font-semibold text-white flex items-center gap-2">
                    <PlusSquare className="w-4 h-4 text-neon-lime" />
                    <span>„App installieren“ oder „Zum Startbildschirm“</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-faint">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-lime flex-shrink-0" />
            <span>Erforderlich für Push-Benachrichtigungen & Offline-Support.</span>
          </div>
        </div>
      </div>

      {/* Footer mit Entwickler/Test-Bypass */}
      <div className="pb-4 text-center">
        <button
          onClick={() => setBypass(true)}
          className="text-xs text-faint hover:text-dim transition-colors py-2 px-4 rounded-lg"
        >
          Im Browser fortfahren (Test-Modus) &rarr;
        </button>
      </div>
    </div>
  );
};
