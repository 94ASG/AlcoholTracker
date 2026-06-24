# AlcoholTracker 🍺

Eine moderne, mobile-first Web-App zum Tracking des Alkoholkonsums für dich und deine Freunde. Vollständig lokal im Browser mit localStorage.

## Features

### 🎯 Kernfunktionalität
- **Persönliches Alkohol-Tracking** - Verfolge deinen täglichen, wöchentlichen und monatlichen Konsum
- **Freundesliste** - Verwalte und vergleiche deinen Konsum mit Freunden
- **Automatische Berechnung** - Berechnet automatisch den reinen Alkoholgehalt in ml basierend auf:
  - Getränkeart (Bier, Wein, Spirituosen, etc.)
  - Alkoholprozentsatz
  - Menge in ml
  - Beispiel: 0,5L Bier (5%) = 25ml reiner Alkohol

### 📱 Benutzeroberfläche
- **Mobile-First Design** - Optimiert für Smartphones im Hochformat
- **Responsive Layout** - Funktioniert auf allen Bildschirmgrößen
- **Dark-Mode & Light-Mode** - Automatische Theme-Anpassung mit Persistierung
- **Swipe-Navigation** - Intuitives Navigieren mit Wischgesten:
  - Links-/Rechts-Swipe: Zwischen Profil, Freunden und Statistiken wechseln

### 🍹 Getränk-Management
- **Vordefinierte Getränke**:
  - 🍺 Bier (4,5-5,5%)
  - 🍷 Wein (11-13%)
  - 🥃 Spirituosen (35-45%)
  - 🍾 Sekt/Prosecco (11-12%)
  - 🍎 Apfelwein/Cider (5,5%)
  - 🍹 Cocktails (15%)
- **Floating Action Button** - Schnell neue Getränke hinzufügen
- **Benutzerdefinierte Getränke** - Erstelle eigene Getränke mit beliebigem Alkoholgehalt
- **Getränkeverlauf** - Alle heutigen Getränke mit Zeitstempel

### 👥 Personen-Management
- **Freunde hinzufügen/entfernen** - Einfache Verwaltung
- **Avatare** - Personalisierte Avatare für jeden Freund
- **Status-Anzeige** - Heutiger Konsum für jeden Freund

### 📊 Statistiken & Tracking
- **Persönliches Dashboard** mit:
  - Heute konsumierter Alkohol (in ml)
  - Wöchentlicher Durchschnitt
  - Monatliches Total
- **Wöchentliche Grafik** - Balkendiagramm der letzten 7 Tage
- **Monatliche Grafik** - Übersicht des aktuellen Monats
- **🏆 Leaderboard** - Vergleich mit Freunden (basierend auf heutigem Konsum)

### 💾 Datenspeicherung
- **100% lokal** - Alle Daten werden in localStorage gespeichert
- **Keine Authentifizierung erforderlich** - Kostenlos und privat
- **Automatische Persistierung** - Alle Änderungen werden sofort gespeichert

## Installation & Nutzung

### Entwicklung
```bash
cd ~/Dokumente/Zeug/AlcoholTracker
npm install
npm run dev
```

Die App öffnet sich unter `http://localhost:5173`

### Produktion
```bash
npm run build
npm run preview
```

## Technologie

- **Frontend**: React 18 mit Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: localStorage
- **Responsive Design**: Mobile-first mit Tailwind

## Projektstruktur

```
src/
├── components/           # React Komponenten
│   ├── Header.jsx       # App Header mit Theme Toggle
│   ├── TabNavigation.jsx # Bottom Tab Navigation
│   ├── ProfileView.jsx  # Persönliches Dashboard
│   ├── FriendsView.jsx  # Freundesliste
│   ├── StatsView.jsx    # Statistiken & Grafiken
│   ├── DrinksList.jsx   # Getränkeliste
│   ├── AddDrinkButton.jsx # FAB zum Getränk-Hinzufügen
│   ├── AddDrinkModal.jsx  # Modal für neue Getränke
│   └── AddFriendModal.jsx # Modal für neue Freunde
├── context/             # State Management
│   └── AppContext.jsx   # Global App Context
├── hooks/               # Custom Hooks
│   └── useSwipe.js      # Swipe-Gesten Hook
├── utils/               # Utility Funktionen
│   ├── drinks.js        # Getränkedatenbank & Berechnungen
│   └── storage.js       # localStorage Service
├── App.jsx              # Main App Komponente
├── main.jsx             # React Root
└── index.css            # Tailwind CSS & Custom Styles
```

## Verwendung

### 1. Getränk hinzufügen
- Klicke auf den blauen ➕ Button
- Wähle ein vordefiniertes Getränk ODER
- Erstelle ein benutzerdefiniertes Getränk mit eigenen Parametern

### 2. Freunde verwalten
- Gehe zum "Freunde" Tab
- Klicke "Freund hinzufügen"
- Wähle einen Avatar und gib einen Namen ein

### 3. Statistiken ansehen
- Gehe zum "Statistiken" Tab
- Sieh deine wöchentlichen und monatlichen Grafiken
- Vergleiche dich mit Freunden im Leaderboard

### 4. Navigation
- **Tap auf Tabs** - Schneller Tab-Wechsel
- **Wische links/rechts** - Sanfte Navigation zwischen Ansichten

## Berechnungsbeispiele

### Bier (500ml, 5%)
- Alkohol = 500ml × (5 ÷ 100) ÷ 1000 = 0,025L = **25ml**

### Wein (150ml, 12%)
- Alkohol = 150ml × (12 ÷ 100) ÷ 1000 = 0,018L = **18ml**

### Wodka Shot (50ml, 40%)
- Alkohol = 50ml × (40 ÷ 100) ÷ 1000 = 0,020L = **20ml**

## Design

### Farbschema
- **Light Mode**: Weiß/Grau mit Blau-Akzenten
- **Dark Mode**: Dunkelgrau/Schwarz mit Blau-Akzenten

### Typografie
- **Titel**: System-UI Schriftart, Bold
- **Text**: System-UI Schriftart, Regular
- **Größe**: Responsive, optimiert für mobile

### Animationen
- Fade-In beim Laden
- Slide-In bei neuen Elementen
- Smooth Transitions bei Theme-Wechsel
- Hover-Effects auf Buttons

## Browser-Unterstützung

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

## Datenschutz

✅ **Vollständig privat** - Keine Daten verlassen deinen Browser
✅ **Keine Tracker** - Keine Analytics oder Third-Party Services
✅ **Lokal gespeichert** - Alles in deinem localStorage

## Tipps & Tricks

- **Daten exportieren**: Öffne DevTools → Application → localStorage
- **Daten löschen**: Leere den localStorage in DevTools oder deaktiviere Cookies
- **Offline-Nutzung**: App funktioniert vollständig offline nach dem ersten Load
- **Schnell hinzufügen**: Häufig verwendete Getränke über den Quick-Add Button

## Zukünftige Features (geplant)

- 📈 Erweiterte Trendanalyse
- 🎯 Ziele und Challenges
- 🔄 Daten-Sync zwischen Geräten
- 📱 Progressive Web App (PWA)
- 🔔 Erinnerungen und Notifications
- 🌍 Multi-Sprachen Support

## Lizenz

MIT License - Frei zu verwenden und zu modifizieren

---

**Genieße verantwortungsvoll! 🍺**
