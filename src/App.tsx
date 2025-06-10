import  { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

// Components
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Lobby from './pages/Lobby';
import GameTable from './pages/GameTable';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard><Layout /></AuthGuard>}>
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/game/:tableId" element={<GameTable />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
 