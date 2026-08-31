import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  SELF_ID: 'alcohol_tracker_self_id',
  THEME: 'alcohol_tracker_theme',
};

// Map a DB drink row (snake_case) to the camelCase shape the app expects.
const mapDrink = (d) => ({
  id: d.id,
  name: d.name,
  icon: d.icon,
  volume: d.volume,
  abv: d.abv,
  alcohol: d.alcohol,
  beerLiters: d.beer_liters,
  timestamp: d.timestamp,
  date: d.date,
});

// Group a person's drinks into { date: [drinks] }.
const buildPerson = (person, drinks) => {
  const grouped = {};
  (drinks || []).forEach((d) => {
    const drink = mapDrink(d);
    if (!grouped[drink.date]) grouped[drink.date] = [];
    grouped[drink.date].push(drink);
  });
  return {
    id: person.id,
    name: person.name,
    avatar: person.avatar,
    createdAt: person.created_at,
    drinks: grouped,
  };
};

const getPerson = async (id) => {
  const { data: person, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  const { data: drinks } = await supabase
    .from('drinks')
    .select('*')
    .eq('person_id', id);
  return buildPerson(person, drinks || []);
};

export const storageService = {
  // Local identity (which person this browser is)
  getSelfId: () => localStorage.getItem(STORAGE_KEYS.SELF_ID),
  saveSelfId: (id) => localStorage.setItem(STORAGE_KEYS.SELF_ID, id),

  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'system',
  setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),

  // People (Supabase)
  async getPeople() {
    const [peopleRes, drinksRes] = await Promise.all([
      supabase.from('people').select('*').order('created_at'),
      supabase.from('drinks').select('*'),
    ]);
    if (peopleRes.error) throw peopleRes.error;
    if (drinksRes.error) throw drinksRes.error;
    const drinks = drinksRes.data || [];
    return (peopleRes.data || []).map((p) =>
      buildPerson(p, drinks.filter((d) => d.person_id === p.id))
    );
  },

  async createPerson(person) {
    const { data, error } = await supabase
      .from('people')
      .insert({ name: person.name, avatar: person.avatar })
      .select()
      .single();
    if (error) throw error;
    return { ...data, drinks: {} };
  },

  async updatePerson(id, updates) {
    const { error } = await supabase
      .from('people')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return getPerson(id);
  },

  async removePerson(id) {
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) throw error;
  },

  // Drinks (Supabase)
  async addDrink(personId, date, drink) {
    const { error } = await supabase.from('drinks').insert({
      person_id: personId,
      date,
      name: drink.name,
      icon: drink.icon,
      volume: drink.volume,
      abv: drink.abv,
      alcohol: drink.alcohol,
      beer_liters: drink.beerLiters,
    });
    if (error) throw error;
    return getPerson(personId);
  },

  async removeDrink(personId, date, drinkId) {
    const { error } = await supabase.from('drinks').delete().eq('id', drinkId);
    if (error) throw error;
    return getPerson(personId);
  },

  async clearDrinksForDate(personId, date) {
    const { error } = await supabase
      .from('drinks')
      .delete()
      .eq('person_id', personId)
      .eq('date', date);
    if (error) throw error;
    return getPerson(personId);
  },

  async resetAll() {
    const { error: drinksError } = await supabase
      .from('drinks')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (drinksError) throw drinksError;
    const { error: peopleError } = await supabase
      .from('people')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (peopleError) throw peopleError;
  },
};
