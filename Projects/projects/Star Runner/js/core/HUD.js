export default class HUD {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.power = 'Normal';
    }

    render(ctx) {
        ctx.fillStyle = 'cyan';
        ctx.font = '20px monospace';
        ctx.fillText(`Score: ${this.score}`, 10, 30);
        ctx.fillText(`Lives: ${this.lives}`, 10, 60);
        ctx.fillText(`Level: ${this.level}`, 700, 30);
        ctx.fillText(`Power: ${this.power}`, 700, 60);
    }
}
