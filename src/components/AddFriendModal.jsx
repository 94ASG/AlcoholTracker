import React, { useState } from 'react';

const AVATARS = ['👨', '👩', '👦', '👧', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '👨‍💼', '👩‍💼'];

export const AddFriendModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        avatar: selectedAvatar,
      });
    }
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet p-6 pb-8">
        <div className="sheet-handle" />
        <div className="flex justify-between items-center mb-5">
          <h2 className="display text-2xl text-paper">Freund hinzufügen</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-dim hover:text-paper transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-paper mb-3">Avatar wählen</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-3 text-3xl rounded-xl border-2 transition-all active:scale-95 ${
                    selectedAvatar === avatar
                      ? 'border-amber bg-amber/10'
                      : 'border-line/10 bg-bg hover:border-line/30'
                  }`}
                >
                  {avatar}
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
            Freund hinzufügen
          </button>
        </form>
      </div>
    </>
  );
};
