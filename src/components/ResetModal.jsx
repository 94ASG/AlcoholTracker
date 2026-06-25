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

  if (step === 'confirm' && confirmMode === 'drinks') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
        <div className="card rounded-2xl p-6 w-full mx-4 animate-slideIn">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Bestätigung</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Alle Getränke von heute wirklich löschen?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setStep('choose')}
              className="flex-1 btn-secondary py-2"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirmDrinksOnly}
              className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm' && confirmMode === 'all') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
        <div className="card rounded-2xl p-6 w-full mx-4 animate-slideIn">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Bestätigung</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            ⚠️ Alle Getränke UND alle Freunde wirklich löschen?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6">
            Diese Aktion kann nicht rückgängig gemacht werden!
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setStep('choose')}
              className="flex-1 btn-secondary py-2"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirmEverything}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              Alles löschen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-md mx-auto animate-fadeIn">
      <div className="card rounded-2xl p-6 w-full mx-4 animate-slideIn">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Reset</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Was möchtest du löschen?
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              setConfirmMode('drinks');
              setStep('confirm');
            }}
            className="w-full p-4 border-2 border-blue-400 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left font-medium text-slate-900 dark:text-white"
          >
            <div>🗑️ Nur Getränke löschen</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Alle Getränke von heute löschen, Freunde bleiben
            </div>
          </button>

          <button
            onClick={() => {
              setConfirmMode('all');
              setStep('confirm');
            }}
            className="w-full p-4 border-2 border-red-400 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium text-slate-900 dark:text-white"
          >
            <div>⚠️ Alles zurücksetzen</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Alle Getränke UND alle Freunde löschen
            </div>
          </button>

          <button
            onClick={onClose}
            className="w-full p-3 btn-secondary"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};
