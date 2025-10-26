import React, { useState, useEffect } from 'react';
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
    currentDistrict: '',
    currentSubDistrict: '',
    currentVillage: '',
    currentStreet: '',
    currentPincode: '',
    permanentState: '',
    permanentDistrict: '',
    permanentSubDistrict: '',
    permanentVillage: '',
    permanentStreet: '',
    permanentPincode: '',
    githubProfile: '',
    linkedinProfile: '',
    adhaarCard: null,
    resume: null
  });

  const [adhaarFileName, setAdhaarFileName] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'currentPincode' || name === 'permanentPincode') && value.length > 6) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'adhaar') {
          setFormData(prev => ({ ...prev, adhaarCard: reader.result }));
          setAdhaarFileName(file.name);
        } else if (type === 'resume') {
          setFormData(prev => ({ ...prev, resume: reader.result }));
          setResumeFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f !== '' && f !== null).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const viewDocument = (type) => {
    const doc = type === 'adhaar' ? formData.adhaarCard : formData.resume;
    if (doc) {
      const win = window.open();
      win.document.write(`<iframe src="${doc}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      alert(`No ${type} uploaded`);
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>Generic Details</h3>
        {!isEditing ? (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <div className="header-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="section-body">
        <div className="form-grid">
          {/* Work Experience */}
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

          {/* Career Gap */}
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

          {/* Current Address */}
          <div className="form-field full-width">
            <label className="form-label">Current Address</label>
          </div>

          <div className="form-field">
            <label className="form-label">State *</label>
            <select
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select State</option>
              {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">District *</label>
            <input
              type="text"
              name="currentDistrict"
              value={formData.currentDistrict}
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
              name="currentSubDistrict"
              value={formData.currentSubDistrict}
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
              name="currentVillage"
              value={formData.currentVillage}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter village/town"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Street/Building No/Floor</label>
            <input
              type="text"
              name="currentStreet"
              value={formData.currentStreet}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter street/building no/floor"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              name="currentPincode"
              value={formData.currentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
            />
          </div>

          {/* Permanent Address */}
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
              {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
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
            <label className="form-label">Street/Building No/Floor</label>
            <input
              type="text"
              name="permanentStreet"
              value={formData.permanentStreet}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter street/building no/floor"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              name="permanentPincode"
              value={formData.permanentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
            />
          </div>

          {/* GitHub & LinkedIn */}
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

          {/* Adhaar & Resume */}
          <div className="form-field">
            <label className="form-label">Adhaar Card *</label>
            {!isEditing ? (
              <div className="document-view">
                {formData.adhaarCard ? (
                  <button className="btn-view" onClick={() => viewDocument('adhaar')}>View Adhaar</button>
                ) : <span className="no-document">No document uploaded</span>}
              </div>
            ) : (
              <div className="file-upload-container">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'adhaar')}
                  className="file-input"
                  id="adhaar-upload"
                />
                <label htmlFor="adhaar-upload" className="file-label">Choose File</label>
                {adhaarFileName && (
                  <div className="file-info">
                    <span className="file-name">{adhaarFileName}</span>
                    <button className="btn-view-small" onClick={() => viewDocument('adhaar')} type="button">View</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Resume *</label>
            {!isEditing ? (
              <div className="document-view">
                {formData.resume ? (
                  <button className="btn-view" onClick={() => viewDocument('resume')}>View Resume</button>
                ) : <span className="no-document">No document uploaded</span>}
              </div>
            ) : (
              <div className="file-upload-container">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="file-input"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="file-label">Choose File</label>
                {resumeFileName && (
                  <div className="file-info">
                    <span className="file-name">{resumeFileName}</span>
                    <button className="btn-view-small" onClick={() => viewDocument('resume')} type="button">View</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericDetails;
