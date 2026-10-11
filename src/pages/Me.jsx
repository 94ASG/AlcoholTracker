// ==============================================
// AlcoholTracker 2.0: Mein Profil & Party-Historie
// ==============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { api } from '../lib/api';
import { ArrowLeft, Bell, Sparkles, Check, ChevronRight } from 'lucide-react';
import { APP_VERSION } from '../config/version';
import { ChangelogModal } from '../components/common/ChangelogModal';

const EMOJI_OPTIONS = ['😎', '🥳', '🤠', '🍺', '🍸', '🦊', '🐻', '🐼', '🦁', '🐸', '👨‍🦱', '👩‍🦱'];
const COLOR_OPTIONS = ['#C6FF3D', '#FF2E93', '#8B5CF6', '#00F0FF', '#FFB800'];

export const Me = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState(profile?.name || '');
  const [emoji, setEmoji] = useState(profile?.emoji || '😎');
  const [color, setColor] = useState(profile?.color || '#C6FF3D');
  const [pastParties, setPastParties] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pushStatus, setPushStatus] = useState('default');
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      api.listPastParties(profile.id).then(setPastParties).catch(console.error);
    }
  }, [profile?.id]);

  useEffect(() => {
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        emoji,
        color,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPush = async () => {
    if (!('Notification' in window)) {
      alert('Dieser Browser unterstützt keine Push-Benachrichtigungen.');
      return;
    }

    const perm = await Notification.requestPermission();
    setPushStatus(perm);

    if (perm === 'granted') {
      try {
        await navigator.serviceWorker.ready;
        // Falls VAPID Keys hinterlegt sind, hier abonnieren
        alert('Push-Benachrichtigungen erfolgreich aktiviert! 🎉');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="app-container px-5 pb-24 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-surface-light border border-white/5 flex items-center justify-center text-dim hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="display-font text-3xl text-white tracking-wide">
            Mein <span className="text-neon-lime">Profil</span>
          </h1>
        </div>
      </header>

      <main className="space-y-6 pt-5">
        {/* Profil Einstellungen */}
        <form onSubmit={handleSave} className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: color,
              }}
            >
              {emoji}
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-faint mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-surface-light border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-neon-lime"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-faint mb-1.5">
              Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`p-2 rounded-xl text-xl border transition-all ${
                    emoji === em ? 'border-white bg-white/20' : 'border-white/5 bg-surface-light'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-faint mb-1.5">
              Farbe
            </label>
            <div className="flex gap-2.5">
              {COLOR_OPTIONS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  className={`w-8 h-8 rounded-xl border-2 transition-all ${
                    color === hex ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-lime w-full text-xs font-bold py-3 flex items-center justify-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Gespeichert!</span>
              </>
            ) : (
              <span>Änderungen speichern</span>
            )}
          </button>
        </form>

        {/* Push-Benachrichtigungen Box */}
        <div className="glass-card p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 flex items-center justify-center text-neon-cyan flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Push-Benachrichtigungen</p>
              <p className="text-[10px] text-dim">
                {pushStatus === 'granted'
                  ? 'Aktiviert – du erhältst morgens das Wrapped'
                  : 'Aktiviere Push für das morgendliche Wrapped'}
              </p>
            </div>
          </div>

          {pushStatus !== 'granted' && (
            <button
              onClick={handleRequestPush}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 text-neon-cyan text-xs font-bold whitespace-nowrap"
            >
              Aktivieren
            </button>
          )}
        </div>

        {/* Vergangene Partys (Historie) */}
        <div>
          <h3 className="display-font text-2xl text-white tracking-wide mb-3">
            Deine Partys & Wrappeds
          </h3>

          {pastParties.length === 0 ? (
            <div className="glass-card p-6 text-center text-dim text-xs">
              Noch keine vergangenen Partys erfasst.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pastParties.map((p) => {
                const dateStr = new Date(p.created_at).toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });

                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/p/${p.id}/wrapped`)}
                    className="glass-card p-3.5 flex items-center justify-between cursor-pointer hover:border-neon-pink/40 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-faint font-mono">{dateStr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-neon-pink text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Wrapped</span>
                      <ChevronRight className="w-4 h-4 ml-0.5 text-faint" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Versionsinfo & Changelog Button */}
        <div className="pt-6 pb-2 text-center space-y-2.5 border-t border-white/5">
          <p className="text-[11px] text-faint font-mono">
            AlcoholTracker <span className="text-dim font-bold">v{APP_VERSION}</span>
          </p>
          <button
            type="button"
            onClick={() => setIsChangelogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-light border border-white/5 text-xs font-bold text-dim hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Was ist neu? (Changelog)</span>
          </button>
        </div>
      </main>

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
};
