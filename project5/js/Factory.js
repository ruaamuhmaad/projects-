// Factory.js
import { Enemy } from './Enemy.js';

export class Factory {
    static createEnemies(enemyData, eventBus) {
        return enemyData.map(e => new Enemy(e.x, e.y, eventBus));
    }
}