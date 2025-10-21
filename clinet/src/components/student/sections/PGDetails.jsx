import React, { useState, useEffect } from 'react';
import './PGDetails.css';

const PGDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasPG, setHasPG] = useState(false);
  const [hasBacklogs, setHasBacklogs] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    courseName: '',
    branch: '',
    marksPercentage: '',
    cgpa: '',
    yearOfPassout: '',
    activeBacklogs: ''
  });

  const pgCourses = ['M.Tech', 'M.E', 'MCA', 'M.Sc', 'MBA', 'M.Com', 'Other'];
  const branches = [
    'Computer Science', 'Information Technology', 'Electronics', 'Electrical',
    'Mechanical', 'Civil', 'Chemical', 'Data Science', 'AI/ML', 'Other'
  ];

  useEffect(() => {
    calculateCompletion();
  }, [formData, hasPG]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateCompletion = () => {
    if (!hasPG) {
      onCompletionChange(100);
      return;
    }
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
        <h3>Section 6: PG Details</h3>
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
        <div className="pg-question">
          <label className="form-label">Do you have post graduation certificate?</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="hasPG"
                checked={hasPG === true}
                onChange={() => setHasPG(true)}
                disabled={!isEditing}
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasPG"
                checked={hasPG === false}
                onChange={() => setHasPG(false)}
                disabled={!isEditing}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {hasPG && (
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">College Name *</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter college name"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Course Name *</label>
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              >
                <option value="">Select Course</option>
                {pgCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Branch *</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Marks in % *</label>
              <input
                type="number"
                name="marksPercentage"
                value={formData.marksPercentage}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter percentage"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-field">
              <label className="form-label">CGPA *</label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter CGPA"
                min="0"
                max="10"
                step="0.01"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Year of Passout *</label>
              <input
                type="number"
                name="yearOfPassout"
                value={formData.yearOfPassout}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
                placeholder="YYYY"
                min="1950"
                max="2030"
              />
            </div>

            <div className="form-field full-width">
              <label className="form-label">Do you have any backlog in college?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasBacklogs"
                    checked={hasBacklogs === true}
                    onChange={() => setHasBacklogs(true)}
                    disabled={!isEditing}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasBacklogs"
                    checked={hasBacklogs === false}
                    onChange={() => setHasBacklogs(false)}
                    disabled={!isEditing}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {hasBacklogs && (
              <div className="form-field">
                <label className="form-label">Active Backlogs *</label>
                <select
                  name="activeBacklogs"
                  value={formData.activeBacklogs}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="">Select Backlogs</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PGDetails;