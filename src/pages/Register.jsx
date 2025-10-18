import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService.js';
import '../styles/Auth.css';

/**
 * Register Page Component
 * Now includes ImageUrl field
 */
export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    designation: 'Student',
    department: '',
    phoneNumber: '',
    address: '',
    imageUrl: ''  //  NEW FIELD
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      console.log('Registration successful:', response);
      navigate('/users');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-icon"></div>
          <h2>Create New Account</h2>
          <p className="subtitle">Fill in your details to register</p>
        </div>
        
        {error && (
          <div className="error-message">
             {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name"> Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email"> Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password"> Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Minimum 6 characters"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth"> Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation"> Designation *</label>
              <select
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department"> Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber"> Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address"> Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                disabled={loading}
              />
            </div>
          </div>

          {/* ✅ NEW FIELD - Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl"> Profile Image URL (Optional)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
              disabled={loading}
            />
            <small className="help-text">
              Leave empty to auto-generate an avatar based on your name
            </small>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? ' Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};
