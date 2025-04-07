import { Config } from './config.js';

export const GameState = {
    // Game settings
    difficulty: Config.defaultDifficulty || 'medium',
    countingSystem: Config.defaultCountingSystem || 'hilo',
    numberOfDecks: Config.defaultNumberOfDecks || 1,
    
    // Game state
    runningCount: 0,
    actualCount: 0,
    displayedActualCount: 0,
    
    // Card management
    currentDeck: [],
    activeCards: [],
    cardSlots: [],
    
    // Control flags
    isTransitioning: false,
    processingCard: false,
    
    // Configuration derived from difficulty
    cardsOnScreen: 1,
    cardDuration: 0,
    autoAdvance: false,
    timerEnabled: false,
    
    // Reset the game state
    reset() {
        this.runningCount = 0;
        this.actualCount = 0;
        this.displayedActualCount = 0;
        this.activeCards = [];
        this.cardSlots = [];
        this.isTransitioning = false;
        this.processingCard = false;
        
        // Ensure counting system is valid
        if (!Config.countingRules || !Config.countingRules[this.countingSystem]) {
            console.warn(`Invalid counting system detected: ${this.countingSystem}. Using default.`);
            this.countingSystem = 'hilo';
        }
        
        // Apply difficulty settings
        this.applyDifficulty();
    },
    
    // Apply settings based on selected difficulty
    applyDifficulty() {
        // Ensure we have a valid difficulty
        if (!Config.difficultySettings || !Config.difficultySettings[this.difficulty]) {
            console.warn(`Invalid difficulty detected: ${this.difficulty}. Using medium.`);
            this.difficulty = 'medium';
        }
        
        const settings = Config.difficultySettings[this.difficulty];
        
        this.cardsOnScreen = settings.cardsOnScreen;
        this.cardDuration = settings.cardDuration;
        this.autoAdvance = settings.autoAdvance;
        this.timerEnabled = settings.timerEnabled;
        
        // Initialize card slots
        this.cardSlots = [];
        for (let i = 0; i < this.cardsOnScreen; i++) {
            this.cardSlots.push({
                occupied: false,
                cardInfo: null
            });
        }
    }
};

export default GameState;