import  { io, Socket } from 'socket.io-client';

// Socket.IO event types
export const EVENTS = {
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STARTED: 'game_started',
  GAME_STATE_UPDATED: 'game_state_updated',
  GAME_ENDED: 'game_ended',
  RECEIVE_MESSAGE: 'receive_message'
};

// Game state types
export interface GamePlayer {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  cardCount: number;
  cards?: any[]; // Player's own cards only
}

export interface GameState {
  tableId: string;
  status: 'waiting' | 'playing' | 'ended';
  players: GamePlayer[];
  currentPlayerIndex: number;
  deckCount: number;
  discardPile: any[];
  potAmount: number;
  winner?: string;
  scores?: {[playerId: string]: number};
}

class SocketService {
  private socket: Socket | null = null;
  private tableId: string | null = null;
  
  // Initialize socket connection
  public init(userId: string): void {
    if (this.socket) return;
    
    const SOCKET_URL = 'http://localhost:3001';
    
    this.socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket']
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });
    
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }
  
  // Join a table
  public joinTable(tableId: string, playerData: any): void {
    if (!this.socket) return;
    
    this.tableId = tableId;
    this.socket.emit('join_table', { tableId, playerData });
  }
  
  // Leave the current table
  public leaveTable(): void {
    if (!this.socket || !this.tableId) return;
    
    this.socket.emit('leave_table', { tableId: this.tableId });
    this.tableId = null;
  }
  
  // Start a game
  public startGame(): void {
    if (!this.socket || !this.tableId) return;
    
    this.socket.emit('start_game', { tableId: this.tableId });
  }
  
  // Send a player action
  public sendPlayerAction(action: string, data: any): void {
    if (!this.socket || !this.tableId) return;
    
    this.socket.emit('player_action', { tableId: this.tableId, action, data });
  }
  
  // Send a chat message
  public sendMessage(message: string): void {
    if (!this.socket || !this.tableId) return;
    
    this.socket.emit('send_message', { tableId: this.tableId, message });
  }
  
  // Listen for events
  public on(event: string, callback: Function): void {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
  }
  
  // Remove event listener
  public off(event: string): void {
    if (!this.socket) return;
    
    this.socket.off(event);
  }
  
  // Disconnect
  public disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.tableId = null;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
 