import React, { useState, useEffect } from 'react';
import './UGDetails.css';

const UGDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    universityRollNo: '',
    collegeName: '',
    courseName: '',
    branch: '',
    yearOfPassout: '',
    marksPercentage: '',
    cgpa: '',
    activeBacklogs: ''
  });

  const ugCourses = ['B.Tech', 'B.E', 'BCA', 'B.Sc', 'B.Com', 'BBA', 'BA', 'Other'];
  
  const courseBranches = {
    'B.Tech': ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology'],
    'B.E': ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical'],
    'BCA': ['Computer Applications', 'Data Science', 'Cyber Security', 'Software Development'],
    'B.Sc': ['Computer Science', 'Information Technology', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Statistics'],
    'B.Com': ['General', 'Accounting & Finance', 'Banking', 'E-Commerce'],
    'BBA': ['General', 'Finance', 'Marketing', 'Human Resources', 'International Business'],
    'BA': ['Economics', 'English', 'History', 'Political Science', 'Psychology', 'Sociology'],
    'Other': ['Other']
  };

  useEffect(() => {
    const savedData = localStorage.getItem('studentUGDetails');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    calculateCompletion();
  }, []);

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset branch when course changes
    if (name === 'courseName') {
      setFormData(prev => ({ ...prev, [name]: value, branch: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
    localStorage.setItem('studentUGDetails', JSON.stringify(formData));
  };

  const handleCancel = () => {
    setIsEditing(false);
    const savedData = localStorage.getItem('studentUGDetails');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  };

  const getAvailableBranches = () => {
    return courseBranches[formData.courseName] || [];
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>UG Details</h3>
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
            <label className="form-label">University Roll No *</label>
            <input
              type="text"
              name="universityRollNo"
              value={formData.universityRollNo}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter roll number"
            />
          </div>

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
              {ugCourses.map(course => (
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
              disabled={!isEditing || !formData.courseName}
              className="form-input"
            >
              <option value="">Select Branch</option>
              {getAvailableBranches().map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            {!formData.courseName && isEditing && (
              <small className="text-muted">Please select a course first</small>
            )}
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
            <label className="form-label">Active Backlogs *</label>
            <select
              name="activeBacklogs"
              value={formData.activeBacklogs}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Backlogs</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UGDetails;