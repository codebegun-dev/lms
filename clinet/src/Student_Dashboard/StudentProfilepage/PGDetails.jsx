import React, { useState, useEffect } from "react";

const PGDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasPG, setHasPG] = useState(false);
  const [hasBacklogs, setHasBacklogs] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: "",
    courseName: "",
    branch: "",
    marksPercentage: "",
    cgpa: "",
    yearOfPassout: "",
    activeBacklogs: "",
  });

  const pgCourses = ["M.Tech", "M.E", "MCA", "M.Sc", "MBA", "M.Com", "Other"];
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "Data Science",
    "AI/ML",
    "Other",
  ];

  useEffect(() => {
    calculateCompletion();
  }, [formData, hasPG]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCompletion = () => {
    if (!hasPG) {
      onCompletionChange(100);
      return;
    }
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "").length;
    const percentage = Math.round((filled / fields.length) * 100);
    if (onCompletionChange) onCompletionChange(percentage);
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  return (
    <div className="card shadow-sm mb-4">
      {/* Header */}
      <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center">
        <h5 className="mb-0">Section 6: PG Details</h5>

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
        {/* Do you have PG? */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Do you have post graduation certificate?
          </label>
          <div className="d-flex gap-4 mt-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="hasPG"
                checked={hasPG === true}
                onChange={() => setHasPG(true)}
                disabled={!isEditing}
              />
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="hasPG"
                checked={hasPG === false}
                onChange={() => setHasPG(false)}
                disabled={!isEditing}
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        {/* PG Details */}
        {hasPG && (
          <div className="row g-3">
            {/* College Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">College Name *</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
                placeholder="Enter college name"
              />
            </div>

            {/* Course Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Course Name *</label>
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="">Select Course</option>
                {pgCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Branch *</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Marks Percentage */}
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

            {/* CGPA */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">CGPA *</label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
                placeholder="Enter CGPA"
                min="0"
                max="10"
                step="0.01"
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

            {/* Backlog Question */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Do you have any backlog in college?
              </label>
              <div className="d-flex gap-4 mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasBacklogs"
                    checked={hasBacklogs === true}
                    onChange={() => setHasBacklogs(true)}
                    disabled={!isEditing}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hasBacklogs"
                    checked={hasBacklogs === false}
                    onChange={() => setHasBacklogs(false)}
                    disabled={!isEditing}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>

            {/* Active Backlogs */}
            {hasBacklogs && (
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Active Backlogs *
                </label>
                <select
                  name="activeBacklogs"
                  value={formData.activeBacklogs}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Select Backlogs</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
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
