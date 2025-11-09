import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    profilePicturePath: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    surName: "",
    gender: "",
    dateOfBirth: "",
    parentMobileNumber: "",
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
          surName: userData.surName || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          parentMobileNumber: userData.parentMobileNumber || "",
          bloodGroup: userData.bloodGroup || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setImagePreview(userData.profilePicturePath);
        originalForm.current = userData;
      } catch (err) {
        console.log("Error loading admin info", err);
        // Load basic user info from localStorage if API fails
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          mobileNumber: user.phone || "",
          surName: "",
          gender: "",
          dateOfBirth: "",
          parentMobileNumber: "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFormData(prev => ({ ...prev, profilePicturePath: res.data.profilePicturePath }));

      const updatedUser = { ...user, profilePicturePath: res.data.profilePicturePath };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      alert("Profile picture updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Image upload failed");
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
        surName: formData.surName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        parentMobileNumber: formData.parentMobileNumber,
        bloodGroup: formData.bloodGroup,
      };

      await axios.put("http://localhost:8080/api/student/personal-info/update", payload);

      // Update user in localStorage
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
    setErrors({});
    setIsEditing(false);
  };

  if (loading) return <div className="container py-4 text-center">Loading Profile...</div>;

  const showLetterAvatar = !imagePreview || imagePreview.includes("ui-avatars.com") || imagePreview.includes("/uploads/") === false;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">
            My Profile - Personal Information
          </h4>
          <button
            className="btn btn-light d-flex align-items-center"
            onClick={() => navigate("/admin-dashboard/usermanagement")}
          >
            <FaArrowLeft className="me-2" />
            Back to User Management
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-end mb-4">
            {!isEditing ? (
              <button 
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-secondary d-flex align-items-center"
                  onClick={handleCancel}
                >
                  <FaTimes className="me-2" />
                  Cancel
                </button>
                <button 
                  className="btn btn-success d-flex align-items-center"
                  onClick={handleSave}
                >
                  <FaSave className="me-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="text-center mb-4">
            <div className="d-flex flex-column align-items-center">
              {showLetterAvatar ? (
                <div
                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-bold mb-3"
                  style={{ width: "120px", height: "120px", fontSize: "48px", color: "white" }}
                >
                  {formData.firstName?.[0]?.toUpperCase() || "A"}
                </div>
              ) : (
                <img
                  src={`${imagePreview}?t=${Date.now()}`}
                  className="rounded-circle object-fit-cover mb-3"
                  style={{ width: "120px", height: "120px" }}
                  alt="Profile"
                />
              )}

              {isEditing && (
                <div className="mt-2">
                  <input 
                    type="file" 
                    className="form-control form-control-sm" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <small className="text-muted">Upload new profile picture</small>
                </div>
              )}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Sure Name</label>
              <input
                type="text"
                name="surName"
                value={formData.surName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                disabled={!isEditing}
                maxLength="10"
                className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
              />
              {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-select"
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

          <div className="alert alert-info mt-4">
            <strong>Note:</strong> As an administrator, you can only update your personal information here. 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;