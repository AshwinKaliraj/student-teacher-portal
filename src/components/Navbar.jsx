import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isTeacher = authService.isTeacher();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/users" style={styles.logo}>
          <span style={styles.logoIcon}>P</span>
          <span>Portal</span>
        </Link>

        <div style={styles.menu}>
          <div style={styles.userInfo}>
            <img 
              src={user.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=64748b&color=f1f5f9'} 
              alt={user.name}
              style={styles.avatar}
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=64748b&color=f1f5f9';
              }}
            />
            <span style={styles.userName}>
              {user.name} ({user.designation})
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
    borderBottom: '2px solid rgba(100, 116, 139, 0.3)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#f1f5f9',
    fontSize: '1.4rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '800',
    color: '#f1f5f9',
    boxShadow: '0 4px 12px rgba(100, 116, 139, 0.5)',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 1rem',
    background: 'rgba(100, 116, 139, 0.1)',
    borderRadius: '24px',
    border: '1.5px solid rgba(100, 116, 139, 0.3)',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '2px solid #64748b',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(100, 116, 139, 0.4)',
  },
  userName: {
    color: '#f1f5f9',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoutBtn: {
    padding: '0.6rem 1.2rem',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    border: '1.5px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    letterSpacing: '0.3px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};
