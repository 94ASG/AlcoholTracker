import { describe, it, expect } from 'vitest';
import {
  calculateAlcoholGrams,
  calculateBeerLiters,
  formatGrams,
  formatTimeRemaining,
  getGroupMilestoneInfo,
  computeBadges,
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
    expect(DRINKS_DB.beer_500).toBeDefined();
    expect(DRINKS_DB.beer_330).toBeDefined();
    expect(DRINKS_DB.radler_500).toBeDefined();
    expect(DRINKS_DB.radler_330).toBeDefined();
    expect(DRINKS_DB.mischen).toBeDefined();
    expect(DRINKS_DB.klopfer).toBeDefined();
    expect(DRINKS_DB.hubertus).toBeDefined();
    expect(DRINKS_DB.berentzen).toBeDefined();
    expect(DRINKS_DB.vodka_shot).toBeDefined();
    expect(DRINKS_DB.prosecco).toBeDefined();
    expect(DRINKS_DB.champagne).toBeDefined();
    expect(DRINKS_DB.wine).toBeDefined();
    expect(DRINKS_DB.whiskey).toBeUndefined();
    expect(DRINKS_DB.rum).toBeUndefined();
    expect(DRINKS_DB.gin).toBeUndefined();
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

describe('Group Milestones', () => {
  it('calculates initial milestone correctly for 0g', () => {
    const info = getGroupMilestoneInfo(0);
    expect(info.nextMilestone.target).toBe(25);
    expect(info.percent).toBe(0);
    expect(info.gramsRemaining).toBe(25);
    expect(info.achievedCount).toBe(0);
  });

  it('calculates progress between milestones', () => {
    // 35g is between 25g (Warm-Up) and 50g (50g Club)
    // Range is 50 - 25 = 25. Current in range is 35 - 25 = 10. 10/25 = 40%
    const info = getGroupMilestoneInfo(35);
    expect(info.nextMilestone.target).toBe(50);
    expect(info.percent).toBe(40);
    expect(info.gramsRemaining).toBe(15);
    expect(info.achievedCount).toBe(1);
  });

  it('correctly tracks high tier milestones', () => {
    const info = getGroupMilestoneInfo(220);
    expect(info.nextMilestone.target).toBe(350);
    expect(info.achievedCount).toBe(4); // 25, 50, 100, 200 achieved
  });
});

describe('Dynamic Badges', () => {
  const members = [
    { id: 'u1', name: 'Lukas' },
    { id: 'u2', name: 'Hannes' },
    { id: 'u3', name: 'Sarah' },
  ];

  it('assigns early bird to the very first drink logged', () => {
    const drinks = [
      { id: 'd1', profile_id: 'u2', created_at: '2026-10-10T20:00:00Z', category: 'beer', beer_liters: 0.5 },
      { id: 'd2', profile_id: 'u1', created_at: '2026-10-10T20:15:00Z', category: 'shot' },
    ];
    const badges = computeBadges(drinks, members);
    const hannesBadges = badges.get('u2');
    expect(hannesBadges.some((b) => b.id === 'early_bird')).toBe(true);
  });

  it('assigns bierkönig to the highest beer consumer', () => {
    const drinks = [
      { id: 'd1', profile_id: 'u1', created_at: '2026-10-10T20:00:00Z', category: 'beer', beer_liters: 1.0 },
      { id: 'd2', profile_id: 'u2', created_at: '2026-10-10T20:05:00Z', category: 'beer', beer_liters: 0.5 },
    ];
    const badges = computeBadges(drinks, members);
    const lukasBadges = badges.get('u1');
    expect(lukasBadges.some((b) => b.id === 'beer_king')).toBe(true);
  });

  it('assigns shot-maschine to highest shot consumer with at least 2 shots', () => {
    const drinks = [
      { id: 'd1', profile_id: 'u3', created_at: '2026-10-10T20:00:00Z', category: 'shot' },
      { id: 'd2', profile_id: 'u3', created_at: '2026-10-10T20:10:00Z', category: 'shot' },
    ];
    const badges = computeBadges(drinks, members);
    const sarahBadges = badges.get('u3');
    expect(sarahBadges.some((b) => b.id === 'shot_machine')).toBe(true);
  });

  it('assigns spendierhose when user logs drinks for others', () => {
    const drinks = [
      { id: 'd1', profile_id: 'u1', logged_by: 'u2', created_at: '2026-10-10T20:00:00Z' },
      { id: 'd2', profile_id: 'u3', logged_by: 'u2', created_at: '2026-10-10T20:00:00Z' },
    ];
    const badges = computeBadges(drinks, members);
    const hannesBadges = badges.get('u2');
    expect(hannesBadges.some((b) => b.id === 'spendierhose')).toBe(true);
  });
});
