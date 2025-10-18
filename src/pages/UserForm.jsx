import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services/userService.js';
import { Navbar } from '../components/Navbar.jsx';
import '../styles/UserForm.css';

/**
 * User Form Component
 * Used for both creating and editing users
 * NOW includes ImageUrl field with preview
 */
export const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    designation: 'Student',
    department: '',
    phoneNumber: '',
    address: '',
    imageUrl: '',  // ✅ NEW FIELD
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');  // ✅ Image preview

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getUserById(id);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        dateOfBirth: user.dateOfBirth.split('T')[0],
        designation: user.designation,
        department: user.department || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        imageUrl: user.imageUrl || '',  // ✅ NEW FIELD
        isActive: user.isActive
      });
      setImagePreview(user.imageUrl || '');  // ✅ Set preview
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');

    // ✅ Update image preview when URL changes
    if (e.target.name === 'imageUrl') {
      setImagePreview(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        const updateData = {
          id: parseInt(id),
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          designation: formData.designation,
          department: formData.department,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          imageUrl: formData.imageUrl,  // ✅ NEW FIELD
          isActive: formData.isActive
        };
        await userService.updateUser(id, updateData);
        alert('✅ User updated successfully!');
      } else {
        await userService.createUser(formData);
        alert('✅ User created successfully!');
      }
      navigate('/users');
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage = err.response?.data?.message || 'Operation failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle image preview error
  const handleImageError = () => {
    setImagePreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=667eea&color=fff&size=200`);
  };

  if (loading && isEditMode) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>{isEditMode ? ' Edit User' : ' Create New User'}</h2>
            <button onClick={() => navigate('/users')} className="btn-back">
              ← Back to Users
            </button>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* ✅ Image Preview Section */}
          <div className="image-preview-section">
            <div className="image-preview-label">Profile Preview</div>
            <img 
              src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=667eea&color=fff&size=200`}
              alt="Profile Preview"
              className="image-preview"
              onError={handleImageError}
            />
          </div>

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
                  placeholder="Enter full name"
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
                  disabled={isEditMode || loading}
                  placeholder="Enter email address"
                />
                {isEditMode && (
                  <small className="help-text"> Email cannot be changed</small>
                )}
              </div>
            </div>

            {!isEditMode && (
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEditMode}
                  minLength="6"
                  placeholder="Minimum 6 characters"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-row">
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
                  <option value="Teacher"> Teacher</option>
                </select>
              </div>
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
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
            </div>

            <div className="form-group">
              <label htmlFor="address"> Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter full address"
                disabled={loading}
              />
            </div>

            {/* ✅ NEW FIELD - Image URL with preview */}
            <div className="form-group">
              <label htmlFor="imageUrl">Profile Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                disabled={loading}
              />
              <small className="help-text">
                 Leave empty to auto-generate an avatar. Image updates in real-time above.
              </small>
            </div>

            {isEditMode && (
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span> Active User</span>
                </label>
                <small className="help-text">
                   Inactive users cannot log in to the system
                </small>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/users')}
                className="btn-cancel"
                disabled={loading}
              >
                 Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-submit"
              >
                {loading ? ' Saving...' : (isEditMode ? ' Update User' : ' Create User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
