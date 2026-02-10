import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <h1>Contract Assistant</h1>
        </div>
        <nav className="header-nav">
          <NavLink 
            to="/chat" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Analysis
          </NavLink>
          <NavLink 
            to="/comparison" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Comparison
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
