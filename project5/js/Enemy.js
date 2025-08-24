
export class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dead = false;
    }

    update() {
     
    }

    render(ctx) {
    
    }

    collidesWith(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
}

export class Enemy extends GameObject {
    constructor(x, y, eventBus) {
        super(x, y, 25, 25);
        this.speed = 2;
        this.eventBus = eventBus;
    }

    update() {
        this.y += this.speed;
    
        if (this.y > 600) {
            this.dead = true;
        }
    }

    render(ctx) {
    
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cc1744';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

}
