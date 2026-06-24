import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, getWeekDates } from '../utils/drinks';
import { AddDrinkButton } from './AddDrinkButton';
import { DrinksList } from './DrinksList';

export const ProfileView = () => {
  const { currentUser, getTodayAlcohol, getTodayBeerLiters, getDrinksForDate, getWeeklyStats } = useApp();
  const todayAlcohol = getTodayAlcohol();
  const todayBeerLiters = getTodayBeerLiters();
  const weeklyStats = getWeeklyStats();
  const todayDrinks = getDrinksForDate();

  const weekDates = getWeekDates();
  const weekTotal = weekDates.reduce((sum, date) => sum + (weeklyStats[date] || 0), 0);
  const weekAverage = (weekTotal / 7).toFixed(2);

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="text-center pt-6">
        <div className="text-6xl mb-4">{currentUser?.avatar || '👤'}</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{currentUser?.name}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Dein Alkoholkonsum</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">HEUTE</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatAlcohol(todayAlcohol)}<span className="text-xs ml-1">ml</span></div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{formatBeerLiters(todayBeerLiters)}L Bier</div>
        </div>
        
        <div className="card text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">WOCHE ⌀</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{(weekAverage * 1000).toFixed(0)}<span className="text-xs ml-1">ml</span></div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{(weekTotal * 1000).toFixed(0)}ml total</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Heute hinzugefügt</h3>
        {todayDrinks.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 text-center py-8 text-sm">Noch keine Getränke heute</p>
        ) : (
          <DrinksList drinks={todayDrinks} />
        )}
      </div>

      <AddDrinkButton />
    </div>
  );
};
