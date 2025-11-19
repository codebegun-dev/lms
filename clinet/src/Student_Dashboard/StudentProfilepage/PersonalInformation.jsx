import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PersonalInformation = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    profilePicturePath: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    parentMobileNumber: "",
    bloodGroup: "",
    file: null
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

  const validateImage = (file) => {
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)";
    }

    if (file.size > maxSize) {
      return "Image size should be less than 5MB";
    }

    return null;
  };

  // ⛔ NO UPLOAD API HERE — only store file for save()
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      alert(validationError);
      e.target.value = "";
      return;
    }

    setImagePreview(URL.createObjectURL(file));

    setFormData((prev) => ({ ...prev, file }));
    e.target.value = "";
  };

  // ✅ Unified PUT update with multipart
  const handleSave = async () => {
    const newErrors = {};
    if (!formData.parentMobileNumber) newErrors.parentMobileNumber = "Parent mobile is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "DOB is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group required";
    if (!formData.gender) newErrors.gender = "Gender required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const multipart = new FormData();

      const payload = {
        userId,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        parentMobileNumber: formData.parentMobileNumber,
        bloodGroup: formData.bloodGroup,
      };

      multipart.append(
        "info",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      // attach image only if selected
      if (formData.file) {
        multipart.append("file", formData.file);
      }

      const res = await axios.put(
        "http://localhost:8080/api/student/personal-info/update",
        multipart,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully");

      setIsEditing(false);
      setFormData(res.data);
      setImagePreview(res.data.profilePicturePath);
      originalForm.current = res.data;

    } catch (err) {
      const message = err.response?.data?.message;
      if (message) setErrors({ parentMobileNumber: message });
    }
  };

  const handleCancel = () => {
    setFormData(originalForm.current);
    setImagePreview(originalForm.current?.profilePicturePath);
    setErrors({});
    setIsEditing(false);
  };

  const removeProfilePicture = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    const multipart = new FormData();

    const payload = {
      userId,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      parentMobileNumber: formData.parentMobileNumber,
      bloodGroup: formData.bloodGroup,
    };

    multipart.append(
      "info",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    axios
      .put("http://localhost:8080/api/student/personal-info/update", multipart, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setFormData(res.data);
        setImagePreview(null);
        alert("Profile picture removed successfully!");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to remove profile picture");
      });
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
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsEditing(true)}
          >
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
            <div className="position-relative">
              <img
                src={`${imagePreview}?t=${Date.now()}`}
                className="rounded-circle object-fit-cover"
                style={{ width: "110px", height: "110px" }}
                alt="Profile"
              />
              {isEditing && imagePreview && (
                <button
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                  style={{ width: "30px", height: "30px" }}
                  onClick={removeProfilePicture}
                  title="Remove profile picture"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {isEditing && (
            <div className="mt-2">
              <input
                type="file"
                className="form-control form-control-sm"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleImageUpload}
              />
              <small className="text-muted">
                Supported formats: JPG, JPEG, PNG, GIF, WEBP (Max 5MB)
              </small>
            </div>
          )}
        </div>

        {/* FORM */}
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
            <label className="form-label">Email *</label>
            <input type="email" value={formData.email} disabled className="form-control" />
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
            {errors.dateOfBirth && (
              <div className="invalid-feedback">{errors.dateOfBirth}</div>
            )}
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
            {errors.bloodGroup && (
              <div className="invalid-feedback">{errors.bloodGroup}</div>
            )}
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
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
