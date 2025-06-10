import  { Send, Layers, Award } from 'lucide-react';

interface GameControlsProps {
  isPlayerTurn: boolean;
  selectedCardIndices: number[];
  onDiscard: () => void;
  onDrop: () => void;
  onTonk: () => void;
}

const GameControls = ({ 
  isPlayerTurn, 
  selectedCardIndices, 
  onDiscard, 
  onDrop, 
  onTonk 
}: GameControlsProps) => {
  return (
    <div className="absolute left-0 right-0 -bottom-12 flex justify-center">
      <div className="bg-card rounded-lg shadow-lg p-3 flex space-x-3">
        <button
          className="btn btn-sm btn-primary"
          disabled={!isPlayerTurn || selectedCardIndices.length !== 1}
          onClick={onDiscard}
        >
          <Send size={16} className="mr-1" />
          Discard
        </button>
        
        <button
          className="btn btn-sm btn-primary"
          disabled={!isPlayerTurn || selectedCardIndices.length < 3}
          onClick={onDrop}
        >
          <Layers size={16} className="mr-1" />
          Drop Set
        </button>
        
        <button
          className="btn btn-sm btn-accent"
          disabled={!isPlayerTurn}
          onClick={onTonk}
        >
          <Award size={16} className="mr-1" />
          Tonk!
        </button>
      </div>
    </div>
  );
};

export default GameControls;
 