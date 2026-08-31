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
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 max-w-md mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full rounded-t-2xl p-6 animate-slideIn">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Willkommen! 🍺</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Wähle deinen Namen und Avatar, damit deine Getränke zentral gespeichert werden.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
              Avatar wählen
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`p-3 text-3xl rounded-lg border-2 transition-colors ${
                    avatar === a
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
              Name
            </label>
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
    </div>
  );
};
