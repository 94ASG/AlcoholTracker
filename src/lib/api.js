// ==============================================
// AlcoholTracker 2.0: Supabase API Client Layer
// ==============================================

import { supabase } from './supabase';
import { calculateAlcoholGrams, calculateBeerLiters } from '../utils/drinks';

export const api = {
  // --- Profiles ---
  async getProfile(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createProfile({ name, emoji = '😎', color = '#C6FF3D', isGuest = false }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name: name.trim(),
        emoji,
        color,
        is_guest: isGuest,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // --- Parties ---
  async listActiveParties() {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('parties')
      .select(`
        id,
        name,
        emoji,
        host_id,
        created_at,
        ends_at,
        ended_at,
        symbol_code,
        party_members (
          profile_id,
          profiles ( id, name, emoji, color )
        )
      `)
      .is('ended_at', null)
      .gt('ends_at', nowIso)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async listPastParties(profileId) {
    if (!profileId) return [];
    const { data, error } = await supabase
      .from('party_members')
      .select(`
        party_id,
        joined_at,
        parties (
          id,
          name,
          emoji,
          created_at,
          ends_at,
          ended_at,
          host_id,
          symbol_code
        )
      `)
      .eq('profile_id', profileId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return (data || [])
      .map((item) => item.parties)
      .filter(Boolean);
  },

  async getParty(id) {
    const { data, error } = await supabase
      .from('parties')
      .select(`
        id,
        name,
        emoji,
        host_id,
        created_at,
        ends_at,
        ended_at,
        symbol_code,
        party_members (
          profile_id,
          joined_at,
          profiles ( id, name, emoji, color, is_guest )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createParty({ name, emoji = '🎉', hostId, symbolCode = null }) {
    const { data, error } = await supabase
      .from('parties')
      .insert({
        name: name.trim(),
        emoji,
        host_id: hostId,
        symbol_code: symbolCode || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Host tritt der Party automatisch bei
    if (hostId) {
      await supabase.from('party_members').insert({
        party_id: data.id,
        profile_id: hostId,
      });
    }

    return data;
  },

  async joinParty(partyId, profileId) {
    const { data, error } = await supabase
      .from('party_members')
      .upsert({
        party_id: partyId,
        profile_id: profileId,
      })
      .select();

    if (error) throw error;
    return data;
  },

  async addGuestToParty({ partyId, name, emoji = '👤', color = '#8B5CF6' }) {
    const guest = await this.createProfile({
      name,
      emoji,
      color,
      isGuest: true,
    });
    await this.joinParty(partyId, guest.id);
    return guest;
  },

  async endParty(partyId, requesterId) {
    const { data, error } = await supabase.rpc('end_party', {
      p_party_id: partyId,
      p_requester_id: requesterId,
    });
    if (error) throw error;
    return data;
  },

  // --- Drinks ---
  async getPartyDrinks(partyId) {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .eq('party_id', partyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async logDrinksBatch({ partyId, profileIds, loggedBy, drink, createdAt }) {
    const isRound = profileIds.length > 1;
    const roundId = isRound ? crypto.randomUUID() : null;
    const alcoholG = calculateAlcoholGrams(drink.volume, drink.abv);
    const beerLiters = calculateBeerLiters(drink.volume, drink.beerFactor || 0);

    const rows = profileIds.map((profileId) => ({
      party_id: partyId,
      profile_id: profileId,
      logged_by: loggedBy,
      round_id: roundId,
      drink_key: drink.key || 'custom',
      name: drink.name,
      icon: drink.icon || '🍹',
      category: drink.category || 'other',
      volume_ml: drink.volume,
      abv: drink.abv,
      alcohol_g: alcoholG,
      beer_liters: beerLiters,
      ...(createdAt ? { created_at: createdAt } : {}),
    }));

    const { data, error } = await supabase
      .from('drinks')
      .insert(rows)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteDrink(drinkId) {
    const { error } = await supabase
      .from('drinks')
      .delete()
      .eq('id', drinkId);

    if (error) throw error;
  },

  // --- Reactions ---
  async getPartyReactions(partyId) {
    const { data, error } = await supabase
      .from('reactions')
      .select(`
        drink_id,
        profile_id,
        emoji,
        drinks!inner(party_id)
      `)
      .eq('drinks.party_id', partyId);

    if (error) throw error;
    return (data || []).map(r => ({
      drink_id: r.drink_id,
      profile_id: r.profile_id,
      emoji: r.emoji,
    }));
  },

  async toggleReaction({ drinkId, profileId, emoji }) {
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('*')
      .eq('drink_id', drinkId)
      .eq('profile_id', profileId)
      .eq('emoji', emoji)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('reactions')
        .delete()
        .eq('drink_id', drinkId)
        .eq('profile_id', profileId)
        .eq('emoji', emoji);
      return false; // removed
    } else {
      await supabase
        .from('reactions')
        .insert({
          drink_id: drinkId,
          profile_id: profileId,
          emoji,
        });
      return true; // added
    }
  },

  // --- Push ---
  async registerPush(subscription, profileId) {
    const subJson = subscription.toJSON();
    const { error } = await supabase.rpc('register_push_subscription', {
      p_endpoint: subJson.endpoint,
      p_p256dh: subJson.keys?.p256dh || '',
      p_auth: subJson.keys?.auth || '',
      p_profile_id: profileId,
    });
    if (error) throw error;
  },

  // --- Full Party for Wrapped ---
  async getPartyFull(partyId) {
    const party = await this.getParty(partyId);
    const drinks = await this.getPartyDrinks(partyId);
    const reactions = await this.getPartyReactions(partyId);

    return {
      party,
      members: (party.party_members || []).map((m) => m.profiles),
      drinks,
      reactions,
    };
  },
};
