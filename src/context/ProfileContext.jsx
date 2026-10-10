// ==============================================
// AlcoholTracker 2.0: Profile Context
// ==============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const PROFILE_ID_KEY = 'alcohol_tracker_profile_id_v2';
const SEEN_WRAPPED_KEY = 'alcohol_tracker_seen_wrapped_v2';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialisiere lokales Profil
  useEffect(() => {
    const init = async () => {
      const storedId = localStorage.getItem(PROFILE_ID_KEY);
      if (storedId) {
        try {
          const loaded = await api.getProfile(storedId);
          if (loaded) {
            setProfile(loaded);
          } else {
            localStorage.removeItem(PROFILE_ID_KEY);
          }
        } catch (err) {
          console.error('Fehler beim Laden des Profils:', err);
          setError(err.message);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const saveProfile = async ({ name, emoji, color }) => {
    try {
      const created = await api.createProfile({ name, emoji, color });
      localStorage.setItem(PROFILE_ID_KEY, created.id);
      setProfile(created);
      return created;
    } catch (err) {
      console.error('Fehler beim Erstellen des Profils:', err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    if (!profile) return;
    try {
      const updated = await api.updateProfile(profile.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Profils:', err);
      throw err;
    }
  };

  // Hilfsfunktion: Wurde das Wrapped für eine bestimmte Party schon angeschaut?
  const hasSeenWrapped = (partyId) => {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_WRAPPED_KEY) || '[]');
      return seen.includes(partyId);
    } catch {
      return false;
    }
  };

  const markWrappedSeen = (partyId) => {
    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_WRAPPED_KEY) || '[]');
      if (!seen.includes(partyId)) {
        seen.push(partyId);
        localStorage.setItem(SEEN_WRAPPED_KEY, JSON.stringify(seen));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        saveProfile,
        updateProfile,
        hasSeenWrapped,
        markWrappedSeen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
