import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const AVATARS = ['👤', '👨', '👩', '👦', '👧', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '👨‍💼', '👩‍💼'];

export const ProfileModal = ({ onClose }) => {
  const { currentUser, updateUser, deleteSelf } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '👤');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (name.trim()) {
      updateUser({ name: name.trim(), avatar });
      onClose();
    }
  };

  const handleDeleteSelf = () => {
    deleteSelf();
    setConfirmDelete(false);
    onClose();
  };

  return createPortal(
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet p-6 pb-8">
        <div className="sheet-handle" />
        <div className="flex justify-between items-center mb-5">
          <h2 className="display text-2xl text-paper">Profil</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-dim hover:text-paper transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-paper mb-3">Profilbild wählen</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`p-3 text-3xl rounded-xl border-2 transition-all active:scale-95 ${
                    avatar === a
                      ? 'border-amber bg-amber/10'
                      : 'border-line/10 bg-bg hover:border-line/30'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-paper mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="z.B. Tom"
              autoFocus
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Speichern
          </button>
        </form>

        <div className="divider my-6" />

        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          Mich selbst löschen
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDeleteModal
          title="Profil löschen?"
          message="Dein Profil und alle deine Getränke werden dauerhaft gelöscht. Du kannst danach ein neues Profil anlegen."
          confirmLabel="Ja, löschen"
          onConfirm={handleDeleteSelf}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>,
    document.body
  );
};
