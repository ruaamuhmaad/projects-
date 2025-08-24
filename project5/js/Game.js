// Game.js
import { EventBus } from './EventBus.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { PowerUp } from './PowerUp.js';
import { HUD } from './HUD.js';
import { Factory } from './Factory.js';
import { Loader } from './Loader.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keys = {};
        this.eventBus = new EventBus();
        this.hud = new HUD(this.eventBus);
        this.player = new Player(375, 500, this.eventBus);
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.running = false;
        this.paused = false;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;

        // التحكم
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Escape') {
                this.togglePause();
            }
        });
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        // الأحداث
        this.eventBus.subscribe('spawnPowerUp', (pu) => this.powerUps.push(pu));

        // أزرار القوائم
        this.setupMenuButtons();
    }

    setupMenuButtons() {
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.hideSettings());
    }

    async start() {
        try {
            const levelData = await Loader.loadJSON('/assets/levels/level1.json');
            this.enemies = Factory.createEnemies(levelData.enemies, this.eventBus);
            this.running = true;
            this.paused = false;
            this.enemySpawnTimer = 0;
            this.powerUpSpawnTimer = 0;
            this.hud.lives = this.player.health;
            this.hud.updateDisplay();
            requestAnimationFrame(() => this.loop());
        } catch (err) {
            console.error('Failed to load level:', err);
        }
    }

    loop() {
        if (!this.running) return;
        
        if (!this.paused) {
            this.update();
            this.render();
        }
        
        requestAnimationFrame(() => this.loop());
    }

    update() {
        // تحديث اللاعب
        this.player.update(this.keys, this.projectiles);

        // تحديث الرصاصات
        this.projectiles.forEach(p => p.update());

        // تحديث الأعداء
        this.enemies.forEach(e => e.update());

        // تحديث القوى
        this.powerUps.forEach(pu => pu.update());

        // إنشاء أعداء جدد
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 180) { // كل 3 ثوانٍ تقريباً
            const x = Math.random() * (800 - 25);
            this.enemies.push(new Enemy(x, -25, this.eventBus));
            this.enemySpawnTimer = 0;
        }

        // إنشاء قوى جديدة
        this.powerUpSpawnTimer++;
        if (this.powerUpSpawnTimer > 600 && Math.random() < 0.3) { // كل 10 ثوانٍ، احتمال 30%
            const x = Math.random() * (800 - 20);
            this.powerUps.push(new PowerUp(x, -20));
            this.powerUpSpawnTimer = 0;
        }

        // التصادمات: الرصاصات مع الأعداء
        this.projectiles.forEach(p => {
            this.enemies.forEach(e => {
                if (!e.dead && p.collidesWith(e)) {
                    e.dead = true;
                    p.offScreen = true;
                    this.hud.addScore(100);
                    
                    // فرصة لإنشاء قوة
                    if (Math.random() < 0.3) {
                        this.powerUps.push(new PowerUp(e.x, e.y));
                    }
                }
            });
        });

        // التصادمات: اللاعب مع القوى
        this.powerUps.forEach(pu => {
            if (this.player.collidesWith(pu)) {
                pu.apply(this.player, this.hud);
                this.hud.updateDisplay();
            }
        });

        // التصادمات: اللاعب مع الأعداء
        this.enemies.forEach(e => {
            if (!e.dead && this.player.collidesWith(e)) {
                if (this.player.takeDamage()) {
                    e.dead = true;
                    this.hud.lives = this.player.health;
                    this.hud.updateDisplay();
                    
                    if (this.player.health <= 0) {
                        this.gameOver();
                    }
                }
            }
        });

        // تنظيف الكائنات الميتة
        this.enemies = this.enemies.filter(e => !e.dead);
        this.projectiles = this.projectiles.filter(p => !p.offScreen);
        this.powerUps = this.powerUps.filter(pu => !pu.collected);
    }

    render() {
        // مسح الشاشة
        this.ctx.fillStyle = 'rgba(2, 5, 8, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // رسم النجوم
        this.renderStars();

        // رسم جميع الكائنات
        this.player.render(this.ctx);
        this.projectiles.forEach(p => p.render(this.ctx));
        this.enemies.forEach(e => e.render(this.ctx));
        this.powerUps.forEach(pu => pu.render(this.ctx));
    }

    renderStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() * 800 + Date.now() * 0.01) % 800;
            const y = (Math.random() * 600 + Date.now() * 0.02) % 600;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    gameOver() {
        this.running = false;
        document.getElementById('finalScore').textContent = this.hud.score;
        
        if (this.hud.score === this.hud.highScore) {
            document.getElementById('newHighScore').style.display = 'block';
        } else {
            document.getElementById('newHighScore').style.display = 'none';
        }
        
        document.getElementById('gameOverMenu').classList.add('active');
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            document.getElementById('pauseMenu').classList.add('active');
        } else {
            document.getElementById('pauseMenu').classList.remove('active');
        }
    }

    restart() {
        this.hideAllMenus();
        this.player = new Player(375, 500, this.eventBus);
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.hud.score = 0;
        this.hud.lives = 3;
        this.hud.level = 1;
        this.hud.power = 'Normal';
        this.hud.updateDisplay();
        this.start();
    }

    showMainMenu() {
        this.running = false;
        this.hideAllMenus();
        document.getElementById('mainMenu').classList.add('active');
        this.hud.updateDisplay();
    }

    showSettings() {
        document.getElementById('settingsMenu').classList.add('active');
    }

    hideSettings() {
        document.getElementById('settingsMenu').classList.remove('active');
    }

    saveSettings() {
        // حفظ الإعدادات
        this.hideSettings();
    }

    hideAllMenus() {
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });
    }
}