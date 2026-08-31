import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ResetModal = ({ onClose }) => {
  const [step, setStep] = useState('choose');
  const [confirmMode, setConfirmMode] = useState(null);
  const { clearAllDrinks, resetEverything } = useApp();

  const handleConfirmDrinksOnly = () => {
    clearAllDrinks();
    setStep('choose');
    setConfirmMode(null);
    onClose();
  };

  const handleConfirmEverything = () => {
    resetEverything();
    setStep('choose');
    setConfirmMode(null);
    onClose();
  };

  if (step === 'confirm') {
    const isAll = confirmMode === 'all';
    return (
      <>
        <div className="sheet-backdrop" onClick={() => setStep('choose')} />
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-5">
          <div className="card p-6 animate-pop">
            <h2 className="display text-2xl text-paper mb-3">Bestätigung</h2>
            <p className="text-dim mb-2">
              {isAll
                ? '⚠️ Alle Getränke UND alle Freunde wirklich löschen?'
                : 'Alle Getränke von heute wirklich löschen?'}
            </p>
            {isAll && (
              <p className="text-sm text-red-400 mb-4">Diese Aktion kann nicht rückgängig gemacht werden!</p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('choose')} className="flex-1 btn-secondary py-2.5">
                Abbrechen
              </button>
              <button
                onClick={isAll ? handleConfirmEverything : handleConfirmDrinksOnly}
                className="flex-1 btn-danger py-2.5"
              >
                {isAll ? 'Alles löschen' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-5">
        <div className="card p-6 animate-pop">
          <h2 className="display text-2xl text-paper mb-1">Runde zurücksetzen</h2>
          <p className="text-sm text-dim mb-5">Was möchtest du löschen?</p>

          <div className="space-y-3">
            <button
              onClick={() => { setConfirmMode('drinks'); setStep('confirm'); }}
              className="w-full p-4 border border-line/15 rounded-xl hover:border-amber/40 hover:bg-amber/5 transition-colors text-left"
            >
              <div className="font-bold text-paper">🗑️ Nur Getränke löschen</div>
              <div className="text-sm text-dim mt-1">Alle Getränke von heute löschen, Freunde bleiben</div>
            </button>

            <button
              onClick={() => { setConfirmMode('all'); setStep('confirm'); }}
              className="w-full p-4 border border-red-500/30 rounded-xl hover:bg-red-500/5 transition-colors text-left"
            >
              <div className="font-bold text-red-400">⚠️ Alles zurücksetzen</div>
              <div className="text-sm text-dim mt-1">Alle Getränke UND alle Freunde löschen</div>
            </button>

            <button onClick={onClose} className="w-full btn-secondary">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
