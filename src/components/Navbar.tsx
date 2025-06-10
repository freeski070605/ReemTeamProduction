import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-primary-light shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-accent">Reem Team</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link to="/lobby" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-primary">
                Lobby
              </Link>
            </div>
          </div>
          
          {/* Right Side (User Info) */}
          <div className="hidden md:flex items-center">
            {user && (
              <>
                <div className="mr-4 flex items-center px-3 py-1 bg-primary rounded-full">
                  <DollarSign size={18} className="mr-1 text-accent" />
                  <span className="font-semibold">${user.chips}</span>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center text-gray-300 hover:text-white focus:outline-none">
                    <span className="mr-2">{user.name}</span>
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <User size={16} className="text-accent" />
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-primary"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/lobby"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary"
              onClick={() => setIsOpen(false)}
            >
              Lobby
            </Link>
            
            {user && (
              <>
                <div className="flex items-center px-3 py-2">
                  <DollarSign size={18} className="mr-2 text-accent" />
                  <span className="font-semibold">${user.chips}</span>
                </div>
                
                <Link 
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-primary"
                >
                  <div className="flex items-center">
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 