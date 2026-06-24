# AlcoholTracker - Entwicklerdokumentation

## 🏗️ Architektur

### Component Structure
```
App (Main Component)
├── Header
│   └── Theme Toggle Button
├── Main Content Area
│   ├── ProfileView
│   ├── FriendsView
│   └── StatsView
└── TabNavigation
    ├── Profile Tab
    ├── Friends Tab
    └── Stats Tab

Modal Layer (Absolute Positioning)
├── AddDrinkModal
└── AddFriendModal
```

### State Flow
```
AppContext (Global State)
├── currentUser
├── drinks {dateKey: [drinks]}
├── friends []
└── theme ('light' | 'dark')

Consumer: All Components
```

## 📝 Component Details

### Header.jsx
- Zeigt App-Name und Logo
- Theme-Toggle Button (☀️/🌙)
- Sticky positioning für quick access

### TabNavigation.jsx
- 3 Tabs: Profile, Friends, Stats
- Fixed at bottom
- Aktiver Tab ist highlighted
- onClick handler für Tab-Wechsel

### ProfileView.jsx
- Zeigt persönliches Dashboard
- 3-Spalten-Grid mit Statistiken
- Heute hinzugefügte Getränke
- AddDrinkButton FAB
- Berechnet: getTodayAlcohol(), getWeeklyStats()

### FriendsView.jsx
- Liste aller Freunde
- AddFriendButton
- Remove-Button für jeden Freund
- Zeigt heutigen Konsum pro Freund

### StatsView.jsx
- Wöchentliche Balken-Grafik
- Monatliche Mini-Grafik
- Leaderboard-Ranking
- Summen und Durchschnitte

### DrinksList.jsx
- Map über Array von Drinks
- Zeigt Icon, Name, ABV%, Volumen
- Remove-Button mit Icon
- Animate slideIn Effekt

### AddDrinkButton.jsx
- Fixed bottom-right FAB
- onClick öffnet AddDrinkModal
- State für isOpen

### AddDrinkModal.jsx
- 2 Tabs: Quick & Custom
- Quick: Grid von DRINKS_DB Elementen
- Custom: Form mit Name, Volume, ABV, Icon
- onAdd callback
- Animation bei Open

### AddFriendModal.jsx
- Avatar-Picker (Grid mit Emojis)
- Text-Input für Name
- onAdd callback
- Animation bei Open

## 🧠 Context Hooks

### useApp() - Global Context Consumer
```javascript
const { 
  currentUser, updateUser,
  drinks, addDrink, removeDrink, getDrinksForDate,
  getTodayAlcohol, getWeeklyStats, getMonthlyStats,
  friends, addFriend, removeFriend,
  theme, setTheme,
  getLeaderboard
} = useApp();
```

### useSwipe() - Touch Gesture Handler
```javascript
useSwipe(onSwipeLeft, onSwipeRight)
// Detectiert 50px+ swipes
// Calls callbacks based on direction
```

## 🔧 Utility Functions

### drinks.js
- `DRINKS_DB` - Datenbank mit vordefinierten Drinks
- `calculateAlcohol(ml, abv%)` - Berechnet reinen Alkohol
- `formatAlcohol(liters)` - Formatiert zu ml
- `getDateKey()` - Gibt heute als YYYY-MM-DD
- `getWeekDates()` - Array der letzten 7 Tage
- `getMonthDates()` - Alle Tage des Monats

### storage.js
- `storageService.getUser()` / `.saveUser()`
- `storageService.getDrinks()` / `.saveDrinks()`
- `storageService.addDrink(date, drink)`
- `storageService.removeDrink(date, id)`
- `storageService.getFriends()` / `.saveFriends()`
- `storageService.addFriend(friend)`
- `storageService.removeFriend(id)`
- `storageService.getTheme()` / `.setTheme()`

## 📊 Data Structures

### User Object
```javascript
{
  id: "1234567890",
  name: "Du",
  avatar: "👤",
  createdAt: "2026-06-24T..."
}
```

### Drink Object
```javascript
{
  id: 1234567890,
  name: "Bier",
  icon: "🍺",
  volume: 500,
  abv: 5,
  alcohol: 0.025,
  timestamp: "2026-06-24T..."
}
```

### Friend Object
```javascript
{
  id: "1234567890",
  name: "Tom",
  avatar: "👨",
  createdAt: "2026-06-24T...",
  todayAlcohol: 0.050
}
```

### Drinks Storage Format
```javascript
{
  "2026-06-24": [drink1, drink2, ...],
  "2026-06-23": [drink1, ...],
  ...
}
```

## 🎯 Key Features Implementation

### 1. Alkoholberechnung
```javascript
// In AddDrinkModal.jsx
const alcohol = calculateAlcohol(volume, abv);
addDrink({ name, volume, abv, icon, alcohol });
```

### 2. Datenspeicherung
```javascript
// AppContext - beim Laden
const storedUser = storageService.getUser();
const storedDrinks = storageService.getDrinks();
```

### 3. Theme Switching
```javascript
// Header.jsx
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
};
```

### 4. Navigation
```javascript
// App.jsx
const handleSwipeLeft = () => {
  // Tab-Index erhöhen
  setActiveTab(tabs[nextIndex]);
};
```

### 5. Statistiken
```javascript
// AppContext
const getTodayAlcohol = () => {
  const today = getDateKey();
  const todayDrinks = getDrinksForDate(today);
  return todayDrinks.reduce((sum, d) => sum + d.alcohol, 0);
};
```

## 🛠️ Development Workflow

### Neue Komponente hinzufügen
1. Erstelle `src/components/NewComponent.jsx`
2. Nutze `useApp()` für Context
3. Import in `App.jsx` oder Parent
4. Exportiere as named export

### Neue Utility-Funktion
1. Erstelle in `src/utils/`
2. Export as named export
3. Import wo nötig
4. Testen

### Styling-Anpassung
1. Nutze Tailwind Klassen direkt in JSX
2. Oder editiere `src/index.css` für Komponenten
3. Theme-Classes: `dark:...` für Dark Mode
4. Hot reload beim Speichern

### Neuen Drink zur DB hinzufügen
```javascript
// In src/utils/drinks.js
myDrink: {
  name: 'Mein Drink',
  defaultAbv: 12,
  icon: '🍷',
  volume: 250,
},
```

## 🧪 Testing Tipps

### localStorage Debugging
```javascript
// In Console
localStorage.getItem('alcohol_tracker_drinks')
localStorage.getItem('alcohol_tracker_friends')
localStorage.clear() // Alles löschen
```

### Theme Testen
```javascript
// In Console
document.documentElement.classList.add('dark')
document.documentElement.classList.remove('dark')
```

### DevTools
1. **Application** → localStorage → alle App-Keys
2. **Network** → sollte leer sein (offline-first)
3. **Performance** → für Optimierungen

## 📈 Performance

### Bundle Size
- JavaScript: ~212KB (ungzip), ~65KB (gzip)
- CSS: ~15KB (ungzip), ~3.5KB (gzip)
- Total: ~227KB → ~68.5KB gzip

### Optimierungen
- Lazy Loading nicht nötig (kleine App)
- CSS wird via Tailwind optimiert
- localStorage ist quasi instant
- Keine API-Calls

## 🐛 Bekannte Limitations

1. **Multi-Device Sync**: Nicht möglich (nur localStorage)
2. **Offline bei erstem Visit**: Braucht min. 1 Online-Load
3. **Max Friend Count**: Theoretisch unbegrenzt, praktisch bis ~1000
4. **Leaderboard Ranking**: Basiert nur auf heute (nicht historisch)

## 🚀 Mögliche Erweiterungen

1. **Backend Integration**
   - Firebase für Cloud Sync
   - User Authentication
   - Social Sharing

2. **Analytics**
   - Trend-Analyse
   - Health Warnings
   - Badges/Achievements

3. **Notifications**
   - Daily Reminders
   - Weekly Summaries
   - Friend Comparisons

4. **PWA Features**
   - Install Button
   - Offline Support
   - Push Notifications

5. **Data Export**
   - CSV/JSON Export
   - PDF Reports
   - Share with Friends

## 📞 Code Style

- **Naming**: camelCase für Variablen/Funktionen, PascalCase für Komponenten
- **Komponenten**: Functional Components mit Hooks
- **Imports**: Gruppiert nach: React, Context, Components, Utils, CSS
- **Comments**: Nur wo Logik kompliziert ist
- **Semicolons**: Nicht verwendet (Prettier-Style)

## 🎓 Learning Resources

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite Docs: https://vitejs.dev
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Letzte Aktualisierung**: 24. Juni 2026
