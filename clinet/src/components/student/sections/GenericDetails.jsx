import React, { useState, useEffect, useRef } from 'react';
import './GenericDetails.css';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const GenericDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    workExperience: '',
    careerGap: '',
    currentState: '',
    permanentState: '',
    permanentDistrict: '',
    permanentSubDistrict: '',
    permanentVillage: '',
    pincode: '',
    preferredLocations: [],
    githubProfile: '',
    linkedinProfile: '',
    adhaarCard: null,
    resume: null
  });

  const [adhaarFileName, setAdhaarFileName] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pincode' && value.length > 6) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => {
      const currentLocations = prev.preferredLocations || [];
      const isSelected = currentLocations.includes(location);
      
      const updatedLocations = isSelected
        ? currentLocations.filter(loc => loc !== location)
        : [...currentLocations, location];
      
      return { ...prev, preferredLocations: updatedLocations };
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'adhaar') {
        setFormData(prev => ({ ...prev, adhaarCard: file }));
        setAdhaarFileName(file.name);
      } else if (type === 'resume') {
        setFormData(prev => ({ ...prev, resume: file }));
        setResumeFileName(file.name);
      }
    }
  };

  const calculateCompletion = () => {
    const fields = Object.entries(formData);
    const filled = fields.filter(([key, value]) => {
      if (key === 'preferredLocations') {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== '' && value !== null;
    }).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowLocationDropdown(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowLocationDropdown(false);
  };

  const viewDocument = (type) => {
    if (type === 'adhaar' && formData.adhaarCard) {
      alert('Opening Adhaar Card...');
    } else if (type === 'resume' && formData.resume) {
      alert('Opening Resume...');
    }
  };

  const getSelectedLocationsText = () => {
    const locations = formData.preferredLocations || [];
    if (locations.length === 0) return 'Select Preferred Locations';
    if (locations.length === 1) return locations[0];
    if (locations.length === 2) return locations.join(', ');
    return `${locations.slice(0, 2).join(', ')} +${locations.length - 2} more`;
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>Section 2: Generic Details</h3>
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
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Work Experience *</label>
            <select
              name="workExperience"
              value={formData.workExperience}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Career Gap</label>
            <select
              name="careerGap"
              value={formData.careerGap}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Career Gap</option>
              <option value="No Gap">No Gap</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="3+ Years">3+ Years</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Current State *</label>
            <select
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-field full-width">
            <label className="form-label">Permanent Address</label>
          </div>

          <div className="form-field">
            <label className="form-label">State *</label>
            <select
              name="permanentState"
              value={formData.permanentState}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">District *</label>
            <input
              type="text"
              name="permanentDistrict"
              value={formData.permanentDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter district"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Sub District</label>
            <input
              type="text"
              name="permanentSubDistrict"
              value={formData.permanentSubDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter sub district"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Village/Town *</label>
            <input
              type="text"
              name="permanentVillage"
              value={formData.permanentVillage}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter village/town"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Preferred Locations *</label>
            <div className="multi-select-wrapper" ref={dropdownRef}>
              <div
                className={`multi-select-input ${!isEditing ? 'disabled' : ''}`}
                onClick={() => isEditing && setShowLocationDropdown(!showLocationDropdown)}
              >
                <span className={formData.preferredLocations?.length > 0 ? '' : 'placeholder'}>
                  {getSelectedLocationsText()}
                </span>
                <span className="dropdown-arrow">▼</span>
              </div>

              {showLocationDropdown && isEditing && (
                <div className="multi-select-dropdown">
                  <div className="dropdown-header">
                    <span>Select Locations (Multiple)</span>
                    {formData.preferredLocations?.length > 0 && (
                      <button
                        className="clear-all-btn"
                        onClick={() => setFormData(prev => ({ ...prev, preferredLocations: [] }))}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="dropdown-options">
                    {indianStates.map(state => (
                      <label key={state} className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={formData.preferredLocations?.includes(state) || false}
                          onChange={() => handleLocationChange(state)}
                        />
                        <span>{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {!isEditing && formData.preferredLocations?.length > 0 && (
                <div className="selected-tags">
                  {formData.preferredLocations.map(location => (
                    <span key={location} className="tag">
                      {location}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">GitHub Profile</label>
            <input
              type="url"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-field">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Adhaar Card *</label>
            {!isEditing ? (
              <div className="document-view">
                {formData.adhaarCard ? (
                  <button className="btn-view" onClick={() => viewDocument('adhaar')}>
                    View Adhaar
                  </button>
                ) : (
                  <span className="no-document">No document uploaded</span>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'adhaar')}
                  className="file-input"
                />
                {adhaarFileName && <span className="file-name">{adhaarFileName}</span>}
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Resume *</label>
            {!isEditing ? (
              <div className="document-view">
                {formData.resume ? (
                  <button className="btn-view" onClick={() => viewDocument('resume')}>
                    View Resume
                  </button>
                ) : (
                  <span className="no-document">No document uploaded</span>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="file-input"
                />
                {resumeFileName && <span className="file-name">{resumeFileName}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericDetails;