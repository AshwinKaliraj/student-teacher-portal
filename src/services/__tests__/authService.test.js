import { authService } from '../authService';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('authService', () => {
  let getItemSpy;
  let setItemSpy;
  let removeItemSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Spy on the real localStorage methods
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Restore spies
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  describe('register', () => {
    it('should register user and store token', async () => {
      // Arrange
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          designation: 'Student',
          token: 'mock-token-123',
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        designation: 'Student',
      };

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
      expect(setItemSpy).toHaveBeenCalledWith('token', 'mock-token-123');
      expect(setItemSpy).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data));
    });

    it('should throw error when registration fails', async () => {
      // Arrange
      const error = new Error('Registration failed');
      api.post.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.register({})).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should login user and store token', async () => {
      // Arrange
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test Teacher',
          email: 'teacher@test.com',
          designation: 'Teacher',
          token: 'teacher-token-456',
        },
      };
      
      api.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'teacher@test.com',
        password: 'password123',
      };

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
      expect(setItemSpy).toHaveBeenCalledWith('token', 'teacher-token-456');
    });

    it('should throw error when login fails', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      api.post.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.login({})).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should remove token and user from localStorage', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test' }));
      
      // Act
      authService.logout();

      // Assert
      expect(removeItemSpy).toHaveBeenCalledWith('token');
      expect(removeItemSpy).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      // Arrange
      const mockUser = { 
        id: 1, 
        name: 'Test User', 
        designation: 'Student' 
      };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const user = authService.getCurrentUser();

      // Assert
      expect(getItemSpy).toHaveBeenCalledWith('user');
      expect(user).toEqual(mockUser);
    });

    it('should return null when no user in localStorage', () => {
      // Act
      const user = authService.getCurrentUser();

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(getItemSpy).toHaveBeenCalledWith('token');
      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isTeacher', () => {
    it('should return true when user is Teacher', () => {
      // Arrange
      const mockUser = { designation: 'Teacher' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const result = authService.isTeacher();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user is Student', () => {
      // Arrange
      const mockUser = { designation: 'Student' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const result = authService.isTeacher();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when no user exists', () => {
      // Act
      const result = authService.isTeacher();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isStudent', () => {
    it('should return true when user is Student', () => {
      // Arrange
      const mockUser = { designation: 'Student' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const result = authService.isStudent();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user is Teacher', () => {
      // Arrange
      const mockUser = { designation: 'Teacher' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const result = authService.isStudent();

      // Assert
      expect(result).toBe(false);
    });
  });
});
