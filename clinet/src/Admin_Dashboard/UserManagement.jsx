import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaBan, FaTimes, FaArrowLeft, FaSave, FaUserPlus } from "react-icons/fa";
import axios from "axios";

// ============================================
// AdminStudentProfileView Component (Full Details - For Students Only)
// ============================================
const AdminStudentProfileView = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);

  const sections = [
    { key: "personal", title: "Personal Information", storageKey: "studentPersonalInfo" },
    { key: "generic", title: "Generic Details", storageKey: "studentGenericInfo" },
    { key: "tenth", title: "10th Grade", storageKey: "studentTenthGrade" },
    { key: "twelfth", title: "12th Grade", storageKey: "studentTwelfthGrade" },
    { key: "ug", title: "UG Details", storageKey: "studentUGDetails" },
    { key: "pg", title: "PG Details", storageKey: "studentPGDetails" },
    { key: "course", title: "Course Details", storageKey: "studentCourseDetails" },
    { key: "projects", title: "Projects", storageKey: "studentProjects" },
    { key: "fee", title: "Fee Details", storageKey: "studentFeeDetails" },
  ];

  useEffect(() => {
    loadAllSections();
  }, []);

  const loadAllSections = async () => {
    try {
      setLoading(true);
      const loadedData = {};
      
      sections.forEach(section => {
        const data = JSON.parse(localStorage.getItem(section.storageKey) || "{}");
        loadedData[section.key] = data;
      });
      
      setSectionData(loadedData);
    } catch (error) {
      console.error("Error loading sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (key) => {
    setEditMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (key, storageKey, data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setSectionData((prev) => ({ ...prev, [key]: data }));
      setEditMode((prev) => ({ ...prev, [key]: false }));
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes");
    }
  };

  const Section = ({ title, sectionKey, storageKey }) => {
    const isEditing = editMode[sectionKey];
    const [formData, setFormData] = useState(sectionData[sectionKey] || {});

    useEffect(() => {
      setFormData(sectionData[sectionKey] || {});
    }, [sectionData, sectionKey]);

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div className="border rounded-3 mb-3 shadow-sm">
        <div
          className="bg-light p-3 d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        >
          <h6 className="mb-0 fw-semibold text-primary">
            <i className="bi bi-folder me-2"></i>
            {title}
          </h6>
          <div className="d-flex gap-2 align-items-center">
            {activeSection === sectionKey && (
              <button
                className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-outline-primary'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEdit(sectionKey);
                }}
              >
                {isEditing ? (
                  <>
                    <FaTimes className="me-1" /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="me-1" /> Edit
                  </>
                )}
              </button>
            )}
            <span className="text-primary fw-bold">
              {activeSection === sectionKey ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {activeSection === sectionKey && (
          <div className="p-4 bg-white">
            {Object.keys(formData).length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                <p className="text-muted mb-0 mt-2">No data available for this section</p>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {Object.entries(formData).map(([key, value]) => (
                    <div className="col-md-4" key={key}>
                      <label className="form-label fw-semibold text-secondary small text-capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={formData[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                        />
                      ) : (
                        <div className="p-2 bg-light rounded border">
                          {value || <span className="text-muted">-</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-4 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleEdit(sectionKey)}
                    >
                      <FaTimes className="me-1" />
                      Cancel
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSave(sectionKey, storageKey, formData)}
                    >
                      <FaSave className="me-1" />
                      Save Changes
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050, overflowY: "auto" }}
    >
      <div className="container py-4">
        <div className="bg-white rounded-3 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="bg-primary text-white p-4 border-bottom d-flex justify-content-between align-items-center rounded-top">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-person-circle me-2"></i>
                {user.firstName} {user.lastName}'s Complete Profile
              </h4>
              <p className="mb-0 small opacity-75">
                <span className="badge bg-light text-primary me-2">{user.role}</span>
                <span className="badge bg-light text-dark">{user.email}</span>
              </p>
            </div>
            <button
              className="btn btn-light rounded-circle"
              onClick={onClose}
              style={{ width: "40px", height: "40px" }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-3 bg-light border-bottom">
            <div className="alert alert-success mb-0 d-flex align-items-center">
              <i className="bi bi-shield-check me-2 fs-5"></i>
              <span className="fw-semibold">
                Admin Full Access - You can view and edit all sections of this student's profile
              </span>
            </div>
          </div>

          <div className="p-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading student information...</p>
              </div>
            ) : (
              <>
                {sections.map((section) => (
                  <Section
                    key={section.key}
                    title={section.title}
                    sectionKey={section.key}
                    storageKey={section.storageKey}
                  />
                ))}
              </>
            )}
          </div>

          <div className="bg-light p-3 border-top d-flex justify-content-between align-items-center rounded-bottom">
            <div className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              All changes are saved automatically to localStorage
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              <FaArrowLeft className="me-2" />
              Back to User Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EditUserModal Component (Personal Information Only)
// ============================================
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    surName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    parentMobileNumber: "",
    role: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPersonalInfo();
    }
  }, [user]);

  const loadPersonalInfo = async () => {
    try {
      setLoading(true);
      const personalInfo = JSON.parse(localStorage.getItem("studentPersonalInfo") || "{}");
      
      setFormData({
        firstName: user.firstName || personalInfo.firstName || "",
        lastName: user.lastName || personalInfo.lastName || "",
        surName: user.surName || personalInfo.surName || "",
        email: user.email || personalInfo.email || "",
        phone: user.phone || personalInfo.phone || "",
        gender: personalInfo.gender || "",
        dateOfBirth: personalInfo.dateOfBirth || "",
        bloodGroup: personalInfo.bloodGroup || "",
        parentMobileNumber: personalInfo.parentMobileNumber || "",
        role: user.role || "",
        status: user.status || "active",
      });
    } catch (error) {
      console.error("Error loading personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const personalInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      surName: formData.surName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      bloodGroup: formData.bloodGroup,
      parentMobileNumber: formData.parentMobileNumber,
    };
    localStorage.setItem("studentPersonalInfo", JSON.stringify(personalInfo));
    
    onUpdate({ ...user, ...formData });
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1060
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-primary text-white border-bottom">
            <h5 className="modal-title fw-semibold">
              <FaEdit className="me-2" />
              Edit Personal Information
            </h5>
            <button
              type="button"
              className="btn btn-light btn-sm rounded-circle"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          {loading ? (
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading personal information...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="alert alert-info d-flex align-items-center mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Update all personal information fields below</span>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
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

                  <div className="col-md-4">
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

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Sure Name</label>
                    <input
                      type="text"
                      name="surName"
                      className="form-control"
                      value={formData.surName}
                      onChange={handleChange}
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

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Blood Group</label>
                    <select
                      name="bloodGroup"
                      className="form-select"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Role *</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Admin</option>
                      <option value="INTERVIEWER">Interviewer</option>
                    </select>
                  </div>

                  <div className="col-md-3">
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
                  <FaSave className="me-1" />
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AddAdminForm Component
// ============================================
const AddAdminForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 3 || formData.firstName.length > 30)
      newErrors.firstName = "First name should be 3-30 characters";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 3 || formData.lastName.length > 30)
      newErrors.lastName = "Last name should be 3-30 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        password: "Admin@123",
        confirmPassword: "Admin@123",
        role: "ADMIN"
      };

      await axios.post("http://localhost:8080/api/user", payload);
      alert("Admin added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Unable to connect to server" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Add New Admin</h5>
        <button className="btn btn-light btn-sm" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="card-body">
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength="10"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>

          <div className="alert alert-info mt-3 mb-0">
            <strong>Default Password:</strong> Admin@123<br />
            The new admin will use this password to login.
          </div>

          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Adding..." : "Add Admin"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// Main UserManagement Component
// ============================================
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  const loadCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/user/all");
      
      const formattedUsers = response.data.map(user => ({
        id: user.userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        surName: user.surName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "STUDENT",
        status: user.status || "active",
        registeredDate: user.createdDate || new Date().toLocaleDateString(),
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users from server");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    setShowAddAdminForm(true);
  };

  const handleAddAdminSuccess = () => {
    loadUsers();
    setShowAddAdminForm(false);
  };

  const handleCloseAddAdmin = () => {
    setShowAddAdminForm(false);
  };

  const canPerformAction = (targetUser) => {
    // Only protect the currently logged-in admin
    if (currentUser?.role === "ADMIN" && targetUser.role === "ADMIN" && currentUser.id === targetUser.id) {
      return false;
    }
    return true;
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowFullProfileModal(true);
  };

  const handleEditUser = (user) => {
    if (!canPerformAction(user)) {
      alert("You cannot edit your own admin information from here!");
      return;
    }
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    if (!canPerformAction(user)) {
      alert("You cannot delete your own admin account!");
      return;
    }
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/user/${userToDelete.id}`);
      await loadUsers();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleDeactivateUser = (user) => {
    if (!canPerformAction(user)) {
      alert("You cannot change your own admin status!");
      return;
    }
    setUserToDeactivate(user);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = async () => {
    try {
      const newStatus = userToDeactivate.status === "active" ? "inactive" : "active";
      await axios.put(`http://localhost:8080/api/user/${userToDeactivate.id}/status`, { status: newStatus });
      await loadUsers();
      setShowDeactivateConfirm(false);
      setUserToDeactivate(null);
      alert(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:8080/api/user/${updatedUser.id}`, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        surName: updatedUser.surName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
      });
      await loadUsers();
      setShowEditModal(false);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="container bg-white rounded-4 shadow p-4 my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container bg-white rounded-4 shadow p-4 my-4">
      {/* Header with Add Admin Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-people-fill me-2"></i>
            User Management
          </h3>
          <p className="text-secondary mb-0">Manage all registered users - View complete profiles with edit access</p>
        </div>
        {!showAddAdminForm && (
          <button 
            className="btn btn-success d-flex align-items-center"
            onClick={handleAddAdmin}
          >
            <FaUserPlus className="me-2" />
            Add Admin
          </button>
        )}
      </div>

      {/* Add Admin Form */}
      {showAddAdminForm && (
        <AddAdminForm 
          onClose={handleCloseAddAdmin}
          onSuccess={handleAddAdminSuccess}
        />
      )}

      {/* User Management Content (hidden when showing Add Admin Form) */}
      {!showAddAdminForm && (
        <>
          {/* Controls */}
          <div className="row g-3 align-items-center mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
                <option value="INTERVIEWER">Interviewer</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={loadUsers}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Users
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-primary">
                <div className="card-body">
                  <h6 className="text-primary mb-0">Total Users</h6>
                  <h3 className="mb-0">{users.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-info">
                <div className="card-body">
                  <h6 className="text-info mb-0">Students</h6>
                  <h3 className="mb-0">{users.filter(u => u.role === "STUDENT").length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-danger">
                <div className="card-body">
                  <h6 className="text-danger mb-0">Admins</h6>
                  <h3 className="mb-0">{users.filter(u => u.role === "ADMIN").length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-success">
                <div className="card-body">
                  <h6 className="text-success mb-0">Active Users</h6>
                  <h3 className="mb-0">{users.filter(u => u.status === "active").length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
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
                  filteredUsers.map((user) => {
                    const isStudent = user.role === "STUDENT";
                    const isCurrentAdmin = currentUser?.id === user.id && user.role === "ADMIN";
                    const showViewButton = isStudent;
                    const showEditButton = !isCurrentAdmin;
                    const showDeleteButton = !isCurrentAdmin;
                    const showDeactivateButton = !isCurrentAdmin;

                    return (
                      <tr key={user.id}>
                        <td>{user.firstName || "-"}</td>
                        <td>{user.lastName || "-"}</td>
                        <td>{user.surName || "-"}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "ADMIN"
                                ? "bg-danger"
                                : user.role === "INTERVIEWER"
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
                            {showViewButton && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleViewUser(user)}
                                title="View Full Profile"
                              >
                                <FaEye />
                              </button>
                            )}
                            {showEditButton && (
                              <button
                                className="btn btn-sm btn-warning text-dark"
                                onClick={() => handleEditUser(user)}
                                title="Edit Personal Information"
                              >
                                <FaEdit />
                              </button>
                            )}
                            {showDeleteButton && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteUser(user)}
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            )}
                            {showDeactivateButton && (
                              <button
                                className={`btn btn-sm ${
                                  user.status === "active"
                                    ? "btn-outline-secondary"
                                    : "btn-outline-success"
                                }`}
                                onClick={() => handleDeactivateUser(user)}
                                title={
                                  user.status === "active" ? "Deactivate User" : "Activate User"
                                }
                              >
                                <FaBan />
                              </button>
                            )}
                            {isCurrentAdmin && (
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-person-check-fill me-1"></i>
                                You
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
                      <p className="mb-0 mt-2">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modals */}
      {showFullProfileModal && selectedUser && selectedUser.role === "STUDENT" && (
        <AdminStudentProfileView
          user={selectedUser}
          onClose={() => setShowFullProfileModal(false)}
        />
      )}

      {showEditModal && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}

      {showDeleteConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
          <div className="bg-white rounded p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <h5 className="fw-semibold mb-3 text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Confirm Delete
            </h5>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <FaTrash className="me-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
          <div className="bg-white rounded p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <h5 className="fw-semibold mb-3 text-warning">
              <i className="bi bi-exclamation-circle me-2"></i>
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
                <FaBan className="me-1" />
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