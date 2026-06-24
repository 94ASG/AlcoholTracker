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
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 max-w-md mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full rounded-t-2xl p-6 animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Freund hinzufügen</h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
              Avatar wählen
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-3 text-3xl rounded-lg border-2 transition-colors ${
                    selectedAvatar === avatar
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {avatar}
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

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Freund hinzufügen
          </button>
        </form>
      </div>
    </div>
  );
};
