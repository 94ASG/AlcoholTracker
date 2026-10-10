// ==============================================
// AlcoholTracker 2.0: App Guide & Explanation
// ==============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Beer, 
  Trophy, 
  Zap, 
  Clock, 
  Smartphone, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const Guide = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const steps = [
    {
      id: 'party',
      number: '01',
      badge: 'Start & Beitritt',
      title: 'Party starten oder beitreten',
      icon: Users,
      color: '#C6FF3D',
      summary: 'Null Registrierung, keine Passwörter. Sofort loslegen.',
      points: [
        {
          heading: 'In 3 Sekunden eröffnet',
          desc: 'Tippe auf dem Homescreen auf „Neue Party starten“, vergib einen Namen und ein Party-Emoji.',
        },
        {
          heading: 'Alle Freunde sehen das Event live',
          desc: 'Deine Freunde öffnen einfach die App und sehen die laufende Party direkt auf dem Homescreen. Ein Klick auf „Beitreten“ genügt!',
        },
        {
          heading: 'Gäste ohne Smartphone mitnehmen',
          desc: 'Akku leer oder kein Handy dabei? Kein Problem: Über das Party-Menü kann der Host jederzeit Offline-Gäste hinzufügen und für sie mittracken.',
        },
      ],
      preview: (
        <div className="bg-surface-light border border-white/5 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <span className="font-bold text-white">WG-Abend</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neon-lime/10 text-neon-lime font-mono text-[10px] font-bold">
              LIVE
            </span>
          </div>
          <p className="text-dim text-[11px]">4 Teilnehmer • Host: Hannes</p>
        </div>
      ),
    },
    {
      id: 'drinks',
      number: '02',
      badge: '1-Tap & Runden',
      title: 'Drinks & Runden tracken',
      icon: Beer,
      color: '#FFB800',
      summary: 'Schnell, flexibel und mit 5-Sekunden-Rückgängig-Funktion.',
      points: [
        {
          heading: '1-Tap Schnellauswahl',
          desc: 'Kategorisierte Liste: Bier (0.5L & 0.33L), Radler, Shots (Klopfer, Hubertus, Berentzen, Wodka) und Wein/Prosecco mit einem Fingertipp eintragen.',
        },
        {
          heading: 'Mischen-Konfigurator',
          desc: 'Stelle dein individuelles Mischverhältnis flexibel ein (z.B. 4cl Spirituose auf 200ml Softdrink). Die Gramm Reinalkohol werden exakt berechnet.',
        },
        {
          heading: 'Runden für die Gruppe ausgeben',
          desc: 'Du holst Bier an der Bar? Wähle einfach alle Freunde an und trage die Runde mit einem Klick für die ganze Truppe ein.',
        },
        {
          heading: 'Vergessen? Nachtragen ohne Reue',
          desc: 'Du hast vorhin vergessen zu tracken? Wähle im Menü einfach „Vor 30 Min“ oder „Vor 1 Std“, damit der zeitliche Verlauf exakt stimmt.',
        },
        {
          heading: '5 Sekunden Rückgängig (Undo)',
          desc: 'Aus Versehen vertippt? Direkt nach jedem Eintrag erscheint 5 Sekunden lang ein praktischer Undo-Button.',
        },
      ],
      preview: (
        <div className="bg-surface-light border border-white/5 rounded-2xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-faint font-bold uppercase tracking-wider">
            <span>Schnellauswahl & Nachtragen</span>
            <span className="text-neon-lime">1-Tap</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <span className="text-lg">🍺</span>
              <div>
                <p className="font-bold text-white text-[11px]">Bier 0.5L</p>
                <p className="text-[10px] text-dim">5.0% Vol.</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <span className="text-lg">🥃</span>
              <div>
                <p className="font-bold text-white text-[11px]">Wodka Shot</p>
                <p className="text-[10px] text-dim">40.0% Vol.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ranking',
      number: '03',
      badge: 'Fair & Gamified',
      title: 'Faires Live-Ranking & Badges',
      icon: Trophy,
      color: '#FF2E93',
      summary: 'Vergleich nach reinem Alkohol (Gramm), dynamische Titel & Gruppen-Ziele.',
      points: [
        {
          heading: 'Wissenschaftlich fair berechnet',
          desc: 'Ein Shot und ein großes Bier sind nicht dasselbe. Die App berechnet den exakten Reinalkohol: Volumen (ml) × Vol.-% × 0.8 / 100.',
        },
        {
          heading: 'Dynamische Live-Titel (Badges)',
          desc: 'Wandern im Laufe des Abends: 👑 Bierkönig, ⚡ Shot-Maschine, 🤝 Spendierhose und 🚀 Frühstarter belohnen Aktivität sofort!',
        },
        {
          heading: 'Kollektive Gruppen-Meilensteine',
          desc: 'Oben im Leaderboard seht ihr den Gruppen-Fortschrittsbalken. Bei 25g, 50g oder 100g gibt es Live-Konfetti für alle im Raum!',
        },
      ],
      preview: (
        <div className="bg-surface-light border border-white/5 rounded-2xl p-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <span className="font-bold text-white">1. Lukas</span>
            </div>
            <span className="font-mono font-bold text-neon-lime">48g Alkohol</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-neon-lime w-4/5 rounded-full" />
          </div>
        </div>
      ),
    },
    {
      id: 'feed',
      number: '04',
      badge: 'Interaktiv',
      title: 'Live-Feed & Reaktionen',
      icon: Zap,
      color: '#00F0FF',
      summary: 'Sieh jeden Drink live und reagiere mit Emojis.',
      points: [
        {
          heading: 'Live-Aktivitätsstrom',
          desc: 'Jedes Getränk und jede Runde erscheint sofort im Feed aller Teilnehmer.',
        },
        {
          heading: 'Reaktionen verteilen',
          desc: 'Feiere deine Freunde oder reagiere auf legendäre Runden mit 🔥, 🍻, 😵, 🫡 oder 💧.',
        },
        {
          heading: 'Einträge löschen',
          desc: 'Jeder Teilnehmer kann seine eigenen Getränke sowie Runden, die er für andere eingetragen hat, jederzeit im Feed löschen.',
        },
      ],
      preview: (
        <div className="bg-surface-light border border-white/5 rounded-2xl p-3 space-y-2 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-white text-[11px]">Hannes hat Bier 0.5L getrunken</p>
              <p className="text-[10px] text-faint">vor 2 Minuten</p>
            </div>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded-lg bg-white/5 text-[11px]">🍻 3</span>
              <span className="px-1.5 py-0.5 rounded-lg bg-white/5 text-[11px]">🔥 2</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'wrapped',
      number: '05',
      badge: 'Der Morgen danach',
      title: 'Automatisches Ende & Story-Rückblick',
      icon: Clock,
      color: '#A855F7',
      summary: 'Kein manuelles Beenden. Statistiken wie bei Spotify Wrapped.',
      points: [
        {
          heading: 'Automatisches Ende um 10:00 Uhr',
          desc: 'Niemand muss ans Beenden denken: Jede Party schließt nach 10 Stunden bzw. am nächsten Morgen um 10:00 Uhr automatisch (oder vorzeitig durch den Host).',
        },
        {
          heading: 'Animierter Story-Rückblick',
          desc: 'Am nächsten Tag erhalten alle Teilnehmer einen animierten Story-Rückblick mit Musik-Festival-Vibe.',
        },
        {
          heading: 'Fun Facts & Siegertreppchen',
          desc: 'Erfahrt euren Gruppen-Gesamtkonsum, das beliebteste Getränk, die wildeste Peak-Uhrzeit, wer die Spendierhose anhatte und das offizielle Podium mit Konfetti!',
        },
      ],
      preview: (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl p-3 space-y-1.5 text-xs text-center">
          <span className="text-xl inline-block">🏆</span>
          <p className="font-bold text-white text-[12px]">Story-Rückblick bereit!</p>
          <p className="text-[10px] text-dim">142g Gesamtalkohol • 18 Runden • Top-Drink: Bier</p>
        </div>
      ),
    },
  ];

  const filteredSteps = activeTab === 'all' 
    ? steps 
    : steps.filter(s => s.id === activeTab);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-bg text-white flex flex-col justify-between px-5 pb-12 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
      {/* Top Header */}
      <div>
        <header className="flex items-center justify-between pb-4 border-b border-white/5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-dim hover:text-white transition-colors py-1.5 pr-3 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-neon-lime" />
            <span>Zurück</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-faint">Anleitung</span>
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-6 pb-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>So funktioniert die App</span>
          </div>

          <h1 className="display-font text-4xl text-white tracking-wide leading-none">
            Gemeinsam tracken, <br />
            <span className="text-neon-lime">ohne Excel-Feeling.</span>
          </h1>

          <p className="text-xs text-dim max-w-xs mx-auto leading-relaxed">
            AlcoholTracker macht gemeinsame Abende mit Freunden spielerisch, transparent und fair. 
            Hier erfährst du alles, was du wissen musst.
          </p>
        </section>

        {/* Schnellnavigation / Filter-Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
              activeTab === 'all'
                ? 'bg-neon-lime text-black font-extrabold shadow-glow-lime'
                : 'bg-surface-light border border-white/5 text-dim hover:text-white'
            }`}
          >
            Alle Schritte
          </button>
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                activeTab === s.id
                  ? 'bg-neon-lime text-black font-extrabold shadow-glow-lime'
                  : 'bg-surface-light border border-white/5 text-dim hover:text-white'
              }`}
            >
              {s.badge}
            </button>
          ))}
        </div>

        {/* Schritte Liste */}
        <div className="space-y-6 pt-2">
          {filteredSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.id}
                className="card p-5 border border-white/10 hover:border-white/20 transition-all space-y-4 relative overflow-hidden"
              >
                {/* Number Watermark */}
                <span className="absolute -top-3 -right-2 display-font text-7xl text-white/[0.03] select-none pointer-events-none">
                  {step.number}
                </span>

                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: step.color }}
                    >
                      Schritt {step.number} • {step.badge}
                    </span>
                    <h2 className="font-bold text-white text-base leading-tight">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-dim leading-relaxed">
                  {step.summary}
                </p>

                {/* Preview Box */}
                {step.preview}

                {/* Key Bullet Points */}
                <div className="space-y-2.5 pt-1">
                  {step.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: step.color }}
                      />
                      <div className="leading-snug">
                        <span className="font-bold text-white">{pt.heading}: </span>
                        <span className="text-faint">{pt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Extra Tipp: PWA / Homescreen */}
        <section className="mt-6 p-5 rounded-3xl bg-gradient-to-br from-surface-light to-bg border border-neon-lime/20 space-y-3">
          <div className="flex items-center gap-2.5 text-neon-lime">
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-bold text-white text-sm">
              Pro-Tipp: Als App zum Homescreen hinzufügen
            </h3>
          </div>
          <p className="text-xs text-dim leading-relaxed">
            AlcoholTracker ist eine Progressive Web App (PWA). Füge sie zu deinem Startbildschirm hinzu für das beste Erlebnis:
          </p>
          <div className="space-y-2 text-xs text-faint">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="font-bold text-white">Auf dem iPhone (iOS):</span> Im Safari-Menü unten auf das <span className="text-white font-bold">Teilen-Symbol</span> tippen und <span className="text-neon-lime font-bold">„Zum Home-Bildschirm“</span> wählen.
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="font-bold text-white">Auf Android:</span> Im Chrome-Menü (drei Punkte) auf <span className="text-neon-lime font-bold">„App installieren“</span> tippen.
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-8 pb-4">
        <button
          onClick={() => navigate('/')}
          className="btn-lime w-full py-4 text-sm font-black flex items-center justify-center gap-2 shadow-glow-lime active:scale-95 transition-all"
        >
          <span>Alles klar, los geht's!</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
