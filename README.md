# 🐷 Prehistorik: Prasečí Lanýž

Funkční 2D prohlížečový platformer v Reactu, kde hrajete za mladé divoké prasátko **Přímo**, které hledá své ukradené lanýže v Kouzelném Lanýžovém Lese.

## 🎮 [HRÁT HRU](https://aiforgewolf.github.io/prasatkochrochro/) 🎮

## 🎮 O Hře

Přímo musí projít **3 levely** plné nebezpečí a překážek:
- 🍄 Najít všechny ukradené lanýže v každém levelu
- 🦔 Vyhnout se nebo porazit agresivní ježky
- 🐰 Uhnout projektilům od králíků-lupičů
- 🦄 Přežít útok magických jednorožců (Level 2)
- 🐻 Porazit mocné medvědy-bosse (Level 3)
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
   - Zdraví: 1
   - Zničení: 1 útok Dash nebo skok na hlavu
2. **Králíci (🐰)**: Stojí a střílí žaludové projektily každých 2.5s
   - Zdraví: 1
   - Nebezpečí: Projektily mohou zasáhnout na dálku
3. **Jednorožci (🦄)** *(Level 2+)*: Magičtí nepřátelé, kteří nabíjejí na hráče
   - Zdraví: 2 (vyžaduje 2 útoky)
   - Detekce: 300px horizontálně, 100px vertikálně
   - Chování: Fialový když čeká, růžový když nabíjí
   - Rychlost nabíjení: 4 (rychlejší než běh hráče!)
4. **Medvědi (🐻)** *(Level 3 - BOSS)*: Mohutní boss nepřátelé s adaptivní AI
   - Zdraví: 3 (nejtěžší nepřítel, vyžaduje 3 útoky!)
   - Velikost: 70x80 (větší než ostatní)
   - Detekce: 250px horizontálně, 120px vertikálně
   - Chování: Dual-mode AI
     * **Patrol mód**: Pomalá chůze (1.5) tam a zpět
     * **Charge mód**: Rychlá nabíječka (3) když detekuje hráče
   - Vizuál: Hnědý když hlídá, tmavě hnědý když nabíjí
   - Zlatý border a health counter (❤️3 → ❤️2 → ❤️1)

### Sběrné Předměty
- **Lanýž (🍄)**: +100 bodů
- **Kuřecí Stehno (🍗)**: +1 život (max 5)

### Levely
**Level 1 - Kouzelný Lanýžový Les:**
- Úvodní level s základními platformami
- 3x Ježci, 1x Králík
- 10x Lanýže

**Level 2 - Meandrový Hřeben:**
- Těžší level s meandrovými platformami a propastmi
- 3x Jednorožci, 2x Ježci, 1x Králík
- 10x Lanýže, 2x Kuřecí stehna
- Vyžaduje přesné skákání a dobré načasování

**Level 3 - Boss Arena:**
- FINÁLNÍ LEVEL s vertikálním platformingem
- Multi-tier design - 4 úrovně výšky
- **3x MEDVĚDI (BOSS)** + 2x Jednorožci, 2x Ježci, 1x Králík
- 10x Lanýže, 3x Kuřecí stehna
- Cíl nahoře vyžaduje vyšplhat celou arénou
- Nejvyšší obtížnost - kombinace všech typů nepřátel!

### Cíl
Dokončit všechny 3 levely, porazit boss medvědy a dostat se do červeného doupěte (🏠) s co nejvyšším skóre!

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

## 🌐 Nasazení na GitHub Pages

### Automatické Nasazení (Doporučeno)

Tento projekt je nakonfigurován pro automatické nasazení na GitHub Pages pomocí GitHub Actions.

**Jak to funguje:**
1. Při každém push do branch `claude/react-platformer-game-018utKngUtzkVygTx9Xy6fy2`, `main` nebo `master`
2. GitHub Actions automaticky:
   - Nainstaluje závislosti
   - Vytvoří production build
   - Nasadí na GitHub Pages

**První nasazení - aktivace GitHub Pages:**
1. Jděte do nastavení repozitáře na GitHubu: `Settings` → `Pages`
2. V sekci "Build and deployment" vyberte **Source: GitHub Actions**
3. Po dalším push se hra automaticky nasadí

**URL hry:**
- 🎮 **https://aiforgewolf.github.io/prasatkochrochro/**

### Manuální Deploy

Pokud chcete nasadit manuálně (není doporučeno kvůli omezením branch):

```bash
npm run deploy
```

Poznámka: Manuální deploy může selhat kvůli omezením Git push. Doporučujeme použít automatické nasazení přes GitHub Actions.

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

V `App.js` najděte sekce `LEVEL_1_DATA` a `LEVEL_2_DATA` a upravte:

```javascript
const LEVEL_1_DATA = {
  platforms: [ /* Přidejte/upravte platformy */ ],
  enemies: [ /* Přidejte/upravte nepřátele */ ],
  items: [ /* Přidejte/upravte předměty */ ],
  goal: { /* Pozice cíle */ }
};

const LEVEL_2_DATA = {
  // Podobná struktura jako Level 1
};

// Přidání do pole levelů
const LEVELS = [LEVEL_1_DATA, LEVEL_2_DATA];
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
✅ AI nepřátel (patrol, střelba, nabíjení)
✅ **Multi-level systém s přechody**
✅ **3 typy nepřátel s různými schopnostmi**
✅ **Health systém pro nepřátele**
✅ Systém životů a skóre
✅ **Persistence skóre a životů mezi levely**
✅ Sběr předmětů
✅ **Level complete obrazovka**
✅ Vítězné/prohrané stavy
✅ Responsivní ovládání
✅ Neporazitelnost po zranění
✅ **Vizuální indikátory zdraví nepřátel**
✅ **Dynamické chování nepřátel (jednorožci)**

## 🐛 Budoucí Vylepšení

- [ ] Zvukové efekty
- [ ] Animace sprites
- [ ] Více levelů (Level 3, 4, ...)
- [ ] Nové typy nepřátel
- [ ] Boss fights
- [ ] Systém ukládání high score
- [ ] Mobile touch ovládání
- [ ] Particle efekty
- [ ] Power-upy (dvojitý skok, štít, atd.)

## 📜 Licence

Tento projekt je vytvořen pro vzdělávací účely.

## 🤝 Autor

Vytvořeno jako ukázka React 2D platformeru s čistým DOM renderingem.

---

**Užijte si hru! 🐷🍄✨**
