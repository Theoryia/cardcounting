export const Deck = {
    // Card values and suits
    values: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    suits: ['♠', '♥', '♦', '♣'],
    
    // Create a shuffled deck with the specified number of decks
    createShuffledDeck(numberOfDecks = 1) {
        let deck = [];
        
        // Create the deck(s)
        for (let d = 0; d < numberOfDecks; d++) {
            for (const suit of this.suits) {
                for (const value of this.values) {
                    deck.push({
                        value: value,
                        suit: suit,
                        color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                    });
                }
            }
        }
        
        // Shuffle the deck
        return this.shuffleDeck(deck);
    },
    
    // Fisher-Yates shuffle algorithm
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
};

export default Deck;