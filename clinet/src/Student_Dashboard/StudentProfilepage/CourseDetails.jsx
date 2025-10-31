import React, { useState, useEffect } from "react";

const CourseDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    courseStartDate: "",
  });
  const [completion, setCompletion] = useState(0);

  const instituteCourses = [
    "Full Stack Java",
    "Full Stack Python",
    "Full Stack .NET",
    "Data Science",
    "Web Development",
  ];

  // Auto calculate completion
  useEffect(() => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "").length;
    setCompletion(Math.round((filled / fields.length) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h5 className="mb-1">Section 7: Institute Course Details</h5>
          <small className="text-muted">
            Completion: <strong>{completion}%</strong>
          </small>
        </div>

        {!isEditing ? (
          <button
            className="btn btn-primary btn-sm mt-2 mt-md-0"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2 mt-2 mt-md-0">
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
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
          {/* Course Name */}
          <div className="col-md-6">
            <label className="form-label">Course Name *</label>
            <select
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Course</option>
              {instituteCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Course Start Date */}
          <div className="col-md-6">
            <label className="form-label">Course Start Date *</label>
            <input
              type="date"
              name="courseStartDate"
              value={formData.courseStartDate}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
