import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaBan, FaTimes } from "react-icons/fa";

// ============================================
// EditUserModal Component
// ============================================
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        status: user.status || "active",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...user, ...formData });
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title fw-semibold">Edit User</h5>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-circle"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Role *</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Interviewer">Interviewer</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Status *</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ViewUserModel Helper Components
// ============================================
const Section = ({ title, children }) => (
  <div className="mb-4 pb-3 border-bottom">
    <h6 className="fw-semibold text-primary mb-3">{title}</h6>
    {children}
  </div>
);

const InfoGrid = ({ data }) => (
  <div className="row g-3">
    {data.map((item, index) => (
      <div className="col-md-4" key={index}>
        <div className="d-flex flex-column">
          <label className="fw-semibold text-secondary small">{item.label}:</label>
          <span className="text-dark">{item.value || "-"}</span>
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// ViewUserModel Component
// ============================================
const ViewUserModel = ({ user, onClose }) => {
  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title fw-semibold">User Profile</h5>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-circle"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          <div className="modal-body" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            {/* Basic Information */}
            <Section title="Basic Information">
              <InfoGrid
                data={[
                  { label: "First Name", value: user.firstName },
                  { label: "Last Name", value: user.lastName },
                  { label: "Email", value: user.email },
                  { label: "Phone", value: user.phone },
                  {
                    label: "Role",
                    value: (
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "bg-primary"
                            : user.role === "Interviewer"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role || "-"}
                      </span>
                    ),
                  },
                  {
                    label: "Status",
                    value: (
                      <span
                        className={`badge ${
                          user.status === "active" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.status || "-"}
                      </span>
                    ),
                  },
                ]}
              />
            </Section>

            {/* Personal Information */}
            {user.personalInfo && Object.keys(user.personalInfo).length > 0 && (
              <Section title="Personal Information">
                <InfoGrid
                  data={[
                    { label: "Sure Name", value: user.personalInfo.surName },
                    { label: "Gender", value: user.personalInfo.gender },
                    { label: "Date of Birth", value: user.personalInfo.dob },
                    { label: "Blood Group", value: user.personalInfo.bloodGroup },
                    { label: "Parent Mobile", value: user.personalInfo.parentMobile },
                  ]}
                />
              </Section>
            )}

            {/* Generic Details */}
            {user.genericInfo && Object.keys(user.genericInfo).length > 0 && (
              <Section title="Generic Details">
                <InfoGrid
                  data={[
                    { label: "Work Experience", value: user.genericInfo.workExperience },
                    { label: "Career Gap", value: user.genericInfo.careerGap },
                    { label: "Current State", value: user.genericInfo.currentState },
                    { label: "Current District", value: user.genericInfo.currentDistrict },
                    { label: "GitHub", value: user.genericInfo.githubProfile },
                    { label: "LinkedIn", value: user.genericInfo.linkedinProfile },
                  ]}
                />
              </Section>
            )}

            {/* 10th Grade */}
            {user.tenthGrade && Object.keys(user.tenthGrade).length > 0 && (
              <Section title="10th Grade">
                <InfoGrid
                  data={[
                    { label: "Board", value: user.tenthGrade.board },
                    { label: "School Name", value: user.tenthGrade.schoolName },
                    { label: "Year of Passout", value: user.tenthGrade.yearOfPassout },
                    { label: "Marks %", value: `${user.tenthGrade.marksPercentage || "-"}%` },
                  ]}
                />
              </Section>
            )}

            {/* 12th Grade */}
            {user.twelfthGrade && Object.keys(user.twelfthGrade).length > 0 && (
              <Section title="12th Grade">
                <InfoGrid
                  data={[
                    { label: "Board", value: user.twelfthGrade.board },
                    { label: "Group", value: user.twelfthGrade.group },
                    { label: "College Name", value: user.twelfthGrade.collegeName },
                    { label: "Year of Passout", value: user.twelfthGrade.yearOfPassout },
                    { label: "Marks %", value: `${user.twelfthGrade.marksPercentage || "-"}%` },
                  ]}
                />
              </Section>
            )}

            {/* UG Details */}
            {user.ugDetails && Object.keys(user.ugDetails).length > 0 && (
              <Section title="UG Details">
                <InfoGrid
                  data={[
                    { label: "University Roll No", value: user.ugDetails.universityRollNo },
                    { label: "College Name", value: user.ugDetails.collegeName },
                    { label: "Course", value: user.ugDetails.courseName },
                    { label: "Branch", value: user.ugDetails.branch },
                    { label: "CGPA", value: user.ugDetails.cgpa },
                    { label: "Active Backlogs", value: user.ugDetails.activeBacklogs || "0" },
                  ]}
                />
              </Section>
            )}
          </div>

          <div className="modal-footer bg-light border-top">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main UserManagement Component
// ============================================
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
        <EditUserModal
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