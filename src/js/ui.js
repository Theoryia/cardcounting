import Game from './main.js';
import { GameState } from './game/state.js';
import { Config } from './game/config.js';
import { CardManager } from './game/card.js';

export const UI = {
    // Show game options screen
    showGameOptions() {
        // Clear the screen
        document.body.innerHTML = '';
        
        // Create a container for options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Create counting system selector
        this.createCountingSystemSelector(optionsContainer);
        
        // Create deck selector
        this.createDeckSelector(optionsContainer);
        
        // Create difficulty selector
        this.createDifficultySelector(optionsContainer);
        
        // Start game button
        const startGameButton = document.createElement('button');
        startGameButton.textContent = 'Start Counting';
        startGameButton.className = 'start-game-btn';
        startGameButton.addEventListener('click', function() {
            Game.startGame();
        });
        
        optionsContainer.appendChild(startGameButton);
        document.body.appendChild(optionsContainer);
    },
    
    // Create counting system selector
    createCountingSystemSelector(container) {
        const systemContainer = document.createElement('div');
        systemContainer.className = 'option-section';
        systemContainer.id = 'counting-system-section'; // Add ID for scoping
        
        const systemLabel = document.createElement('h2');
        systemLabel.textContent = 'Counting System';
        systemContainer.appendChild(systemLabel);
        
        const systemButtons = document.createElement('div');
        systemButtons.className = 'option-buttons';
        
        // Use the countingSystems array
        Config.countingSystems.forEach(system => {
            const button = document.createElement('button');
            button.textContent = system.name;
            button.className = 'option-button system-button'; // Add specific class
            
            if (system.value === GameState.countingSystem) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', function() {
                // Only remove selected class from buttons in THIS option group
                document.querySelectorAll('#counting-system-section .option-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
                GameState.countingSystem = system.value;
            });
            
            systemButtons.appendChild(button);
        });
        
        systemContainer.appendChild(systemButtons);
        container.appendChild(systemContainer);
    },
    
    // Create deck selector
    createDeckSelector(container) {
        const deckContainer = document.createElement('div');
        deckContainer.className = 'option-section';
        deckContainer.id = 'deck-selector-section'; // Add ID for scoping
        
        const deckLabel = document.createElement('h2');
        deckLabel.textContent = 'Number of Decks';
        deckContainer.appendChild(deckLabel);
        
        const deckButtons = document.createElement('div');
        deckButtons.className = 'option-buttons';
        
        Config.deckCounts.forEach(count => {
            const button = document.createElement('button');
            button.textContent = count;
            button.className = 'option-button deck-button'; // Add specific class
            
            if (count === GameState.numberOfDecks) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', function() {
                // Only remove selected class from buttons in THIS option group
                document.querySelectorAll('#deck-selector-section .option-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
                GameState.numberOfDecks = count;
            });
            
            deckButtons.appendChild(button);
        });
        
        deckContainer.appendChild(deckButtons);
        container.appendChild(deckContainer);
    },
    
    // Create difficulty selector
    createDifficultySelector(container) {
        const difficultyContainer = document.createElement('div');
        difficultyContainer.className = 'option-section';
        difficultyContainer.id = 'difficulty-section'; // Add ID for scoping
        
        const difficultyLabel = document.createElement('h2');
        difficultyLabel.textContent = 'Difficulty';
        difficultyContainer.appendChild(difficultyLabel);
        
        const difficultyButtons = document.createElement('div');
        difficultyButtons.className = 'option-buttons';
        
        // Create a button for each difficulty option
        Config.difficulties.forEach(diff => {
            const button = document.createElement('button');
            button.textContent = diff.name;
            button.className = 'option-button difficulty-button'; // Add specific class
            
            if (diff.value === GameState.difficulty) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', function() {
                // Only remove selected class from buttons in THIS option group
                document.querySelectorAll('#difficulty-section .option-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                this.classList.add('selected');
                GameState.difficulty = diff.value;
            });
            
            difficultyButtons.appendChild(button);
        });
        
        difficultyContainer.appendChild(difficultyButtons);
        container.appendChild(difficultyContainer);
    },
    
    // Set up game UI
    setupGameUI() {
        // Clear the screen
        document.body.innerHTML = '';
        
        // Create top info bar
        this.createInfoBar();
        
        // Create a container for the game elements
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        gameContainer.id = 'gameContainer';
        
        // Create card area
        const cardArea = document.createElement('div');
        cardArea.className = 'card-area';
        cardArea.id = 'cardArea';
        cardArea.dataset.cards = GameState.cardsOnScreen;
        gameContainer.appendChild(cardArea);
        
        // Create counting buttons
        this.createCountButtons(gameContainer);
        
        document.body.appendChild(gameContainer);
    },
    
    // Create info bar
    createInfoBar() {
        const infoBar = document.createElement('div');
        infoBar.className = 'info-bar';
        
        // Actual count display (left)
        const actualCountDisplay = document.createElement('div');
        actualCountDisplay.className = 'actual-count-display';
        actualCountDisplay.textContent = `Actual Count: ${GameState.actualCount}`;
        actualCountDisplay.id = 'actualCountDisplay';
        infoBar.appendChild(actualCountDisplay);
        
        // Running count display (center)
        const runningCountDisplay = document.createElement('div');
        runningCountDisplay.className = 'running-count-display';
        runningCountDisplay.textContent = `Your Count: ${GameState.runningCount}`;
        runningCountDisplay.id = 'runningCountDisplay';
        infoBar.appendChild(runningCountDisplay);
        
        // Cards remaining display (right)
        const cardsRemainingDisplay = document.createElement('div');
        cardsRemainingDisplay.className = 'cards-remaining-display';
        cardsRemainingDisplay.textContent = `Cards Left: ${GameState.currentDeck.length}`;
        cardsRemainingDisplay.id = 'cardsRemainingDisplay';
        infoBar.appendChild(cardsRemainingDisplay);
        
        document.body.appendChild(infoBar);
    },
    
    // Create count buttons
    createCountButtons(container) {
        const countButtonsContainer = document.createElement('div');
        countButtonsContainer.className = 'count-buttons-container';
        
        Config.countValues.forEach(value => {
            const button = document.createElement('button');
            button.className = 'count-button';
            button.textContent = value > 0 ? '+' + value : value;
            button.dataset.value = value;
            
            button.addEventListener('click', function() {
                Game.handleCountButtonClick(this);
            });
            
            countButtonsContainer.appendChild(button);
        });
        
        container.appendChild(countButtonsContainer);
    },
    
    // Update info bar
    updateInfoBar() {
        document.getElementById('actualCountDisplay').textContent = `Actual Count: ${GameState.actualCount}`;
        document.getElementById('runningCountDisplay').textContent = `Your Count: ${GameState.runningCount}`;
        document.getElementById('cardsRemainingDisplay').textContent = `Cards Left: ${GameState.currentDeck.length}`;
    }
};

export default UI;