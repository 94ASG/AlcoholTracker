import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AVATARS = ['👤', '👨', '👩', '👦', '👧', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '👨‍💼', '👩‍💼'];

export const IdentitySetupModal = () => {
  const { updateUser } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👤');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      updateUser({ name: name.trim(), avatar });
    }
  };

  return (
    <>
      <div className="sheet-backdrop" />
      <div className="sheet p-6 pb-8">
        <div className="sheet-handle" />
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🍺</div>
          <h2 className="display text-3xl text-paper">Willkommen!</h2>
          <p className="text-sm text-dim mt-1">
            Wähle deinen Namen und Avatar, damit deine Getränke zentral gespeichert werden.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-paper mb-3">Avatar wählen</label>
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
            Los geht's
          </button>
        </form>
      </div>
    </>
  );
};
