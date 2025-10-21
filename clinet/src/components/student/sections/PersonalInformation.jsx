import React, { useState, useEffect } from 'react';
import './PersonalInformation.css';

const PersonalInformation = ({ onCompletionChange, onProfilePicChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: '',
    firstName: '',
    lastName: '',
    surName: '',
    gender: '',
    dob: '',
    mobileNumber: '',
    parentMobile: '',
    bloodGroup: ''
  });

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
        onProfilePicChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f !== '').length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>Section 1: Personal Information</h3>
        {!isEditing ? (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="header-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="section-body">
        <div className="profile-pic-section">
          <label className="form-label">Profile Picture</label>
          <div className="pic-preview-box">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="preview-img" />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          {isEditing && (
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="file-input"
            />
          )}
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Sure Name</label>
            <input
              type="text"
              name="surName"
              value={formData.surName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Parent Mobile Number *</label>
            <input
              type="tel"
              name="parentMobile"
              value={formData.parentMobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
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
  );
};

export default PersonalInformation;