import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService.js';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Users } from './pages/Users.jsx';
import { UserForm } from './pages/UserForm.jsx';
import './App.css';

/**
 * Main App Component
 * Handles routing and authentication
 */
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Accessible by Both Students and Teachers */}
          <Route 
            path="/users" 
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } 
          />
          
          {/* Protected Routes - Teachers Only */}
          <Route 
            path="/users/create" 
            element={
              <PrivateRoute requireTeacher>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/users/edit/:id" 
            element={
              <PrivateRoute requireTeacher>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={
              authService.isAuthenticated() ? 
                <Navigate to="/users" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
