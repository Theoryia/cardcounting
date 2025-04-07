import { GameState } from './game/state.js';
import { Config } from './game/config.js';
import { Deck } from './game/deck.js';
import { CardManager } from './game/card.js';
import { Scoring } from './game/scoring.js';
import UI from './ui.js';

// Main game object that connects all components
export const Game = {
    // Initialize difficulty settings
    initializeDifficulty() {
        GameState.applyDifficulty();
    },
    
    // Start the game
    startGame() {
        // Reset game state
        GameState.reset();
        
        // Initialize the deck
        this.initializeDeck();
        
        // Setup game UI
        UI.setupGameUI();
        
        // Show initial cards
        this.fillCardArea();
    },
    
    // Initialize the deck
    initializeDeck() {
        GameState.currentDeck = Deck.createShuffledDeck(GameState.numberOfDecks);
    },
    
    // Fill the card area
    fillCardArea() {
        CardManager.fillCardArea();
    },
    
    // Handle count button clicks
    handleCountButtonClick(button) {
        if (GameState.activeCards.length === 0) {
            return;
        }
        
        // Find the first non-counted card
        const cardInfo = GameState.activeCards.find(c => !c.counted);
        if (!cardInfo) {
            return;
        }
        
        const userCountValue = parseInt(button.dataset.value);
        
        // Process the count
        Scoring.processCardCount(cardInfo, userCountValue);
        
        // Update running count
        Scoring.updateRunningCount(userCountValue);
        
        // Update displayed count
        Scoring.updateDisplayedCount();
        
        // Show feedback
        Scoring.showCountFeedback(userCountValue, cardInfo.countValue);
        
        // Highlight button
        button.classList.add('selected');
        
        // Reset button after a moment
        setTimeout(() => {
            button.classList.remove('selected');
        }, 500);
        
        // In easy mode, remove card after counting
        if (!GameState.autoAdvance && GameState.difficulty === 'easy') {
            setTimeout(() => {
                CardManager.removeCard(cardInfo, false);
            }, 500);
        }
    },
    
    // Getters and setters to access GameState
    get countingSystem() { return GameState.countingSystem; },
    set countingSystem(value) { GameState.countingSystem = value; },
    
    get difficulty() { return GameState.difficulty; },
    set difficulty(value) { GameState.difficulty = value; },
    
    get numberOfDecks() { return GameState.numberOfDecks; },
    set numberOfDecks(value) { GameState.numberOfDecks = value; },
    
    get cardsOnScreen() { return GameState.cardsOnScreen; },
    get cardDuration() { return GameState.cardDuration; },
    get autoAdvance() { return GameState.autoAdvance; },
    get timerEnabled() { return GameState.timerEnabled; },
    
    get runningCount() { return GameState.runningCount; },
    get actualCount() { return GameState.actualCount; },
    get displayedActualCount() { return GameState.displayedActualCount; },
    
    get currentDeck() { return GameState.currentDeck; },
    get activeCards() { return GameState.activeCards; }
};

export default Game;