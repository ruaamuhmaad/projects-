import Enemy from '../entities/Enemy.js';
import PowerUp from '../entities/PowerUp.js';

export default class Factory {
    static createEnemy(x, y) {
        return new Enemy(x, y);
    }

    static createPowerUp(x, y) {
        return new PowerUp(x, y);
    }
}
