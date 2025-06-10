import  { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, History, LogOut, Save, AlertCircle } from 'lucide-react';
import { transactionService, gameHistoryService } from '../services/api';
import paymentService from '../services/payment';

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdrawal' | 'game-win' | 'game-loss';
  amount: number;
  status: string;
  createdAt: string;
}

interface GameRecord {
  _id: string;
  potAmount: number;
  winner: string;
  players: {
    userId: string;
    name: string;
    score: number;
  }[];
  startTime: string;
  endTime: string;
}

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [cashAppId, setCashAppId] = useState(user?.cashAppId || '');
  const [depositAmount, setDepositAmount] = useState(10);
  const [withdrawAmount, setWithdrawAmount] = useState(10);
  
  // Fetch transactions when tab changes
  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'history') {
      fetchGameHistory();
    }
  }, [activeTab]);
  
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchGameHistory = async () => {
    try {
      setIsLoading(true);
      const data = await gameHistoryService.getGameHistory();
      setGameHistory(data);
    } catch (err) {
      setError('Failed to load game history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      await updateUser({ name, cashAppId });
      
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await paymentService.processDeposit(depositAmount);
      
      if (result.success) {
        setSuccess(`Successfully deposited $${depositAmount}`);
        // Refresh user data to show updated balance
        const response = await transactionService.deposit(depositAmount, 'cashapp');
        updateUser({ chips: response.newBalance });
        
        // Refresh transactions list
        fetchTransactions();
      } else {
        setError(result.error || 'Deposit failed');
      }
    } catch (err) {
      setError('Failed to process deposit');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!cashAppId) {
      setError('Please enter your CashApp ID');
      return;
    }
    
    if ((user?.chips || 0) < withdrawAmount) {
      setError('Insufficient balance');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await paymentService.processWithdrawal(withdrawAmount, cashAppId);
      
      if (result.success) {
        setSuccess(`Successfully withdrew $${withdrawAmount} to $${cashAppId}`);
        // Refresh user data to show updated balance
        const response = await transactionService.withdraw(withdrawAmount, cashAppId);
        updateUser({ chips: response.newBalance });
        
        // Refresh transactions list
        fetchTransactions();
      } else {
        setError(result.error || 'Withdrawal failed');
      }
    } catch (err) {
      setError('Failed to process withdrawal');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'game-win':
        return 'Game Win';
      case 'game-loss':
        return 'Game Stake';
      default:
        return type;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            {/* User info */}
            <div className="p-6 text-center border-b border-gray-700">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
              <div className="bg-primary rounded-full px-4 py-2 inline-flex items-center">
                <CreditCard size={16} className="mr-2 text-accent" />
                <span className="font-bold">${user?.chips || 0}</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-6 py-4 hover:bg-primary transition-colors ${activeTab === 'profile' ? 'bg-primary text-accent' : ''} rounded-lg`}
              >
                <div className="flex items-center">
                  <User size={18} className="mr-3" />
                  <span>Profile</span>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`w-full text-left px-6 py-4 hover:bg-primary transition-colors ${activeTab === 'transactions' ? 'bg-primary text-accent' : ''} rounded-lg`}
              >
                <div className="flex items-center">
                  <CreditCard size={18} className="mr-3" />
                  <span>Transactions</span>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full text-left px-6 py-4 hover:bg-primary transition-colors ${activeTab === 'history' ? 'bg-primary text-accent' : ''} rounded-lg`}
              >
                <div className="flex items-center">
                  <History size={18} className="mr-3" />
                  <span>Game History</span>
                </div>
              </button>
              
              <button 
                onClick={logout}
                className="w-full text-left px-6 py-4 hover:bg-primary text-red-500 transition-colors rounded-lg"
              >
                <div className="flex items-center">
                  <LogOut size={18} className="mr-3" />
                  <span>Log Out</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          <div className="bg-card rounded-xl shadow-lg p-6">
            {/* Alerts */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{success}</span>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-primary w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">CashApp ID</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500">$</span>
                      <input
                        type="text"
                        value={cashAppId}
                        onChange={(e) => setCashAppId(e.target.value)}
                        className="bg-primary w-full pl-8 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                        placeholder="yourcashtag"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      We'll send your winnings to this CashApp ID
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-accent"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
                
                <div className="border-t border-gray-700 my-8 pt-8">
                  <h3 className="text-xl font-bold mb-6">Manage Your Chips</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Deposit */}
                    <div className="bg-secondary p-6 rounded-xl">
                      <h4 className="text-lg font-semibold mb-4">Deposit</h4>
                      
                      <form onSubmit={handleDeposit} className="space-y-4">
                        <div>
                          <label className="block text-gray-400 mb-2">Amount ($)</label>
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(parseInt(e.target.value))}
                            min={1}
                            className="bg-primary w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className="btn btn-accent w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                          ) : (
                            'Deposit Chips'
                          )}
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Deposits are processed via CashApp
                        </p>
                      </form>
                    </div>
                    
                    {/* Withdraw */}
                    <div className="bg-secondary p-6 rounded-xl">
                      <h4 className="text-lg font-semibold mb-4">Withdraw</h4>
                      
                      <form onSubmit={handleWithdraw} className="space-y-4">
                        <div>
                          <label className="block text-gray-400 mb-2">Amount ($)</label>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(parseInt(e.target.value))}
                            min={1}
                            max={user?.chips || 0}
                            className="bg-primary w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Available: ${user?.chips || 0}
                          </p>
                        </div>
                        
                        <button
                          type="submit"
                          className="btn btn-primary w-full"
                          disabled={isLoading || (user?.chips || 0) < withdrawAmount}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent"></div>
                          ) : (
                            'Withdraw to CashApp'
                          )}
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Funds will be sent to your CashApp ID
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left">
                        <tr className="border-b border-gray-700">
                          <th className="pb-3 pl-4">Type</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(transaction => (
                          <tr key={transaction._id} className="border-b border-gray-700/50 hover:bg-primary/30">
                            <td className="py-4 pl-4">
                              {getTransactionTypeLabel(transaction.type)}
                            </td>
                            <td className={`py-4 ${
                              transaction.type.includes('win') || transaction.type === 'deposit' 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {transaction.type.includes('win') || transaction.type === 'deposit' 
                                ? `+$${transaction.amount}` 
                                : `-$${transaction.amount}`}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : 'bg-red-500/20 text-red-500'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-4">{formatDate(transaction.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-primary/30 rounded-lg">
                    <CreditCard size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
                    <p className="text-gray-400">
                      Your transaction history will appear here once you start playing.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Game History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Game History</h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                  </div>
                ) : gameHistory.length > 0 ? (
                  <div className="space-y-4">
                    {gameHistory.map(game => (
                      <div key={game._id} className="bg-secondary p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-sm text-gray-400">
                              {formatDate(game.startTime)}
                            </div>
                            <h4 className="font-semibold">
                              Pot: ${game.potAmount}
                            </h4>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            game.winner === user?.id
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {game.winner === user?.id ? 'Won' : 'Lost'}
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-700 mt-3 pt-3">
                          <h5 className="text-sm font-semibold mb-2">Players:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {game.players.map(player => (
                              <div 
                                key={player.userId} 
                                className={`text-sm ${player.userId === game.winner ? 'text-accent' : ''}`}
                              >
                                {player.name}: {player.score} pts
                                {player.userId === game.winner && ' (Winner)'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-primary/30 rounded-lg">
                    <History size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Games Played Yet</h3>
                    <p className="text-gray-400">
                      Your game history will appear here once you start playing.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
 