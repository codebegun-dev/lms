import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaBan, FaTimes, FaArrowLeft, FaSave, FaUserPlus, FaCheckCircle, FaTimesCircle, FaUsers, FaUserShield, FaUserTie, FaFilter } from "react-icons/fa";
import axios from "axios";

// ============================================
// AdminUserProfileView Component (Full Details - For All Users)
// ============================================
const AdminUserProfileView = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);

  const sections = [
    { key: "personal", title: "Personal Information", storageKey: `user_${user.id}_personalInfo`, icon: "👤" },
    { key: "generic", title: "Generic Details", storageKey: `user_${user.id}_genericInfo`, icon: "📋" },
    { key: "tenth", title: "10th Grade", storageKey: `user_${user.id}_tenthGrade`, icon: "🎓" },
    { key: "twelfth", title: "12th Grade", storageKey: `user_${user.id}_twelfthGrade`, icon: "📚" },
    { key: "ug", title: "UG Details", storageKey: `user_${user.id}_ugDetails`, icon: "🎯" },
    { key: "pg", title: "PG Details", storageKey: `user_${user.id}_pgDetails`, icon: "🏆" },
    { key: "course", title: "Course Details", storageKey: `user_${user.id}_courseDetails`, icon: "📖" },
    { key: "projects", title: "Projects", storageKey: `user_${user.id}_projects`, icon: "💼" },
    { key: "fee", title: "Fee Details", storageKey: `user_${user.id}_feeDetails`, icon: "💰" },
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

  const Section = ({ title, sectionKey, storageKey, icon }) => {
    const isEditing = editMode[sectionKey];
    const [formData, setFormData] = useState(sectionData[sectionKey] || {});

    useEffect(() => {
      setFormData(sectionData[sectionKey] || {});
    }, [sectionData, sectionKey]);

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div className="border rounded-3 mb-3 shadow-sm overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <div
          className="p-3 d-flex justify-content-between align-items-center"
          style={{ 
            cursor: "pointer", 
            background: activeSection === sectionKey ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        >
          <h6 className={`mb-0 fw-semibold d-flex align-items-center ${activeSection === sectionKey ? 'text-white' : 'text-dark'}`}>
            <span className="me-2" style={{ fontSize: '1.2rem' }}>{icon}</span>
            {title}
          </h6>
          <div className="d-flex gap-2 align-items-center">
            {activeSection === sectionKey && (
              <button
                className={`btn btn-sm ${isEditing ? 'btn-light' : 'btn-outline-light'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEdit(sectionKey);
                }}
                style={{ borderRadius: '20px', padding: '4px 12px' }}
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
            <span className={`fw-bold ${activeSection === sectionKey ? 'text-white' : 'text-primary'}`}>
              {activeSection === sectionKey ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {activeSection === sectionKey && (
          <div className="p-4 bg-white">
            {Object.keys(formData).length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '4rem', opacity: 0.3 }}>📭</div>
                <p className="text-muted mb-0 mt-2">No data available for this section</p>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {Object.entries(formData).map(([key, value]) => (
                    <div className="col-md-6" key={key}>
                      <label className="form-label fw-semibold text-secondary small text-capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control"
                          value={formData[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                          style={{ borderRadius: '8px' }}
                        />
                      ) : (
                        <div className="p-2 bg-light rounded border" style={{ borderRadius: '8px', minHeight: '38px' }}>
                          {value || <span className="text-muted">-</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-4 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => toggleEdit(sectionKey)}
                      style={{ borderRadius: '20px' }}
                    >
                      <FaTimes className="me-1" />
                      Cancel
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSave(sectionKey, storageKey, formData)}
                      style={{ borderRadius: '20px' }}
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
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050, backdropFilter: 'blur(5px)' }}
    >
      <div className="container py-4" style={{ maxHeight: '95vh', overflowY: 'auto' }}>
        <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1rem 1rem 0 0'
          }}>
            <div className="text-white">
              <h4 className="mb-2 fw-bold d-flex align-items-center">
                <span className="me-2" style={{ fontSize: '1.5rem' }}>👤</span>
                {user.firstName} {user.lastName}'s Complete Profile
              </h4>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-dark px-3 py-2">{user.role}</span>
                <span className="badge bg-white text-dark px-3 py-2">{user.email}</span>
                <span className="badge bg-white text-dark px-3 py-2">ID: {user.id}</span>
              </div>
            </div>
            <button
              className="btn btn-light rounded-circle shadow"
              onClick={onClose}
              style={{ width: "45px", height: "45px" }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-3" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="alert alert-success mb-0 d-flex align-items-center border-0 shadow-sm">
              <FaCheckCircle className="me-2 fs-5" />
              <span className="fw-semibold">
                Admin Full Access - You can view and edit all sections of this user's profile
              </span>
            </div>
          </div>

          <div className="p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-semibold">Loading user information...</p>
              </div>
            ) : (
              <>
                {sections.map((section) => (
                  <Section
                    key={section.key}
                    title={section.title}
                    sectionKey={section.key}
                    storageKey={section.storageKey}
                    icon={section.icon}
                  />
                ))}
              </>
            )}
          </div>

          <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ background: '#f8f9fa', borderRadius: '0 0 1rem 1rem' }}>
            <div className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              All changes are saved automatically to localStorage
            </div>
            <button className="btn btn-primary shadow" onClick={onClose} style={{ borderRadius: '20px' }}>
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
// EditUserModal Component (Basic Info View)
// ============================================
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
      const personalInfo = JSON.parse(localStorage.getItem(`user_${user.id}_personalInfo`) || "{}");
      
      setFormData({
        firstName: user.firstName || personalInfo.firstName || "",
        lastName: user.lastName || personalInfo.lastName || "",
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

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060, backdropFilter: 'blur(5px)' }}
    >
      <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "900px", width: "90%" }}>
        <div className="p-4 border-bottom" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem 1rem 0 0'
        }}>
          <div className="d-flex justify-content-between align-items-center text-white">
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              <FaEye className="me-2" />
              View Basic Information - {user.firstName} {user.lastName}
            </h5>
            <button
              type="button"
              className="btn btn-light rounded-circle shadow"
              onClick={onClose}
              style={{ width: "40px", height: "40px" }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading user information...</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm">
              <i className="bi bi-info-circle me-2 fs-5"></i>
              <span>View-only mode - Basic profile information</span>
            </div>

            <div className="row g-3">
              {[
                { label: "First Name", value: formData.firstName },
                { label: "Last Name", value: formData.lastName },
                { label: "Email", value: formData.email },
                { label: "Phone", value: formData.phone },
                { label: "Gender", value: formData.gender },
                { label: "Date of Birth", value: formData.dateOfBirth },
                { label: "Blood Group", value: formData.bloodGroup },
                { label: "Parent Mobile", value: formData.parentMobileNumber },
                { label: "Role", value: formData.role },
                { label: "Status", value: formData.status }
              ].map((field, idx) => (
                <div className="col-md-6" key={idx}>
                  <label className="form-label fw-semibold text-secondary">{field.label}</label>
                  <div className="p-3 bg-light rounded border" style={{ borderRadius: '8px' }}>
                    {field.value || <span className="text-muted">-</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-top d-flex justify-content-end" style={{ background: '#f8f9fa', borderRadius: '0 0 1rem 1rem' }}>
          <button className="btn btn-primary shadow" onClick={onClose} style={{ borderRadius: '20px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// AddUserForm Component
// ============================================
const AddUserForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setErrors({ general: "Unable to load roles" });
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? Number(value) : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate
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

    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Get adminAuthId from logged-in user
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const adminId = loggedUser?.userId ? Number(loggedUser.userId) : null;

    if (!adminId) {
      setErrors({ general: "Admin session expired. Please login again." });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roleId: formData.role,
        adminAuthId: adminId,
      };

      await axios.post("http://localhost:8080/api/user", payload);

      alert("User added successfully!");
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
    <div className="card mb-4 border-0 shadow-lg rounded-4 overflow-hidden">
      {/* Header */}
      <div
        className="card-header p-4 d-flex justify-content-between align-items-center"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <h5 className="mb-0 text-white fw-bold d-flex align-items-center">
          <FaUserPlus className="me-2" />
          Add New User
        </h5>

        <button
          className="btn btn-light rounded-circle shadow"
          onClick={onClose}
          style={{ width: "40px", height: "40px" }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-4">
        {errors.general && (
          <div className="alert alert-danger border-0 shadow-sm">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* First Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                placeholder="Enter first name"
                style={{ borderRadius: "8px" }}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            {/* Last Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                placeholder="Enter last name"
                style={{ borderRadius: "8px" }}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter email"
                style={{ borderRadius: "8px" }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone *</label>
              <input
                type="text"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Enter phone number"
                style={{ borderRadius: "8px" }}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Role Dropdown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-select ${errors.role ? "is-invalid" : ""}`}
                style={{ borderRadius: "8px" }}
                disabled={loadingRoles}
              >
                <option value="">
                  {loadingRoles ? "Loading roles..." : "Select Role"}
                </option>
                {!loadingRoles &&
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success shadow"
              disabled={loading}
              style={{ borderRadius: "20px" }}
            >
              {loading ? "Adding..." : "Add User"}
            </button>

            <button
              type="button"
              className="btn btn-secondary shadow"
              onClick={onClose}
              style={{ borderRadius: "20px" }}
            >
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
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
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

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleAddUserSuccess = () => {
    loadUsers();
    setShowAddUserForm(false);
  };

  const handleCloseAddUser = () => {
    setShowAddUserForm(false);
  };

  // UPDATED: Protection for current admin actions
  const canPerformAction = (targetUser) => {
    // Prevent current admin from modifying their own account
    if (currentUser?.role === "ADMIN" && 
        targetUser.role === "ADMIN" && 
        currentUser.userId === targetUser.id) {
      return false;
    }
    return true;
  };

  const handleViewBasicInfo = (user) => {
    setSelectedUser(user);
    setShowBasicInfoModal(true);
  };

  const handleEditFullProfile = (user) => {
    setSelectedUser(user);
    setShowFullProfileModal(true);
  };

  const handleDeleteUser = (user) => {
    if (!canPerformAction(user)) {
      alert("⚠️ Protected Action: You cannot delete your own admin account!");
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
      alert("✅ User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Failed to delete user");
    }
  };

  const handleDeactivateUser = (user) => {
    if (!canPerformAction(user)) {
      alert("⚠️ Protected Action: You cannot change your own admin account status!");
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
      alert(`✅ User ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("❌ Failed to update user status");
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
      <div className="container bg-white rounded-4 shadow-lg p-5 my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="bg-white rounded-4 shadow-lg p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
              <span className="me-2" style={{ fontSize: '2rem' }}>👥</span>
              User Management System
            </h2>
            <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
          </div>
          {!showAddUserForm && (
            <button 
              className="btn btn-success shadow d-flex align-items-center"
              onClick={handleAddUser}
              style={{ borderRadius: '20px', padding: '12px 24px' }}
            >
              <FaUserPlus className="me-2" />
              Add New User
            </button>
          )}
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <AddUserForm 
            onClose={handleCloseAddUser}
            onSuccess={handleAddUserSuccess}
          />
        )}

        {/* Main Content */}
        {!showAddUserForm && (
          <>
            {/* Search and Filter Controls */}
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <div className="input-group shadow-sm">
                  <span className="input-group-text border-0" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search by name or email..."
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
                    <option value="STUDENT">Students</option>
                    <option value="ADMIN">Admins</option>
                    <option value="INTERVIEWER">Interviewers</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-outline-primary w-100 shadow-sm d-flex align-items-center justify-content-center" 
                  onClick={loadUsers}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md">
                <div className="card border-0 shadow-sm h-100" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="card-body text-white text-center">
                    <FaUsers className="mb-2" style={{ fontSize: '2rem' }} />
                    <h6 className="mb-1 opacity-75">Total Users</h6>
                    <h2 className="mb-0 fw-bold">{users.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card border-0 shadow-sm h-100" style={{ 
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="card-body text-white text-center">
                    <i className="bi bi-mortarboard-fill mb-2" style={{ fontSize: '2rem' }}></i>
                    <h6 className="mb-1 opacity-75">Students</h6>
                    <h2 className="mb-0 fw-bold">{users.filter(u => u.role === "STUDENT").length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card border-0 shadow-sm h-100" style={{ 
                  background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="card-body text-white text-center">
                    <FaUserShield className="mb-2" style={{ fontSize: '2rem' }} />
                    <h6 className="mb-1 opacity-75">Admins</h6>
                    <h2 className="mb-0 fw-bold">{users.filter(u => u.role === "ADMIN").length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card border-0 shadow-sm h-100" style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="card-body text-white text-center">
                    <FaUserTie className="mb-2" style={{ fontSize: '2rem' }} />
                    <h6 className="mb-1 opacity-75">Interviewers</h6>
                    <h2 className="mb-0 fw-bold">{users.filter(u => u.role === "INTERVIEWER").length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card border-0 shadow-sm h-100" style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="card-body text-white text-center">
                    <FaCheckCircle className="mb-2" style={{ fontSize: '2rem' }} />
                    <h6 className="mb-1 opacity-75">Active</h6>
                    <h2 className="mb-0 fw-bold">{users.filter(u => u.status === "active").length}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <tr>
                        <th className="border-0 py-3 ps-4">User ID</th>
                        <th className="border-0 py-3">Name</th>
                        <th className="border-0 py-3">Email</th>
                        <th className="border-0 py-3">Phone</th>
                        <th className="border-0 py-3">Role</th>
                        <th className="border-0 py-3">Status</th>
                        <th className="border-0 py-3 text-center pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const isCurrentAdmin = currentUser?.userId === user.id && user.role === "ADMIN";
                          const isStudent = user.role === "STUDENT";
                          const actionProtected = !canPerformAction(user);

                          return (
                            <tr key={user.id} style={{ transition: 'all 0.3s ease' }}>
                              <td className="fw-semibold ps-4 align-middle">
                                <span className="badge bg-light text-dark px-3 py-2">{user.id}</span>
                              </td>
                              <td className="align-middle">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-gradient d-flex align-items-center justify-content-center me-2" 
                                       style={{ 
                                         width: '35px', 
                                         height: '35px',
                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                         color: 'white',
                                         fontWeight: 'bold'
                                       }}>
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                  </div>
                                  <span className="fw-semibold">{user.firstName} {user.lastName}</span>
                                </div>
                              </td>
                              <td className="align-middle text-secondary">{user.email}</td>
                              <td className="align-middle text-secondary">{user.phone}</td>
                              <td className="align-middle">
                                <span
                                  className={`badge px-3 py-2 ${
                                    user.role === "ADMIN"
                                      ? "bg-danger"
                                      : user.role === "INTERVIEWER"
                                      ? "bg-warning text-dark"
                                      : "bg-info text-dark"
                                  }`}
                                  style={{ borderRadius: '20px' }}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="align-middle">
                                <span
                                  className={`badge px-3 py-2 ${
                                    user.status === "active" ? "bg-success" : "bg-secondary"
                                  }`}
                                  style={{ borderRadius: '20px' }}
                                >
                                  {user.status === "active" ? (
                                    <>
                                      <FaCheckCircle className="me-1" /> Active
                                    </>
                                  ) : (
                                    <>
                                      <FaTimesCircle className="me-1" /> Inactive
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="align-middle text-center pe-4">
                                <div className="d-flex justify-content-center gap-2">
                                  {/* Edit Full Profile - For ALL users */}
                                  <button
                                    className="btn btn-sm shadow-sm"
                                    onClick={() => handleEditFullProfile(user)}
                                    title="Edit Full Profile"
                                    style={{ 
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      color: 'white',
                                      borderRadius: '8px',
                                      border: 'none'
                                    }}
                                  >
                                    <FaEdit />
                                  </button>
                                  
                                  {/* View Basic Info - Only for STUDENTS */}
                                  {isStudent && (
                                    <button
                                      className="btn btn-sm btn-warning shadow-sm"
                                      onClick={() => handleViewBasicInfo(user)}
                                      title="View Basic Info"
                                      style={{ borderRadius: '8px' }}
                                    >
                                      <FaEye />
                                    </button>
                                  )}
                                  
                                  {/* Protected Actions Badge for Current Admin */}
                                  {actionProtected ? (
                                    <span className="badge bg-warning text-dark px-3 py-2 d-flex align-items-center" style={{ borderRadius: '20px' }}>
                                      <i className="bi bi-shield-lock-fill me-1"></i>
                                      Protected
                                    </span>
                                  ) : (
                                    <>
                                      {/* Deactivate/Activate Button */}
                                      <button
                                        className={`btn btn-sm shadow-sm ${
                                          user.status === "active"
                                            ? "btn-outline-secondary"
                                            : "btn-outline-success"
                                        }`}
                                        onClick={() => handleDeactivateUser(user)}
                                        title={user.status === "active" ? "Deactivate User" : "Activate User"}
                                        style={{ borderRadius: '8px' }}
                                      >
                                        <FaBan />
                                      </button>
                                      
                                      {/* Delete Button */}
                                      <button
                                        className="btn btn-sm btn-outline-danger shadow-sm"
                                        onClick={() => handleDeleteUser(user)}
                                        title="Delete User"
                                        style={{ borderRadius: '8px' }}
                                      >
                                        <FaTrash />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <div style={{ fontSize: '4rem', opacity: 0.3 }}>📭</div>
                            <p className="text-muted mb-0 mt-2 fw-semibold">No users found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showFullProfileModal && selectedUser && (
        <AdminUserProfileView
          user={selectedUser}
          onClose={() => setShowFullProfileModal(false)}
        />
      )}

      {showBasicInfoModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowBasicInfoModal(false)}
          onUpdate={() => {}}
        />
      )}

      {showDeleteConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060, backdropFilter: 'blur(5px)' }}>
          <div className="bg-white rounded-4 p-4 shadow-lg" style={{ maxWidth: "450px" }}>
            <div className="text-center mb-3">
              <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <FaTrash className="text-danger" style={{ fontSize: '1.5rem' }} />
              </div>
              <h5 className="fw-bold mb-2">Confirm Delete</h5>
              <p className="text-secondary mb-0">
                Are you sure you want to delete{" "}
                <strong className="text-dark">
                  {userToDelete?.firstName} {userToDelete?.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-secondary shadow-sm"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ borderRadius: '20px', padding: '8px 24px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger shadow-sm" 
                onClick={confirmDelete}
                style={{ borderRadius: '20px', padding: '8px 24px' }}
              >
                <FaTrash className="me-1" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060, backdropFilter: 'blur(5px)' }}>
          <div className="bg-white rounded-4 p-4 shadow-lg" style={{ maxWidth: "450px" }}>
            <div className="text-center mb-3">
              <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <FaBan className="text-warning" style={{ fontSize: '1.5rem' }} />
              </div>
              <h5 className="fw-bold mb-2">
                Confirm {userToDeactivate?.status === "active" ? "Deactivation" : "Activation"}
              </h5>
              <p className="text-secondary mb-0">
                Are you sure you want to{" "}
                {userToDeactivate?.status === "active" ? "deactivate" : "activate"}{" "}
                <strong className="text-dark">
                  {userToDeactivate?.firstName} {userToDeactivate?.lastName}
                </strong>
                ?
              </p>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-secondary shadow-sm"
                onClick={() => setShowDeactivateConfirm(false)}
                style={{ borderRadius: '20px', padding: '8px 24px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-warning shadow-sm" 
                onClick={confirmDeactivate}
                style={{ borderRadius: '20px', padding: '8px 24px' }}
              >
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