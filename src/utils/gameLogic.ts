import  { Card } from './cards';

export enum PlayerAction {
  DRAW_DECK = 'draw_deck',
  DRAW_DISCARD = 'draw_discard',
  DISCARD = 'discard',
  DROP = 'drop',
  TONK = 'tonk',
  PASS = 'pass'
}

export interface GamePlayer {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  cards: Card[];
}

export interface GameState {
  tableId: string;
  status: 'waiting' | 'playing' | 'ended';
  players: GamePlayer[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  potAmount: number;
  winner?: string;
  scores?: {[playerId: string]: number};
}

// Check if a set of cards forms a valid set (same rank)
export const isValidSet = (cards: Card[]): boolean => {
  if (cards.length < 3) return false;
  
  // All cards must have the same rank
  const firstRank = cards[0].rank;
  return cards.every(card => card.rank === firstRank);
};

// Check if a set of cards forms a valid run (consecutive cards of same suit)
export const isValidRun = (cards: Card[]): boolean => {
  if (cards.length < 3) return false;
  
  // All cards must have the same suit
  const firstSuit = cards[0].suit;
  if (!cards.every(card => card.suit === firstSuit)) {
    return false;
  }
  
  // Sort by value
  const sortedCards = [...cards].sort((a, b) => a.value - b.value);
  
  // Check if values are consecutive
  for (let i = 1; i < sortedCards.length; i++) {
    if (sortedCards[i].value !== sortedCards[i-1].value + 1) {
      return false;
    }
  }
  
  return true;
};

// Calculate the total value of a hand
export const calculateHandValue = (cards: Card[]): number => {
  return cards.reduce((total, card) => total + card.value, 0);
};

// Check if a hand has a valid Tonk (hand value <= 50)
export const hasValidTonk = (cards: Card[]): boolean => {
  return calculateHandValue(cards) <= 50;
};
 