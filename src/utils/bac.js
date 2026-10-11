// ==============================================
// AlcoholTracker 2.0: Promille-Rechner (BAC Engine)
// Watson-Formel (1980) & Zeitkinetik-Simulation
// ==============================================

export const BODY_PROFILE_STORAGE_KEY = 'alcohol_tracker_body_profile_v1';

// Eliminationsrate der Leber: Forensischer Standardmittelwert 0.12 ‰ pro Stunde (0.002 ‰ / Minute)
export const BAC_METABOLISM_PER_HOUR = 0.12;
export const BAC_METABOLISM_PER_MINUTE = BAC_METABOLISM_PER_HOUR / 60;

// Dauer der Resorptionsphase pro Drink (in Minuten)
export const ABSORPTION_DURATION_MINUTES = 30;

/**
 * Berechnet das Gesamtkörperwasser (Total Body Water = TBW in Litern)
 * nach der anerkannten Watson-Formel (1980).
 *
 * @param {Object} params
 * @param {'male'|'female'|'other'} params.gender
 * @param {number} params.age - Alter in Jahren
 * @param {number} params.heightCm - Größe in cm
 * @param {number} params.weightKg - Gewicht in kg
 * @returns {number} Gesamtkörperwasser in Litern
 */
export const calculateTbw = ({ gender, age, heightCm, weightKg }) => {
  const ageNum = Number(age) || 25;
  const heightNum = Number(heightCm) || 175;
  const weightNum = Number(weightKg) || 70;

  // Watson Formel für Männer
  const tbwMale = 2.447 - 0.09516 * ageNum + 0.1074 * heightNum + 0.3362 * weightNum;

  // Watson Formel für Frauen
  const tbwFemale = -2.097 + 0.1069 * heightNum + 0.2466 * weightNum;

  if (gender === 'female') {
    return Math.max(10, tbwFemale);
  }
  if (gender === 'other') {
    return Math.max(10, (tbwMale + tbwFemale) / 2);
  }
  // Standard: male
  return Math.max(10, tbwMale);
};

/**
 * Berechnet die Blutalkoholkonzentration (BAC in Promille)
 * für eine Liste von Drinks unter Berücksichtigung von Resorption und Abbau.
 *
 * @param {Array} userDrinks - Drinks des Nutzers [{ alcohol_g, created_at, ... }]
 * @param {Object} bodyProfile - { gender, age, heightCm, weightKg }
 * @param {Date|string|number} [currentTime=new Date()]
 * @returns {Object} { currentBac, formattedBac, peakBac, peakTime, soberTime, soberTimeString, isZero }
 */
export const calculateBacFromDrinks = (userDrinks = [], bodyProfile, currentTime = new Date()) => {
  if (!bodyProfile || !bodyProfile.weightKg || !userDrinks || userDrinks.length === 0) {
    return {
      currentBac: 0,
      formattedBac: '0,0 ‰',
      peakBac: 0,
      peakTime: null,
      soberTime: null,
      soberTimeString: '',
      isZero: true,
    };
  }

  const tbw = calculateTbw(bodyProfile);
  if (tbw <= 0) {
    return {
      currentBac: 0,
      formattedBac: '0,0 ‰',
      peakBac: 0,
      peakTime: null,
      soberTime: null,
      soberTimeString: '',
      isZero: true,
    };
  }

  const nowMs = new Date(currentTime).getTime();

  // Sortiere Drinks chronologisch
  const sortedDrinks = [...userDrinks]
    .map((d) => ({
      alcoholG: Number(d.alcohol_g) || 0,
      timeMs: new Date(d.created_at).getTime(),
    }))
    .filter((d) => d.alcoholG > 0 && !isNaN(d.timeMs))
    .sort((a, b) => a.timeMs - b.timeMs);

  if (sortedDrinks.length === 0) {
    return {
      currentBac: 0,
      formattedBac: '0,0 ‰',
      peakBac: 0,
      peakTime: null,
      soberTime: null,
      soberTimeString: '',
      isZero: true,
    };
  }

  // 1 Gramm Reinalkohol ergibt im Körperwasser:
  // Blutanteil am Wasser = ca. 80% (0.80)
  const bacPerGram = 0.8 / tbw;

  // Minutengenaue Simulation vom ersten Drink bis jetzt
  const startTimeMs = sortedDrinks[0].timeMs;
  if (startTimeMs > nowMs) {
    return {
      currentBac: 0,
      formattedBac: '0,0 ‰',
      peakBac: 0,
      peakTime: null,
      soberTime: null,
      soberTimeString: '',
      isZero: true,
    };
  }

  const totalMinutes = Math.min(60 * 24 * 3, Math.floor((nowMs - startTimeMs) / (60 * 1000))); // max 3 Tage

  let simBac = 0;
  let peakBac = 0;
  let peakMinuteIndex = 0;

  for (let m = 0; m <= totalMinutes; m++) {
    const minuteTimeMs = startTimeMs + m * 60 * 1000;

    // Alkoholzugang in dieser Minute aus noch resorbierenden Drinks
    let alcoholGramsThisMinute = 0;
    for (const d of sortedDrinks) {
      if (d.timeMs <= minuteTimeMs) {
        const minutesSinceDrink = (minuteTimeMs - d.timeMs) / (60 * 1000);
        if (minutesSinceDrink < ABSORPTION_DURATION_MINUTES) {
          // Gleichmäßige Resorption über 30 Min
          alcoholGramsThisMinute += d.alcoholG / ABSORPTION_DURATION_MINUTES;
        }
      }
    }

    const bacGain = alcoholGramsThisMinute * bacPerGram;
    simBac += bacGain;

    // Abbau durch die Leber (wenn Alkohol im Blut)
    if (simBac > 0) {
      simBac = Math.max(0, simBac - BAC_METABOLISM_PER_MINUTE);
    }

    if (simBac > peakBac) {
      peakBac = simBac;
      peakMinuteIndex = m;
    }
  }

  const currentBac = Number(simBac.toFixed(2));
  const peakBacFormatted = Number(peakBac.toFixed(2));
  const peakTime = new Date(startTimeMs + peakMinuteIndex * 60 * 1000);

  // Nüchternzeit berechnen
  let soberTime = null;
  let soberTimeString = '';

  if (currentBac > 0) {
    const minutesToZero = Math.ceil(currentBac / BAC_METABOLISM_PER_MINUTE);
    soberTime = new Date(nowMs + minutesToZero * 60 * 1000);

    const hoursStr = String(soberTime.getHours()).padStart(2, '0');
    const minsStr = String(soberTime.getMinutes()).padStart(2, '0');
    soberTimeString = `${hoursStr}:${minsStr} Uhr`;
  }

  const formattedBac = `~${currentBac.toFixed(2).replace('.', ',')} ‰`;

  return {
    currentBac,
    formattedBac,
    peakBac: peakBacFormatted,
    peakTime,
    soberTime,
    soberTimeString,
    isZero: currentBac <= 0,
  };
};

// ==============================================
// LocalStorage Persistence Helpers
// ==============================================

export const getBodyProfile = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        const raw = globalThis.localStorage.getItem(BODY_PROFILE_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      }
      return null;
    }
    const raw = window.localStorage.getItem(BODY_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.weightKg) return null;
    return parsed;
  } catch (err) {
    console.error('Fehler beim Laden des Körperprofils:', err);
    return null;
  }
};

export const saveBodyProfile = (data) => {
  try {
    const profile = {
      gender: data.gender || 'male',
      age: Math.min(99, Math.max(16, Number(data.age) || 25)),
      heightCm: Math.min(240, Math.max(100, Number(data.heightCm) || 175)),
      weightKg: Math.min(250, Math.max(35, Number(data.weightKg) || 75)),
      shareInParty: Boolean(data.shareInParty),
      updatedAt: new Date().toISOString(),
    };
    const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : globalThis.localStorage;
    if (storage) {
      storage.setItem(BODY_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
    return profile;
  } catch (err) {
    console.error('Fehler beim Speichern des Körperprofils:', err);
    throw err;
  }
};

export const clearBodyProfile = () => {
  try {
    const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : globalThis.localStorage;
    if (storage) {
      storage.removeItem(BODY_PROFILE_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Fehler beim Löschen des Körperprofils:', err);
  }
};
