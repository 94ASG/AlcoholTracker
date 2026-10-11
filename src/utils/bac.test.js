import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTbw,
  calculateBacFromDrinks,
  getBodyProfile,
  saveBodyProfile,
  clearBodyProfile,
} from './bac';

describe('Watson TBW Calculations', () => {
  it('calculates TBW for an average male (25yo, 180cm, 75kg)', () => {
    // 2.447 - (0.09516 * 25) + (0.1074 * 180) + (0.3362 * 75)
    // = 2.447 - 2.379 + 19.332 + 25.215 = 44.615
    const tbw = calculateTbw({ gender: 'male', age: 25, heightCm: 180, weightKg: 75 });
    expect(tbw).toBeCloseTo(44.615, 2);
  });

  it('calculates TBW for an average female (25yo, 165cm, 60kg)', () => {
    // -2.097 + (0.1069 * 165) + (0.2466 * 60)
    // = -2.097 + 17.6385 + 14.796 = 30.3375
    const tbw = calculateTbw({ gender: 'female', age: 25, heightCm: 165, weightKg: 60 });
    expect(tbw).toBeCloseTo(30.3375, 2);
  });

  it('calculates TBW for diverse/other as average of male and female', () => {
    const male = calculateTbw({ gender: 'male', age: 25, heightCm: 175, weightKg: 70 });
    const female = calculateTbw({ gender: 'female', age: 25, heightCm: 175, weightKg: 70 });
    const other = calculateTbw({ gender: 'other', age: 25, heightCm: 175, weightKg: 70 });
    expect(other).toBeCloseTo((male + female) / 2, 2);
  });
});

describe('BAC Time Kinetics and Metabolism', () => {
  const profile = { gender: 'male', age: 25, heightCm: 180, weightKg: 75 };

  it('returns zero for empty drinks or missing profile', () => {
    const result1 = calculateBacFromDrinks([], profile);
    expect(result1.currentBac).toBe(0);
    expect(result1.isZero).toBe(true);

    const result2 = calculateBacFromDrinks([{ alcohol_g: 20, created_at: new Date().toISOString() }], null);
    expect(result2.currentBac).toBe(0);
  });

  it('calculates BAC accurately after 1 drink 30 minutes ago (full absorption)', () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const drinks = [{ alcohol_g: 19.7, created_at: thirtyMinsAgo }]; // 1 Bier 0.5L

    const result = calculateBacFromDrinks(drinks, profile);
    // TBW ~ 44.615 L. Total BAC before elimination = 19.7 * 0.8 / 44.615 = 0.353
    // Elimination over 30 mins at 0.12/h = 0.06
    // Net ~ 0.353 - 0.06 ~ 0.29
    expect(result.currentBac).toBeGreaterThan(0.20);
    expect(result.currentBac).toBeLessThan(0.35);
    expect(result.isZero).toBe(false);
    expect(result.soberTimeString).toContain(':');
  });

  it('shows lower BAC during early absorption (e.g. 5 mins after drinking)', () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const drinks = [{ alcohol_g: 19.7, created_at: fiveMinsAgo }];

    const result = calculateBacFromDrinks(drinks, profile);
    // After 5 mins, only ~5/30 of the drink has entered the bloodstream
    expect(result.currentBac).toBeGreaterThan(0.02);
    expect(result.currentBac).toBeLessThan(0.12);
  });

  it('completely eliminates alcohol after sufficient time (e.g. 8 hours after 1 beer)', () => {
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
    const drinks = [{ alcohol_g: 19.7, created_at: eightHoursAgo }];

    const result = calculateBacFromDrinks(drinks, profile);
    expect(result.currentBac).toBe(0);
    expect(result.isZero).toBe(true);
    expect(result.soberTime).toBeNull();
  });

  it('accumulates multiple drinks over the evening and finds peak', () => {
    const now = Date.now();
    const drinks = [
      { alcohol_g: 19.7, created_at: new Date(now - 120 * 60 * 1000).toISOString() }, // 2h ago
      { alcohol_g: 19.7, created_at: new Date(now - 60 * 60 * 1000).toISOString() },  // 1h ago
      { alcohol_g: 15.8, created_at: new Date(now - 15 * 60 * 1000).toISOString() },  // 15m ago
    ];

    const result = calculateBacFromDrinks(drinks, profile);
    expect(result.currentBac).toBeGreaterThan(0.4);
    expect(result.peakBac).toBeGreaterThanOrEqual(result.currentBac);
    expect(result.formattedBac).toMatch(/^~\d+,\d{2} ‰$/);
  });
});

describe('LocalStorage BodyProfile Helpers', () => {
  let mockStore = {};

  beforeEach(() => {
    mockStore = {};
    globalThis.localStorage = {
      getItem: (key) => mockStore[key] || null,
      setItem: (key, val) => {
        mockStore[key] = String(val);
      },
      removeItem: (key) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };
  });

  it('saves, retrieves, and clears body profile', () => {
    expect(getBodyProfile()).toBeNull();

    saveBodyProfile({
      gender: 'female',
      age: 26,
      heightCm: 168,
      weightKg: 62,
      shareInParty: true,
    });

    const loaded = getBodyProfile();
    expect(loaded).not.toBeNull();
    expect(loaded.gender).toBe('female');
    expect(loaded.age).toBe(26);
    expect(loaded.heightCm).toBe(168);
    expect(loaded.weightKg).toBe(62);
    expect(loaded.shareInParty).toBe(true);

    clearBodyProfile();
    expect(getBodyProfile()).toBeNull();
  });
});
