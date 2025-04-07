import Game from './main.js';
import UI from './ui.js';

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            UI.showGameOptions();
        });
    }
});