import Phaser from 'phaser';
import GameScene from './GameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1e1e1e',
    scene: [GameScene]
};

class PhaserGame extends Phaser.Game {
    constructor() {
        super(config);
    }
}

export default PhaserGame;
