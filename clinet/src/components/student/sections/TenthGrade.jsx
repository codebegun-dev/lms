import React, { useState, useEffect } from 'react';
import './TenthGrade.css';

const TenthGrade = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    board: '',
    schoolName: '',
    yearOfPassout: '',
    marksPercentage: ''
  });

  const boards = [
    'CBSE',
    'ICSE',
    'State Board',
    'IB (International Baccalaureate)',
    'NIOS',
    'Other'
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('studentTenthGrade');
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
    localStorage.setItem('studentTenthGrade', JSON.stringify(formData));
  };

  const handleCancel = () => {
    setIsEditing(false);
    const savedData = localStorage.getItem('studentTenthGrade');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>10th Grade</h3>
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
            <label className="form-label">Board *</label>
            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">School Name *</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Enter school name"
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
        </div>
      </div>
    </div>
  );
};

export default TenthGrade;