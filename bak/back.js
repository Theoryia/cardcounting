document.addEventListener('DOMContentLoaded', function() {
    // Get the start button
    const startButton = document.getElementById('startButton');
    
    // Game state variables
    let countingSystem = 'hilo';
    let difficulty = 'medium';
    let numberOfDecks = 1;
    let runningCount = 0;
    let actualCount = 0;
    let isTransitioning = false;
    let currentDeck = [];
    let userSelectedCount = null;
    
    // Add click event listener
    startButton.addEventListener('click', showGameOptions);
    
    function showGameOptions() {
        // Clear the screen
        document.body.innerHTML = '';
        
        // Create a container for options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        // Create counting system selector
        const systemContainer = document.createElement('div');
        systemContainer.className = 'option-section';
        
        const systemLabel = document.createElement('h2');
        systemLabel.textContent = 'Select Counting System';
        systemContainer.appendChild(systemLabel);
        
        const systemSelect = document.createElement('select');
        systemSelect.id = 'countingSystem';
        
        const systems = [
            { value: 'hilo', name: 'Hi-Lo (2-6: +1, 7-9: 0, 10-A: -1)' },
            { value: 'ko', name: 'KO / Knock Out (2-7: +1, 8-9: 0, 10-A: -1)' },
            { value: 'omega2', name: 'Omega II (2,3,7: +1, 4-6: +2, 9: -1, 10-K: -2, A,8: 0)' }
        ];
        
        systems.forEach(system => {
            const option = document.createElement('option');
            option.value = system.value;
            option.textContent = system.name;
            systemSelect.appendChild(option);
        });
        
        systemSelect.addEventListener('change', function() {
            countingSystem = this.value;
        });
        
        systemContainer.appendChild(systemSelect);
        optionsContainer.appendChild(systemContainer);
        
        // Create deck selector
        const deckContainer = document.createElement('div');
        deckContainer.className = 'option-section';
        
        const deckLabel = document.createElement('h2');
        deckLabel.textContent = 'Number of Decks';
        deckContainer.appendChild(deckLabel);
        
        const deckSelect = document.createElement('select');
        deckSelect.id = 'deckCount';
        
        [1, 2, 4, 6, 8].forEach(count => {
            const option = document.createElement('option');
            option.value = count;
            option.textContent = count + (count === 1 ? ' deck' : ' decks');
            deckSelect.appendChild(option);
        });
        
        deckSelect.addEventListener('change', function() {
            numberOfDecks = parseInt(this.value);
        });
        
        deckContainer.appendChild(deckSelect);
        optionsContainer.appendChild(deckContainer);
        
        // Create difficulty selector
        const difficultyContainer = document.createElement('div');
        difficultyContainer.className = 'option-section';
        
        const difficultyLabel = document.createElement('h2');
        difficultyLabel.textContent = 'Select Difficulty';
        difficultyContainer.appendChild(difficultyLabel);
        
        const difficultyButtons = document.createElement('div');
        difficultyButtons.className = 'difficulty-buttons';
        
        const difficulties = [
            { value: 'easy', name: 'Easy' },
            { value: 'medium', name: 'Medium' },
            { value: 'hard', name: 'Hard' }
        ];
        
        difficulties.forEach(diff => {
            const button = document.createElement('button');
            button.textContent = diff.name;
            button.classList.add('difficulty-button');
            if (diff.value === difficulty) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', function() {
                document.querySelectorAll('.difficulty-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
                difficulty = diff.value;
            });
            
            difficultyButtons.appendChild(button);
        });
        
        difficultyContainer.appendChild(difficultyButtons);
        optionsContainer.appendChild(difficultyContainer);
        
        // Start game button
        const startGameButton = document.createElement('button');
        startGameButton.textContent = 'Start Counting';
        startGameButton.className = 'start-game-btn';
        startGameButton.addEventListener('click', startGame);
        
        optionsContainer.appendChild(startGameButton);
        
        // Add the container to the body
        document.body.appendChild(optionsContainer);
    }
    
    function startGame() {
        // Clear the screen
        document.body.innerHTML = '';
        
        // Reset counts
        runningCount = 0;
        actualCount = 0;
        
        // Initialize the deck
        initializeDeck();
        
        // Create a container for the game elements
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        gameContainer.id = 'gameContainer';
        
        // Create top info bar
        const infoBar = document.createElement('div');
        infoBar.className = 'info-bar';
        
        // Actual count display (left)
        const actualCountDisplay = document.createElement('div');
        actualCountDisplay.className = 'actual-count-display';
        actualCountDisplay.textContent = `Actual Count: ${actualCount}`;
        actualCountDisplay.id = 'actualCountDisplay';
        infoBar.appendChild(actualCountDisplay);
        
        // Running count display (center)
        const runningCountDisplay = document.createElement('div');
        runningCountDisplay.className = 'running-count-display';
        runningCountDisplay.textContent = `Your Count: ${runningCount}`;
        runningCountDisplay.id = 'runningCountDisplay';
        infoBar.appendChild(runningCountDisplay);
        
        // Cards remaining display (right)
        const cardsRemainingDisplay = document.createElement('div');
        cardsRemainingDisplay.className = 'cards-remaining-display';
        cardsRemainingDisplay.textContent = `Cards Left: ${currentDeck.length}`;
        cardsRemainingDisplay.id = 'cardsRemainingDisplay';
        infoBar.appendChild(cardsRemainingDisplay);
        
        document.body.appendChild(infoBar);
        
        // Create card area
        const cardArea = document.createElement('div');
        cardArea.className = 'card-area';
        gameContainer.appendChild(cardArea);
        
        // Create counting buttons
        const countButtonsContainer = document.createElement('div');
        countButtonsContainer.className = 'count-buttons-container';
        
        const countValues = [-2, -1, 0, 1, 2];
        countValues.forEach(value => {
            const button = document.createElement('button');
            button.className = 'count-button';
            button.textContent = value > 0 ? '+' + value : value;
            button.dataset.value = value;
            
            button.addEventListener('click', function() {
                if (userSelectedCount === null) {
                    // Update running count
                    runningCount += parseInt(this.dataset.value);
                    document.getElementById('runningCountDisplay').textContent = `Your Count: ${runningCount}`;
                    
                    // Highlight the selected button
                    this.classList.add('selected');
                    userSelectedCount = parseInt(this.dataset.value);
                    
                    // Disable all count buttons
                    document.querySelectorAll('.count-button').forEach(btn => {
                        if (btn !== this) {
                            btn.classList.add('disabled');
                        }
                    });
                    
                    // Immediately proceed to next card after button press
                    const currentCard = document.querySelector('.card');
                    if (currentCard) {
                        currentCard.classList.add('card-exit');
                        
                        setTimeout(() => {
                            cardArea.innerHTML = '';
                            userSelectedCount = null;
                            // Reset button states
                            document.querySelectorAll('.count-button').forEach(btn => {
                                btn.classList.remove('selected', 'disabled');
                            });
                            showNextCard(cardArea);
                        }, 200); // Faster exit animation
                    }
                }
            });
            
            countButtonsContainer.appendChild(button);
        });
        
        gameContainer.appendChild(countButtonsContainer);
        
        document.body.appendChild(gameContainer);
        
        // Show the first card
        showNextCard(cardArea);
    }
    
    function initializeDeck() {
        currentDeck = [];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = ['♠', '♥', '♦', '♣'];
        
        // Create decks
        for (let d = 0; d < numberOfDecks; d++) {
            for (let s = 0; s < suits.length; s++) {
                for (let v = 0; v < values.length; v++) {
                    currentDeck.push({
                        value: values[v],
                        suit: suits[s],
                        color: (suits[s] === '♥' || suits[s] === '♦') ? 'red' : 'black'
                    });
                }
            }
        }
        
        // Shuffle deck
        shuffleDeck(currentDeck);
    }
    
    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    function showNextCard(container) {
        // Check if there are cards left
        if (currentDeck.length === 0) {
            // Game over
            container.innerHTML = `<div class="game-over">All cards played!</div>`;
            return;
        }
        
        // Draw a card from the deck
        const drawnCard = currentDeck.pop();
        
        // Update the card counter
        document.getElementById('cardsRemainingDisplay').textContent = `Cards Left: ${currentDeck.length}`;
        
        // Update actual count
        updateActualCount(drawnCard.value);
        
        // Create card element
        const card = createCardElement(drawnCard);
        
        // Add entrance animation
        card.classList.add('card-entrance');
        
        // Add the card to the container
        container.appendChild(card);
        
        // Auto-flip the card after a short delay
        setTimeout(() => {
            card.classList.add('flipped');
        }, 300);
    }
    
    function createCardElement(cardData) {
        // Create the main card container
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = cardData.value;
        
        // Create card inner container (for flip effect)
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        // Create card front (back of card, pattern)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        
        // Create card back (face with value and suit)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        // Create card content for the face side
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.style.color = cardData.color;
        
        // Add value and suit to card
        const valueElement = document.createElement('div');
        valueElement.className = 'card-value';
        valueElement.textContent = cardData.value;
        
        const suitElement = document.createElement('div');
        suitElement.className = 'card-suit';
        suitElement.textContent = cardData.suit;
        
        // Assemble card
        cardContent.appendChild(valueElement);
        cardContent.appendChild(suitElement);
        cardBack.appendChild(cardContent);
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        return card;
    }
    
    function updateActualCount(cardValue) {
        let countChange = 0;
        
        // Calculate count change based on selected system
        if (countingSystem === 'hilo') {
            if (['2','3','4','5','6'].includes(cardValue)) countChange = 1;
            else if (['10','J','Q','K','A'].includes(cardValue)) countChange = -1;
        } 
        else if (countingSystem === 'ko') {
            if (['2','3','4','5','6','7'].includes(cardValue)) countChange = 1;
            else if (['10','J','Q','K','A'].includes(cardValue)) countChange = -1;
        } 
        else if (countingSystem === 'omega2') {
            if (['2','3','7'].includes(cardValue)) countChange = 1;
            else if (['4','5','6'].includes(cardValue)) countChange = 2;
            else if (cardValue === '9') countChange = -1;
            else if (['10','J','Q','K'].includes(cardValue)) countChange = -2;
        }
        
        actualCount += countChange;
        
        // Update the actual count display
        const actualCountDisplay = document.getElementById('actualCountDisplay');
        if (actualCountDisplay) {
            actualCountDisplay.textContent = `Actual Count: ${actualCount}`;
        }
    }
});