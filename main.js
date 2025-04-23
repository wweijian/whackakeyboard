// main.js
// Entry point for the application - connects everything together

import * as Game from './game-logic.js';
import { elements, showScreen } from './ui.js';

// Event listeners for option selection
elements.difficultyOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        elements.difficultyOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update current difficulty
        Game.updateDifficulty(option.dataset.difficulty);
    });
});

elements.timeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        elements.timeOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update current time limit
        Game.updateTimeLimit(option.dataset.time);
    });
});

// Start button click event
elements.startButton.addEventListener('click', Game.startGame);

// Restart button click event
elements.restartButton.addEventListener('click', Game.initGame);

// Key press event listener
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    // Check for Escape key to force end game
    if (key === 'escape') {
    Game.forceEndGame();
        return;
    }
    
    // Handle normal gameplay keys
    Game.handleKeyPress(key);
});

// Initialize the game when page loads
window.addEventListener('load', Game.initGame);

elements.instructionsButton.addEventListener('click', () => {
    showScreen('instructions');
});

elements.backButton.addEventListener('click', () => {
    showScreen('config');
});