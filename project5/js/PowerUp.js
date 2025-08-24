
export class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.speed = 1;
        this.type = this.getRandomType();
        
      
        this.createTimedEffect = (duration, effectName, hud) => {
            let timeRemaining = duration;
            const originalPower = hud.power;
            
            const timerFunction = () => {
                if (timeRemaining > 0) {
                    hud.power = `${effectName} (${Math.ceil(timeRemaining/60)}s)`;
                    hud.updateDisplay();
                    timeRemaining--;
                    setTimeout(timerFunction, 16.67); 
                } else {
                    hud.power = originalPower;
                    hud.updateDisplay();
                }
            };
            
            return timerFunction;
        };
    }

    getRandomType() {
        const types = ['rapidFire', 'doubleShot', 'health'];
        return types[Math.floor(Math.random() * types.length)];
    }

    update() {
        this.y += this.speed;
        if (this.y > 600) {
            this.collected = true; 
        }
    }

    render(ctx) {
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
    
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.getSymbol(), this.x + this.width/2, this.y + this.height/2 + 4);
    }

    getColor() {
        switch (this.type) {
            case 'rapidFire': return '#ffd700';
            case 'doubleShot': return '#00ff00';
            case 'health': return '#ff69b4';
            default: return '#ffffff';
        }
    }

    getSymbol() {
        switch (this.type) {
            case 'rapidFire': return 'R';
            case 'doubleShot': return '2';
            case 'health': return '+';
            default: return '?';
        }
    }

    apply(player, hud) {
        switch (this.type) {
            case 'health':
                if (player.health < 5) {
                    player.health++;
                    hud.lives = player.health;
                }
                break;
            case 'rapidFire':
                const rapidFireTimer = this.createTimedEffect(300, 'Rapid Fire', hud);
                rapidFireTimer();
                break;
            case 'doubleShot':
                const doubleShotTimer = this.createTimedEffect(300, 'Double Shot', hud);
                doubleShotTimer();
                break;
        }
        this.collected = true;
    }

    collidesWith(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }

}
