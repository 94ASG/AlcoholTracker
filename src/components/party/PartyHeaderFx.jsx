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
      {/* 1. Voller oberer Ambient-Glow (reicht über den oberen Rand hinaus) */}
      <div className="absolute -top-16 inset-x-0 h-52 bg-gradient-to-b from-neon-purple/35 via-neon-cyan/20 to-transparent blur-3xl opacity-80" />

      {/* 2. Fluid Aurora Blob A (Cyan / Lime - Linke Flanke) */}
      <div
        className="absolute -top-16 -left-14 w-80 h-52 rounded-full blur-[42px] mix-blend-screen opacity-75 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.8) 0%, rgba(198,255,61,0.5) 55%, transparent 75%)',
          animation: 'auroraDrift1 8.5s ease-in-out infinite',
        }}
      />

      {/* 3. Fluid Aurora Blob B (Hot Pink / Purple - Rechte Flanke) */}
      <div
        className="absolute -top-16 -right-14 w-88 h-56 rounded-full blur-[45px] mix-blend-screen opacity-70 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,46,147,0.8) 0%, rgba(139,92,246,0.55) 50%, transparent 75%)',
          animation: 'auroraDrift2 10.5s ease-in-out infinite',
        }}
      />

      {/* 4. Fluid Aurora Blob C (Festival Lime / Amber - Oben Mitte) */}
      <div
        className="absolute -top-20 left-1/4 w-72 h-48 rounded-full blur-[38px] mix-blend-screen opacity-65 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(198,255,61,0.75) 0%, rgba(255,184,0,0.45) 60%, transparent 75%)',
          animation: 'auroraDrift3 9s ease-in-out infinite',
        }}
      />

      {/* 5. Fluid Aurora Blob D (Deep Electric Violet / Blue - Direkt unter Statusleiste / Dynamic Island) */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-68 h-40 rounded-full blur-[34px] mix-blend-screen opacity-75 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(0,240,255,0.45) 65%, transparent 75%)',
          animation: 'auroraDrift1 11s ease-in-out infinite reverse',
        }}
      />

      {/* 6. Subtiler Vignette-Fade nach unten zur perfekten Textlesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070B]/10 to-[#07070B]/60 pointer-events-none" />
    </div>
  );
};

