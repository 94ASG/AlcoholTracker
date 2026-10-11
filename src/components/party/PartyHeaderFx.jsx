// ==============================================
// AlcoholTracker 2.0: PartyHeaderFx (Fluid Club Aurora)
// ==============================================

import React from 'react';

/**
 * Option 1: Volumetrische "Fluid Club Aurora" über die volle Bildschirmbreite und -höhe.
 * Erzeugt eine weiche, raumfüllende Club- und Festival-Lichtatmosphäre.
 * Schimmert organisch durch den milchglasartigen iOS-PWA-Statusleisten-Blur,
 * ohne Text oder Buttons zu beeinträchtigen.
 */
export const PartyHeaderFx = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Tiefer Ambient-Raumglow (120% Breite) */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-gradient-to-b from-neon-purple/25 via-neon-cyan/15 to-transparent blur-3xl opacity-75" />

      {/* 2. Fluid Aurora Blob A (Cyan / Lime - Linke Flanke bis Zentrum) */}
      <div
        className="absolute -top-10 -left-16 w-72 h-40 rounded-full blur-[36px] mix-blend-screen opacity-70 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.75) 0%, rgba(198,255,61,0.45) 55%, transparent 75%)',
          animation: 'auroraDrift1 8.5s ease-in-out infinite',
        }}
      />

      {/* 3. Fluid Aurora Blob B (Hot Pink / Purple - Rechte Flanke) */}
      <div
        className="absolute -top-12 -right-16 w-80 h-44 rounded-full blur-[40px] mix-blend-screen opacity-65 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,46,147,0.75) 0%, rgba(139,92,246,0.5) 50%, transparent 75%)',
          animation: 'auroraDrift2 10.5s ease-in-out infinite',
        }}
      />

      {/* 4. Fluid Aurora Blob C (Festival Lime / Amber - Oben Mitte hinter Statusleiste) */}
      <div
        className="absolute -top-14 left-1/4 w-64 h-36 rounded-full blur-[32px] mix-blend-screen opacity-60 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(198,255,61,0.7) 0%, rgba(255,184,0,0.4) 60%, transparent 75%)',
          animation: 'auroraDrift3 9s ease-in-out infinite',
        }}
      />

      {/* 5. Durchgezogenes horizontales Neon-Lichtband (Full-Width Aurora Ribbon) */}
      <div
        className="absolute top-[calc(env(safe-area-inset-top,0px)+0.25rem)] left-0 right-0 h-[2.5px] blur-[1.5px] opacity-70 will-change-transform"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.6) 12%, rgba(198,255,61,0.8) 38%, rgba(255,46,147,0.75) 70%, rgba(139,92,246,0.6) 88%, transparent 100%)',
          animation: 'auroraWavePulse 4s ease-in-out infinite',
        }}
      />

      {/* 6. Weiche Lichtkante darunter für subtile Tiefenwirkung */}
      <div
        className="absolute top-[calc(env(safe-area-inset-top,0px)+0.45rem)] left-0 right-0 h-4 opacity-25 blur-sm"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, rgba(0,240,255,0.3) 25%, rgba(198,255,61,0.4) 50%, rgba(255,46,147,0.3) 75%, transparent 95%)',
        }}
      />

      {/* 7. Subtiler Vignette-Fade nach unten zur perfekten Textlesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070B]/10 to-[#07070B]/60 pointer-events-none" />
    </div>
  );
};

