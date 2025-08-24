// HUD.js - مع localStorage محسن للإعدادات
export class HUD {
    constructor(eventBus) {
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.lives = 3;
        this.level = 1;
        this.power = 'Normal';
        this.eventBus = eventBus;
        this.settings = this.loadSettings();
        
        // تحديث العرض فوراً
        this.updateDisplay();
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem('starRunnerHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (error) {
            console.warn('Could not load high score:', error);
            return 0;
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('starRunnerSettings');
            return saved ? JSON.parse(saved) : {
                soundEffects: true,
                music: true,
                difficulty: 'normal'
            };
        } catch (error) {
            console.warn('Could not load settings:', error);
            return {
                soundEffects: true,
                music: true,
                difficulty: 'normal'
            };
        }
    }

    saveSettings(newSettings) {
        try {
            this.settings = { ...this.settings, ...newSettings };
            localStorage.setItem('starRunnerSettings', JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.error('Could not save settings:', error);
            return false;
        }
    }

    addScore(value) {
        this.score += value;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            try {
                localStorage.setItem('starRunnerHighScore', this.highScore.toString());
            } catch (error) {
                console.warn('Could not save high score:', error);
            }
        }
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('scoreDisplay').textContent = this.score;
        document.getElementById('livesDisplay').textContent = this.lives;
        document.getElementById('levelDisplay').textContent = this.level;
        document.getElementById('powerDisplay').textContent = this.power;
        document.getElementById('displayHighScore').textContent = this.highScore;
    }

    render(ctx) {
        // لا حاجة لرسم في Canvas لأننا نستخدم HTML elements
    }
}