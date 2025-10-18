// jest-dom adds custom jest matchers for asserting on DOM nodes
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window methods
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
