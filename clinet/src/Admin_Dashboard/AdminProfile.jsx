import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars, FaTint, FaCamera, FaTrash } from "react-icons/fa";
import axios from "axios";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    profilePicturePath: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    email: "",
    phone: "",
  });

  const originalForm = React.useRef(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) {
          alert("User not found. Please login again.");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:8080/api/student/personal-info/${userId}`);
        const userData = res.data;
        
        setFormData({
          profilePicturePath: userData.profilePicturePath || "",
          firstName: userData.firstName || user.firstName || "",
          lastName: userData.lastName || user.lastName || "",
          mobileNumber: userData.mobileNumber || user.phone || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          bloodGroup: userData.bloodGroup || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setImagePreview(userData.profilePicturePath);
        originalForm.current = userData;
      } catch (err) {
        console.log("Error loading admin info", err);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          mobileNumber: user.phone || "",
          gender: "",
          dateOfBirth: "",
          bloodGroup: "",
          profilePicturePath: "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateImage = (file) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)";
    }

    if (file.size > maxSize) {
      return "Image size should be less than 5MB";
    }

    return null;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      alert(validationError);
      e.target.value = "";
      return;
    }

    setUploading(true);
    setImagePreview(URL.createObjectURL(file));

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/student/personal-info/upload-image/${userId}`,
        formDataImg,
        { 
          headers: { 
            "Content-Type": "multipart/form-data" 
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${progress}%`);
          }
        }
      );

      setFormData(prev => ({ ...prev, profilePicturePath: res.data.profilePicturePath }));

      const updatedUser = { ...user, profilePicturePath: res.data.profilePicturePath };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Image upload failed. Please try again.");
      setImagePreview(originalForm.current?.profilePicturePath);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeProfilePicture = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.userId;

      await axios.delete(`http://localhost:8080/api/student/personal-info/remove-image/${userId}`);
      
      setFormData(prev => ({ ...prev, profilePicturePath: "" }));
      setImagePreview(null);

      const updatedUser = { ...user, profilePicturePath: "" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      alert("Profile picture removed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove profile picture");
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.userId;

      if (!userId) {
        alert("User not found. Please login again.");
        return;
      }

      const payload = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
      };

      await axios.put("http://localhost:8080/api/student/personal-info/update", payload);

      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.mobileNumber,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      alert("Profile updated successfully");
      setIsEditing(false);
      originalForm.current = formData;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      alert(message);
    }
  };

  const handleCancel = () => {
    setFormData(originalForm.current);
    setImagePreview(originalForm.current?.profilePicturePath);
    setErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const showLetterAvatar = !imagePreview || imagePreview.includes("ui-avatars.com") || imagePreview.includes("/uploads/") === false;

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        {/* Header with Gradient */}
        <div className="card-header p-4 border-0" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-white">
              <h3 className="mb-1 fw-bold d-flex align-items-center">
                <FaUser className="me-2" />
                My Profile
              </h3>
              <p className="mb-0 opacity-75">Manage your personal information</p>
            </div>
            <button
              className="btn btn-light shadow d-flex align-items-center"
              onClick={() => navigate("/admin-dashboard/usermanagement")}
              style={{ borderRadius: '20px', padding: '10px 20px' }}
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Action Buttons */}
          <div className="d-flex justify-content-end mb-4">
            {!isEditing ? (
              <button 
                className="btn shadow d-flex align-items-center"
                onClick={() => setIsEditing(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '10px 24px',
                  border: 'none'
                }}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-secondary shadow d-flex align-items-center"
                  onClick={handleCancel}
                  style={{ borderRadius: '20px', padding: '10px 20px' }}
                >
                  <FaTimes className="me-2" />
                  Cancel
                </button>
                <button 
                  className="btn btn-success shadow d-flex align-items-center"
                  onClick={handleSave}
                  style={{ borderRadius: '20px', padding: '10px 20px' }}
                >
                  <FaSave className="me-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture Section */}
          <div className="text-center mb-5">
            <div className="d-flex flex-column align-items-center">
              <div className="position-relative mb-3">
                {showLetterAvatar ? (
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-lg"
                    style={{ 
                      width: "140px", 
                      height: "140px", 
                      fontSize: "56px", 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: "white",
                      border: '5px solid white'
                    }}
                  >
                    {formData.firstName?.[0]?.toUpperCase() || "A"}
                  </div>
                ) : (
                  <>
                    <img
                      src={`${imagePreview}?t=${Date.now()}`}
                      className="rounded-circle object-fit-cover shadow-lg"
                      style={{ 
                        width: "140px", 
                        height: "140px",
                        border: '5px solid white'
                      }}
                      alt="Profile"
                    />
                    {isEditing && imagePreview && (
                      <button
                        className="btn btn-danger btn-sm position-absolute rounded-circle shadow"
                        style={{ 
                          width: "36px", 
                          height: "36px",
                          top: '0',
                          right: '0',
                          padding: 0
                        }}
                        onClick={removeProfilePicture}
                        title="Remove profile picture"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </>
                )}
                {isEditing && (
                  <label 
                    className="btn btn-sm position-absolute rounded-circle shadow"
                    style={{ 
                      width: "36px", 
                      height: "36px",
                      bottom: '0',
                      right: '0',
                      padding: 0,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Upload profile picture"
                  >
                    <FaCamera />
                    <input 
                      type="file" 
                      className="d-none" 
                      accept=".jpg,.jpeg,.png,.gif,.webp" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <h4 className="fw-bold mb-1">{formData.firstName} {formData.lastName}</h4>
              <p className="text-muted mb-0">{formData.email}</p>
              
              {isEditing && (
                <div className="mt-3">
                  <small className="text-muted d-block">
                    {uploading ? (
                      <span className="text-primary">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Uploading...
                      </span>
                    ) : (
                      "📸 Supported formats: JPG, JPEG, PNG, GIF, WEBP (Max 5MB)"
                    )}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="row g-4">
            {/* Personal Information Section */}
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-header border-0 p-3" style={{ 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <h6 className="mb-0 fw-bold text-dark">👤 Personal Information</h6>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaUser className="me-2 text-primary" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaUser className="me-2 text-primary" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaVenusMars className="me-2 text-primary" />
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-select"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaCalendar className="me-2 text-primary" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaTint className="me-2 text-primary" />
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-select"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-header border-0 p-3" style={{ 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <h6 className="mb-0 fw-bold text-dark">📞 Contact Information</h6>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaEnvelope className="me-2 text-primary" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaPhone className="me-2 text-primary" />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        maxLength="10"
                        className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                      {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        <FaPhone className="me-2 text-primary" />
                        Alternate Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        maxLength="10"
                        className="form-control"
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          padding: '10px 15px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert border-0 shadow-sm mt-4" style={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: '12px'
          }}>
            <div className="d-flex align-items-start">
              <i className="bi bi-info-circle-fill text-primary me-3 fs-5"></i>
              <div>
                <strong className="text-primary">Administrator Note</strong>
                <p className="mb-0 text-secondary mt-1">
                  As an administrator, you can update your personal information here. Changes will be reflected across the system immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
