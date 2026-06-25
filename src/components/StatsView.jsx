import React from 'react';
import { useApp } from '../context/AppContext';
import { formatAlcohol, formatBeerLiters, getWeekDates, getMonthDates, getDateKey } from '../utils/drinks';

export const StatsView = () => {
  const { getWeeklyStats, getMonthlyStats, getLeaderboard } = useApp();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  const leaderboard = getLeaderboard();

  const weekDates = getWeekDates();
  const weekTotal = weekDates.reduce((sum, date) => sum + (weeklyStats[date] || 0), 0);
  const weekAverage = (weekTotal / 7).toFixed(2);

  const monthDates = getMonthDates();
  const monthTotal = monthDates.reduce((sum, date) => sum + (monthlyStats[date] || 0), 0);
  const monthAverage = (monthTotal / monthDates.length).toFixed(2);

  const maxWeekly = Math.max(...Object.values(weeklyStats), 0.001);
  const maxDaily = Math.max(...Object.values(monthlyStats), 0.001);

  const getDayName = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()];
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Statistiken</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Deine Verbrauchsübersicht</p>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">🏆 LEADERBOARD</h3>
        <div className="space-y-2">
          {leaderboard.map((person, index) => (
            <div
              key={person.id}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-bold text-lg text-slate-600 dark:text-slate-400 w-6 text-center">{index + 1}</span>
                  <span className="text-3xl">{person.avatar}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-900 dark:text-white text-sm">{person.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 ml-12 text-xs">
                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                  <div className="text-slate-600 dark:text-slate-400 mb-1 font-medium">HEUTE</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatAlcohol(person.alcohol)}ml</div>
                  <div className="text-slate-600 dark:text-slate-400">{formatBeerLiters(person.beerLiters)}L</div>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                  <div className="text-slate-600 dark:text-slate-400 mb-1 font-medium">7 TAGE</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatAlcohol(person.weeklyAlcohol)}ml</div>
                  <div className="text-slate-600 dark:text-slate-400">{formatBeerLiters(person.weeklyBeerLiters)}L</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">WÖCHENTLICHER ÜBERBLICK</h3>
        <div className="flex items-end gap-1 h-32 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          {weekDates.map(date => {
            const value = weeklyStats[date] || 0;
            const height = maxWeekly > 0 ? (value / maxWeekly) * 100 : 0;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 dark:bg-blue-600 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${getDayName(date)}: ${formatAlcohol(value)}ml`}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">{getDayName(date)}</span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">SUMME</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{(weekTotal * 1000).toFixed(0)}<span className="text-xs">ml</span></div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">DURCHSCHNITT</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{(weekAverage * 1000).toFixed(0)}<span className="text-xs">ml</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">MONATLICHER ÜBERBLICK</h3>
        <div className="flex items-end gap-0.5 h-24 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          {monthDates.map(date => {
            const value = monthlyStats[date] || 0;
            const height = maxDaily > 0 ? (value / maxDaily) * 100 : 0;
            return (
              <div
                key={date}
                className="flex-1 bg-green-500 dark:bg-green-600 rounded-t opacity-60 hover:opacity-100 transition-opacity"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${date}: ${formatAlcohol(value)}ml`}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">SUMME</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{(monthTotal * 1000).toFixed(0)}<span className="text-xs">ml</span></div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">DURCHSCHNITT</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{(monthAverage * 1000).toFixed(0)}<span className="text-xs">ml</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
