import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { getDateKey } from '../utils/drinks';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [drinks, setDrinks] = useState({});
  const [friends, setFriends] = useState([]);
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const storedUser = storageService.getUser();
    const storedDrinks = storageService.getDrinks();
    const storedFriends = storageService.getFriends();
    const storedTheme = storageService.getTheme();

    if (!storedUser) {
      const newUser = {
        id: Date.now().toString(),
        name: 'Du',
        avatar: '👤',
        createdAt: new Date().toISOString(),
      };
      storageService.saveUser(newUser);
      setCurrentUser(newUser);
    } else {
      setCurrentUser(storedUser);
    }

    setDrinks(storedDrinks);
    setFriends(storedFriends);
    setThemeState(storedTheme);

    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const updateUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    storageService.saveUser(updated);
  };

  const addDrink = (drink) => {
    const today = getDateKey();
    const updated = storageService.addDrink(today, drink);
    setDrinks(updated);
  };

  const removeDrink = (drinkId) => {
    const today = getDateKey();
    const updated = storageService.removeDrink(today, drinkId);
    setDrinks(updated);
  };

  const addFriend = (friend) => {
    const updated = storageService.addFriend(friend);
    setFriends(updated);
  };

  const removeFriend = (friendId) => {
    const updated = storageService.removeFriend(friendId);
    setFriends(updated);
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
    const dateKey = typeof date === 'string' ? date : getDateKey(date);
    return drinks[dateKey] || [];
  };

  const getTodayAlcohol = () => {
    const today = getDateKey();
    const todayDrinks = getDrinksForDate(today);
    return todayDrinks.reduce((sum, drink) => sum + (drink.alcohol || 0), 0);
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

  const getLeaderboard = () => {
    const today = getDateKey();
    const board = [
      {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        alcohol: getTodayAlcohol(),
      },
    ];

    friends.forEach(friend => {
      board.push({
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar,
        alcohol: 0,
      });
    });

    return board.sort((a, b) => b.alcohol - a.alcohol);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateUser,
        drinks,
        addDrink,
        removeDrink,
        getDrinksForDate,
        getTodayAlcohol,
        getWeeklyStats,
        getMonthlyStats,
        friends,
        addFriend,
        removeFriend,
        theme,
        setTheme,
        getLeaderboard,
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
