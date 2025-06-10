import  axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Auth Service
class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error');
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async updateProfile(userData: any) {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
      this.setUser(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Update failed');
      }
      throw new Error('Network error');
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Add axios interceptor for authentication
  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}

// Table Service
class TableService {
  async getAllTables() {
    try {
      const response = await axios.get(`${API_URL}/tables`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  async getTableById(tableId: string) {
    try {
      const response = await axios.get(`${API_URL}/tables/${tableId}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching table ${tableId}:`, error);
      throw error;
    }
  }

  async createTable(tableData: any) {
    try {
      const response = await axios.post(`${API_URL}/tables`, tableData, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }

  async joinTable(tableId: string) {
    try {
      const response = await axios.post(`${API_URL}/tables/${tableId}/join`, {}, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Error joining table ${tableId}:`, error);
      throw error;
    }
  }

  async leaveTable(tableId: string) {
    try {
      const response = await axios.post(`${API_URL}/tables/${tableId}/leave`, {}, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Error leaving table ${tableId}:`, error);
      throw error;
    }
  }
}

// Transaction Service
class TransactionService {
  async getTransactions() {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async deposit(amount: number, paymentMethod: string = 'cashapp') {
    try {
      const response = await axios.post(`${API_URL}/transactions/deposit`, 
        { amount, paymentMethod },
        { headers: { Authorization: `Bearer ${authService.getToken()}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Error processing deposit:', error);
      throw error;
    }
  }

  async withdraw(amount: number, cashAppId: string) {
    try {
      const response = await axios.post(`${API_URL}/transactions/withdraw`, 
        { amount, cashAppId },
        { headers: { Authorization: `Bearer ${authService.getToken()}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  }
}

// Game History Service
class GameHistoryService {
  async getGameHistory() {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching game history:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: string) {
    try {
      const response = await axios.get(`${API_URL}/history/${gameId}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching game details for ${gameId}:`, error);
      throw error;
    }
  }
}

// Initialize services
const authService = new AuthService();
authService.setupInterceptors();

const tableService = new TableService();
const transactionService = new TransactionService();
const gameHistoryService = new GameHistoryService();

// Export services
export { authService, tableService, transactionService, gameHistoryService };
 