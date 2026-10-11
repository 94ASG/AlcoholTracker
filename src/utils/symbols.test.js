import { describe, it, expect } from 'vitest';
import {
  CARD_SYMBOLS,
  CARD_SYMBOLS_MAP,
  generateRandomSymbolCode,
  parseSymbolCode,
  verifySymbolCode,
} from './symbols';

describe('Symbol Password Utilities', () => {
  it('contains the 4 required card symbols', () => {
    expect(CARD_SYMBOLS.length).toBe(4);
    expect(CARD_SYMBOLS_MAP.spade).toBeDefined();
    expect(CARD_SYMBOLS_MAP.heart).toBeDefined();
    expect(CARD_SYMBOLS_MAP.diamond).toBeDefined();
    expect(CARD_SYMBOLS_MAP.club).toBeDefined();
  });

  it('generates a random 4-symbol code', () => {
    const code = generateRandomSymbolCode();
    const parts = code.split(',');
    expect(parts.length).toBe(4);
    parts.forEach((p) => {
      expect(['spade', 'heart', 'diamond', 'club']).toContain(p);
    });
  });

  it('correctly parses a symbol code string into objects', () => {
    const code = 'spade,heart,diamond,club';
    const parsed = parseSymbolCode(code);
    expect(parsed.length).toBe(4);
    expect(parsed[0].symbol).toBe('♠');
    expect(parsed[1].symbol).toBe('♥');
    expect(parsed[2].symbol).toBe('♦');
    expect(parsed[3].symbol).toBe('♣');
  });

  it('handles invalid or empty symbol code strings gracefully', () => {
    expect(parseSymbolCode(null)).toEqual([]);
    expect(parseSymbolCode('')).toEqual([]);
    expect(parseSymbolCode('invalid')).toEqual([]);
  });

  it('verifies correct symbol code successfully', () => {
    const target = 'spade,heart,club,diamond';
    const valid = ['spade', 'heart', 'club', 'diamond'];
    const invalid = ['heart', 'spade', 'club', 'diamond'];
    const tooShort = ['spade', 'heart', 'club'];

    expect(verifySymbolCode(valid, target)).toBe(true);
    expect(verifySymbolCode(invalid, target)).toBe(false);
    expect(verifySymbolCode(tooShort, target)).toBe(false);
  });

  it('returns true when party has no target code (open party)', () => {
    expect(verifySymbolCode([], null)).toBe(true);
    expect(verifySymbolCode([], '')).toBe(true);
  });
});
