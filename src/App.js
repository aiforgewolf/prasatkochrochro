import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// I. KONSTANTY FYZIKY
// ============================================================================
const PHYSICS = {
  GRAVITY: 0.8,
  JUMP_VELOCITY: -15,
  RUN_SPEED: 5,
  DASH_SPEED_MULTIPLIER: 2.5,
  DASH_DURATION: 200,
  INVINCIBILITY_DURATION: 1500,
  PROJECTILE_SPEED: 4,
};

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;

// ============================================================================
// II. DATA LEVELU
// ============================================================================
const INITIAL_LEVEL_DATA = {
  platforms: [
    // Podlaha
    { id: 'p0', x: 0, y: 550, width: 1200, height: 50 },
    // Nízké platformy
    { id: 'p1', x: 200, y: 450, width: 150, height: 20 },
    { id: 'p2', x: 450, y: 400, width: 150, height: 20 },
    { id: 'p3', x: 700, y: 350, width: 150, height: 20 },
    // Vysoká platforma
    { id: 'p4', x: 350, y: 250, width: 200, height: 20 },
    // Levá strana - schody
    { id: 'p5', x: 50, y: 480, width: 100, height: 20 },
    { id: 'p6', x: 50, y: 380, width: 100, height: 20 },
    // Pravá strana - vysoko
    { id: 'p7', x: 950, y: 300, width: 200, height: 20 },
    { id: 'p8', x: 900, y: 450, width: 150, height: 20 },
  ],
  enemies: [
    { id: 'e1', x: 250, y: 410, width: 40, height: 40, velX: 2, type: 'hedgehog', health: 1 },
    { id: 'e2', x: 500, y: 360, width: 40, height: 40, velX: -2, type: 'hedgehog', health: 1 },
    { id: 'e3', x: 950, y: 510, width: 40, height: 40, velX: 2, type: 'hedgehog', health: 1 },
    { id: 'e4', x: 1000, y: 260, width: 50, height: 60, type: 'rabbit', health: 1, lastShot: 0 },
  ],
  items: [
    // Lanýže (truffles)
    { id: 'i1', x: 220, y: 430, type: 'truffle', collected: false },
    { id: 'i2', x: 470, y: 380, type: 'truffle', collected: false },
    { id: 'i3', x: 720, y: 330, type: 'truffle', collected: false },
    { id: 'i4', x: 370, y: 230, type: 'truffle', collected: false },
    { id: 'i5', x: 420, y: 230, type: 'truffle', collected: false },
    { id: 'i6', x: 70, y: 460, type: 'truffle', collected: false },
    { id: 'i7', x: 70, y: 360, type: 'truffle', collected: false },
    { id: 'i8', x: 970, y: 280, type: 'truffle', collected: false },
    { id: 'i9', x: 920, y: 430, type: 'truffle', collected: false },
    { id: 'i10', x: 600, y: 530, type: 'truffle', collected: false },
    // Kuřecí stehno (drumstick)
    { id: 'i11', x: 1050, y: 280, type: 'drumstick', collected: false },
  ],
  goal: { x: 1050, y: 450, width: 100, height: 100 },
};

// ============================================================================
// III. UTILITY FUNKCE - KOLIZE
// ============================================================================
const checkAABBCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// ============================================================================
// IV. HLAVNÍ HERNÍ KOMPONENTA
// ============================================================================
function App() {
  // --------------------------------------------------------------------------
  // STAV HRY
  // --------------------------------------------------------------------------
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver, victory
  const [player, setPlayer] = useState({
    x: 100,
    y: 400,
    width: 50,
    height: 50,
    velX: 0,
    velY: 0,
    lives: 3,
    score: 0,
    isGrounded: false,
    isAttacking: false,
    attackTimer: 0,
    direction: 1, // 1 = right, -1 = left
    invincible: false,
    invincibilityTimer: 0,
  });

  const [platforms] = useState(INITIAL_LEVEL_DATA.platforms);
  const [enemies, setEnemies] = useState(INITIAL_LEVEL_DATA.enemies);
  const [items, setItems] = useState(INITIAL_LEVEL_DATA.items);
  const [projectiles, setProjectiles] = useState([]);
  const [goal] = useState(INITIAL_LEVEL_DATA.goal);

  // Klávesy
  const keysPressed = useRef({});
  const lastUpdateTime = useRef(Date.now());
  const animationFrameId = useRef(null);

  // --------------------------------------------------------------------------
  // OVLÁDÁNÍ
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      // Prevence scrollování stránky
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // --------------------------------------------------------------------------
  // HLAVNÍ HERNÍ SMYČKA
  // --------------------------------------------------------------------------
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const currentTime = Date.now();
    const deltaTime = Math.min((currentTime - lastUpdateTime.current) / 16, 2); // Normalizace na 60 FPS
    lastUpdateTime.current = currentTime;

    setPlayer((prevPlayer) => {
      let newPlayer = { ...prevPlayer };

      // === ZPRACOVÁNÍ VSTUPU ===
      let inputVelX = 0;

      if (keysPressed.current['ArrowLeft']) {
        inputVelX = -PHYSICS.RUN_SPEED;
        newPlayer.direction = -1;
      }
      if (keysPressed.current['ArrowRight']) {
        inputVelX = PHYSICS.RUN_SPEED;
        newPlayer.direction = 1;
      }

      // Skok
      if ((keysPressed.current['ArrowUp'] || keysPressed.current[' ']) && newPlayer.isGrounded) {
        newPlayer.velY = PHYSICS.JUMP_VELOCITY;
        newPlayer.isGrounded = false;
      }

      // Útok Dash
      if ((keysPressed.current['d'] || keysPressed.current['D'] || keysPressed.current['Control']) && !newPlayer.isAttacking) {
        newPlayer.isAttacking = true;
        newPlayer.attackTimer = PHYSICS.DASH_DURATION;
      }

      // === AKTUALIZACE ÚTOKU ===
      if (newPlayer.isAttacking) {
        newPlayer.attackTimer -= 16 * deltaTime;
        if (newPlayer.attackTimer <= 0) {
          newPlayer.isAttacking = false;
          newPlayer.attackTimer = 0;
        }
      }

      // === AKTUALIZACE NEPORAZITELNOSTI ===
      if (newPlayer.invincible) {
        newPlayer.invincibilityTimer -= 16 * deltaTime;
        if (newPlayer.invincibilityTimer <= 0) {
          newPlayer.invincible = false;
          newPlayer.invincibilityTimer = 0;
        }
      }

      // === APLIKACE RYCHLOSTI ===
      if (newPlayer.isAttacking) {
        newPlayer.velX = inputVelX * PHYSICS.DASH_SPEED_MULTIPLIER;
      } else {
        newPlayer.velX = inputVelX;
      }

      // === GRAVITACE ===
      newPlayer.velY += PHYSICS.GRAVITY * deltaTime;

      // === POHYB ===
      newPlayer.x += newPlayer.velX * deltaTime;
      newPlayer.y += newPlayer.velY * deltaTime;

      // === KONTROLA HRANIC SVĚTA ===
      if (newPlayer.x < 0) newPlayer.x = 0;
      if (newPlayer.x + newPlayer.width > GAME_WIDTH) newPlayer.x = GAME_WIDTH - newPlayer.width;

      // Pád do propasti
      if (newPlayer.y > GAME_HEIGHT) {
        if (!newPlayer.invincible) {
          newPlayer.lives -= 1;
          newPlayer.invincible = true;
          newPlayer.invincibilityTimer = PHYSICS.INVINCIBILITY_DURATION;
        }
        // Respawn
        newPlayer.x = 100;
        newPlayer.y = 400;
        newPlayer.velX = 0;
        newPlayer.velY = 0;
      }

      // === KOLIZE S PLATFORMAMI ===
      newPlayer.isGrounded = false;
      platforms.forEach((platform) => {
        if (checkAABBCollision(newPlayer, platform)) {
          // Kolize shora (přistání)
          if (newPlayer.velY > 0 && newPlayer.y + newPlayer.height - newPlayer.velY * deltaTime <= platform.y) {
            newPlayer.y = platform.y - newPlayer.height;
            newPlayer.velY = 0;
            newPlayer.isGrounded = true;
          }
          // Kolize zdola (náraz hlavou)
          else if (newPlayer.velY < 0 && newPlayer.y - newPlayer.velY * deltaTime >= platform.y + platform.height) {
            newPlayer.y = platform.y + platform.height;
            newPlayer.velY = 0;
          }
          // Kolize z levé strany
          else if (newPlayer.velX > 0) {
            newPlayer.x = platform.x - newPlayer.width;
            newPlayer.velX = 0;
          }
          // Kolize z pravé strany
          else if (newPlayer.velX < 0) {
            newPlayer.x = platform.x + platform.width;
            newPlayer.velX = 0;
          }
        }
      });

      return newPlayer;
    });

    // === AKTUALIZACE NEPŘÁTEL ===
    setEnemies((prevEnemies) => {
      return prevEnemies.map((enemy) => {
        if (enemy.type === 'hedgehog') {
          let newEnemy = { ...enemy };
          newEnemy.x += newEnemy.velX * deltaTime;

          // Kontrola hranic a platforem - obrat směr
          let shouldTurn = false;

          // Hranice světa
          if (newEnemy.x <= 0 || newEnemy.x + newEnemy.width >= GAME_WIDTH) {
            shouldTurn = true;
          }

          // Kolize s platformami - náraz do stěny
          platforms.forEach((platform) => {
            if (checkAABBCollision(newEnemy, platform)) {
              if (newEnemy.velX > 0 && newEnemy.x + newEnemy.width - newEnemy.velX * deltaTime <= platform.x) {
                shouldTurn = true;
              } else if (newEnemy.velX < 0 && newEnemy.x - newEnemy.velX * deltaTime >= platform.x + platform.width) {
                shouldTurn = true;
              }
            }
          });

          // Detekce konce plošiny (aby nespadl)
          let onPlatform = false;
          platforms.forEach((platform) => {
            const futureX = newEnemy.x + newEnemy.velX * 5; // Pohled do budoucnosti
            const feetY = newEnemy.y + newEnemy.height;
            if (
              futureX + newEnemy.width / 2 > platform.x &&
              futureX + newEnemy.width / 2 < platform.x + platform.width &&
              Math.abs(feetY - platform.y) < 5
            ) {
              onPlatform = true;
            }
          });

          if (!onPlatform && newEnemy.velX !== 0) {
            shouldTurn = true;
          }

          if (shouldTurn) {
            newEnemy.velX = -newEnemy.velX;
          }

          return newEnemy;
        } else if (enemy.type === 'rabbit') {
          // Králík střílí projektily
          let newEnemy = { ...enemy };
          const now = Date.now();
          if (now - newEnemy.lastShot > 2500) {
            // Střílí každých 2.5s
            newEnemy.lastShot = now;
            // Vytvoření projektilu
            const direction = newEnemy.x > player.x ? -1 : 1;
            setProjectiles((prev) => [
              ...prev,
              {
                id: `proj_${now}_${Math.random()}`,
                x: newEnemy.x + newEnemy.width / 2,
                y: newEnemy.y + newEnemy.height / 2,
                width: 10,
                height: 10,
                velX: direction * PHYSICS.PROJECTILE_SPEED,
              },
            ]);
          }
          return newEnemy;
        }
        return enemy;
      });
    });

    // === AKTUALIZACE PROJEKTILŮ ===
    setProjectiles((prevProjectiles) => {
      return prevProjectiles
        .map((proj) => ({
          ...proj,
          x: proj.x + proj.velX * deltaTime,
        }))
        .filter((proj) => proj.x > -50 && proj.x < GAME_WIDTH + 50); // Odstranit mimo obrazovku
    });

    // === KOLIZE HRÁČE S NEPŘÁTELI ===
    setEnemies((prevEnemies) => {
      const survivingEnemies = prevEnemies.filter((enemy) => {
        if (checkAABBCollision(player, enemy)) {
          if (player.isAttacking) {
            // Zničení nepřítele
            setPlayer((p) => ({ ...p, score: p.score + 50 }));
            return false; // Odstranit nepřítele
          } else if (!player.invincible) {
            // Hráč je zasažen
            setPlayer((p) => ({
              ...p,
              lives: p.lives - 1,
              invincible: true,
              invincibilityTimer: PHYSICS.INVINCIBILITY_DURATION,
            }));
          }
        }
        return true;
      });
      return survivingEnemies;
    });

    // === KOLIZE HRÁČE S PROJEKTILY ===
    setProjectiles((prevProjectiles) => {
      const survivingProjectiles = prevProjectiles.filter((proj) => {
        if (checkAABBCollision(player, proj)) {
          if (!player.invincible) {
            setPlayer((p) => ({
              ...p,
              lives: p.lives - 1,
              invincible: true,
              invincibilityTimer: PHYSICS.INVINCIBILITY_DURATION,
            }));
          }
          return false; // Odstranit projektil
        }
        return true;
      });
      return survivingProjectiles;
    });

    // === KOLIZE S PŘEDMĚTY (SBĚR) ===
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (!item.collected && checkAABBCollision(player, { x: item.x, y: item.y, width: 15, height: 15 })) {
          if (item.type === 'truffle') {
            setPlayer((p) => ({ ...p, score: p.score + 100 }));
          } else if (item.type === 'drumstick') {
            setPlayer((p) => ({ ...p, lives: Math.min(p.lives + 1, 5) }));
          }
          return { ...item, collected: true };
        }
        return item;
      });
    });

    // === KONTROLA VÍTĚZSTVÍ (DOSAŽENÍ CÍLE) ===
    if (checkAABBCollision(player, goal)) {
      setGameState('victory');
    }

    // === KONTROLA PROHRY ===
    if (player.lives <= 0) {
      setGameState('gameOver');
    }
  }, [gameState, player, platforms, enemies, goal]);

  useEffect(() => {
    if (gameState === 'playing') {
      const animate = () => {
        gameLoop();
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [gameState, gameLoop]);

  // --------------------------------------------------------------------------
  // RESTART HRY
  // --------------------------------------------------------------------------
  const restartGame = () => {
    setPlayer({
      x: 100,
      y: 400,
      width: 50,
      height: 50,
      velX: 0,
      velY: 0,
      lives: 3,
      score: 0,
      isGrounded: false,
      isAttacking: false,
      attackTimer: 0,
      direction: 1,
      invincible: false,
      invincibilityTimer: 0,
    });
    setEnemies(INITIAL_LEVEL_DATA.enemies.map((e) => ({ ...e })));
    setItems(INITIAL_LEVEL_DATA.items.map((i) => ({ ...i, collected: false })));
    setProjectiles([]);
    setGameState('playing');
    lastUpdateTime.current = Date.now();
  };

  // --------------------------------------------------------------------------
  // RENDEROVÁNÍ
  // --------------------------------------------------------------------------
  return (
    <div style={styles.container}>
      {/* MENU */}
      {gameState === 'menu' && (
        <div style={styles.menu}>
          <h1 style={styles.title}>🐷 PREHISTORIK: PRASEČÍ LANÝŽ 🐷</h1>
          <p style={styles.subtitle}>Pomozte prasátku Přímovi najít ukradené lanýže!</p>
          <button style={styles.button} onClick={restartGame}>
            ZAČÍT HRU
          </button>
          <div style={styles.instructions}>
            <h3>OVLÁDÁNÍ:</h3>
            <p>← → Šipky: Pohyb</p>
            <p>↑ / Mezerník: Skok</p>
            <p>D / Ctrl: Útok Dash</p>
          </div>
        </div>
      )}

      {/* PLOCHA HRY */}
      {gameState === 'playing' && (
        <div style={styles.gameArea}>
          {/* UI - Score a Lives */}
          <div style={styles.ui}>
            <div style={styles.uiItem}>❤️ Životy: {player.lives}</div>
            <div style={styles.uiItem}>🏆 Skóre: {player.score}</div>
            <div style={styles.uiItem}>🍄 Lanýže: {items.filter((i) => i.type === 'truffle' && i.collected).length}/10</div>
          </div>

          {/* Platformy */}
          {platforms.map((platform) => (
            <div
              key={platform.id}
              style={{
                ...styles.platform,
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height,
              }}
            />
          ))}

          {/* Hráč - Přímo */}
          <div
            style={{
              ...styles.player,
              left: player.x,
              top: player.y,
              width: player.width,
              height: player.height,
              opacity: player.invincible ? 0.5 : 1,
              transform: `scaleX(${player.direction})`,
              backgroundColor: player.isAttacking ? '#ff69b4' : '#ffc0cb',
            }}
          >
            🐷
          </div>

          {/* Nepřátelé */}
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              style={{
                ...styles.enemy,
                left: enemy.x,
                top: enemy.y,
                width: enemy.width,
                height: enemy.height,
                backgroundColor: enemy.type === 'hedgehog' ? '#696969' : '#ffffff',
              }}
            >
              {enemy.type === 'hedgehog' ? '🦔' : '🐰'}
            </div>
          ))}

          {/* Projektily */}
          {projectiles.map((proj) => (
            <div
              key={proj.id}
              style={{
                ...styles.projectile,
                left: proj.x,
                top: proj.y,
                width: proj.width,
                height: proj.height,
              }}
            >
              🌰
            </div>
          ))}

          {/* Předměty */}
          {items
            .filter((item) => !item.collected)
            .map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  left: item.x,
                  top: item.y,
                }}
              >
                {item.type === 'truffle' ? '🍄' : '🍗'}
              </div>
            ))}

          {/* Cíl - Doupě */}
          <div
            style={{
              ...styles.goal,
              left: goal.x,
              top: goal.y,
              width: goal.width,
              height: goal.height,
            }}
          >
            🏠
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameOver' && (
        <div style={styles.menu}>
          <h1 style={styles.title}>💀 GAME OVER 💀</h1>
          <p style={styles.subtitle}>Přímovi došly životy...</p>
          <p style={styles.subtitle}>Finální skóre: {player.score}</p>
          <button style={styles.button} onClick={restartGame}>
            ZKUSIT ZNOVU
          </button>
        </div>
      )}

      {/* VÍTĚZSTVÍ */}
      {gameState === 'victory' && (
        <div style={styles.menu}>
          <h1 style={styles.title}>🎉 VÍTĚZSTVÍ! 🎉</h1>
          <p style={styles.subtitle}>Přímo našel své lanýže a vrátil se domů!</p>
          <p style={styles.subtitle}>Finální skóre: {player.score}</p>
          <button style={styles.button} onClick={restartGame}>
            HRÁT ZNOVU
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// V. STYLY
// ============================================================================
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    overflow: 'hidden',
  },
  menu: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '48px',
    margin: '20px 0',
    color: '#8B4513',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '24px',
    margin: '10px 0',
    color: '#333',
  },
  button: {
    fontSize: '24px',
    padding: '15px 40px',
    margin: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
  },
  instructions: {
    marginTop: '30px',
    textAlign: 'left',
    fontSize: '18px',
    color: '#555',
  },
  gameArea: {
    position: 'relative',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#87CEEB',
    border: '5px solid #8B4513',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  },
  ui: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    gap: '20px',
    zIndex: 100,
  },
  uiItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  platform: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    border: '2px solid #654321',
  },
  player: {
    position: 'absolute',
    backgroundColor: '#ffc0cb',
    border: '3px solid #ff1493',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    transition: 'opacity 0.1s',
  },
  enemy: {
    position: 'absolute',
    border: '2px solid #000',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '35px',
  },
  projectile: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  item: {
    position: 'absolute',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  goal: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    border: '3px dashed #ff0000',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
  },
};

export default App;
