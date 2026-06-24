const STORAGE_KEYS = {
  USER: 'alcohol_tracker_user',
  DRINKS: 'alcohol_tracker_drinks',
  FRIENDS: 'alcohol_tracker_friends',
  THEME: 'alcohol_tracker_theme',
};

export const storageService = {
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  saveUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getDrinks: () => {
    const drinks = localStorage.getItem(STORAGE_KEYS.DRINKS);
    return drinks ? JSON.parse(drinks) : {};
  },

  saveDrinks: (drinks) => {
    localStorage.setItem(STORAGE_KEYS.DRINKS, JSON.stringify(drinks));
  },

  addDrink: (date, drink) => {
    const drinks = storageService.getDrinks();
    if (!drinks[date]) {
      drinks[date] = [];
    }
    drinks[date].push({
      ...drink,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    storageService.saveDrinks(drinks);
    return drinks;
  },

  removeDrink: (date, drinkId) => {
    const drinks = storageService.getDrinks();
    if (drinks[date]) {
      drinks[date] = drinks[date].filter(d => d.id !== drinkId);
      if (drinks[date].length === 0) {
        delete drinks[date];
      }
    }
    storageService.saveDrinks(drinks);
    return drinks;
  },

  getFriends: () => {
    const friends = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    return friends ? JSON.parse(friends) : [];
  },

  saveFriends: (friends) => {
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  },

  addFriend: (friend) => {
    const friends = storageService.getFriends();
    const newFriend = {
      ...friend,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    friends.push(newFriend);
    storageService.saveFriends(friends);
    return friends;
  },

  removeFriend: (friendId) => {
    const friends = storageService.getFriends();
    const updated = friends.filter(f => f.id !== friendId);
    storageService.saveFriends(updated);
    return updated;
  },

  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'system';
  },

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
