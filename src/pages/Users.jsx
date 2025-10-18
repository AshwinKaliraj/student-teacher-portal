import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService.js';
import { authService } from '../services/authService.js';
import { Navbar } from '../components/Navbar.jsx';
import '../styles/Users.css';


/**
 * Users List Page Component
 * Shows all users with search and filter functionality
 * Displays user profile images
 */
export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('All');
  
  const isTeacher = authService.isTeacher();
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterDesignation, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by designation
    if (filterDesignation !== 'All') {
      filtered = filtered.filter(u => u.designation === filterDesignation);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        alert('User deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete user: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleImageError = (e, userName) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=14b8a6&color=fff&size=200`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="users-container">
        <div className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <h1>User Management</h1>
            <p className="user-role-badge">
              {isTeacher ? 'Teacher - Full Access' : 'Student - View Only'}
            </p>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="controls-left">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-box">
                <select 
                  value={filterDesignation} 
                  onChange={(e) => setFilterDesignation(e.target.value)}
                >
                  <option value="All">All Users</option>
                  <option value="Student">Students Only</option>
                  <option value="Teacher">Teachers Only</option>
                </select>
              </div>
            </div>

            {isTeacher && (
              <Link to="/users/create" className="btn-create">
                Create New User
              </Link>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Users Table */}
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Age</th>
                  <th>Phone</th>
                  {isTeacher && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={isTeacher ? "9" : "8"} className="no-data">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <img 
                          src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=14b8a6&color=fff&size=200`}
                          alt={user.name}
                          className="user-avatar"
                          onError={(e) => handleImageError(e, user.name)}
                        />
                      </td>
                      <td>{user.id}</td>
                      <td>
                        <div className="user-name">
                          {user.name}
                          {user.designation === 'Teacher' && (
                            <span className="badge badge-teacher">TEACHER</span>
                          )}
                          {user.designation === 'Student' && (
                            <span className="badge badge-student">STUDENT</span>
                          )}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.designation}</td>
                      <td>{user.department || '-'}</td>
                      <td>{user.age}</td>
                      <td>{user.phoneNumber || '-'}</td>
                      {isTeacher && (
                        <td className="actions-cell">
                          <Link 
                            to={`/users/edit/${user.id}`} 
                            className="btn-edit"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Permission Notice for Students */}
          {!isTeacher && (
            <div className="permission-notice">
              <p>
                <strong>Note:</strong> You are logged in as a <strong>Student</strong>. 
                You can view user data but cannot create, edit, or delete users. 
                Only <strong>Teachers</strong> have full CRUD permissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
