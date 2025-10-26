import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import UserManagement from './UserManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar onLogout={handleLogout} />
      
      <div className="admin-content-wrapper">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        
        <div className="admin-main-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-welcome">
              <h1>Welcome to Admin Dashboard</h1>
              <p>Select a section from the sidebar to manage</p>
            </div>
          )}
          
          {activeSection === 'userManagement' && (
            <UserManagement />
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;