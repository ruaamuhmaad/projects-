// Player.js - مع Inheritance
import { Projectile } from './Projectile.js';
import { GameObject } from './Enemy.js';

export class Player extends GameObject {
    constructor(x, y, eventBus) {
        super(x, y, 30, 30);
        this.speed = 5;
        this.eventBus = eventBus;
        this.cooldown = 0;
        this.health = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }

    update(keys, projectiles) {
        // الحركة
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x + this.width < 800) this.x += this.speed;
        if (keys['ArrowUp'] && this.y > 50) this.y -= this.speed;
        if (keys['ArrowDown'] && this.y + this.height < 600) this.y += this.speed;

        // إطلاق النار
        if (keys['Space'] && this.cooldown <= 0) {
            projectiles.push(new Projectile(this.x + this.width / 2 - 3, this.y));
            this.cooldown = 15;
        }

        if (this.cooldown > 0) this.cooldown--;

        // تحديث حالة عدم التأثر
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    render(ctx) {
        ctx.save();
        
        // تأثير الوميض عند الإصابة
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
            ctx.globalAlpha = 0.5;
        }

        // رسم اللاعب كدائرة زرقاء
        ctx.fillStyle = '#00bfff';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();

        // نقطة بيضاء في الوسط
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    takeDamage() {
        if (!this.invulnerable) {
            this.health--;
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2 ثانية عند 60 FPS
            return true;
        }
        return false;
    }
}