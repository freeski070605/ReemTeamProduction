import  { User } from 'lucide-react';
import Card from './Card';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  cardCount: number;
}

interface PlayerHUDProps {
  player: Player;
  position: number;
  isActive: boolean;
}

const PlayerHUD = ({ player, position, isActive }: PlayerHUDProps) => {
  const getPositionClasses = () => {
    // Different positions based on player index
    switch (position % 3) {
      case 0:
        return 'justify-start';
      case 1:
        return 'justify-center';
      case 2:
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };
  
  const getCardContainerClasses = () => {
    // Different card layouts based on position
    switch (position % 3) {
      case 0:
        return 'flex -space-x-3 ml-4';
      case 1:
        return 'flex -space-x-3';
      case 2:
        return 'flex -space-x-3 mr-4';
      default:
        return 'flex -space-x-3';
    }
  };
  
  return (
    <div className={`flex ${getPositionClasses()} p-3 bg-card/90 rounded-xl shadow-lg relative`}>
      {/* Player Info */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full" />
          ) : (
            <User size={20} />
          )}
        </div>
        
        {/* Name */}
        <div className="flex flex-col">
          <span className="font-medium">{player.name}</span>
          <span className="text-xs text-gray-400">{player.cardCount} cards</span>
        </div>
      </div>
      
      {/* Cards */}
      <div className={getCardContainerClasses()}>
        {Array.from({ length: Math.min(player.cardCount, 5) }).map((_, i) => (
          <Card key={i} faceDown size="sm" />
        ))}
      </div>
      
      {/* Active player indicator */}
      {isActive && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-primary animate-pulse"></div>
      )}
    </div>
  );
};

export default PlayerHUD;
 