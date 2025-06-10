//  Card types
export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades'
}

export enum Rank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K'
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

// Create a 40-card deck (standard deck minus 8s, 9s, and 10s)
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  
  const suits = Object.values(Suit);
  const ranks = Object.values(Rank);
  
  for (const suit of suits) {
    for (const rank of ranks) {
      let value: number;
      
      // Assign card values
      switch (rank) {
        case Rank.ACE:
          value = 1;
          break;
        case Rank.JACK:
        case Rank.QUEEN:
        case Rank.KING:
          value = 10;
          break;
        default:
          value = parseInt(rank);
      }
      
      deck.push({ suit, rank, value });
    }
  }
  
  return deck;
};

// Shuffle a deck using Fisher-Yates algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Deal cards to players
export const dealCards = (deck: Card[], numPlayers: number, cardsPerPlayer: number = 5) => {
  const playerHands: Card[][] = Array(numPlayers).fill([]).map(() => []);
  const remainingDeck = [...deck];
  
  // Deal cards to each player
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (remainingDeck.length > 0) {
        const card = remainingDeck.shift()!;
        playerHands[j] = [...playerHands[j], card];
      }
    }
  }
  
  return { playerHands, remainingDeck };
};

// Get the color of a suit (red or black)
export const getSuitColor = (suit: Suit): string => {
  return (suit === Suit.HEARTS || suit === Suit.DIAMONDS) ? 'text-red-500' : 'text-white';
};

// Get the symbol for a suit
export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case Suit.HEARTS:
      return '♥';
    case Suit.DIAMONDS:
      return '♦';
    case Suit.CLUBS:
      return '♣';
    case Suit.SPADES:
      return '♠';
  }
};
 
