import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import socketService, { EVENTS, GameState } from '../services/socket';
import { useAuth } from './AuthContext';

interface GameContextType {
  gameState: GameState | null;
  isConnected: boolean;
  isJoiningTable: boolean;
  isStartingGame: boolean;
  chatMessages: ChatMessage[];
  error: string | null;
  joinTable: (tableId: string) => void;
  leaveTable: () => void;
  startGame: () => void;
  performAction: (action: string, data: any) => void;
  sendChatMessage: (message: string) => void;
}

interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isJoiningTable, setIsJoiningTable] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (user) {
      socketService.init(user.id);
      setIsConnected(true);
      
      // Set up event listeners
      socketService.on('connect', () => {
        setIsConnected(true);
        setError(null);
      });
      
      socketService.on('connect_error', (err) => {
        setIsConnected(false);
        setError('Connection error: ' + err.message);
      });
      
      socketService.on('disconnect', () => {
        setIsConnected(false);
      });
      
      // Game state updates
      socketService.on(EVENTS.GAME_STATE_UPDATED, (data: GameState) => {
        setGameState(data);
      });
      
      // Chat messages
      socketService.on(EVENTS.RECEIVE_MESSAGE, (data: ChatMessage) => {
        setChatMessages(prev => [...prev, data]);
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (isConnected) {
        socketService.off(EVENTS.GAME_STATE_UPDATED);
        socketService.off(EVENTS.RECEIVE_MESSAGE);
        socketService.disconnect();
        setIsConnected(false);
      }
    };
  }, [user]);

  // Join a table
  const joinTable = (tableId: string) => {
    if (!user) return;
    
    setIsJoiningTable(true);
    setError(null);
    
    try {
      socketService.joinTable(tableId, {
        id: user.id,
        name: user.name,
        avatar: user.avatar || ''
      });
      
      // Clear any previous chat messages
      setChatMessages([]);
    } catch (err) {
      setError('Failed to join table');
      console.error(err);
    } finally {
      setIsJoiningTable(false);
    }
  };

  // Leave the current table
  const leaveTable = () => {
    try {
      socketService.leaveTable();
      setGameState(null);
      setChatMessages([]);
    } catch (err) {
      console.error('Error leaving table:', err);
    }
  };

  // Start a game
  const startGame = () => {
    setIsStartingGame(true);
    setError(null);
    
    try {
      socketService.startGame();
    } catch (err) {
      setError('Failed to start game');
      console.error(err);
    } finally {
      setIsStartingGame(false);
    }
  };

  // Perform a game action
  const performAction = (action: string, data: any) => {
    try {
      socketService.sendPlayerAction(action, data);
    } catch (err) {
      setError('Failed to perform action');
      console.error(err);
    }
  };

  // Send a chat message
  const sendChatMessage = (message: string) => {
    if (!user) return;
    
    try {
      socketService.sendMessage(message);
      
      // Add message to local state immediately for UI
      const newMessage: ChatMessage = {
        playerId: user.id,
        playerName: user.name,
        message,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const value = {
    gameState,
    isConnected,
    isJoiningTable,
    isStartingGame,
    chatMessages,
    error,
    joinTable,
    leaveTable,
    startGame,
    performAction,
    sendChatMessage
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
 