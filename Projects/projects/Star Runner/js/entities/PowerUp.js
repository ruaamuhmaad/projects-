export default class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 1.5;
    }

    update() {
        this.y += this.speed;
        if (this.y > 600) this.y = -this.height;
    }

    render(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
