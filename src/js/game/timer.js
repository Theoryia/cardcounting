import { GameState } from './state.js';
import { CardManager } from './card.js';

export const Timer = {
    // Create timer ring SVG element
    createTimerRing(card) {
        const timerRing = document.createElement('div');
        timerRing.className = 'timer-ring';
        
        const timerCircle = document.createElement('svg');
        timerCircle.setAttribute('viewBox', '0 0 100 100');
        timerCircle.classList.add('timer-circle');
        
        // Background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', '50');
        bgCircle.setAttribute('cy', '50');
        bgCircle.setAttribute('r', '45');
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke', '#333');
        bgCircle.setAttribute('stroke-width', '5');
        
        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', '50');
        progressCircle.setAttribute('cy', '50');
        progressCircle.setAttribute('r', '45');
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', '#4CAF50');
        progressCircle.setAttribute('stroke-width', '5');
        progressCircle.setAttribute('stroke-dasharray', '283');
        progressCircle.setAttribute('stroke-dashoffset', '0');
        progressCircle.classList.add('progress-ring');
        
        timerCircle.appendChild(bgCircle);
        timerCircle.appendChild(progressCircle);
        timerRing.appendChild(timerCircle);
        
        // Wrap card in timer ring
        timerRing.appendChild(card);
        
        return timerRing;
    },
    
    // Start card timer
    startCardTimer(cardInfo) {
        const startTime = Date.now();
        const duration = GameState.cardDuration;
        
        // Get progress circle
        const progressCircle = document.querySelector(`#${cardInfo.containerId} .progress-ring`);
        
        const updateTimer = () => {
            // Don't update if the card is no longer active
            if (!GameState.activeCards.includes(cardInfo)) {
                return;
            }
            
            const elapsedTime = Date.now() - startTime;
            const remainingPercent = Math.max(0, 1 - (elapsedTime / duration));
            
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = (283 * remainingPercent) + 'px';
            }
            
            if (elapsedTime < duration) {
                cardInfo.timer = requestAnimationFrame(updateTimer);
            } else {
                // Time's up - remove card
                CardManager.removeCard(cardInfo, true);
            }
        };
        
        cardInfo.timer = requestAnimationFrame(updateTimer);
    }
};

export default Timer;