import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Clock, RefreshCw, Trash, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import Card from '../components/Card';
import ChatBox from '../components/ChatBox';
import GameControls from '../components/GameControls';
import PlayerHUD from '../components/PlayerHUD';
import GameResult from '../components/GameResult';
import { Card as CardType } from '../utils/cards';
import useGameState from '../hooks/useGameState';

const GameTable = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { user } = useAuth();
  const { gameState, error, joinTable, leaveTable } = useGame();
  const navigate = useNavigate();
  
  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);
  const [showChat, setShowChat] = useState(false);
  
  // Custom hook for game actions
  const gameActions = useGameState();
  
  // Join table on mount
  useEffect(() => {
    if (user && tableId) {
      joinTable(tableId);
    }
    
    // Cleanup - leave table on unmount
    return () => {
      if (tableId) {
        leaveTable();
      }
    };
  }, [user, tableId]);
  
  // Update player cards when game state changes
  useEffect(() => {
    if (gameState?.players) {
      // Find current player's cards
      const currentPlayer = gameState.players.find(p => p.id === user?.id);
      if (currentPlayer && currentPlayer.cards) {
        setPlayerCards(currentPlayer.cards);
      }
    }
  }, [gameState, user]);
  
  // Reset selected cards when player cards change
  useEffect(() => {
    setSelectedCardIndices([]);
  }, [playerCards]);
  
  const handleCardClick = (index: number) => {
    setSelectedCardIndices(prev => {
      // If already selected, unselect it
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      // Otherwise, add to selection
      return [...prev, index];
    });
  };
  
  const isPlayerTurn = () => {
    if (!gameState || gameState.status !== 'playing') return false;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    return currentPlayer.id === user?.id;
  };
  
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/lobby')}
          className="btn btn-primary"
        >
          Return to Lobby
        </button>
      </div>
    );
  }
  
  if (!gameState) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  return (
    <div className="relative h-screen overflow-hidden bg-table">
      {/* Table background with felt texture */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589993673499-a79cea71ab21?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover opacity-20"></div>
      
      {/* Game info bar */}
      <div className="absolute top-0 left-0 right-0 bg-primary/80 backdrop-blur-sm p-2 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            <span>{gameState.players.length} Players</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>Pot: ${gameState.potAmount}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => gameActions.startGame()}
            className="btn btn-sm btn-primary"
            disabled={gameState.status === 'playing'}
          >
            <RefreshCw size={14} className="mr-1" />
            New Game
          </button>
          
          <button 
            onClick={() => navigate('/lobby')}
            className="btn btn-sm btn-secondary"
          >
            <Trash size={14} className="mr-1" />
            Leave Table
          </button>
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className="btn btn-sm btn-accent relative"
          >
            <MessageCircle size={14} className="mr-1" />
            Chat
          </button>
        </div>
      </div>
      
      {/* Game area */}
      <div className="h-full pt-12 px-4 flex flex-col items-center justify-between">
        {/* Opponents */}
        <div className="w-full grid grid-cols-3 gap-4 pt-4">
          {gameState.players.map((player, index) => (
            player.id !== user?.id && (
              <PlayerHUD 
                key={player.id} 
                player={player}
                position={index}
                isActive={gameState.currentPlayerIndex === index}
              />
            )
          ))}
        </div>
        
        {/* Center area with deck and discard pile */}
        <div className="flex items-center justify-center space-x-16 my-8">
          {/* Deck */}
          <div className="text-center">
            <div 
              className="relative"
              onClick={() => isPlayerTurn() && gameActions.drawCard(false)}
            >
              <Card 
                faceDown
                className={`${isPlayerTurn() ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
              />
              <div className="absolute -bottom-6 w-full text-center text-sm">
                {gameState.deckCount} cards
              </div>
            </div>
          </div>
          
          {/* Discard Pile */}
          <div className="text-center">
            <div 
              className="relative"
              onClick={() => isPlayerTurn() && gameState.discardPile.length > 0 && gameActions.drawCard(true)}
            >
              {gameState.discardPile.length > 0 ? (
                <Card 
                  card={gameState.discardPile[0]} 
                  className={`${isPlayerTurn() ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                />
              ) : (
                <Card />
              )}
              <div className="absolute -bottom-6 w-full text-center text-sm">
                Discard
              </div>
            </div>
          </div>
        </div>
        
        {/* Player's hand */}
        <div className="mb-24 relative">
          {gameState.status === 'ended' ? (
            <GameResult 
              winner={gameState.winner}
              players={gameState.players}
              scores={gameState.scores}
              potAmount={gameState.potAmount}
              onPlayAgain={() => {
                gameActions.startGame();
              }}
              onReturnToLobby={() => navigate('/lobby')}
            />
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="flex justify-center space-x-2">
                  {playerCards.map((card, index) => (
                    <Card 
                      key={index} 
                      card={card}
                      className={`transform transition-all duration-200 hover:-translate-y-4 cursor-pointer ${
                        selectedCardIndices.includes(index) ? 'translate-y-4 ring-2 ring-accent' : ''
                      }`}
                      onClick={() => handleCardClick(index)}
                    />
                  ))}
                </div>
              </div>
              
              <GameControls 
                isPlayerTurn={isPlayerTurn()}
                selectedCardIndices={selectedCardIndices}
                onDiscard={() => {
                  if (selectedCardIndices.length === 1) {
                    gameActions.discardCard(selectedCardIndices[0]);
                    setSelectedCardIndices([]);
                  }
                }}
                onDrop={() => {
                  if (selectedCardIndices.length >= 3) {
                    gameActions.dropCards(selectedCardIndices);
                    setSelectedCardIndices([]);
                  }
                }}
                onTonk={() => {
                  gameActions.declareTonk();
                }}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Chat overlay */}
      {showChat && (
        <div className="absolute right-4 bottom-24 w-80 h-96 bg-card rounded-lg shadow-xl z-20">
          <div className="bg-primary px-4 py-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">Table Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              &times;
            </button>
          </div>
          <ChatBox tableId={tableId || ''} />
        </div>
      )}
    </div>
  );
};

export default GameTable;
 