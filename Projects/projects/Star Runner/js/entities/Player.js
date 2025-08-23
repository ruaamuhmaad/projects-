import Projectile from './Projectile.js';

export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.projectiles = [];
        this.shootCooldown = 0;
    }

    update(keys) {
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x + this.width < 800) this.x += this.speed;
        if (keys['Space'] && this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = 15; // frames between shots
        }

        if (this.shootCooldown > 0) this.shootCooldown--;

        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => p.y + p.height > 0);
    }

    shoot() {
        const projectile = new Projectile(this.x + this.width / 2 - 2.5, this.y);
        this.projectiles.push(projectile);
    }

    render(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.projectiles.forEach(p => p.render(ctx));
    }
}
