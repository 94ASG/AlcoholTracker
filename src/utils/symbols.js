// ==============================================
// AlcoholTracker 2.0: Symbol-Passwort System (Wii U Style)
// ==============================================

export const CARD_SYMBOLS = [
  {
    id: 'spade',
    symbol: '♠',
    label: 'Pik',
    color: '#00F0FF',
    glowClass: 'shadow-[0_0_15px_rgba(0,240,255,0.4)]',
    borderClass: 'border-[#00F0FF]/40',
    bgClass: 'bg-[#00F0FF]/10',
    textClass: 'text-[#00F0FF]',
  },
  {
    id: 'heart',
    symbol: '♥',
    label: 'Herz',
    color: '#FF2E93',
    glowClass: 'shadow-[0_0_15px_rgba(255,46,147,0.4)]',
    borderClass: 'border-[#FF2E93]/40',
    bgClass: 'bg-[#FF2E93]/10',
    textClass: 'text-[#FF2E93]',
  },
  {
    id: 'diamond',
    symbol: '♦',
    label: 'Karo',
    color: '#FFB800',
    glowClass: 'shadow-[0_0_15px_rgba(255,184,0,0.4)]',
    borderClass: 'border-[#FFB800]/40',
    bgClass: 'bg-[#FFB800]/10',
    textClass: 'text-[#FFB800]',
  },
  {
    id: 'club',
    symbol: '♣',
    label: 'Kreuz',
    color: '#C6FF3D',
    glowClass: 'shadow-[0_0_15px_rgba(198,255,61,0.4)]',
    borderClass: 'border-[#C6FF3D]/40',
    bgClass: 'bg-[#C6FF3D]/10',
    textClass: 'text-[#C6FF3D]',
  },
];

export const CARD_SYMBOLS_MAP = CARD_SYMBOLS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {});

/**
 * Generiert einen zufälligen 4-Symbol-Code als String (z.B. "spade,heart,club,spade")
 */
export const generateRandomSymbolCode = () => {
  const code = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * CARD_SYMBOLS.length);
    code.push(CARD_SYMBOLS[randomIndex].id);
  }
  return code.join(',');
};

/**
 * Parst einen Code-String in ein Array von Symbol-Objekten
 */
export const parseSymbolCode = (codeString) => {
  if (!codeString || typeof codeString !== 'string') return [];
  const parts = codeString.split(',').map((p) => p.trim());
  return parts.map((id) => CARD_SYMBOLS_MAP[id]).filter(Boolean);
};

/**
 * Vergleicht eine Liste eingegebener Symbol-IDs mit dem Ziel-Code-String
 */
export const verifySymbolCode = (enteredIds = [], targetCodeString = '') => {
  if (!targetCodeString) return true; // Offene Party
  if (!enteredIds || enteredIds.length !== 4) return false;
  const targetIds = targetCodeString.split(',').map((p) => p.trim());
  if (targetIds.length !== 4) return false;
  return enteredIds.every((id, idx) => id === targetIds[idx]);
};
