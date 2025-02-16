import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load background
        this.load.image('background', '/assets/background.png');

        // Load enemy sprites from new cropped images
        this.load.image('lightTank', '/assets/enemies/light_tank.png');
        this.load.image('mediumTank', '/assets/enemies/medium_tank.png');
        this.load.image('heavyTank', '/assets/enemies/heavy_tank.png');
        this.load.image('lightAircraft', '/assets/enemies/light_aircraft.png');
        this.load.image('mediumAircraft', '/assets/enemies/medium_aircraft.png');
        this.load.image('heavyAircraft', '/assets/enemies/heavy_aircraft.png');
        this.load.image('jeep', '/assets/enemies/jeep.png');
        this.load.image('apc', '/assets/enemies/apc.png'); // Updated from half-track
        this.load.image('mammothTank', '/assets/enemies/mammoth_tank.png'); // Boss wave
        this.load.image('heavyBomber', '/assets/enemies/heavy_bomber.png'); // Boss wave
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Example enemy spawn with new sprites
        this.spawnEnemies([
            { type: 'lightTank', x: 50, y: 100 },
            { type: 'mediumTank', x: 50, y: 150 },
            { type: 'heavyTank', x: 50, y: 200 },
            { type: 'lightAircraft', x: 50, y: 250 },
            { type: 'mediumAircraft', x: 50, y: 300 },
            { type: 'heavyAircraft', x: 50, y: 350 },
            { type: 'jeep', x: 50, y: 400 },
            { type: 'apc', x: 50, y: 450 }
        ]);

        // Add special boss enemy every 10th wave
        this.time.addEvent({
            delay: 10000, // Every 10 seconds (simulating every 10th wave)
            callback: () => {
                this.spawnBossWave();
            },
            loop: true
        });
    }

    spawnEnemies(enemyData) {
        this.enemies = [];
        enemyData.forEach(({ type, x, y }) => {
            let enemy = this.add.image(x, y, type).setScale(0.8);
            this.enemies.push(enemy);

            // Move enemy across the screen
            this.tweens.add({
                targets: enemy,
                x: 800,
                duration: 5000,
                repeat: -1
            });
        });
    }

    spawnBossWave() {
        console.log("🚨 Boss wave incoming!");
        let bossType = Math.random() > 0.5 ? 'mammothTank' : 'heavyBomber';
        let boss = this.add.image(50, 250, bossType).setScale(1.2);
        
        // Move boss enemy slowly
        this.tweens.add({
            targets: boss,
            x: 800,
            duration: 10000, // Moves slower than regular enemies
            repeat: 0
        });
    }
}

export default GameScene;
