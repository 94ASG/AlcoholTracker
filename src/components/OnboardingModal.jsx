import React, { useState } from 'react';

const STEPS = [
  {
    icon: '🍺',
    title: 'Willkommen',
    text: 'Tracke gemeinsam mit deinen Freunden, wer heute wie viel getrunken hat. Alles live und zentral gespeichert.',
  },
  {
    icon: '👥',
    title: 'Die Runde',
    text: 'Jede Person hat eine eigene Zeile. Tippe auf das +, um ein Getränk hinzuzufügen.',
  },
  {
    icon: '🍻',
    title: 'Getränke',
    text: 'Wähle aus den gängigsten Getränken oder lege eigene an. Der Alkohol wird in Gramm angezeigt.',
  },
  {
    icon: '⚡',
    title: 'Live-Sync',
    text: 'Änderungen erscheinen sofort bei allen — egal wer sie einträgt.',
  },
  {
    icon: '🎊',
    title: 'Abend beenden',
    text: 'Am Ende des Abends siehst du das Leaderboard und wer die Runde anführt.',
  },
];

export const OnboardingModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet p-6 pb-8">
        <div className="sheet-handle" />

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-amber rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="eyebrow">Schritt {step + 1} von {STEPS.length}</span>
          <button
            onClick={onClose}
            className="text-sm text-faint hover:text-paper transition-colors"
          >
            Überspringen
          </button>
        </div>

        <div key={step} className="text-center animate-fadeIn">
          <div className="text-6xl mb-5">{current.icon}</div>
          <h2 className="display text-3xl text-paper mb-3">{current.title}</h2>
          <p className="text-dim leading-relaxed max-w-xs mx-auto">{current.text}</p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 my-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-5 bg-amber' : 'w-1.5 bg-line/20'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary flex-1"
            >
              Zurück
            </button>
          )}
          <button onClick={handleNext} className="btn-primary flex-1">
            {isLast ? "Los geht's!" : 'Weiter'}
          </button>
        </div>
      </div>
    </>
  );
};
