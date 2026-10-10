// ==============================================
// AlcoholTracker 2.0: Getränkedatenbank & Rechner
// ==============================================

export const ETHANOL_DENSITY = 0.789; // g/ml

export const DRINKS_DB = {
  beer: {
    key: 'beer',
    name: 'Bier',
    category: 'beer',
    defaultAbv: 5.0,
    icon: '🍺',
    volume: 500,
    beerFactor: 1,
  },
  radler: {
    key: 'radler',
    name: 'Radler',
    category: 'beer',
    defaultAbv: 2.5,
    icon: '🍺',
    volume: 500,
    beerFactor: 0.5,
  },
  mischen: {
    key: 'mischen',
    name: 'Mischen',
    category: 'mix',
    defaultAbv: 0,
    icon: '🥤',
    volume: 250,
    beerFactor: 0,
    isCustomMix: true,
  },
  wine: {
    key: 'wine',
    name: 'Wein',
    category: 'wine',
    defaultAbv: 12.0,
    icon: '🍷',
    volume: 150,
    beerFactor: 0,
  },
  vodka: {
    key: 'vodka',
    name: 'Vodka',
    category: 'shot',
    defaultAbv: 40.0,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  whiskey: {
    key: 'whiskey',
    name: 'Whiskey',
    category: 'shot',
    defaultAbv: 40.0,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  rum: {
    key: 'rum',
    name: 'Rum',
    category: 'shot',
    defaultAbv: 40.0,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  gin: {
    key: 'gin',
    name: 'Gin',
    category: 'shot',
    defaultAbv: 40.0,
    icon: '🥃',
    volume: 50,
    beerFactor: 0,
  },
  prosecco: {
    key: 'prosecco',
    name: 'Prosecco',
    category: 'sparkling',
    defaultAbv: 11.0,
    icon: '🍾',
    volume: 150,
    beerFactor: 0,
  },
  champagne: {
    key: 'champagne',
    name: 'Champagne',
    category: 'sparkling',
    defaultAbv: 12.0,
    icon: '🍾',
    volume: 150,
    beerFactor: 0,
  },
  hubertus: {
    key: 'hubertus',
    name: 'Hubertus Tropfen',
    category: 'shot',
    defaultAbv: 16.0,
    icon: '🌿',
    volume: 20,
    beerFactor: 0,
  },
  klopfer: {
    key: 'klopfer',
    name: 'Klopfer',
    category: 'shot',
    defaultAbv: 16.0,
    icon: '🌰',
    volume: 50,
    beerFactor: 0,
  },
};

export const SPIRITS_DB = {
  vodka: { key: 'vodka', name: 'Wodka', abv: 40, icon: '🥃' },
  korn: { key: 'korn', name: 'Korn', abv: 38, icon: '🌾' },
  springer: { key: 'springer', name: 'Springer', abv: 33, icon: '🍺' },
};

export const MIX_RATIOS = [
  { label: '10% Spirituose', value: '10-90', ratio: 0.10 },
  { label: '20% Spirituose', value: '20-80', ratio: 0.20 },
  { label: '30% Spirituose', value: '30-70', ratio: 0.30 },
  { label: '40% Spirituose', value: '40-60', ratio: 0.40 },
  { label: '50% Spirituose (Halbe-Halbe)', value: '50-50', ratio: 0.50 },
];

export const MIX_SIZES = [100, 150, 200, 250, 300, 500];

// Berechnet reinen Alkohol in Gramm
export const calculateAlcoholGrams = (volumeMl, abvPercent) => {
  if (!volumeMl || !abvPercent) return 0;
  return Number(((volumeMl * (abvPercent / 100)) * ETHANOL_DENSITY).toFixed(1));
};

// Berechnet reinen Alkohol in Litern
export const calculateAlcoholLiters = (volumeMl, abvPercent) => {
  if (!volumeMl || !abvPercent) return 0;
  return Number(((volumeMl * (abvPercent / 100)) / 1000).toFixed(4));
};

// Berechnet Bier-Äquivalent in Litern
export const calculateBeerLiters = (volumeMl, beerFactor = 0) => {
  if (!volumeMl || !beerFactor) return 0;
  return Number(((volumeMl * beerFactor) / 1000).toFixed(2));
};

// Formatiert Gramm Alkohol sauber ohne Nachkommastelle für das Ranking
export const formatGrams = (grams) => {
  return Math.round(Number(grams) || 0).toString();
};

// Formatiert Restzeit bis zum Party-Ende
export const formatTimeRemaining = (endsAtDate) => {
  if (!endsAtDate) return '';
  const now = new Date();
  const target = new Date(endsAtDate);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'Endet jetzt';

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours === 0) {
    return `${diffMinutes}m`;
  }
  return `${diffHours}h ${diffMinutes}m`;
};
