import api from './api';

/**
 * Authentication Service
 * Handles user registration, login, logout
 */
export const authService = {
  /**
   * Register new user
   * POST: /api/auth/register
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login existing user
   * POST: /api/auth/login
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Check if current user is a Teacher
   */
  isTeacher() {
    const user = this.getCurrentUser();
    return user?.designation === 'Teacher';
  },

  /**
   * Check if current user is a Student
   */
  isStudent() {
    const user = this.getCurrentUser();
    return user?.designation === 'Student';
  },

  /**
   * Get user role
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.designation || null;
  }
};
