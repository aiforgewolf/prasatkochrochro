# 🐷 Prehistorik: Prasečí Lanýž

Funkční 2D prohlížečový platformer v Reactu, kde hrajete za mladé divoké prasátko **Přímo**, které hledá své ukradené lanýže v Kouzelném Lanýžovém Lese.

## 🎮 O Hře

Přímo musí:
- 🍄 Najít všech 10 ukradených lanýžů
- 🦔 Vyhnout se nebo porazit agresivní ježky
- 🐰 Uhnout projektilům od králíků-lupičů
- 🏠 Najít cestu zpět do svého doupěte

## 🕹️ Ovládání

| Klávesa | Akce |
|---------|------|
| ← → | Pohyb doleva/doprava |
| ↑ / Mezerník | Skok |
| D / Ctrl | Útok Dash (zrychlený náběh) |

## 🎯 Herní Mechanika

### Hráč (Přímo)
- **Pohyb**: Šipky doleva/doprava
- **Skok**: Dvojité skoky nejsou možné, musíte stát na platformě
- **Útok Dash**: Zrychlený náběh, který ničí nepřátele při kontaktu
- **Životy**: 3 na začátku, po zásahu krátká neporazitelnost
- **Smrt**: Pád do propasti nebo kontakt s nepřítelem (bez dashe)

### Nepřátelé
1. **Ježci (🦔)**: Pohybují se tam a zpět po platformách, obrací se na konci
2. **Králíci (🐰)**: Stojí a střílí žaludové projektily každých 2.5s

### Sběrné Předměty
- **Lanýž (🍄)**: +100 bodů
- **Kuřecí Stehno (🍗)**: +1 život (max 5)

### Cíl
Dostat se do červeného doupěte (🏠) na konci levelu s co nejvyšším skóre!

## 🚀 Instalace a Spuštění

### Lokální Vývoj

1. **Nainstalujte závislosti:**
```bash
npm install
```

2. **Spusťte vývojový server:**
```bash
npm start
```

3. **Otevřete prohlížeč:**
Hra se automaticky otevře na `http://localhost:3000`

### Produkční Build

```bash
npm run build
```

Build se vytvoří ve složce `build/` a je připraven k nasazení.

## 🌐 Nasazení na Railway.com

### Automatické Nasazení

1. **Připojte GitHub repozitář k Railway:**
   - Přihlaste se na [railway.app](https://railway.app)
   - Klikněte na "New Project" → "Deploy from GitHub repo"
   - Vyberte tento repozitář

2. **Railway automaticky detekuje React app a použije správné build příkazy:**
   - Build Command: `npm run build`
   - Start Command: `npx serve -s build -p $PORT`

3. **Nastavte proměnné prostředí (volitelné):**
   - `NODE_ENV=production`

### Manuální Konfigurace

Pokud potřebujete vlastní konfiguraci, Railway používá `railway.json` nebo `Procfile`.

## 🏗️ Technická Specifikace

### Fyzika
- **Gravitace**: 0.8
- **Rychlost skoku**: -15
- **Rychlost běhu**: 5
- **Násobič Dash**: 2.5x
- **FPS**: 60 (16ms per frame)

### Komponenty
- **App.js**: Hlavní herní komponenta obsahující celou logiku
  - Herní smyčka pomocí `requestAnimationFrame`
  - Kolizní detekce (AABB)
  - Správa stavu přes React Hooks
  - Fyzikální simulace

### Architektura
```
src/
├── App.js        # Hlavní herní komponenta (celá hra)
├── index.js      # React bootstrap
public/
├── index.html    # HTML template
package.json      # Dependencies a skripty
```

## 🎨 Customizace

### Úprava Level Designu

V `App.js` najděte sekci `INITIAL_LEVEL_DATA` a upravte:

```javascript
const INITIAL_LEVEL_DATA = {
  platforms: [ /* Přidejte/upravte platformy */ ],
  enemies: [ /* Přidejte/upravte nepřátele */ ],
  items: [ /* Přidejte/upravte předměty */ ],
  goal: { /* Pozice cíle */ }
};
```

### Úprava Fyziky

V sekci `PHYSICS` konstanty můžete upravit pocit hry:

```javascript
const PHYSICS = {
  GRAVITY: 0.8,           // Vyšší = rychlejší pád
  JUMP_VELOCITY: -15,     // Více záporné = vyšší skok
  RUN_SPEED: 5,           // Vyšší = rychlejší běh
  // ...
};
```

## 📝 Herní Features

✅ Fyzikální engine s gravitací
✅ Kolizní detekce (AABB)
✅ Platformové skákání
✅ Útok Dash
✅ AI nepřátel (patrol, střelba)
✅ Systém životů a skóre
✅ Sběr předmětů
✅ Vítězné/prohrané stavy
✅ Responsivní ovládání
✅ Neporazitelnost po zranění

## 🐛 Known Issues & Budoucí Vylepšení

- [ ] Zvukové efekty
- [ ] Animace sprites
- [ ] Více levelů
- [ ] Systém ukládání high score
- [ ] Mobile touch ovládání
- [ ] Particle efekty

## 📜 Licence

Tento projekt je vytvořen pro vzdělávací účely.

## 🤝 Autor

Vytvořeno jako ukázka React 2D platformeru s čistým DOM renderingem.

---

**Užijte si hru! 🐷🍄✨**
