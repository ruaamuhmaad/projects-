import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import HUD from './HUD.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keys = {};
        this.player = new Player(375, 500);
        this.enemies = [new Enemy(100, 0), new Enemy(300, -150), new Enemy(500, -300)];
        this.hud = new HUD();
        this.running = false;

        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
    }

    start() {
        this.running = true;
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        if (!this.running) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        this.player.update(this.keys);

        this.enemies.forEach(e => e.update());

        this.player.projectiles.forEach((p, pIndex) => {
            this.enemies.forEach((e, eIndex) => {
                if (p.x < e.x + e.width &&
                    p.x + p.width > e.x &&
                    p.y < e.y + e.height &&
                    p.y + p.height > e.y) {
                    this.player.projectiles.splice(pIndex, 1);
                    this.enemies.splice(eIndex, 1);

                  
                    this.hud.score += 10;
                }
            });
        });

        if (this.enemies.length === 0) {
            this.enemies.push(
                new Enemy(Math.random() * 700, -50),
                new Enemy(Math.random() * 700, -150),
                new Enemy(Math.random() * 700, -250)
            );
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        this.enemies.forEach(e => e.render(this.ctx));
        this.hud.render(this.ctx);
    }
}
