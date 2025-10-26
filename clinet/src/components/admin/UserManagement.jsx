import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaBan } from 'react-icons/fa';
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Load all registered users
    const allUsers = [];
    
    // Get main registered user
    const mainUser = localStorage.getItem('user');
    if (mainUser) {
      const user = JSON.parse(mainUser);
      allUsers.push({
        id: 1,
        ...user,
        status: 'active',
        registeredDate: new Date().toLocaleDateString()
      });
    }

    // You can add logic here to load multiple users from a database
    // For now, we'll simulate with localStorage
    const storedUsers = localStorage.getItem('allUsers');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      setUsers(allUsers);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  };

  const handleViewUser = (user) => {
    // Load complete user profile data
    const personalInfo = JSON.parse(localStorage.getItem('studentPersonalInfo') || '{}');
    const genericInfo = JSON.parse(localStorage.getItem('studentGenericInfo') || '{}');
    const tenthGrade = JSON.parse(localStorage.getItem('studentTenthGrade') || '{}');
    const twelfthGrade = JSON.parse(localStorage.getItem('studentTwelfthGrade') || '{}');
    const ugDetails = JSON.parse(localStorage.getItem('studentUGDetails') || '{}');
    const pgDetails = JSON.parse(localStorage.getItem('studentPGDetails') || '{}');
    const courseDetails = JSON.parse(localStorage.getItem('studentCourseDetails') || '{}');
    const projects = JSON.parse(localStorage.getItem('studentProjects') || '{}');

    setSelectedUser({
      ...user,
      personalInfo,
      genericInfo,
      tenthGrade,
      twelfthGrade,
      ugDetails,
      pgDetails,
      courseDetails,
      projects
    });
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedUsers = users.filter(u => u.id !== userToDelete.id);
    setUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleDeactivateUser = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = () => {
    const updatedUsers = users.map(u => 
      u.id === userToDeactivate.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setShowDeactivateConfirm(false);
    setUserToDeactivate(null);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setShowEditModal(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management">
      <div className="um-header">
        <h2>User Management</h2>
        <p>Manage all registered users</p>
      </div>

      <div className="um-controls">
        <input
          type="text"
          className="um-search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="um-filter"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Interviewer">Interviewer</option>
        </select>
      </div>

      <div className="um-table-wrapper">
        <table className="um-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Sure Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName || '-'}</td>
                  <td>{user.lastName || '-'}</td>
                  <td>{user.surName || '-'}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewUser(user)}
                        title="View User"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn deactivate-btn"
                        onClick={() => handleDeactivateUser(user)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <FaBan />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      {showViewModal && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}?</p>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation */}
      {showDeactivateConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm {userToDeactivate?.status === 'active' ? 'Deactivate' : 'Activate'}</h3>
            <p>
              Are you sure you want to {userToDeactivate?.status === 'active' ? 'deactivate' : 'activate'} {userToDeactivate?.firstName} {userToDeactivate?.lastName}?
            </p>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel"
                onClick={() => setShowDeactivateConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmDeactivate}
              >
                {userToDeactivate?.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;