import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaFilter } from "react-icons/fa";

import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import EditUserModal from "./EditUserModal";
import ConfirmModal from "./ConfirmModal";
import AdminUserProfileView from "./AdminUserProfileView";

const API_BASE = "http://localhost:8080";

const normalizeRoleName = (role) => {
  if (!role) return "";
  return typeof role === "string" ? role : role.name || "";
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadRoles();
    loadUsers();
  }, []);

  const loadCurrentUser = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(u);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await axios.get(`${API_BASE}/api/roles`);
      // Expecting array of { id, name }
      setRoles(res.data || []);
    } catch (err) {
      console.error("Failed to load roles", err);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(`${API_BASE}/api/user/all`);
      const mapped = (res.data || []).map((u) => ({
        id: u.userId ?? u.id ?? null,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        role: u.role ?? (u.roleName ?? ""),
        status: (u.status ?? "active").toLowerCase(),
        raw: u,
      }));
      setUsers(mapped);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filtering (frontend-only)
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
    await loadUsers();
    setShowAddUserForm(false);
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
    // Prevent current admin from modifying their own admin account (front-end safeguard)
    const currentId = currentUser?.userId ?? currentUser?.id;
    const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
    const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
    if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
      return false;
    }
    return true;
  };

  const askDelete = (user) => {
    if (!canPerformAction(user)) {
      alert("Protected action: cannot delete your own admin account.");
      return;
    }
    setConfirmState({ open: true, type: "delete", payload: user });
  };

  const askToggleStatus = (user) => {
    if (!canPerformAction(user)) {
      alert("Protected action: cannot change your own admin account status.");
      return;
    }
    setConfirmState({ open: true, type: "toggleStatus", payload: user });
  };

  const performConfirm = async () => {
  const { type, payload } = confirmState;
  if (!payload) return;

  try {
    // DELETE USER
    if (type === "delete") {
      await axios.delete(`${API_BASE}/api/user/delete/${payload.id}`);
      await loadUsers();
      alert("User deleted successfully");

    // ACTIVATE / DEACTIVATE USER
    } else if (type === "toggleStatus") {
      if (payload.status === "active") {
        await axios.delete(`${API_BASE}/api/user/deactivate/${payload.id}`);
        alert("User deactivated successfully");
      } else {
        await axios.put(`${API_BASE}/api/user/activate/${payload.id}`);
        alert("User activated successfully");
      }

      await loadUsers();
    }

  } catch (err) {
    console.error("Confirm action failed", err);
    alert("Action failed: " + (err.response?.data?.message || err.message));
  } finally {
    setConfirmState({ open: false, type: "", payload: null });
  }
};

  return (
    <div className="container my-4">
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

        {/* AddUserForm */}
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
            {/* Controls */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="input-group shadow-sm">
                  <span className="input-group-text border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="input-group shadow-sm">
                  <span className="input-group-text border-0 bg-light">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select border-0"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    <option value="All">All Roles</option>
                    {/* dynamic roles (from backend) */}
                    {roles.map((r) => (
                      <option key={r.id} value={r.name?.toUpperCase()}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <button className="btn btn-outline-primary w-100 shadow-sm d-flex align-items-center justify-content-center" onClick={loadUsers} style={{ borderRadius: '8px' }}>
                  <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                </button>
              </div>
            </div>

            {/* Table */}
            <UserTable
              users={filteredUsers}
              loading={loadingUsers}
              onEditFullProfile={handleOpenFullProfile}
              onViewBasicInfo={handleOpenBasicInfo}
              onDelete={askDelete}
              onToggleStatus={askToggleStatus}
              canPerformAction={canPerformAction}
            />
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

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
        message={
          confirmState.type === "delete"
            ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
            : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
        }
        onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
        onConfirm={performConfirm}
      />
    </div>
  );
};

export default UserManagement;

