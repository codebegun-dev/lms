import React, { useState, useEffect } from "react";

const PersonalInformation = ({ onCompletionChange, onProfilePicChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    firstName: "",
    lastName: "",
    surName: "",
    gender: "",
    dob: "",
    mobileNumber: "",
    parentMobile: "",
    bloodGroup: "",
  });

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
        onProfilePicChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "").length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-semibold text-secondary">
          Section 1: Personal Information
        </h5>
        {!isEditing ? (
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        {/* Profile Picture Section */}
        <div className="text-center mb-4">
          <label className="form-label fw-semibold d-block">Profile Picture</label>
          <div
            className="d-flex justify-content-center align-items-center border border-primary rounded-circle overflow-hidden bg-light mx-auto ratio ratio-1x1"
            style={{ maxWidth: "150px" }}
          >
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="img-fluid rounded-circle object-fit-cover w-100 h-100"
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center text-muted small w-100 h-100">
                No Image
              </div>
            )}
          </div>


          {isEditing && (
            <div className="mt-3 d-flex justify-content-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control w-50"
              />
            </div>
          )}
        </div>

        {/* Form Grid */}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Sur Name</label>
            <input
              type="text"
              name="surName"
              value={formData.surName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Parent Mobile Number *</label>
            <input
              type="tel"
              name="parentMobile"
              value={formData.parentMobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
