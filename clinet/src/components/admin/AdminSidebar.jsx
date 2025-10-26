import React from 'react';
import { FaUsers, FaTachometerAlt, FaCalendarAlt, FaCog } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { id: 'userManagement', icon: <FaUsers />, label: 'User Management' },
    { id: 'interviews', icon: <FaCalendarAlt />, label: 'Interviews' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;