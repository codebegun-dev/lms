import React, { useState, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL; 


const PGDetails = ({ onCompletionChange }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

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

  const branchesByCourse = {
    "M.Tech": ["Computer Science","Information Technology","Electronics","Electrical","Mechanical","Civil","Chemical","Data Science","AI/ML","VLSI","Embedded Systems","Other"],
    "M.E": ["Computer Science","Information Technology","Electronics","Electrical","Mechanical","Civil","Chemical","Structural Engineering","Power Systems","Other"],
    "MCA": ["Computer Applications","Information Technology","Data Science","AI/ML","Software Engineering","Cyber Security","Other"],
    "M.Sc": ["Computer Science","Information Technology","Physics","Chemistry","Mathematics","Data Science","Statistics","Biotechnology","Other"],
    "MBA": ["Finance","Marketing","Human Resources","Operations","Information Technology","Business Analytics","International Business","Entrepreneurship","Other"],
    "M.Com": ["Accounting","Finance","Banking","Taxation","Business Economics","International Business","Other"],
    "Other": ["Computer Science","Information Technology","Electronics","Electrical","Mechanical","Civil","Chemical","Data Science","AI/ML","Other"],
  };

  //  Fetch PG details on mount
  useEffect(() => {
    if (userId) {
      axios
        .get(`${API}/api/student/pg-details/${userId}`)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            setHasPG(data.hasPG);
            setHasBacklogs(data.hasBacklogs);
            setFormData({
              collegeName: data.collegeName || "",
              courseName: data.courseName || "",
              branch: data.branch || "",
              marksPercentage: data.marksPercentage || "",
              cgpa: data.cgpa || "",
              yearOfPassout: data.yearOfPassout || "",
              activeBacklogs: data.activeBacklogs || "",
            });
          }
        })
        .catch(() => console.log("No PG record found"));
    }
  }, [userId]);

  useEffect(() => {
    calculateCompletion();
  }, [formData, hasPG]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseName") {
      setFormData((prev) => ({ ...prev, [name]: value, branch: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateCompletion = () => {
    if (!hasPG) {
      onCompletionChange(100);
      return;
    }
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "").length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  // ✅ Save & send data to backend
  const handleSave = () => {
    const payload = {
      userId,
      hasPG,
      hasBacklogs,
      ...formData,
    };

    axios
      .put(`${API}/api/student/pg-details/update`, payload)
      .then(() => {
        setIsEditing(false);
        alert("PG Details saved successfully");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error saving PG details");
      });
  };

  const handleCancel = () => setIsEditing(false);

  const getAvailableBranches = () => {
    if (!formData.courseName) return [];
    return branchesByCourse[formData.courseName] || [];
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">PG Details</h5>
        {!isEditing ? (
          <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="form-label fw-semibold">Do you have post graduation certificate?</label>
          <div className="d-flex gap-4 mt-2">
            <div className="form-check">
              <input className="form-check-input" type="radio" checked={hasPG} onChange={() => setHasPG(true)} disabled={!isEditing}/>
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" checked={!hasPG} onChange={() => setHasPG(false)} disabled={!isEditing}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        {hasPG && (
          <>
            {/* College */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">College Name *</label>
                <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="Enter college name"/>
              </div>

              {/* Course */}
              <div className="col-md-6">
                <label className="form-label">Course Name *</label>
                <select name="courseName" value={formData.courseName} onChange={handleChange} disabled={!isEditing} className="form-select">
                  <option value="">Select Course</option>
                  {pgCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div className="col-md-6">
                <label className="form-label">Branch *</label>
                <select name="branch" value={formData.branch} onChange={handleChange} disabled={!isEditing || !formData.courseName} className="form-select">
                  <option value="">Select Branch</option>
                  {getAvailableBranches().map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Marks */}
              <div className="col-md-6">
                <label className="form-label">Marks in % *</label>
                <input type="number" name="marksPercentage" value={formData.marksPercentage} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="Enter percentage"/>
              </div>

              {/* CGPA */}
              <div className="col-md-6">
                <label className="form-label">CGPA *</label>
                <input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="Enter CGPA"/>
              </div>

              {/* Year */}
              <div className="col-md-6">
                <label className="form-label">Year of Passout *</label>
                <input type="number" name="yearOfPassout" value={formData.yearOfPassout} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="YYYY"/>
              </div>

              {/* Backlogs */}
              <div className="col-12 mt-3">
                <label className="form-label fw-semibold">Do you have any backlog?</label>
                <div className="d-flex gap-4 mt-2">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" checked={hasBacklogs} onChange={() => setHasBacklogs(true)} disabled={!isEditing}/>
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" checked={!hasBacklogs} onChange={() => setHasBacklogs(false)} disabled={!isEditing}/>
                    <label className="form-check-label">No</label>
                  </div>
                </div>
              </div>

              {hasBacklogs && (
                <div className="col-md-6">
                  <label className="form-label">Active Backlogs *</label>
                  <select name="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} disabled={!isEditing} className="form-select">
                    <option value="">Select Backlogs</option>
                    {[1,2,3,4,5,6,7,8,9].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PGDetails;
