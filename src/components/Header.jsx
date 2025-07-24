import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authtoken');

  const handleLogout = () => {
    localStorage.removeItem('authtoken');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img className="logo-img" src="/todo_app_logo.png" alt="todo app logo" />
            <h2>ClearTick</h2>
          </div>
          <nav className="nav">
            <button 
              className={`nav-link ${location.pathname === '/todos' ? 'active' : ''}`}
              onClick={() => navigate('/todos')}
            >
              Todos
            </button>
            <button 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button className="nav-link logout" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;