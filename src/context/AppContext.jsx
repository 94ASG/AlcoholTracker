import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storageService } from '../utils/storage';
import { supabase } from '../lib/supabase';
import { getDateKey } from '../utils/drinks';

const AppContext = createContext();

// Guard against React StrictMode double-invoking the init effect in dev,
// which would otherwise create a duplicate identity on the server.
let initStarted = false;

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [theme, setThemeState] = useState('light');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [needsIdentitySetup, setNeedsIdentitySetup] = useState(false);
  const selfIdRef = useRef(null);

  const refreshPeople = useCallback(async () => {
    const people = await storageService.getPeople();
    const selfId = selfIdRef.current;
    const self = people.find((p) => p.id === selfId) || null;
    setCurrentUser(self);
    setFriends(people.filter((p) => p.id !== selfId));
  }, []);

  useEffect(() => {
    const init = async () => {
      if (initStarted) return;
      initStarted = true;

      const storedTheme = storageService.getTheme();
      setThemeState(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }

      let selfId = storageService.getSelfId();
      selfIdRef.current = selfId;

      try {
        let people = await storageService.getPeople();

        // If this browser has no identity yet, create one on the server.
        if (!selfId || !people.find((p) => p.id === selfId)) {
          const newSelf = await storageService.createPerson({ name: 'Du', avatar: '👤' });
          selfId = newSelf.id;
          selfIdRef.current = selfId;
          storageService.saveSelfId(selfId);
          setNeedsIdentitySetup(true);
          people = await storageService.getPeople();
        }

        const self = people.find((p) => p.id === selfId) || null;
        setCurrentUser(self);
        setFriends(people.filter((p) => p.id !== selfId));
      } catch (err) {
        setLoadError(err.message || 'Could not connect to Supabase.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Subscribe to Supabase realtime so drinks added by other people
  // appear instantly across devices.
  useEffect(() => {
    if (loading) return;
    const channel = supabase
      .channel('tracker-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'people' }, () => {
        refreshPeople();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drinks' }, () => {
        refreshPeople();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading, refreshPeople]);

  const updateUser = async (updates) => {
    if (!currentUser) return;
    const updated = await storageService.updatePerson(currentUser.id, updates);
    setCurrentUser(updated);
    if (updates.name !== undefined || updates.avatar !== undefined) {
      setNeedsIdentitySetup(false);
    }
  };

  const addDrink = async (drink) => {
    if (!currentUser) return;
    const today = getDateKey();
    const updated = await storageService.addDrink(currentUser.id, today, drink);
    setCurrentUser(updated);
  };

  const removeDrink = async (drinkId) => {
    if (!currentUser) return;
    const today = getDateKey();
    const updated = await storageService.removeDrink(currentUser.id, today, drinkId);
    setCurrentUser(updated);
  };

  const addFriend = async (friend) => {
    const created = await storageService.createPerson(friend);
    setFriends((prev) => [...prev, created]);
  };

  const removeFriend = async (friendId) => {
    await storageService.removePerson(friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const addDrinkToFriend = async (friendId, drink) => {
    const today = getDateKey();
    const updated = await storageService.addDrink(friendId, today, drink);
    setFriends((prev) => prev.map((f) => (f.id === friendId ? updated : f)));
  };

  const removeDrinkFromFriend = async (friendId, drinkId) => {
    const today = getDateKey();
    const updated = await storageService.removeDrink(friendId, today, drinkId);
    setFriends((prev) => prev.map((f) => (f.id === friendId ? updated : f)));
  };

  const getFriendDrinksForDate = (friendId, date) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend || !friend.drinks) return [];
    const dateKey = typeof date === 'string' ? date : getDateKey(date);
    return friend.drinks[dateKey] || [];
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    storageService.setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getDrinksForDate = (date) => {
    if (!currentUser || !currentUser.drinks) return [];
    const dateKey = typeof date === 'string' ? date : getDateKey(date);
    return currentUser.drinks[dateKey] || [];
  };

  const getTodayAlcohol = () => {
    const today = getDateKey();
    const todayDrinks = getDrinksForDate(today);
    return todayDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
  };

  const getTodayBeerLiters = () => {
    const today = getDateKey();
    const todayDrinks = getDrinksForDate(today);
    return todayDrinks.reduce((sum, drink) => sum + (drink.beerLiters || 0), 0);
  };

  const getFriendTodayAlcohol = (friendId) => {
    const today = getDateKey();
    const friendDrinks = getFriendDrinksForDate(friendId, today);
    return friendDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
  };

  const getFriendTodayBeerLiters = (friendId) => {
    const today = getDateKey();
    const friendDrinks = getFriendDrinksForDate(friendId, today);
    return friendDrinks.reduce((sum, drink) => sum + (drink.beerLiters || 0), 0);
  };

  const getWeeklyStats = () => {
    const stats = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = getDateKey(date);
      const dayDrinks = getDrinksForDate(dateKey);
      stats[dateKey] = dayDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
    }
    return stats;
  };

  const getMonthlyStats = () => {
    const stats = {};
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let date = new Date(monthStart); date <= monthEnd; date.setDate(date.getDate() + 1)) {
      const dateKey = getDateKey(date);
      const dayDrinks = getDrinksForDate(dateKey);
      stats[dateKey] = dayDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
    }
    return stats;
  };

  const getWeeklyAlcohol = () => {
    const weeklyStats = getWeeklyStats();
    return Object.values(weeklyStats).reduce((sum, val) => sum + val, 0);
  };

  const getWeeklyBeerLiters = () => {
    const today = new Date();
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = getDateKey(date);
      const dayDrinks = getDrinksForDate(dateKey);
      total += dayDrinks.reduce((sum, drink) => sum + (drink.beerLiters || 0), 0);
    }
    return total;
  };

  const getFriendWeeklyAlcohol = (friendId) => {
    const today = new Date();
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = getDateKey(date);
      const friendDrinks = getFriendDrinksForDate(friendId, dateKey);
      total += friendDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
    }
    return total;
  };

  const getFriendWeeklyBeerLiters = (friendId) => {
    const today = new Date();
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = getDateKey(date);
      const friendDrinks = getFriendDrinksForDate(friendId, dateKey);
      total += friendDrinks.reduce((sum, drink) => sum + (drink.beerLiters || 0), 0);
    }
    return total;
  };

  const getLeaderboard = () => {
    if (!currentUser) return [];
    const today = getDateKey();
    const board = [
      {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        alcohol: getTodayAlcohol(),
        beerLiters: getTodayBeerLiters(),
        weeklyAlcohol: getWeeklyAlcohol(),
        weeklyBeerLiters: getWeeklyBeerLiters(),
      },
    ];

    friends.forEach((friend) => {
      board.push({
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar,
        alcohol: getFriendTodayAlcohol(friend.id),
        beerLiters: getFriendTodayBeerLiters(friend.id),
        weeklyAlcohol: getFriendWeeklyAlcohol(friend.id),
        weeklyBeerLiters: getFriendWeeklyBeerLiters(friend.id),
      });
    });

    return board.sort((a, b) => b.alcohol - a.alcohol);
  };

  const clearAllDrinks = async () => {
    if (!currentUser) return;
    const today = getDateKey();
    const updatedSelf = await storageService.clearDrinksForDate(currentUser.id, today);
    setCurrentUser(updatedSelf);
    const updatedFriends = await Promise.all(
      friends.map((f) => storageService.clearDrinksForDate(f.id, today))
    );
    setFriends(updatedFriends);
  };

  const resetEverything = async () => {
    await storageService.resetAll();
    const newSelf = await storageService.createPerson({ name: 'Du', avatar: '👤' });
    selfIdRef.current = newSelf.id;
    storageService.saveSelfId(newSelf.id);
    setCurrentUser(newSelf);
    setFriends([]);
    setNeedsIdentitySetup(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateUser,
        drinks: currentUser?.drinks || {},
        addDrink,
        removeDrink,
        getDrinksForDate,
        getTodayAlcohol,
        getTodayBeerLiters,
        getWeeklyStats,
        getMonthlyStats,
        getWeeklyAlcohol,
        getWeeklyBeerLiters,
        getFriendWeeklyAlcohol,
        getFriendWeeklyBeerLiters,
        friends,
        addFriend,
        removeFriend,
        addDrinkToFriend,
        removeDrinkFromFriend,
        getFriendDrinksForDate,
        getFriendTodayAlcohol,
        getFriendTodayBeerLiters,
        theme,
        setTheme,
        getLeaderboard,
        clearAllDrinks,
        resetEverything,
        loading,
        loadError,
        needsIdentitySetup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
