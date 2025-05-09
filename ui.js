// ui.js
// Handle UI updates, animations, and DOM interactions

// Cache DOM elements for performance
export const elements = {
    configScreen: document.getElementById('config-screen'),
    countdownDisplay: document.getElementById('countdown'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    scoreDisplay: document.getElementById('score-display'),
    timerDisplay: document.getElementById('timer-display'),
    difficultyOptions: document.querySelectorAll('#difficulty-options .option-button'),
    timeOptions: document.querySelectorAll('#time-options .option-button'),
    startButton: document.getElementById('start-button'),
    restartButton: document.getElementById('restart-button'),
    finalScore: document.getElementById('final-score'),
    totalKeystrokes: document.getElementById('total-keystrokes'),
    keystrokesPerMinute: document.getElementById('keystrokes-per-minute'),
    finalDifficulty: document.getElementById('final-difficulty'),
    finalTime: document.getElementById('final-time'),
    instructionsScreen: document.getElementById('instructions-screen'),
    instructionsButton: document.getElementById('instructions-button'),
    backButton: document.getElementById('back-button'),
};

// Update timer display
export function updateTimerDisplay(time) {
    elements.timerDisplay.textContent = time === Infinity ? 
        'Time: ∞' : 
        `Time: ${time}s`;
}

// Highlight a specific key
export function highlightKey(key) {
    // Highlight on main keyboard
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.add('highlight');
        keyElement.setAttribute('data-image', `key-${key}.png`);
        
        // Also highlight on mobile keyboard if on mobile
        if (isMobileDevice()) {
            const mobileKey = document.querySelector(`.mobile-key[data-key="${key}"]`);
            if (mobileKey) {
                mobileKey.classList.add('highlight');
            }
        }
        
        return keyElement;
    }
    return null;
}

// Reset all key highlights
export function resetKeyHighlights() {
    // Reset main keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('highlight');
        
        // Remove progress bar
        const progressBar = key.querySelector('.progress-bar');
        if (progressBar) {
            key.removeChild(progressBar);
        }
    });
    
    // Reset mobile keyboard
    const mobileKeys = document.querySelectorAll('.mobile-key');
    mobileKeys.forEach(key => {
        key.classList.remove('highlight');
    });
}

// Create and start progress bar for a key
export function createProgressBar(key, charTotalTime) {
    if (!key) return null;
    
    // Create progress bar if it doesn't exist
    if (!key.querySelector('.progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        
        progressBar.appendChild(progressFill);
        key.appendChild(progressBar);
    }
    
    return key.querySelector('.progress-fill');
}

// Show wrong key animation
export function showWrongKey(key) {
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.add('wrong');
        setTimeout(() => {
            keyElement.classList.remove('wrong');
        }, 300);
    }
}

// Update game screens visibility
export function showScreen(screenName) {
    // Hide all screens
    elements.configScreen.style.display = 'none';
    elements.countdownDisplay.style.display = 'none';
    elements.gameScreen.style.display = 'none';
    elements.gameOverScreen.style.display = 'none';
    elements.instructionsScreen.style.display = 'none';
    
    // Show requested screen
    switch(screenName) {
        case 'config':
            elements.configScreen.style.display = 'flex';
            break;
        case 'countdown':
            elements.countdownDisplay.style.display = 'flex';
            break;
        case 'game':
            elements.gameScreen.style.display = 'block';
            // Focus the input field to trigger mobile keyboard
            setTimeout(focusMobileInput, 300);
            break;
        case 'gameOver':
            elements.gameOverScreen.style.display = 'flex';
            break;
        case 'instructions':
            elements.instructionsScreen.style.display = 'flex';
            break;
    }
}


// Display game stats at game over
export function displayGameStats(score, keystrokes, difficulty, timeLimit, timeRemaining) {
    // Calculate game duration (in minutes) for KPM
    const gameDuration = timeLimit === 'infinite' ? 
        1 : // Default to 1 for calculation if infinite
        (timeLimit - timeRemaining) / 60;
        
    // Update stats
    const kpm = keystrokes > 0 ? 
        Math.round((keystrokes / Math.max(0.01, gameDuration)) * 10) / 10 : 
        0;
    
    elements.finalScore.textContent = Math.round(score * 10) / 10;
    elements.totalKeystrokes.textContent = keystrokes;
    elements.keystrokesPerMinute.textContent = isFinite(kpm) ? kpm : 0;
    elements.finalDifficulty.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    elements.finalTime.textContent = timeLimit === 'infinite' ? 'Infinite' : `${timeLimit}s`;
}

export function focusMobileInput() {
    const mobileInput = document.getElementById('mobile-input');
    if (mobileInput && isMobileDevice()) {
        // iOS requires user interaction before focusing inputs
        // Set a small delay to ensure iOS recognizes the focus
        setTimeout(() => {
            mobileInput.style.opacity = '0.01'; // Make slightly visible to iOS
            mobileInput.style.position = 'absolute';
            mobileInput.style.left = '0';
            mobileInput.style.top = '0';
            mobileInput.style.width = '100%';
            mobileInput.style.height = '40px';
            mobileInput.style.zIndex = '100';
            mobileInput.blur();  // First blur to reset any existing focus
            mobileInput.focus(); // Then focus
        }, 300);
    }
}

export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};