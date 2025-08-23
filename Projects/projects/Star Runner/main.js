import Game from './js/core/Game.js';

const canvas = document.getElementById('gameCanvas');
const startBtn = document.getElementById('startBtn');

const game = new Game(canvas);

startBtn.addEventListener('click', () => {
    document.getElementById('mainMenu').classList.remove('active');
    game.start();
});
