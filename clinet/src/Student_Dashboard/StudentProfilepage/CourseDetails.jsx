import React, { useState, useEffect } from "react";

const CourseDetails = () => {
  const [formData] = useState({
    courseName: "Full Stack Java",
    courseStartDate: "2025-02-15",
    batchName: "Batch A-2025",
  });

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const { courseName, courseStartDate } = formData;
    const filled = [courseName, courseStartDate].filter((f) => f !== "").length;
    setCompletion(Math.round((filled / 2) * 100));
  }, [formData]);

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h5 className="mb-1">Section 7: Institute Course Details</h5>
          <small className="text-muted">
            Completion: <strong>{completion}%</strong>
          </small>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {/* Course Name */}
          <div className="col-md-4">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              value={formData.courseName}
              className="form-control"
              readOnly
            />
          </div>

          {/* Course Start Date */}
          <div className="col-md-4">
            <label className="form-label">Course Start Date</label>
            <input
              type="date"
              value={formData.courseStartDate}
              className="form-control"
              readOnly
            />
          </div>

          {/* Batch Name */}
          <div className="col-md-4">
            <label className="form-label">Batch Name</label>
            <input
              type="text"
              value={formData.batchName}
              className="form-control"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
