export const Config = {
    defaultDifficulty: 'medium',
    defaultCountingSystem: 'hilo',
    defaultNumberOfDecks: 1,
    
    countValues: [-2, -1, 0, 1, 2],

    deckCounts: [1, 2, 4, 6, 8],

    difficulties: [
        { name: 'Easy', value: 'easy' },
        { name: 'Medium', value: 'medium' },
        { name: 'Hard', value: 'hard' },
        { name: 'Expert', value: 'expert' }
    ],
    
    countingSystems: [
        { name: 'Hi-Lo', value: 'hilo' },
        { name: 'K-O', value: 'ko' },
        { name: 'Omega II', value: 'omega2' }
    ],
    
    countingRules: {
        hilo: {
            '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
            '7': 0, '8': 0, '9': 0,
            '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
        },
        ko: {
            '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1,
            '8': 0, '9': 0,
            '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
        },
        omega2: {
            '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1,
            '8': 0, '9': -1,
            '10': -2, 'J': -2, 'Q': -2, 'K': -2, 'A': 0
        }
    },
    
    // Difficulty settings
    difficultySettings: {
        easy: {
            cardsOnScreen: 1,
            cardDuration: 0, 
            autoAdvance: false,
            timerEnabled: false
        },
        medium: {
            cardsOnScreen: 1,
            cardDuration: 4000, 
            autoAdvance: true,
            timerEnabled: true
        },
        hard: {
            cardsOnScreen: 2,
            cardDuration: 4000,
            autoAdvance: true,
            timerEnabled: true
        },
        expert: {
            cardsOnScreen: 5,
            cardDuration: 5000,
            autoAdvance: true,
            timerEnabled: true
        }
    }
};