export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 2;
    }

    update() {
        this.y += this.speed;
        if (this.y > 600) this.y = -this.height;
    }

    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
