// Projectile.js
export class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 20;
        this.speed = 8;
        this.offScreen = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y + this.height < 0) this.offScreen = true;
    }

    render(ctx) {
        ctx.fillStyle = '#00ff88'; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(obj) {
        return this.x < obj.x + obj.width && 
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height && 
               this.y + this.height > obj.y;
    }
}