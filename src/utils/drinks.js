export const DRINKS_DB = {
  beer: {
    name: 'Bier',
    category: 'Beer',
    defaultAbv: 5,
    icon: '🍺',
    volume: 500,
    beerFactor: 1,
  },
  radler: {
    name: 'Radler',
    category: 'Beer',
    defaultAbv: 2.5,
    icon: '🍺',
    volume: 500,
    beerFactor: 0.5,
  },
  wine: {
    name: 'Wein',
    category: 'Wine',
    defaultAbv: 12,
    icon: '🍷',
    volume: 150,
    beerFactor: 0,
  },
  vodka: {
    name: 'Vodka',
    category: 'Spirits',
    defaultAbv: 40,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  whiskey: {
    name: 'Whiskey',
    category: 'Spirits',
    defaultAbv: 40,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  rum: {
    name: 'Rum',
    category: 'Spirits',
    defaultAbv: 40,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  gin: {
    name: 'Gin',
    category: 'Spirits',
    defaultAbv: 40,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  prosecco: {
    name: 'Prosecco',
    category: 'Sparkling',
    defaultAbv: 11,
    icon: '🍾',
    volume: 150,
    beerFactor: 0,
  },
  champagne: {
    name: 'Champagne',
    category: 'Sparkling',
    defaultAbv: 12,
    icon: '🍾',
    volume: 150,
    beerFactor: 0,
  },
  cider: {
    name: 'Apfelwein',
    category: 'Cider',
    defaultAbv: 5.5,
    icon: '🍎',
    volume: 500,
    beerFactor: 0,
  },
  cocktail: {
    name: 'Cocktail',
    category: 'Cocktail',
    defaultAbv: 15,
    icon: '🍹',
    volume: 250,
    beerFactor: 0,
  },
  hubertus: {
    name: 'Hubertus Tropfen',
    category: 'Liqueur',
    defaultAbv: 35,
    icon: '🌿',
    volume: 50,
    beerFactor: 0,
  },
  klopfer: {
    name: 'Klopfer',
    category: 'Spirits',
    defaultAbv: 32,
    icon: '🌰',
    volume: 50,
    beerFactor: 0,
  },
  mischen: {
    name: 'Mischen',
    category: 'Mix',
    defaultAbv: 0,
    icon: '🥤',
    volume: 0,
    beerFactor: 0,
    isCustomMix: true,
  },
};

export const calculateAlcohol = (volumeMl, abvPercent) => {
  return (volumeMl * (abvPercent / 100)) / 1000;
};

export const calculateBeerLiters = (volumeMl, beerFactor) => {
  return (volumeMl * beerFactor) / 1000;
};

export const formatAlcohol = (liters) => {
  return (liters * 1000).toFixed(0);
};

export const formatBeerLiters = (liters) => {
  return liters.toFixed(2);
};

export const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export const getWeekDates = (date = new Date()) => {
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - date.getDay());
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(getDateKey(d));
  }
  return dates;
};

export const getMonthDates = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const dates = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    dates.push(getDateKey(d));
  }
  return dates;
};

