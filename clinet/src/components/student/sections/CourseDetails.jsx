import React, { useState, useEffect } from 'react';
import './CourseDetails.css';

const CourseDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    courseStartDate: ''
  });

  const instituteCourses = [
    'Full Stack Java',
    'Full Stack Python',
    'Full Stack .NET',
    'Data Science',
    'Web Development'
  ];

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <h3>Institute Course Details</h3>
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
            <label className="form-label">Course Name *</label>
            <select
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Course</option>
              {instituteCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Course Start Date *</label>
            <input
              type="date"
              name="courseStartDate"
              value={formData.courseStartDate}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;