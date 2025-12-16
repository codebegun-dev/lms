
// src/Admin_Dashboard/UserManagement/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";

import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import EditUserModal from "./EditUserModal";
import ConfirmModal from "./ConfirmModal";
import AdminUserProfileView from "./AdminUserProfileView";

const API_BASE = "http://localhost:8080";

// Utility to normalize role names
const normalizeRoleName = (role) => {
  if (!role) return "";
  return typeof role === "string" ? role : role.name || "";
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  // JWT token
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCurrentUser();
    loadRoles();
    loadUsers(0); // Load first page initially
  }, []);

  const loadCurrentUser = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(u);
    } catch {
      setCurrentUser(null);
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 5000);
  };

  // Close toast manually
  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  // Fetch Roles with token
  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await axios.get(`${API_BASE}/api/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const rolesData = res.data || [];
      const uniqueRolesMap = new Map();
      
      rolesData.forEach(role => {
        if (role && role.id) {
          if (!uniqueRolesMap.has(role.id)) {
            uniqueRolesMap.set(role.id, {
              id: role.id,
              name: role.name || role.roleName || `Role ${role.id}`
            });
          }
        }
      });
      
      const uniqueRoles = Array.from(uniqueRolesMap.values());
      setRoles(uniqueRoles);
      
    } catch (err) {
      console.error("Failed to load roles", err);
      showToast("Failed to load roles", "danger");
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Fetch Users with pagination
  const loadUsers = async (page = pagination.currentPage) => {
    try {
      setLoadingUsers(true);
      
      const response = await axios.get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          size: pagination.pageSize
        }
      });
      
      // Handle response structure from backend
      const responseData = response.data || {};
      const usersData = responseData.USERS || [];
      const metaData = {
        currentPage: responseData.CURRENT_PAGE || 0,
        pageSize: responseData.PAGE_SIZE || 10,
        totalPages: responseData.TOTAL_PAGES || 0,
        totalUsers: responseData.TOTAL_USERS || 0,
        activeUsers: responseData.ACTIVE_USERS || 0,
        inactiveUsers: responseData.INACTIVE_USERS || 0,
        roleCounts: responseData.ROLE_COUNTS || {}
      };
      
      // Map users with consistent structure
      const mappedUsers = usersData.map((u) => ({
        id: u.userId || u.id,
        userId: u.userId || u.id, // Keep both for compatibility
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || (u.roleName ? { name: u.roleName } : null),
        status: (u.status || "active").toLowerCase(),
        raw: u,
      }));
      
      setUsers(mappedUsers);
      setPagination(metaData);
      
      if (page === 0) {
        showToast("Users loaded successfully", "success");
      }
      
    } catch (err) {
      console.error("Failed to load users", err);
      
      let errorMessage = "Failed to load users";
      if (err.response) {
        if (err.response.status === 500) {
          errorMessage = "Server error (500). Please check backend server.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      showToast(errorMessage, "danger");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadUsers(newPage);
    }
  };

  // Filtering (client-side for now)
  const filteredUsers = users.filter((user) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (user.firstName && user.firstName.toLowerCase().includes(q)) ||
      (user.lastName && user.lastName.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.phone && user.phone.toLowerCase().includes(q));

    const roleName = normalizeRoleName(user.role).toUpperCase();
    const matchesRole = filterRole === "All" || roleName === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => setShowAddUserForm(true);
  const handleCloseAdd = () => setShowAddUserForm(false);

  const handleAddSuccess = async () => {
    await loadUsers(0); // Reload from first page
    setShowAddUserForm(false);
    showToast("User added successfully!", "success");
  };

  const handleOpenFullProfile = (user) => {
    setSelectedUser(user.raw || user);
    setShowFullProfileModal(true);
  };

  const handleOpenBasicInfo = (user) => {
    setSelectedUser(user.raw || user);
    setShowBasicInfoModal(true);
  };

  const canPerformAction = (targetUser) => {
    if (!targetUser) return false;
    
    const currentId = currentUser?.userId ?? currentUser?.id;
    const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
    const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
    
    // Prevent self-modification for ADMIN and MASTER_ADMIN
    if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
      return false;
    }
    if (currentRole === "MASTER_ADMIN" && targetRole === "MASTER_ADMIN" && Number(currentId) === Number(targetUser.id)) {
      return false;
    }
    
    return true;
  };

  // const askDelete = (user) => {
  //   if (!canPerformAction(user)) {
  //     showToast("Protected action: cannot delete your own account.", "warning");
  //     return;
  //   }
  //   setConfirmState({ open: true, type: "delete", payload: user });
  // };

  const askToggleStatus = (user) => {
    if (!canPerformAction(user)) {
      showToast("Protected action: cannot change your own account status.", "warning");
      return;
    }
    
    // Check if trying to modify MASTER_ADMIN
    const targetRole = normalizeRoleName(user.role)?.toUpperCase();
    if (targetRole === "MASTER_ADMIN") {
      showToast("Cannot change status of MASTER_ADMIN", "warning");
      return;
    }
    
    setConfirmState({ open: true, type: "toggleStatus", payload: user });
  };

  const performConfirm = async () => {
    const { type, payload } = confirmState;
    if (!payload) return;

    try {
      // if (type === "delete") {
      //   await axios.delete(`${API_BASE}/api/users/${payload.id}`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   await loadUsers(pagination.currentPage);
      //   showToast("User deleted successfully", "success");
      // } else 
      if (type === "toggleStatus") {
        // Use new unified endpoint with query parameter
        const isActive = payload.status === "active";
        const newActiveStatus = !isActive;
        
        await axios.put(
          `${API_BASE}/api/users/${payload.id}/status`,
          null, // No body for this endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { active: newActiveStatus }
          }
        );
        
        const action = newActiveStatus ? "activated" : "deactivated";
        showToast(`User ${action} successfully`, "success");
        await loadUsers(pagination.currentPage);
      }
    } catch (err) {
      console.error("Confirm action failed", err);
      const errorMsg = err.response?.data?.message || err.message || "Action failed";
      showToast(errorMsg, "danger");
    } finally {
      setConfirmState({ open: false, type: "", payload: null });
    }
  };

  return (
    <div className="container my-4">
      {/* Toast Notification */}
      <div 
        className={`toast align-items-center text-bg-${toast.type} border-0 ${toast.show ? 'show' : ''}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '300px'
        }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {toast.type === 'success' ? '✅ ' : '❌ '}
            {toast.message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            data-bs-dismiss="toast" 
            aria-label="Close"
            onClick={closeToast}
          ></button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
              <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
              User Management System
            </h2>
            <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
          </div>

          {!showAddUserForm && (
            <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
              <FaUserPlus className="me-2" /> Add New User
            </button>
          )}
        </div>

        {showAddUserForm ? (
          <AddUserForm
            onClose={handleCloseAdd}
            onSuccess={handleAddSuccess}
            roles={roles}
            loadingRoles={loadingRoles}
            apiBase={API_BASE}
          />
        ) : (
          <>
            {/* Stats Row */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm bg-primary text-white">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 opacity-75">Total Users</h6>
                    <h3 className="card-title mb-0">{pagination.totalUsers}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm bg-success text-white">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 opacity-75">Active Users</h6>
                    <h3 className="card-title mb-0">{pagination.activeUsers}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm bg-secondary text-white">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 opacity-75">Inactive Users</h6>
                    <h3 className="card-title mb-0">{pagination.inactiveUsers}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm bg-info text-white">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 opacity-75">Current Page</h6>
                    <h3 className="card-title mb-0">{pagination.currentPage + 1} / {pagination.totalPages || 1}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select shadow-sm"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  {roles.map((r) => (
                    <option key={`filter-role-${r.id}`} value={r.name?.toUpperCase()}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 d-flex gap-2">
                <button className="btn btn-outline-primary flex-grow-1 shadow-sm" onClick={() => loadUsers(pagination.currentPage)}>
                  Refresh Data
                </button>
                <button className="btn btn-outline-secondary shadow-sm" onClick={() => setFilterRole("All")}>
                  Clear Filters
                </button>
              </div>
            </div>

            <UserTable
              users={filteredUsers}
              loading={loadingUsers}
              onEditFullProfile={handleOpenFullProfile}
              onViewBasicInfo={handleOpenBasicInfo}
              // onDelete={askDelete}
              onToggleStatus={askToggleStatus}
              canPerformAction={canPerformAction}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-4">
                <nav aria-label="User pagination">
                  <ul className="pagination">
                    <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i;
                      } else if (pagination.currentPage <= 2) {
                        pageNum = i;
                      } else if (pagination.currentPage >= pagination.totalPages - 3) {
                        pageNum = pagination.totalPages - 5 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum + 1}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages - 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages - 1}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="ms-3 text-muted">
                  Showing page {pagination.currentPage + 1} of {pagination.totalPages}
                  {" • "}
                  {pagination.pageSize} per page
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showFullProfileModal && selectedUser && (
        <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
      )}

      {showBasicInfoModal && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
      )}

      {/* <ConfirmModal
        open={confirmState.open}
        title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
        message={
          confirmState.type === "delete"
            ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}? This action cannot be undone.`
            : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
        }
        onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
        onConfirm={performConfirm}
      /> */}
    </div>
  );
};

export default UserManagement;