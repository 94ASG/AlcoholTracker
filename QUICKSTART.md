# AlcoholTracker - Schnellstart 🚀

## Installation (einmalig)

```bash
cd ~/Dokumente/Zeug/AlcoholTracker
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Öffne dann: **http://localhost:5173**

## Build für Produktion

```bash
npm run build
npm run preview
```

## Erste Schritte in der App

1. **Getränk hinzufügen**
   - Klick auf großen blauen ➕ Button
   - Wähle ein Getränk oder erstelle Custom

2. **Freund hinzufügen**
   - Gehe zu "Freunde" Tab
   - Klick "Freund hinzufügen"
   - Avatar wählen, Name eingeben

3. **Statistiken ansehen**
   - Gehe zu "Statistiken" Tab
   - Sieh Grafiken und Leaderboard

## Navigation

- **Tab-Buttons** (unten) - Schnell zwischen Ansichten wechseln
- **Wischen links/rechts** - Sanfte Navigation
- **☀️/🌙** (oben rechts) - Dark/Light Mode

## Wichtige Files

| Datei | Funktion |
|-------|----------|
| `src/context/AppContext.jsx` | Global State Management |
| `src/components/` | Alle UI-Komponenten |
| `src/utils/drinks.js` | Getränkendatenbank |
| `src/utils/storage.js` | localStorage Service |
| `tailwind.config.js` | Styling Config |

## Häufige Aufgaben

### Neues Getränk zur Datenbank hinzufügen

Bearbeite `src/utils/drinks.js`:
```javascript
export const DRINKS_DB = {
  // ... existing drinks ...
  myDrink: {
    name: 'Mein Getränk',
    defaultAbv: 12,
    icon: '🍷',
    volume: 250,
  },
};
```

### Neue Statistik hinzufügen

Bearbeite `src/context/AppContext.jsx` und füge eine Methode zu AppContext hinzu.

### Styling ändern

Bearbeite `src/index.css` oder `tailwind.config.js`

## Tipps

- 💾 Alle Daten werden automatisch gespeichert
- 🌐 App funktioniert offline nach dem ersten Load
- 🔄 localStorage kann in DevTools gelöscht werden
- 📱 Perfekt auf allen Smartphones funktionierend

## Troubleshooting

**Build fehlgeschlagen?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Dev-Server startet nicht?**
```bash
npm run dev
# Versuche http://localhost:5173
```

**Styling funktioniert nicht?**
```bash
# Rebuild Tailwind CSS
npm run build
```

---

**Viel Spaß mit AlcoholTracker! 🍺**
