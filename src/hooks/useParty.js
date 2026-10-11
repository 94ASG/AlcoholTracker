// ==============================================
// AlcoholTracker 2.0: useParty Custom Hook
// ==============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { useProfile } from '../context/ProfileContext';

export const useParty = (partyId) => {
  const { profile } = useProfile();
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartyData = useCallback(async () => {
    if (!partyId) return;
    try {
      const data = await api.getParty(partyId);
      setParty(data);
      
      const memberList = (data.party_members || []).map((m) => ({
        ...m.profiles,
        joinedAt: m.joined_at,
        currentBac: m.current_bac ? Number(m.current_bac) : null,
      }));
      setMembers(memberList);

      const [drinksData, reactionsData] = await Promise.all([
        api.getPartyDrinks(partyId),
        api.getPartyReactions(partyId),
      ]);
      setDrinks(drinksData);
      setReactions(reactionsData);
    } catch (err) {
      console.error('Fehler beim Laden der Party:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => {
    fetchPartyData();
  }, [fetchPartyData]);

  // Realtime Subscriptions für diese Party
  useEffect(() => {
    if (!partyId) return;

    const channel = supabase
      .channel(`party-realtime-${partyId}`)
      // Neue / gelöschte Getränke
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'drinks', filter: `party_id=eq.${partyId}` },
        () => {
          api.getPartyDrinks(partyId).then(setDrinks).catch(console.error);
        }
      )
      // Neue Mitglieder
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'party_members', filter: `party_id=eq.${partyId}` },
        () => {
          fetchPartyData();
        }
      )
      // Party-Statusänderung (z.B. ended_at)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parties', filter: `id=eq.${partyId}` },
        (payload) => {
          if (payload.new) {
            setParty((prev) => ({ ...prev, ...payload.new }));
          }
        }
      )
      // Reaktionen
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        () => {
          api.getPartyReactions(partyId).then(setReactions).catch(console.error);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId, fetchPartyData]);

  // Berechne Live-Ranking (Leaderboard)
  const leaderboard = useMemo(() => {
    // Map member ID -> Aggregated Stats
    const statsMap = new Map();

    members.forEach((m) => {
      statsMap.set(m.id, {
        profile: m,
        totalAlcoholGrams: 0,
        totalDrinksCount: 0,
        totalBeerLiters: 0,
      });
    });

    drinks.forEach((d) => {
      const entry = statsMap.get(d.profile_id);
      if (entry) {
        entry.totalAlcoholGrams += Number(d.alcohol_g) || 0;
        entry.totalDrinksCount += 1;
        entry.totalBeerLiters += Number(d.beer_liters) || 0;
      }
    });

    const list = Array.from(statsMap.values());
    list.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);

    return list.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }, [members, drinks]);

  // Das letzte Getränk des aktuellen Benutzers (für Quick-Repeat Button)
  const lastDrinkOfUser = useMemo(() => {
    if (!profile) return null;
    return drinks.find((d) => d.profile_id === profile.id) || null;
  }, [drinks, profile]);

  // Gesamtanzahl Drinks der Party
  const totalPartyDrinks = drinks.length;

  // Gesamter Alkohol der Party in Gramm
  const totalPartyAlcoholGrams = useMemo(() => {
    return drinks.reduce((sum, d) => sum + (Number(d.alcohol_g) || 0), 0);
  }, [drinks]);

  // Aktionen
  const logDrink = async ({ profileIds, drink, createdAt }) => {
    if (!profile) return;
    const targetIds = profileIds && profileIds.length > 0 ? profileIds : [profile.id];
    
    // Optimistisches Update für sofortige UI-Reaktion
    const res = await api.logDrinksBatch({
      partyId,
      profileIds: targetIds,
      loggedBy: profile.id,
      drink,
      createdAt,
    });

    if (res) {
      setDrinks((prev) => [...res, ...prev]);
    }
    return res;
  };

  const deleteDrink = async (drinkId) => {
    await api.deleteDrink(drinkId);
    setDrinks((prev) => prev.filter((d) => d.id !== drinkId));
  };

  const toggleReaction = async (drinkId, emoji) => {
    if (!profile) return;
    await api.toggleReaction({
      drinkId,
      profileId: profile.id,
      emoji,
    });
  };

  const addGuest = async ({ name, emoji, color }) => {
    const guest = await api.addGuestToParty({ partyId, name, emoji, color });
    setMembers((prev) => [...prev, guest]);
    return guest;
  };

  const endParty = async () => {
    if (!profile) return;
    await api.endParty(partyId, profile.id);
    setParty((prev) => (prev ? { ...prev, ended_at: new Date().toISOString() } : null));
  };

  const isHost = party?.host_id === profile?.id;
  const isEnded = Boolean(party?.ended_at || (party?.ends_at && new Date(party.ends_at) <= new Date()));

  return {
    party,
    members,
    drinks,
    reactions,
    leaderboard,
    lastDrinkOfUser,
    totalPartyDrinks,
    totalPartyAlcoholGrams,
    loading,
    error,
    isHost,
    isEnded,
    logDrink,
    deleteDrink,
    toggleReaction,
    addGuest,
    endParty,
    refresh: fetchPartyData,
  };
};
