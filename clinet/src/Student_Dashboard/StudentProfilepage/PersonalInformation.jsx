import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PersonalInformation = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

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
  });

  const originalForm = useRef(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/student/personal-info/${userId}`
        );

        setFormData(res.data);
        setImagePreview(res.data.profilePicturePath);
        originalForm.current = res.data;
      } catch (err) {
        console.log("Error loading student info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/student/personal-info/upload-image/${userId}`,
        formDataImg,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFormData((prev) => ({
        ...prev,
        profilePicturePath: res.data.profilePicturePath,
      }));

      const updatedUser = {
        ...user,
        profilePicturePath: res.data.profilePicturePath,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      alert("Profile picture updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Image upload failed");
    }
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!formData.parentMobileNumber)
      newErrors.parentMobileNumber = "Parent mobile is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "DOB is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group required";
    if (!formData.gender) newErrors.gender = "Gender required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        userId,
        surName: formData.surName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        parentMobileNumber: formData.parentMobileNumber,
        bloodGroup: formData.bloodGroup,
      };

      await axios.put(
        "http://localhost:8080/api/student/personal-info/update",
        payload
      );

      alert("Profile updated successfully");
      setIsEditing(false);
      originalForm.current = formData;
    } catch (err) {
      const message = err.response?.data?.message;
      if (message) setErrors({ parentMobileNumber: message });
    }
  };

  const handleCancel = () => {
    setFormData(originalForm.current);
    setErrors({});
    setIsEditing(false);
  };

  if (loading) return <div>Loading Personal Info...</div>;

  const showLetterAvatar =
    !imagePreview ||
    imagePreview.includes("ui-avatars.com") ||
    imagePreview.includes("/uploads/") === false;

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Section 1: Personal Information</h5>

        {!isEditing ? (
          <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div>
            <button className="btn btn-secondary btn-sm me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="mb-3 text-center d-flex flex-column align-items-center">
          {showLetterAvatar ? (
            <div
              className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-bold"
              style={{ width: "110px", height: "110px", fontSize: "40px", color: "white" }}
            >
              {formData.firstName?.[0]?.toUpperCase() || "U"}
            </div>
          ) : (
            <img
              src={`${imagePreview}?t=${Date.now()}`}
              className="rounded-circle object-fit-cover"
              style={{ width: "110px", height: "110px" }}
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
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">First Name *</label>
            <input type="text" value={formData.firstName} disabled className="form-control" />
          </div>

          <div className="col-md-4">
            <label className="form-label">Last Name *</label>
            <input type="text" value={formData.lastName} disabled className="form-control" />
          </div>

          <div className="col-md-4">
            <label className="form-label">Sur Name</label>
            <input
              type="text"
              name="surName"
              value={formData.surName}
              disabled={!isEditing}
              onChange={handleChange}
              className={`form-control ${errors.surName && "is-invalid"}`}
            />
            {errors.surName && <div className="invalid-feedback">{errors.surName}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Mobile Number *</label>
            <input type="text" value={formData.mobileNumber} disabled className="form-control" />
          </div>

          <div className="col-md-4">
            <label className="form-label">Parent Mobile Number *</label>
            <input
              type="tel"
              name="parentMobileNumber"
              maxLength="10"
              value={formData.parentMobileNumber}
              disabled={!isEditing}
              onChange={handleChange}
              className={`form-control ${errors.parentMobileNumber && "is-invalid"}`}
            />
            {errors.parentMobileNumber && (
              <div className="invalid-feedback">{errors.parentMobileNumber}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              disabled={!isEditing}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`form-control ${errors.dateOfBirth && "is-invalid"}`}
            />
            {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              disabled={!isEditing}
              onChange={handleChange}
              className={`form-select ${errors.bloodGroup && "is-invalid"}`}
            >
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
            {errors.bloodGroup && <div className="invalid-feedback">{errors.bloodGroup}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              disabled={!isEditing}
              onChange={handleChange}
              className={`form-select ${errors.gender && "is-invalid"}`}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
