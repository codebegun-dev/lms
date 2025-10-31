import React, { useState, useEffect } from "react";

const TenthGrade = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hallTicketNumber: "",
    schoolName: "",
    yearOfPassout: "",
    marksPercentage: "",
  });

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "").length;
    const percentage = Math.round((filled / fields.length) * 100);
    if (onCompletionChange) onCompletionChange(percentage);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm mb-4">
      {/* Header */}
      <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center">
        <h5 className="mb-0">Section 3: 10th Grade</h5>

        {!isEditing ? (
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary btn-sm px-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-success btn-sm px-3"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="row g-3">
          {/* Hall Ticket */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Hall Ticket Number *</label>
            <input
              type="text"
              name="hallTicketNumber"
              value={formData.hallTicketNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              placeholder="Enter hall ticket number"
            />
          </div>

          {/* School Name */}
          <div className="col-md-4">
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
          <div className="col-md-4">
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

          {/* Marks Percentage */}
          <div className="col-md-4">
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
