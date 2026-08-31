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
  mischen: {
    name: 'Mischen',
    category: 'Mix',
    defaultAbv: 0,
    icon: '🥤',
    volume: 0,
    beerFactor: 0,
    isCustomMix: true,
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
  hubertus: {
    name: 'Hubertus Tropfen',
    category: 'Liqueur',
    defaultAbv: 16,
    icon: '🌿',
    volume: 20,
    beerFactor: 0,
  },
  klopfer: {
    name: 'Klopfer',
    category: 'Spirits',
    defaultAbv: 16,
    icon: '🌰',
    volume: 50,
    beerFactor: 0,
  },
};

export const calculateAlcohol = (volumeMl, abvPercent) => {
  return (volumeMl * (abvPercent / 100)) / 1000;
};

export const calculateBeerLiters = (volumeMl, beerFactor) => {
  return (volumeMl * beerFactor) / 1000;
};

// Density of ethanol: 0.789 g/ml. Converts pure-alcohol liters to grams.
const ETHANOL_DENSITY = 0.789;

export const formatAlcohol = (liters) => {
  return (liters * 1000 * ETHANOL_DENSITY).toFixed(0);
};

export const formatBeerLiters = (liters) => {
  return liters.toFixed(2);
};

export const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

