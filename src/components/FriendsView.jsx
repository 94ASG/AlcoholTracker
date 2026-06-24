import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddFriendModal } from './AddFriendModal';
import { FriendDetailView } from './FriendDetailView';
import { formatAlcohol, formatBeerLiters } from '../utils/drinks';

export const FriendsView = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const { friends, removeFriend, addFriend, getFriendTodayAlcohol, getFriendTodayBeerLiters } = useApp();

  if (selectedFriendId) {
    const friend = friends.find(f => f.id === selectedFriendId);
    return (
      <FriendDetailView
        friend={friend}
        onBack={() => setSelectedFriendId(null)}
      />
    );
  }

  const handleAddFriend = (friendData) => {
    addFriend(friendData);
    setIsAddOpen(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Freunde</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Verwalte und tracke deine Freunde</p>
      </div>

      <div className="space-y-3">
        {friends.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Noch keine Freunde hinzugefügt</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="btn-primary inline-block"
            >
              Ersten Freund hinzufügen
            </button>
          </div>
        ) : (
          <>
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriendId(friend.id)}
                className="w-full card flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left animate-slideIn"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-5xl">{friend.avatar || '👤'}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{friend.name}</h3>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Alkohol</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{formatAlcohol(getFriendTodayAlcohol(friend.id))}ml</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Bier</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{formatBeerLiters(getFriendTodayBeerLiters(friend.id))}L</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFriend(friend.id);
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400 ml-2"
                  aria-label="Remove friend"
                >
                  ✕
                </button>
              </button>
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
