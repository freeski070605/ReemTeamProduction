import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table as TableIcon, Plus, DollarSign, RefreshCw, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tableService } from '../services/api';

interface Table {
  id: string;
  name: string;
  stakeAmount: number;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'active' | 'full';
}

const Lobby = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableStake, setNewTableStake] = useState<number>(5);
  const [stakeFilter, setStakeFilter] = useState<number | null>(null);
  
  // Fetch tables on mount and periodically
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const data = await tableService.getAllTables();
        setTables(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tables');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchTables();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchTables, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTableName || newTableStake <= 0) {
      setError('Please provide a valid name and stake amount');
      return;
    }
    
    try {
      const newTable = await tableService.createTable({
        name: newTableName,
        stakeAmount: newTableStake,
        maxPlayers: 4
      });
      
      setTables(prev => [newTable, ...prev]);
      setIsCreatingTable(false);
      setNewTableName('');
      setNewTableStake(5);
    } catch (err) {
      setError('Failed to create table');
      console.error(err);
    }
  };
  
  const handleJoinTable = async (tableId: string) => {
    try {
      await tableService.joinTable(tableId);
      navigate(`/game/${tableId}`);
    } catch (err) {
      setError('Failed to join table');
      console.error(err);
    }
  };
  
  const refreshTables = async () => {
    try {
      setIsLoading(true);
      const data = await tableService.getAllTables();
      setTables(data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh tables');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter tables by stake amount
  const filteredTables = stakeFilter 
    ? tables.filter(table => table.stakeAmount === stakeFilter)
    : tables;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Game Lobby</h1>
          <p className="text-gray-400">
            Join an existing table or create your own to start playing.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setIsCreatingTable(true)}
            className="btn btn-accent"
          >
            <Plus size={18} className="mr-2" />
            Create Table
          </button>
          
          <button
            onClick={refreshTables}
            className="btn btn-primary"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Create table form */}
      {isCreatingTable && (
        <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Table</h2>
          
          <form onSubmit={handleCreateTable} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Table Name</label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="bg-primary w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                placeholder="My Tonk Table"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Stake Amount ($)</label>
              <select
                value={newTableStake}
                onChange={(e) => setNewTableStake(parseInt(e.target.value))}
                className="bg-primary w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                required
              >
                <option value={1}>$1</option>
                <option value={5}>$5</option>
                <option value={10}>$10</option>
                <option value={20}>$20</option>
                <option value={50}>$50</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-accent flex-1"
              >
                Create Table
              </button>
              
              <button
                type="button"
                onClick={() => setIsCreatingTable(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Filter controls */}
      <div className="bg-secondary rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStakeFilter(null)}
            className={`px-4 py-2 rounded-md ${stakeFilter === null ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            All Stakes
          </button>
          
          <button
            onClick={() => setStakeFilter(1)}
            className={`px-4 py-2 rounded-md ${stakeFilter === 1 ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            $1
          </button>
          
          <button
            onClick={() => setStakeFilter(5)}
            className={`px-4 py-2 rounded-md ${stakeFilter === 5 ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            $5
          </button>
          
          <button
            onClick={() => setStakeFilter(10)}
            className={`px-4 py-2 rounded-md ${stakeFilter === 10 ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            $10
          </button>
          
          <button
            onClick={() => setStakeFilter(20)}
            className={`px-4 py-2 rounded-md ${stakeFilter === 20 ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            $20
          </button>
          
          <button
            onClick={() => setStakeFilter(50)}
            className={`px-4 py-2 rounded-md ${stakeFilter === 50 ? 'bg-accent text-primary' : 'bg-primary hover:bg-primary-light'}`}
          >
            $50
          </button>
        </div>
      </div>
      
      {/* Tables list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map(table => (
            <div key={table.id} className="bg-card rounded-xl shadow-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{table.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    table.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    table.status === 'full' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {table.status === 'active' ? 'Active' :
                     table.status === 'full' ? 'Full' : 'Waiting'}
                  </span>
                </div>
                
                <div className="flex space-x-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    ${table.stakeAmount}
                  </div>
                  
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {table.playerCount}/{table.maxPlayers}
                  </div>
                </div>
                
                <button
                  onClick={() => handleJoinTable(table.id)}
                  className="btn btn-accent w-full"
                  disabled={table.status === 'full' || (user?.chips || 0) < table.stakeAmount}
                >
                  {(user?.chips || 0) < table.stakeAmount ? 
                    'Insufficient Chips' :
                    table.status === 'full' ? 
                    'Table Full' : 
                    'Join Table'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-lg p-8 text-center">
          <TableIcon size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Tables Found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or create a new table.</p>
          <button
            onClick={() => setIsCreatingTable(true)}
            className="btn btn-accent"
          >
            Create Table
          </button>
        </div>
      )}
    </div>
  );
};

export default Lobby;
 