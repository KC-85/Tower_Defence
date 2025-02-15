/**
 * Mega-Advanced Warzone Tower Defense Game Engine
 * - Dynamic enemy scaling & difficulty
 * - Special Boss Enemies every 10 waves
 * - Towers with unique targeting modes
 * - Sniper bullets, EMP, AOE, Napalm, Rocket Launchers
 * - Smart pathfinding with multiple routes
 */

const gameState = {
    enemies: [],
    towers: [],
    money: 500,  // Starting money
    health: 30,  // Base health
    wave: 1,
    goldPerKill: 15,
    waveBonus: 100,
};

/**
 * Enemy path system (3 randomizable paths)
 */
const enemyPaths = [
    [{ x: 0, y: 50 }, { x: 200, y: 50 }, { x: 600, y: 50 }],
    [{ x: 0, y: 150 }, { x: 250, y: 150 }, { x: 600, y: 150 }],
    [{ x: 0, y: 250 }, { x: 300, y: 250 }, { x: 600, y: 250 }]
];

/**
 * Spawns a wave of enemies with difficulty scaling & boss enemies.
 */
const spawnWave = (wave) => {
    let enemyCount = wave * 3;
    let newEnemies = [];

    for (let i = 0; i < enemyCount; i++) {
        let pathIndex = i % enemyPaths.length;
        let baseHealth = 100 + wave * 25;
        let baseSpeed = 2 + wave * 0.3;

        // Every 10th wave, enemies become significantly stronger
        if (wave % 10 === 0) {
            baseHealth *= 1.7;
            baseSpeed *= 1.3;
        }

        newEnemies.push({
            id: `enemy-${Date.now()}-${i}`,
            path: enemyPaths[pathIndex],
            pathIndex: 0,
            health: baseHealth,
            speed: baseSpeed,
            type: Math.random() > 0.8 ? 'flying' : 'ground',
            frozen: false,
            frozenTime: 0
        });
    }

    // Special Boss Enemy every 10th wave
    if (wave % 10 === 0) {
        newEnemies.push({
            id: `boss-${wave}`,
            path: enemyPaths[Math.floor(Math.random() * enemyPaths.length)],
            pathIndex: 0,
            health: 4000 + wave * 100,
            speed: 1.2,
            type: "boss",
            frozen: false,
            frozenTime: 0
        });
        console.log(`🔥 Boss Enemy appeared on Wave ${wave}!`);
    }

    gameState.enemies.push(...newEnemies);
};

/**
 * Moves enemies along predefined paths.
 */
const moveEnemies = () => {
    gameState.enemies.forEach(enemy => {
        if (enemy.frozen) {
            enemy.frozenTime--;
            if (enemy.frozenTime <= 0) {
                enemy.frozen = false;
            }
        } else {
            if (enemy.pathIndex < enemy.path.length) {
                enemy.x = enemy.path[enemy.pathIndex].x;
                enemy.y = enemy.path[enemy.pathIndex].y;
                enemy.pathIndex++;
            } else {
                gameState.health--;
            }
        }
    });

    gameState.enemies = gameState.enemies.filter(enemy => enemy.pathIndex < enemy.path.length);
};

/**
 * Tower Types with Upgradeable Levels
 */
const towerTypes = {
    gun: { damage: 25, range: 120, fireRate: 1, cost: 75, maxLevel: 5, sniperChance: 0 },
    rocket: { damage: 75, range: 140, fireRate: 2, cost: 150, maxLevel: 5, splash: true },
    napalm: { damage: 20, range: 130, fireRate: 1, cost: 120, maxLevel: 5, burn: true },
    emp: { range: 160, fireRate: 1, cost: 130, maxLevel: 5, effect: "freeze" },
    pulse: { damage: 40, range: 110, fireRate: 1, cost: 160, maxLevel: 5, effect: "aoe" },
    airLaser: { damage: 45, range: 140, fireRate: 1, cost: 140, maxLevel: 5, targetType: "flying" },
    samSite: { damage: 35, range: 100, fireRate: 2, cost: 100, maxLevel: 5, targetType: "flying" }
};

/**
 * Places a tower at a given position.
 */
const placeTower = (type, x, y) => {
    if (!towerTypes[type]) {
        console.log(`Invalid tower type: ${type}`);
        return;
    }

    const towerData = towerTypes[type];

    if (gameState.money >= towerData.cost) {
        gameState.towers.push({
            id: `tower-${Date.now()}`,
            type,
            x,
            y,
            level: 1,
            damage: towerData.damage,
            range: towerData.range,
            fireRate: towerData.fireRate,
            sniperChance: towerData.sniperChance || 0,
            targetMode: "first",
        });
        gameState.money -= towerData.cost;
    } else {
        console.log("Not enough money to place this tower.");
    }
};

/**
 * Towers attack enemies using targeting logic.
 */
const towerAttack = () => {
    gameState.towers.forEach(tower => {
        let enemiesInRange = gameState.enemies.filter(enemy =>
            Math.abs(enemy.x - tower.x) <= tower.range
        );

        if (enemiesInRange.length > 0) {
            let target = enemiesInRange[0];

            if (tower.type === "gun" && tower.level === 5) {
                if (Math.random() < 0.1) {
                    console.log(`🔫 SNIPER BULLET! ${target.id} INSTANTLY KILLED!`);
                    gameState.enemies = gameState.enemies.filter(e => e.id !== target.id);
                    return;
                }
            }

            target.health -= tower.damage;
        }
    });

    gameState.enemies = gameState.enemies.filter(enemy => enemy.health > 0);
};

/**
 * Upgrades a tower up to level 5.
 */
const upgradeTower = (towerId) => {
    const tower = gameState.towers.find(t => t.id === towerId);
    if (tower && tower.level < 5 && gameState.money >= 100) {
        tower.level++;
        tower.damage += 15;
        tower.range += 15;
        tower.fireRate += 0.2;

        if (tower.type === "gun" && tower.level === 5) {
            tower.sniperChance = 0.1;
        }

        gameState.money -= 100;
        console.log(`Tower ${towerId} upgraded to Level ${tower.level}!`);
    } else {
        console.log("Cannot upgrade further or not enough money.");
    }
};

/**
 * Runs one tick of the game loop.
 */
const processGameTick = () => {
    moveEnemies();
    towerAttack();
};

module.exports = { 
    gameState, 
    spawnWave, 
    placeTower, 
    upgradeTower, 
    processGameTick 
};
