import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Reusable confirmation modal for destructive actions.
// The confirm button stays disabled for a short delay to prevent accidental taps.
export const ConfirmDeleteModal = ({
  title,
  message,
  confirmLabel = 'Löschen',
  onConfirm,
  onCancel,
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEnabled(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return createPortal(
    <>
      <div className="sheet-backdrop" onClick={onCancel} />
      <div className="fixed inset-0 z-50 max-w-md mx-auto flex items-center justify-center p-6">
        <div className="card w-full p-6 animate-pop">
          <div className="text-4xl mb-3 text-center">⚠️</div>
          <h2 className="display text-2xl text-paper text-center mb-2">{title}</h2>
          <p className="text-dim text-center mb-6 leading-relaxed">{message}</p>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={!enabled}
              className="btn-danger w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enabled ? confirmLabel : 'Bitte warten...'}
            </button>
            <button onClick={onCancel} className="btn-secondary w-full">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
