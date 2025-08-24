// main.js - بدء اللعبة
import { Game } from './Game.js';

// بدء اللعبة
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
    document.getElementById('mainMenu').classList.remove('active');
    game.start();
});