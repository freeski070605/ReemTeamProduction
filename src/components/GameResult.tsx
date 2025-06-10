import  { Trophy, X, Repeat, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  name: string;
}

interface GameResultProps {
  winner: string | null;
  players: Player[];
  scores: {[playerId: string]: number};
  potAmount: number;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

const GameResult = ({ 
  winner, 
  players, 
  scores, 
  potAmount, 
  onPlayAgain, 
  onReturnToLobby 
}: GameResultProps) => {
  // Find the winner player object
  const winnerPlayer = players.find(p => p.id === winner);
  
  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-xl p-6 w-96">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Over</h2>
        
        {winner && (
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
              <Trophy size={32} className="text-accent" />
            </div>
            <p className="text-xl font-semibold">
              {winnerPlayer?.name || 'Unknown Player'} Wins!
            </p>
            <p className="text-lg text-accent">${potAmount}</p>
          </div>
        )}
        
        <div className="bg-primary/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 text-left">Final Scores:</h3>
          <div className="space-y-1">
            {players.map(player => (
              <div key={player.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  {player.id === winner && (
                    <span className="text-accent mr-2">•</span>
                  )}
                  <span>{player.name}</span>
                </div>
                <span className={player.id === winner ? 'text-accent font-semibold' : ''}>
                  {scores[player.id] || 0} pts
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onPlayAgain}
            className="btn btn-accent flex-1"
          >
            <Repeat size={18} className="mr-2" />
            Play Again
          </button>
          
          <button
            onClick={onReturnToLobby}
            className="btn btn-primary flex-1"
          >
            <ArrowLeft size={18} className="mr-2" />
            Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
 