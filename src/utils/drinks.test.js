import { describe, it, expect } from 'vitest';
import {
  calculateAlcoholGrams,
  calculateAlcoholLiters,
  calculateBeerLiters,
  formatGrams,
  formatTimeRemaining,
  DRINKS_DB,
} from './drinks';

describe('Alcohol Calculations', () => {
  it('correctly calculates alcohol grams for 0.5L beer at 5%', () => {
    // 500ml * 0.05 * 0.789 = 19.725 -> 19.7
    const grams = calculateAlcoholGrams(500, 5);
    expect(grams).toBe(19.7);
  });

  it('correctly calculates alcohol grams for 50ml vodka shot at 40%', () => {
    // 50ml * 0.40 * 0.789 = 15.78 -> 15.8
    const grams = calculateAlcoholGrams(50, 40);
    expect(grams).toBe(15.8);
  });

  it('handles edge cases with zero volume or abv', () => {
    expect(calculateAlcoholGrams(0, 5)).toBe(0);
    expect(calculateAlcoholGrams(500, 0)).toBe(0);
    expect(calculateAlcoholGrams(null, null)).toBe(0);
  });

  it('correctly calculates beer liters equivalent', () => {
    expect(calculateBeerLiters(500, 1)).toBe(0.5);
    expect(calculateBeerLiters(500, 0.5)).toBe(0.25);
    expect(calculateBeerLiters(50, 0)).toBe(0);
  });

  it('formats grams rounded for the ranking UI', () => {
    expect(formatGrams(19.7)).toBe('20');
    expect(formatGrams(15.2)).toBe('15');
    expect(formatGrams(0)).toBe('0');
  });

  it('contains all required drinks in the database', () => {
    expect(DRINKS_DB.beer).toBeDefined();
    expect(DRINKS_DB.radler).toBeDefined();
    expect(DRINKS_DB.mischen).toBeDefined();
    expect(DRINKS_DB.vodka).toBeDefined();
    expect(DRINKS_DB.hubertus).toBeDefined();
    expect(DRINKS_DB.klopfer).toBeDefined();
  });
});

describe('Countdown formatting', () => {
  it('formats past date as ending now', () => {
    const past = new Date(Date.now() - 10000);
    expect(formatTimeRemaining(past)).toBe('Endet jetzt');
  });

  it('formats future date with hours and minutes', () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000);
    const res = formatTimeRemaining(future);
    expect(res).toMatch(/2h 1[45]m/);
  });
});
