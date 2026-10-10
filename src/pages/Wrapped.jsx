// ==============================================
// AlcoholTracker 2.0: Spotify-Wrapped Story Player
// ==============================================

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useProfile } from '../context/ProfileContext';
import { formatGrams } from '../utils/drinks';
import { X, Share2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Wrapped = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, markWrappedSeen } = useProfile();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const SLIDE_DURATION = 6000; // 6 Sekunden pro Slide

  useEffect(() => {
    const load = async () => {
      try {
        const full = await api.getPartyFull(id);
        setData(full);
        markWrappedSeen(id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, markWrappedSeen]);

  // Berechne alle Slides und Fun Facts
  const slides = useMemo(() => {
    if (!data || !data.party) return [];

    const { party, members, drinks } = data;
    const s = [];

    // Aggregiere Trinker-Statistiken
    const statsMap = new Map();
    members.forEach((m) => {
      statsMap.set(m.id, {
        profile: m,
        alcoholGrams: 0,
        drinksCount: 0,
        drinkCounts: {},
        roundsGiven: 0,
      });
    });

    drinks.forEach((d) => {
      const entry = statsMap.get(d.profile_id);
      if (entry) {
        entry.alcoholGrams += Number(d.alcohol_g) || 0;
        entry.drinksCount += 1;
        entry.drinkCounts[d.name] = (entry.drinkCounts[d.name] || 0) + 1;
      }

      // Check rounds given
      if (d.round_id && d.logged_by && d.logged_by !== d.profile_id) {
        const hostEntry = statsMap.get(d.logged_by);
        if (hostEntry) {
          hostEntry.roundsGiven += 1;
        }
      }
    });

    const ranking = Array.from(statsMap.values()).sort(
      (a, b) => b.alcoholGrams - a.alcoholGrams
    );

    const totalAlcohol = drinks.reduce((sum, d) => sum + (Number(d.alcohol_g) || 0), 0);

    // Beliebtestes Getränk
    const drinkNameCounts = {};
    drinks.forEach((d) => {
      drinkNameCounts[d.name] = (drinkNameCounts[d.name] || 0) + 1;
    });
    const mostPopularDrink = Object.entries(drinkNameCounts).sort((a, b) => b[1] - a[1])[0];

    // Peak-Hour (Stunde mit den meisten Drinks)
    const hourCounts = {};
    drinks.forEach((d) => {
      const h = new Date(d.created_at).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

    // Persönliche Statistiken
    const myStats = statsMap.get(profile?.id);
    const myRank = ranking.findIndex((r) => r.profile.id === profile?.id) + 1;

    // Spendierhose
    const topGenerous = ranking.reduce((best, r) => (r.roundsGiven > best.roundsGiven ? r : best), ranking[0]);

    // 1. SLIDE: INTRO
    s.push({
      id: 'intro',
      bg: 'from-[#0A051B] via-[#1E0836] to-[#07070B]',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
          <span className="text-7xl animate-bounce">{party.emoji}</span>
          <p className="text-xs uppercase tracking-widest text-neon-pink font-extrabold">
            Euer Abend im Rückblick
          </p>
          <h2 className="display-font text-5xl text-white tracking-wide leading-tight">
            {party.name}
          </h2>
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-dim font-mono">
            {members.length} Freunde · {drinks.length} Drinks getrunken
          </div>
        </div>
      ),
    });

    // 2. SLIDE: GESAMTALKOHOL
    const beerEquivalent = Math.round(totalAlcohol / 19.7); // 1 Bier 0.5l ~ 19.7g Alk
    s.push({
      id: 'total_alcohol',
      bg: 'from-[#17052E] via-[#2A0845] to-[#07070B]',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
          <span className="text-xs uppercase tracking-widest text-neon-lime font-bold">
            Die Runde zusammen
          </span>
          <div className="display-font text-8xl text-neon-lime tracking-wide leading-none animate-pop">
            {formatGrams(totalAlcohol)}
            <span className="text-3xl font-sans font-bold ml-1">g</span>
          </div>
          <p className="text-lg font-bold text-white max-w-xs">
            reiner Alkohol wurde vernichtet! 💥
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-dim max-w-xs leading-relaxed font-mono">
            🍺 Das entspricht ca. <b className="text-white">{beerEquivalent} Halben Bier</b> (0,5L)!
          </div>
        </div>
      ),
    });

    // 3. SLIDE: BELIEBTESTES GETRÄNK
    if (mostPopularDrink) {
      s.push({
        id: 'popular_drink',
        bg: 'from-[#071E26] via-[#083040] to-[#07070B]',
        render: () => (
          <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-neon-cyan font-bold">
              Der Liebling des Abends
            </span>
            <div className="w-24 h-24 rounded-3xl bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-5xl shadow-glow-lime">
              🍸
            </div>
            <h3 className="display-font text-5xl text-white tracking-wide">
              {mostPopularDrink[0]}
            </h3>
            <p className="text-xs text-dim">
              Ganze <b className="text-white text-base">{mostPopularDrink[1]}x</b> bestellt und getrunken.
            </p>
          </div>
        ),
      });
    }

    // 4. SLIDE: PEAK HOUR
    if (peakHour) {
      const peakHourFormatted = `${peakHour[0]}:00 – ${Number(peakHour[0]) + 1}:00 Uhr`;
      s.push({
        id: 'peak_hour',
        bg: 'from-[#2A0512] via-[#3D0A1C] to-[#07070B]',
        render: () => (
          <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-neon-pink font-bold">
              Die wildeste Stunde
            </span>
            <div className="display-font text-6xl text-neon-pink tracking-wide">
              {peakHourFormatted}
            </div>
            <p className="text-sm font-bold text-white max-w-xs">
              Um diese Uhrzeit ging es richtig rund: {peakHour[1]} Drinks in nur 60 Minuten! ⏱️
            </p>
          </div>
        ),
      });
    }

    // 4b. SLIDE: SPENDIERHOSE
    if (topGenerous && topGenerous.roundsGiven > 0) {
      s.push({
        id: 'top_generous',
        bg: 'from-[#1A1803] via-[#2E2805] to-[#07070B]',
        render: () => (
          <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
              Die Spendierhose des Abends 💸
            </span>
            <div className="w-20 h-20 rounded-3xl bg-yellow-400/20 border border-yellow-400 flex items-center justify-center text-4xl">
              {topGenerous.profile.emoji}
            </div>
            <h3 className="font-bold text-white text-3xl">{topGenerous.profile.name}</h3>
            <p className="text-sm font-bold text-white max-w-xs">
              Hat ganze <span className="text-yellow-400 text-lg font-extrabold">{topGenerous.roundsGiven}</span> Runden für Freunde spendiert! Ehrenperson! 🫡
            </p>
          </div>
        ),
      });
    }

    // 5. SLIDE: DEIN ABEND
    if (myStats) {
      s.push({
        id: 'my_stats',
        bg: 'from-[#0F1E05] via-[#1B3308] to-[#07070B]',
        render: () => (
          <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-neon-lime font-bold">
              Dein persönlicher Abend
            </span>
            <div className="w-20 h-20 rounded-3xl bg-neon-lime/20 border border-neon-lime flex items-center justify-center text-4xl">
              {profile?.emoji}
            </div>
            <h3 className="font-bold text-white text-2xl">{profile?.name}</h3>
            <div className="display-font text-6xl text-neon-lime leading-none">
              Platz #{myRank}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-faint uppercase font-bold block">Alkohol</span>
                <span className="text-lg font-bold text-white">
                  {formatGrams(myStats.alcoholGrams)}g
                </span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-faint uppercase font-bold block">Drinks</span>
                <span className="text-lg font-bold text-white">{myStats.drinksCount}</span>
              </div>
            </div>
          </div>
        ),
      });
    }

    // 6. SLIDE: PODIUM (DIE TOP 3)
    const top3 = ranking.slice(0, 3);
    s.push({
      id: 'podium',
      bg: 'from-[#2B1B05] via-[#422507] to-[#07070B]',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-5">
          <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
          <h3 className="display-font text-5xl text-white tracking-wide">
            Das Siegertreppchen
          </h3>

          <div className="space-y-2.5 w-full max-w-xs">
            {top3.map((entry, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={entry.profile.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    idx === 0
                      ? 'bg-yellow-500/20 border-yellow-400 shadow-glow-lime'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{medals[idx]}</span>
                    <span className="text-xl">{entry.profile.emoji}</span>
                    <span className="font-bold text-white text-sm">
                      {entry.profile.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neon-lime text-base">
                    {formatGrams(entry.alcoholGrams)}g
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ),
    });

    // 7. SLIDE: OUTRO & SHARE
    s.push({
      id: 'outro',
      bg: 'from-[#141424] via-[#0E0E18] to-[#07070B]',
      render: () => (
        <div className="flex flex-col items-center justify-center text-center h-full p-6 space-y-6">
          <span className="text-6xl">🍻</span>
          <h3 className="display-font text-5xl text-white">Was für ein Abend!</h3>
          <p className="text-xs text-dim max-w-xs">
            Teile euer Wrapped mit Freunden oder schau es dir später in deinem Profil an.
          </p>

          <div className="w-full max-w-xs space-y-3 pt-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `AlcoholTracker: ${party.name}`,
                    text: `Wir haben bei ${party.name} zusammen ${formatGrams(totalAlcohol)}g Alkohol getrunken! 🍻`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link kopiert!');
                }
              }}
              className="btn-lime w-full text-xs font-bold py-3.5 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Wrapped teilen</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full text-xs font-bold py-3.5"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      ),
    });

    return s;
  }, [data, profile, navigate]);

  // Konfetti beim Podium
  useEffect(() => {
    if (slides[currentSlideIndex]?.id === 'podium') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#C6FF3D', '#FF2E93'],
      });
    }
  }, [currentSlideIndex, slides]);

  // Auto-Advance Timer
  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const timer = setTimeout(() => {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      }
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, isPaused, slides.length]);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  if (loading || slides.length === 0) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-bg flex items-center justify-center text-white">
        <p className="text-xs text-dim">Berechne Wrapped...</p>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div
      className={`fixed inset-0 z-50 max-w-md mx-auto flex flex-col justify-between select-none bg-gradient-to-b ${currentSlide.bg}`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Bar: Story Progress Bars */}
      <div className="pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] px-4 z-20">
        <div className="flex gap-1.5 h-1 w-full">
          {slides.map((s, idx) => (
            <div key={s.id} className="h-full flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all ${
                  idx < currentSlideIndex
                    ? 'w-full'
                    : idx === currentSlideIndex
                    ? 'w-full duration-[6000ms] ease-linear'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3">
          <button
            onClick={() => navigate(`/p/${id}`)}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative z-10 flex flex-col justify-center">
        {currentSlide.render()}
      </div>

      {/* Touch Tap Zones for Prev/Next */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/3 h-full" onClick={handlePrev} />
        <div className="w-2/3 h-full" onClick={handleNext} />
      </div>
    </div>
  );
};
