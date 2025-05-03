import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/explore">NFT Marketplace</Link>
      </div>
      <div className="nav-links">
        <Link to="/explore" className="nav-link">Explore</Link>
        <Link to="/upload" className="nav-link">Upload</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout} className="nav-link logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 