import React, { useState } from 'react';
import { DRINKS_DB } from '../utils/drinks';

export const AddDrinkModal = ({ onClose, onAdd }) => {
  const [selectedTab, setSelectedTab] = useState('quick');
  const [mixMode, setMixMode] = useState(null);
  const [customDrink, setCustomDrink] = useState({
    name: '',
    volume: 500,
    abv: 5,
    icon: '🍹',
    beerFactor: 0,
  });
  const [mixConfig, setMixConfig] = useState({
    ratio: '50-50',
    size: 200,
    spirit: 'vodka',
  });

  const spirits = {
    vodka: { name: 'Wodka', abv: 40, icon: '🥃' },
    korn: { name: 'Korn', abv: 38, icon: '🌾' },
    springer: { name: 'Springer', abv: 33, icon: '🍺' },
  };

  const handleQuickAdd = (drinkKey) => {
    const drink = DRINKS_DB[drinkKey];
    if (drink.isCustomMix) {
      setMixMode('select');
      return;
    }
    onAdd({
      name: drink.name,
      icon: drink.icon,
      volume: drink.volume,
      abv: drink.defaultAbv,
      beerFactor: drink.beerFactor || 0,
    });
  };

  const handleMixAdd = () => {
    const spiritPercent = parseInt(mixConfig.ratio.split('-')[0]);
    const spirit = spirits[mixConfig.spirit];
    const spiritAbv = spirit.abv;

    const effectiveAbv = (spiritPercent / 100) * spiritAbv;

    onAdd({
      name: `Mischen ${spirit.name} (${mixConfig.ratio})`,
      icon: '🥤',
      volume: mixConfig.size,
      abv: effectiveAbv,
      beerFactor: 0,
    });
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (customDrink.name.trim()) {
      onAdd(customDrink);
    }
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={() => mixMode ? setMixMode(null) : onClose()} />
      <div className="sheet p-6 pb-8">
        <div className="sheet-handle" />
        <div className="flex justify-between items-center mb-5">
          <h2 className="display text-2xl text-paper">
            {mixMode ? 'Mischen konfigurieren' : 'Getränk hinzufügen'}
          </h2>
          <button
            onClick={() => mixMode ? setMixMode(null) : onClose()}
            className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center text-dim hover:text-paper transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {mixMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-paper mb-2">Spirituosentyp</label>
              <select
                value={mixConfig.spirit}
                onChange={(e) => setMixConfig({ ...mixConfig, spirit: e.target.value })}
                className="input-field"
              >
                <option value="vodka">🥃 Wodka (40%)</option>
                <option value="korn">🌾 Korn (38%)</option>
                <option value="springer">🍺 Springer (33%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-paper mb-2">Verhältnis (Spirituose – Softgetränk)</label>
              <select
                value={mixConfig.ratio}
                onChange={(e) => setMixConfig({ ...mixConfig, ratio: e.target.value })}
                className="input-field"
              >
                <option value="10-90">10% – 90%</option>
                <option value="20-80">20% – 80%</option>
                <option value="30-70">30% – 70%</option>
                <option value="40-60">40% – 60%</option>
                <option value="50-50">50% – 50%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-paper mb-2">Größe (ml)</label>
              <select
                value={mixConfig.size}
                onChange={(e) => setMixConfig({ ...mixConfig, size: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value={100}>100ml</option>
                <option value={150}>150ml</option>
                <option value={200}>200ml</option>
                <option value={250}>250ml</option>
                <option value={300}>300ml</option>
                <option value={500}>500ml</option>
              </select>
            </div>

            <button onClick={handleMixAdd} className="btn-primary w-full">
              Mischen hinzufügen
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-1 mb-5 bg-bg rounded-xl p-1">
              <button
                onClick={() => setSelectedTab('quick')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  selectedTab === 'quick' ? 'bg-surface text-amber shadow-sm' : 'text-dim'
                }`}
              >
                Schnell
              </button>
              <button
                onClick={() => setSelectedTab('custom')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  selectedTab === 'custom' ? 'bg-surface text-amber shadow-sm' : 'text-dim'
                }`}
              >
                Eigenes
              </button>
            </div>

            {selectedTab === 'quick' && (
              <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {Object.entries(DRINKS_DB).map(([key, drink]) => (
                  <button
                    key={key}
                    onClick={() => handleQuickAdd(key)}
                    className="p-3 bg-bg border border-line/10 rounded-xl text-center hover:border-amber/40 hover:bg-amber/5 transition-colors active:scale-95"
                  >
                    <div className="text-3xl mb-1.5 leading-none">{drink.icon}</div>
                    <div className="font-semibold text-paper text-xs leading-tight">{drink.name}</div>
                    <div className="font-mono text-[10px] text-faint mt-0.5">
                      {drink.isCustomMix ? 'Variabel' : `${drink.defaultAbv}%`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedTab === 'custom' && (
              <form onSubmit={handleCustomAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-paper mb-1">Getränkename</label>
                  <input
                    type="text"
                    value={customDrink.name}
                    onChange={(e) => setCustomDrink({ ...customDrink, name: e.target.value })}
                    className="input-field"
                    placeholder="z.B. Mojito"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-paper mb-1">Menge (ml)</label>
                    <input
                      type="number"
                      value={customDrink.volume}
                      onChange={(e) => setCustomDrink({ ...customDrink, volume: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-paper mb-1">Alkohol (%)</label>
                    <input
                      type="number"
                      value={customDrink.abv}
                      onChange={(e) => setCustomDrink({ ...customDrink, abv: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-paper mb-1">Bier-Faktor</label>
                  <select
                    value={customDrink.beerFactor}
                    onChange={(e) => setCustomDrink({ ...customDrink, beerFactor: parseFloat(e.target.value) })}
                    className="input-field"
                  >
                    <option value={0}>Kein Bier (Spirituosen, Wein)</option>
                    <option value={0.5}>Halbes Bier (Radler)</option>
                    <option value={1}>Volles Bier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-paper mb-1">Emoji</label>
                  <input
                    type="text"
                    value={customDrink.icon}
                    onChange={(e) => setCustomDrink({ ...customDrink, icon: e.target.value })}
                    className="input-field"
                    maxLength="2"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Hinzufügen
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
};
