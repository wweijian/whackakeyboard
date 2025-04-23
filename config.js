// Game configuration constants and settings

export const validChars = "abcdefghijklmnopqrstuvwxyz0123456789-=[];',.";
export const MAX_SCORE = Number.MAX_SAFE_INTEGER;

// Get time per difficulty (in milliseconds)
export function getTimeForDifficulty(difficulty) {
    switch(difficulty) {
        case 'zen': return Infinity;
        case 'easy': return 5000; 
        case 'medium': return 2000;
        case 'difficult': return 1000;
        case 'hell': return 500;
        default: return 5000;
    }
}

// Default game settings
export const defaultSettings = {
    difficulty: 'zen',
    timeLimit: 60
};