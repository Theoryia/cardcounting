import { GameState } from './state.js';
import { Scoring } from './scoring.js';
import { Timer } from './timer.js';

export const CardManager = {
    // Create a card in a specific slot
    createCardInSlot(slotIndex) {
        if (GameState.currentDeck.length === 0) {
            return;
        }
        
        const cardArea = document.getElementById('cardArea');
        if (!cardArea) {
            return;
        }
        
        // Draw a card
        const drawnCard = GameState.currentDeck.pop();
        
        // Update cards remaining display
        const cardsRemainingDisplay = document.getElementById('cardsRemainingDisplay');
        if (cardsRemainingDisplay) {
            cardsRemainingDisplay.textContent = `Cards Left: ${GameState.currentDeck.length}`;
        }
        
        // Create a card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.id = `card-container-${Date.now()}-${slotIndex}`;
        cardContainer.dataset.slotIndex = slotIndex;
        
        // Create the card element
        const card = this.createCardElement(drawnCard);
        card.id = `card-${Date.now()}-${slotIndex}`;
        card.classList.add('card-entrance');
        
        // Add timer if enabled
        if (GameState.timerEnabled) {
            const timerRing = Timer.createTimerRing(card);
            cardContainer.appendChild(timerRing);
        } else {
            cardContainer.appendChild(card);
        }
        
        // Add to card area
        cardArea.appendChild(cardContainer);
        
        // Create card info
        const cardInfo = {
            id: card.id,
            containerId: cardContainer.id,
            value: drawnCard.value,
            slotIndex: slotIndex,
            counted: false,
            countValue: Scoring.getCardCountValue(drawnCard.value),
            timer: null
        };
        
        // Occupy the slot
        GameState.cardSlots[slotIndex].occupied = true;
        GameState.cardSlots[slotIndex].cardInfo = cardInfo;
        
        // Add to active cards
        GameState.activeCards.push(cardInfo);
        
        // Flip after short delay
        setTimeout(() => {
            card.classList.add('flipped');
            
            // Start timer if auto advance
            if (GameState.autoAdvance && GameState.cardDuration > 0) {
                Timer.startCardTimer(cardInfo);
            }
        }, 300);
    },
    
    // Create a card element
    createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        // Apply color class based on suit
        const isRed = cardData.suit === '♥' || cardData.suit === '♦';
        cardBack.classList.add(isRed ? 'red' : 'black');
        
        // Create card content
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
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
    },
    
    // Remove a card
    removeCard(cardInfo, isAutomatic = false) {
        // Cancel any timer
        if (cardInfo.timer) {
            cancelAnimationFrame(cardInfo.timer);
            cardInfo.timer = null;
        }
        
        // If not counted yet, count as 0 on auto-removal
        if (!cardInfo.counted && isAutomatic) {
            Scoring.processCardCount(cardInfo, 0);
            
            // Update displays
            const runningCountDisplay = document.getElementById('runningCountDisplay');
            if (runningCountDisplay) {
                runningCountDisplay.textContent = `Your Count: ${GameState.runningCount}`;
            }
            
            GameState.displayedActualCount = GameState.actualCount;
            const actualCountDisplay = document.getElementById('actualCountDisplay');
            if (actualCountDisplay) {
                actualCountDisplay.textContent = `Actual Count: ${GameState.displayedActualCount}`;
            }
        }
        
        // Get elements
        const cardContainer = document.getElementById(cardInfo.containerId);
        const card = document.getElementById(cardInfo.id);
        
        if (card) {
            card.classList.add('card-exit');
        }
        
        // Free the slot
        const slotIndex = cardInfo.slotIndex;
        if (slotIndex >= 0 && slotIndex < GameState.cardSlots.length) {
            GameState.cardSlots[slotIndex].occupied = false;
            GameState.cardSlots[slotIndex].cardInfo = null;
        }
        
        // Remove after animation
        setTimeout(() => {
            if (cardContainer && cardContainer.parentNode) {
                cardContainer.parentNode.removeChild(cardContainer);
            }
            
            // Remove from active cards
            GameState.activeCards = GameState.activeCards.filter(c => c.id !== cardInfo.id);
            
            // Fill empty slots
            this.fillCardArea();
        }, 200);
    },
    
    // Fill card area with cards
    fillCardArea() {
        // Don't proceed if processing
        if (GameState.processingCard) {
            return;
        }
        
        const cardArea = document.getElementById('cardArea');
        if (!cardArea) {
            console.error('Card area not found');
            return;
        }
        
        // Fill empty slots
        for (let i = 0; i < GameState.cardSlots.length; i++) {
            if (!GameState.cardSlots[i].occupied && GameState.currentDeck.length > 0) {
                this.createCardInSlot(i);
            }
        }
        
        // Check if game is over
        if (GameState.currentDeck.length === 0 && GameState.activeCards.length === 0) {
            cardArea.innerHTML = `<div class="game-over">All cards played!</div>`;
        }
    }
};

export default CardManager;