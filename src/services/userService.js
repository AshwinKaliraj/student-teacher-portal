import api from './api';

/**
 * User Service
 * Handles all user CRUD operations
 * Connects to UsersController in StudentApp API
 */
export const userService = {
  /**
   * Get all users
   * GET: /api/users
   * Accessible by: Students and Teachers
   */
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID
   * GET: /api/users/{id}
   * Accessible by: Students and Teachers
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get users by designation (Student or Teacher)
   * GET: /api/users/designation/{designation}
   * Accessible by: Students and Teachers
   */
  async getUsersByDesignation(designation) {
    try {
      const response = await api.get(`/users/designation/${designation}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search users by name
   * GET: /api/users/search?term={searchTerm}
   * Accessible by: Students and Teachers
   */
  async searchUsers(searchTerm) {
    try {
      const response = await api.get(`/users/search?term=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new user
   * POST: /api/users
   * Accessible by: Teachers only
   */
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update existing user
   * PUT: /api/users/{id}
   * Accessible by: Teachers only
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user (soft delete)
   * DELETE: /api/users/{id}
   * Accessible by: Teachers only
   */
  async deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};
