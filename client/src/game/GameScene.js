import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets
        this.load.image('background', '/assets/background.png'); // Add your background image
        this.load.image('tower', '/assets/tower.png');
        this.load.image('bullet', '/assets/bullet.png');

        // Load enemy sprites
        this.load.image('lightTank', '/assets/enemies/light_tank.png');
        this.load.image('mediumTank', '/assets/enemies/medium_tank.png');
        this.load.image('heavyTank', '/assets/enemies/heavy_tank.png');
        this.load.image('lightAircraft', '/assets/enemies/light_aircraft.png');
        this.load.image('mediumAircraft', '/assets/enemies/medium_aircraft.png');
        this.load.image('heavyAircraft', '/assets/enemies/heavy_aircraft.png');
        this.load.image('jeep', '/assets/enemies/jeep.png');
        this.load.image('halfTrack', '/assets/enemies/half_track.png');
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Tower placement (static)
        this.towers = this.add.group();
        this.addTower(150, 350);
        this.addTower(400, 400);
        this.addTower(650, 300);

        // Enemy movement logic
        this.enemies = this.add.group();
        this.spawnEnemies();

        // Shooting bullets
        this.bullets = this.add.group();

        // Add timed event for shooting
        this.time.addEvent({
            delay: 1000, // Shoot every 1 second
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Adds a tower at the specified position.
     */
    addTower(x, y) {
        let tower = this.add.image(x, y, 'tower').setScale(0.5);
        this.towers.add(tower);
    }

    /**
     * Spawns enemies on screen and moves them.
     */
    spawnEnemies() {
        const enemyData = [
            { type: 'lightTank', x: 50, y: 100 },
            { type: 'mediumTank', x: 50, y: 150 },
            { type: 'heavyTank', x: 50, y: 200 },
            { type: 'lightAircraft', x: 50, y: 250 },
            { type: 'mediumAircraft', x: 50, y: 300 },
            { type: 'heavyAircraft', x: 50, y: 350 },
            { type: 'jeep', x: 50, y: 400 },
            { type: 'halfTrack', x: 50, y: 450 }
        ];

        enemyData.forEach(({ type, x, y }) => {
            let enemy = this.add.image(x, y, type).setScale(0.8);
            this.enemies.add(enemy);

            this.tweens.add({
                targets: enemy,
                x: 800,
                duration: 5000,
                repeat: -1
            });
        });
    }

    /**
     * Shoots bullets from towers.
     */
    shootBullet() {
        this.towers.children.iterate(tower => {
            let bullet = this.add.image(tower.x, tower.y - 20, 'bullet').setScale(0.5);
            this.bullets.add(bullet);

            this.tweens.add({
                targets: bullet,
                x: 800,
                duration: 2000,
                onComplete: () => bullet.destroy()
            });
        });
    }
}

export default GameScene;
