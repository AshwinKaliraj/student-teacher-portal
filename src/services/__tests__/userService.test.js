import { userService } from '../userService';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('userService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should fetch all users successfully', async () => {
      // Arrange
      const mockUsers = [
        { 
          id: 1, 
          name: 'User 1', 
          designation: 'Teacher',
          email: 'user1@test.com',
          isActive: true
        },
        { 
          id: 2, 
          name: 'User 2', 
          designation: 'Student',
          email: 'user2@test.com',
          isActive: true
        },
      ];
      api.get.mockResolvedValue({ data: mockUsers });

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should throw error when fetch fails', async () => {
      // Arrange
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getAllUsers()).rejects.toThrow('Network error');
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id successfully', async () => {
      // Arrange
      const mockUser = { 
        id: 1, 
        name: 'Test User', 
        designation: 'Teacher',
        email: 'test@test.com',
        department: 'Computer Science'
      };
      api.get.mockResolvedValue({ data: mockUser });

      // Act
      const result = await userService.getUserById(1);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(1);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const error = new Error('User not found');
      api.get.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getUserById(999)).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'New User',
        email: 'newuser@test.com',
        designation: 'Student',
        password: 'password123',
        dateOfBirth: '2000-01-01'
      };
      const mockResponse = { 
        id: 3, 
        ...userData,
        isActive: true,
        createdAt: '2025-10-18T00:00:00Z'
      };
      api.post.mockResolvedValue({ data: mockResponse });

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBe(3);
    });

    it('should throw error when creation fails', async () => {
      // Arrange
      const error = new Error('Email already exists');
      api.post.mockRejectedValue(error);

      const userData = {
        name: 'Duplicate User',
        email: 'existing@test.com',
      };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    it('should update existing user successfully', async () => {
      // Arrange
      const userData = {
        id: 1,
        name: 'Updated User',
        designation: 'Teacher',
        department: 'Mathematics'
      };
      api.put.mockResolvedValue({ data: userData });

      // Act
      const result = await userService.updateUser(1, userData);

      // Assert
      expect(api.put).toHaveBeenCalledWith('/users/1', userData);
      expect(result).toEqual(userData);
      expect(result.name).toBe('Updated User');
    });

    it('should throw error when update fails', async () => {
      // Arrange
      const error = new Error('Update failed');
      api.put.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.updateUser(1, {})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      api.delete.mockResolvedValue({ data: { message: 'User deleted' } });

      // Act
      await userService.deleteUser(1);

      // Assert
      expect(api.delete).toHaveBeenCalledWith('/users/1');
    });

    it('should throw error when delete fails', async () => {
      // Arrange
      const error = new Error('Delete failed');
      api.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.deleteUser(1)).rejects.toThrow('Delete failed');
    });
  });
});
