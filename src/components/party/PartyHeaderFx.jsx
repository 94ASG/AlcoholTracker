// ==============================================
// AlcoholTracker 2.0: PartyHeaderFx (Gemini-Live Style Soundwave)
// ==============================================

import React from 'react';

/**
 * Zarte, organisch pulsierende Neon-Soundwave im Gemini-Live-Stil.
 * Platziert im oberen Safe-Area-Bereich, abgestimmt auf den diffusen iOS-PWA-Blur.
 */
export const PartyHeaderFx = () => {
  // 18 harmonische Soundwave-Säulen mit unterschiedlichen Phasen und Höhen
  const bars = [
    { height: 10, delay: '0.1s', color: '#00F0FF' },
    { height: 16, delay: '0.4s', color: '#00F0FF' },
    { height: 22, delay: '0.8s', color: '#38EF7D' },
    { height: 14, delay: '0.2s', color: '#70F25A' },
    { height: 24, delay: '0.6s', color: '#C6FF3D' },
    { height: 18, delay: '1.0s', color: '#C6FF3D' },
    { height: 26, delay: '0.3s', color: '#E2FF5E' },
    { height: 20, delay: '0.7s', color: '#FFE043' },
    { height: 28, delay: '0.1s', color: '#FFB800' },
    { height: 22, delay: '0.5s', color: '#FF7A45' },
    { height: 26, delay: '0.9s', color: '#FF2E93' },
    { height: 18, delay: '0.3s', color: '#FF2E93' },
    { height: 24, delay: '0.7s', color: '#E024B7' },
    { height: 16, delay: '0.2s', color: '#B829E3' },
    { height: 22, delay: '0.6s', color: '#8B5CF6' },
    { height: 14, delay: '1.1s', color: '#7C3AED' },
    { height: 18, delay: '0.4s', color: '#6366F1' },
    { height: 10, delay: '0.8s', color: '#00F0FF' },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 h-[calc(env(safe-area-inset-top,0px)+0.75rem)] pointer-events-none overflow-hidden select-none z-0 flex items-center justify-center opacity-65">
      {/* Sanfter Ambient Aura Glow im Hintergrund */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-lime/[0.04] to-transparent blur-md" />

      {/* Gemini Live Organische Soundwave-Pill-Reihe */}
      <div className="flex items-center justify-center gap-[3px] h-full max-w-[280px] w-full px-4">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            className="w-[2.5px] rounded-full transition-all duration-700 ease-in-out"
            style={{
              height: `${bar.height}px`,
              backgroundColor: bar.color,
              boxShadow: `0 0 8px ${bar.color}99`,
              animation: `geminiLivePulse 2.8s ease-in-out infinite alternate`,
              animationDelay: bar.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};
