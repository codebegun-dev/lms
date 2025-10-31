import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaBan } from "react-icons/fa";
import ViewUserModel from "./UserViewModel";
import EditUserModel from "./EditUserModel";
 
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = [];
    const mainUser = localStorage.getItem("user");
    if (mainUser) {
      const user = JSON.parse(mainUser);
      allUsers.push({
        id: 1,
        ...user,
        status: "active",
        registeredDate: new Date().toLocaleDateString(),
      });
    }

    const storedUsers = localStorage.getItem("allUsers");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      setUsers(allUsers);
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
  };

  const handleViewUser = (user) => {
    const personalInfo = JSON.parse(localStorage.getItem("studentPersonalInfo") || "{}");
    const genericInfo = JSON.parse(localStorage.getItem("studentGenericInfo") || "{}");
    const tenthGrade = JSON.parse(localStorage.getItem("studentTenthGrade") || "{}");
    const twelfthGrade = JSON.parse(localStorage.getItem("studentTwelfthGrade") || "{}");
    const ugDetails = JSON.parse(localStorage.getItem("studentUGDetails") || "{}");
    const pgDetails = JSON.parse(localStorage.getItem("studentPGDetails") || "{}");
    const courseDetails = JSON.parse(localStorage.getItem("studentCourseDetails") || "{}");
    const projects = JSON.parse(localStorage.getItem("studentProjects") || "{}");

    setSelectedUser({
      ...user,
      personalInfo,
      genericInfo,
      tenthGrade,
      twelfthGrade,
      ugDetails,
      pgDetails,
      courseDetails,
      projects,
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
    const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
    setUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleDeactivateUser = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = () => {
    const updatedUsers = users.map((u) =>
      u.id === userToDeactivate.id
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    setShowDeactivateConfirm(false);
    setUserToDeactivate(null);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    setShowEditModal(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container bg-white rounded-4 shadow p-4 my-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">User Management</h3>
        <p className="text-secondary mb-0">Manage all registered users</p>
      </div>

      {/* Controls */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
            <option value="Interviewer">Interviewer</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Sure Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName || "-"}</td>
                  <td>{user.lastName || "-"}</td>
                  <td>{user.surName || "-"}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "Admin"
                          ? "bg-danger"
                          : user.role === "Interviewer"
                          ? "bg-success"
                          : "bg-info text-dark"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewUser(user)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-warning text-dark"
                        onClick={() => handleEditUser(user)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className={`btn btn-sm ${
                          user.status === "active"
                            ? "btn-outline-secondary"
                            : "btn-outline-success"
                        }`}
                        onClick={() => handleDeactivateUser(user)}
                        title={
                          user.status === "active" ? "Deactivate" : "Activate"
                        }
                      >
                        <FaBan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      {showViewModal && (
        <ViewUserModel
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModel
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white rounded p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <h5 className="fw-semibold mb-3">Confirm Delete</h5>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>
              ?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation */}
      {showDeactivateConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white rounded p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <h5 className="fw-semibold mb-3">
              Confirm {userToDeactivate?.status === "active" ? "Deactivate" : "Activate"}
            </h5>
            <p className="mb-4">
              Are you sure you want to{" "}
              {userToDeactivate?.status === "active" ? "deactivate" : "activate"}{" "}
              <strong>
                {userToDeactivate?.firstName} {userToDeactivate?.lastName}
              </strong>
              ?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeactivateConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-warning" onClick={confirmDeactivate}>
                {userToDeactivate?.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
