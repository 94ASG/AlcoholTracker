import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddFriendModal } from './AddFriendModal';
import { formatAlcohol } from '../utils/drinks';

export const FriendsView = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { friends, removeFriend, addFriend } = useApp();

  const handleAddFriend = (friendData) => {
    addFriend(friendData);
    setIsAddOpen(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Deine Freunde</h2>
      </div>

      <div className="space-y-3">
        {friends.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Noch keine Freunde hinzugefügt</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="btn-primary"
            >
              Ersten Freund hinzufügen
            </button>
          </div>
        ) : (
          <>
            {friends.map(friend => (
              <div
                key={friend.id}
                className="card flex items-center justify-between animate-slideIn"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-4xl">{friend.avatar || '👤'}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{friend.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Heute: {formatAlcohol(friend.todayAlcohol || 0)}ml</p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                  aria-label="Remove friend"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <button
        onClick={() => setIsAddOpen(true)}
        className="btn-primary w-full py-3 sticky bottom-24 z-30"
      >
        ➕ Freund hinzufügen
      </button>

      {isAddOpen && (
        <AddFriendModal
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddFriend}
        />
      )}
    </div>
  );
};
