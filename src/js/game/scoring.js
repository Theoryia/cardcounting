import { Config } from './config.js';
import { GameState } from './state.js';

export const Scoring = {
    // Get the count value for a card based on the selected counting system
    getCardCountValue(cardValue) {
        // Make sure we have a valid counting system
        const countingSystem = GameState.countingSystem || 'hilo';
        
        // Access the counting rules directly without trying to access '.values'
        const rules = Config.countingRules[countingSystem];
        
        if (!rules) {
            console.error(`No counting rules found for system: ${countingSystem}`);
            return 0;
        }
        
        // Return the value for the card or 0 if not found
        return rules[cardValue] || 0;
    },
    
    // Process a card count
    processCardCount(cardInfo, userCountValue) {
        if (cardInfo.counted) {
            return;
        }
        
        // Mark as counted but DON'T remove
        cardInfo.counted = true;
        GameState.actualCount += cardInfo.countValue;
        
        // Mark the card visually as counted
        const card = document.getElementById(cardInfo.id);
        if (card) {
            card.classList.add('counted');
            
            // Add visual feedback on the card
            const isCorrect = userCountValue === cardInfo.countValue;
            card.classList.add(isCorrect ? 'correct-count-card' : 'incorrect-count-card');
        }
    },
    
    // Update the running count based on user input
    updateRunningCount(value) {
        GameState.runningCount += value;
        const runningCountDisplay = document.getElementById('runningCountDisplay');
        if (runningCountDisplay) {
            runningCountDisplay.textContent = `Your Count: ${GameState.runningCount}`;
        }
    },
    
    // Update the displayed actual count
    updateDisplayedCount() {
        GameState.displayedActualCount = GameState.actualCount;
        const actualCountDisplay = document.getElementById('actualCountDisplay');
        if (actualCountDisplay) {
            actualCountDisplay.textContent = `Actual Count: ${GameState.displayedActualCount}`;
        }
    },
    
    // Show feedback for correct/incorrect counting
    showCountFeedback(userValue, correctValue) {
        const isCorrect = userValue === correctValue;
        const actualCountDisplay = document.getElementById('actualCountDisplay');
        
        if (actualCountDisplay) {
            actualCountDisplay.classList.toggle('correct-count', isCorrect);
            actualCountDisplay.classList.toggle('incorrect-count', !isCorrect);
            
            // Reset after timeout
            setTimeout(() => {
                actualCountDisplay.classList.remove('correct-count', 'incorrect-count');
            }, 500);
        }
    }
};

export default Scoring;