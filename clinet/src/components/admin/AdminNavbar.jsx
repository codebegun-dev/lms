import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user || { firstName: 'Admin' };
    } catch (error) {
      return { firstName: 'Admin' };
    }
  };

  const userInfo = getUserInfo();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <div className="admin-logo">
          <span className="logo-text">CodeBeGun</span>
        </div>
      </div>

      <div className="admin-navbar-right">
        <div 
          className="admin-profile-icon"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle size={35} />
          <span className="admin-name">{userInfo.firstName}</span>
        </div>

        {showMenu && (
          <div className="admin-dropdown-menu">
            <button 
              className="admin-dropdown-item logout-item"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;