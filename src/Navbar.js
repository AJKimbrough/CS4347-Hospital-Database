import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/billing" className="nav-link">Billing</Link>
        <Link to="/emr" className="nav-link">Electronic Medical Records</Link>
        <Link to="/registration" className="nav-link">Patient Registration</Link>
        <Link to="/scheduling" className="nav-link">Appointment Scheduling</Link>
        <Link to="/staff" className="nav-link">Staff Management</Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

