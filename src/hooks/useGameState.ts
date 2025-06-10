import  { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PlayerAction } from '../utils/gameLogic';

interface GameActions {
  startGame: () => void;
  drawCard: (fromDiscard: boolean) => void;
  discardCard: (cardIndex: number) => void;
  declareTonk: () => void;
  dropCards: (cardIndices: number[]) => void;
  handleNextTurn: () => void;
}

const useGameState = (): GameActions => {
  const { tableId } = useParams<{ tableId: string }>();
  const { performAction, startGame: initGame } = useGame();
  
  // Start a new game
  const startGame = useCallback(() => {
    if (tableId) {
      initGame();
    }
  }, [tableId, initGame]);
  
  // Draw a card from deck or discard pile
  const drawCard = useCallback((fromDiscard: boolean) => {
    const action = fromDiscard ? PlayerAction.DRAW_DISCARD : PlayerAction.DRAW_DECK;
    performAction(action, {});
  }, [performAction]);
  
  // Discard a card from hand
  const discardCard = useCallback((cardIndex: number) => {
    performAction(PlayerAction.DISCARD, { cardIndex });
  }, [performAction]);
  
  // Declare Tonk
  const declareTonk = useCallback(() => {
    performAction(PlayerAction.TONK, {});
  }, [performAction]);
  
  // Drop cards as a set or run
  const dropCards = useCallback((cardIndices: number[]) => {
    performAction(PlayerAction.DROP, { cardIndices });
  }, [performAction]);
  
  // Pass turn (not typically used in Tonk but included for completeness)
  const handleNextTurn = useCallback(() => {
    performAction(PlayerAction.PASS, {});
  }, [performAction]);
  
  return {
    startGame,
    drawCard,
    discardCard,
    declareTonk,
    dropCards,
    handleNextTurn
  };
};

export default useGameState;
 