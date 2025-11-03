import React, { useState, useEffect } from 'react';
 
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
    <div className="card shadow-sm border-0 my-3">
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">10th Grade</h5>
        {!isEditing ? (
          <button
            className="btn btn-light btn-sm"
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
        <div className="row g-3">
          {/* Board */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Board *</label>
            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>

          {/* School Name */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">School Name *</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              placeholder="Enter school name"
            />
          </div>

          {/* Year of Passout */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Year of Passout *</label>
            <input
              type="number"
              name="yearOfPassout"
              value={formData.yearOfPassout}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              placeholder="YYYY"
              min="1950"
              max="2030"
            />
          </div>

          {/* Marks */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Marks in % *</label>
            <input
              type="number"
              name="marksPercentage"
              value={formData.marksPercentage}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
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
