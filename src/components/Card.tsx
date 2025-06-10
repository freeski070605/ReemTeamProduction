import  { Card as CardType, Suit, getSuitColor, getSuitSymbol } from '../utils/cards';

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Card = ({ card, faceDown = false, size = 'md', className = '', onClick }: CardProps) => {
  // Card dimensions based on size
  const dimensions = {
    sm: 'w-8 h-12',
    md: 'w-14 h-20',
    lg: 'w-20 h-28'
  };
  
  // If no card provided, show an empty card slot
  if (!card && !faceDown) {
    return (
      <div 
        className={`${dimensions[size]} rounded-lg border border-gray-600 bg-primary/20 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-600">&times;</span>
      </div>
    );
  }
  
  // Face down card
  if (faceDown) {
    return (
      <div 
        className={`${dimensions[size]} rounded-lg bg-secondary border border-gray-600 relative select-none ${className}`}
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-md border-2 border-gray-600 bg-primary"></div>
        </div>
      </div>
    );
  }
  
  // Face up card
  return (
    <div 
      className={`${dimensions[size]} rounded-lg bg-white relative select-none ${className}`}
      onClick={onClick}
    >
      <div className="absolute top-1 left-1 font-bold text-sm">
        <span className={getSuitColor(card.suit)}>{card.rank}</span>
      </div>
      <div className="absolute bottom-1 right-1 font-bold text-sm transform rotate-180">
        <span className={getSuitColor(card.suit)}>{card.rank}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </span>
      </div>
    </div>
  );
};

export default Card;
 