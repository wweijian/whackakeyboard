// game-logic.js
// Main game logic and state management

import { validChars, MAX_SCORE, getTimeForDifficulty } from './config.js';
import * as UI from './ui.js';

// Game state
const gameState = {
    active: false,
    score: 0,
    keystrokes: 0,
    currentDifficulty: 'zen',
    currentTimeLimit: 60,
    gameTimer: null,
    decayTimer: null,
    currentChar: '',
    timeRemaining: 0,
    charRemaining: 0,
    charTotalTime: 0,
    progressInterval: null,
    progressFill: null
};

// Initialize the game
export function initGame() {
    // Reset game variables
    gameState.score = 0;
    gameState.keystrokes = 0;
    gameState.active = false;
    
    // Reset UI
    UI.showScreen('config');
    UI.resetKeyHighlights();
    UI.updateTimerDisplay(gameState.currentTimeLimit);
    UI.elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
    
    // Clear any existing timers
    clearAllTimers();
}

// Clear all active timers
function clearAllTimers() {
    if (gameState.gameTimer) clearInterval(gameState.gameTimer);
    if (gameState.decayTimer) clearTimeout(gameState.decayTimer);
    if (gameState.progressInterval) clearInterval(gameState.progressInterval);
    
    gameState.gameTimer = null;
    gameState.decayTimer = null;
    gameState.progressInterval = null;
}

// Start the game with selected settings
export function startGame() {
    // Show countdown
    UI.showScreen('countdown');
    
    // Start countdown
    let countdown = 3;
    UI.elements.countdownDisplay.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        UI.elements.countdownDisplay.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            startGameplay();
        }
    }, 1000);
}

// Start actual gameplay
function startGameplay() {
    gameState.active = true;
    UI.showScreen('game');
    
    // Start game timer
    gameState.timeRemaining = gameState.currentTimeLimit === 'infinite' ? Infinity : gameState.currentTimeLimit;
    if (gameState.timeRemaining !== Infinity) {
        gameState.gameTimer = setInterval(() => {
            gameState.timeRemaining--;
            UI.updateTimerDisplay(gameState.timeRemaining);
            
            if (gameState.timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    // Generate first character
    generateNewCharacter();
}

// Generate a new random character to display
export function generateNewCharacter() {
    // Only generate if game is active
    if (!gameState.active) return;
    
    // Clear previous timers
    if (gameState.decayTimer) clearTimeout(gameState.decayTimer);
    if (gameState.progressInterval) clearInterval(gameState.progressInterval);
    
    // Reset highlights
    UI.resetKeyHighlights();
    
    // Select random character
    gameState.currentChar = validChars[Math.floor(Math.random() * validChars.length)];
    
    // Highlight the key
    const keyElement = UI.highlightKey(gameState.currentChar);
    
    // Start decay timer based on difficulty
    gameState.charTotalTime = getTimeForDifficulty(gameState.currentDifficulty);
    gameState.charRemaining = gameState.charTotalTime;
    
    if (gameState.charTotalTime !== Infinity && keyElement) {
        // Create progress bar
        gameState.progressFill = UI.createProgressBar(keyElement, gameState.charTotalTime);
        
        // Start progress interval for smooth decay animation
        const updateFrequency = 50; // Update every 50ms
        gameState.progressInterval = setInterval(() => {
            gameState.charRemaining -= updateFrequency;
            const percentage = (gameState.charRemaining / gameState.charTotalTime) * 100;
            
            if (gameState.progressFill) {
                gameState.progressFill.style.width = `${Math.max(0, percentage)}%`;
            }
        }, updateFrequency);
        
        // Set decay timer
        gameState.decayTimer = setTimeout(() => {
            characterExpired();
        }, gameState.charTotalTime);
    }
}

// When character timer expires
function characterExpired() {
    if (gameState.active) {
        // Show the character as wrong
        UI.showWrongKey(gameState.currentChar);
        
        // Generate new character after a short delay
        setTimeout(() => {
            generateNewCharacter();
        }, 300);
    }
}

// Handle key press
export function handleKeyPress(key) {
    if (!gameState.active) return;
    
    // Normalize key to lowercase for case-insensitive matching
    const pressedKey = key.toLowerCase();
    
    if (pressedKey === gameState.currentChar) {
        // Correct key pressed
        // Calculate score based on time remaining
        const timeBonus = Math.ceil((gameState.charRemaining / gameState.charTotalTime) * 10) / 10;
        const pointsEarned = 1 + timeBonus;
        
        // Update score
        gameState.score += pointsEarned;
        gameState.score = Math.min(gameState.score, MAX_SCORE); // Ensure score doesn't exceed max
        UI.elements.scoreDisplay.textContent = `Score: ${Math.round(gameState.score * 10) / 10}`;
        gameState.keystrokes++;
        
        // Cancel current decay timer
        if (gameState.decayTimer) clearTimeout(gameState.decayTimer);
        if (gameState.progressInterval) clearInterval(gameState.progressInterval);
        
        // Generate new character
        generateNewCharacter();
        
        // If score exceeds MAX_SCORE, end the game
        if (gameState.score >= MAX_SCORE) {
            endGame();
        }
    } else if (validChars.includes(pressedKey)) {
        // Wrong key pressed
        UI.showWrongKey(pressedKey);
    }
}

// Force end the game
export function forceEndGame() {
    endGame();
}

// End the game and show stats
function endGame() {
    // Only run this if the game is active to prevent double calls
    if (!gameState.active) return;
    
    gameState.active = false;
    
    // Clear timers
    clearAllTimers();
    
    // Show game over screen
    UI.showScreen('gameOver');
    
    // Display stats
    UI.displayGameStats(
        gameState.score,
        gameState.keystrokes,
        gameState.currentDifficulty,
        gameState.currentTimeLimit,
        gameState.timeRemaining
    );
}

// Update settings
export function updateDifficulty(difficulty) {
    gameState.currentDifficulty = difficulty;
}

export function updateTimeLimit(timeLimit) {
    gameState.currentTimeLimit = timeLimit === 'infinite' ? 'infinite' : parseInt(timeLimit);
}