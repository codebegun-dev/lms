import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL; 


const UGDetails = ({ onCompletionChange }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    universityRollNo: "",
    collegeName: "",
    courseName: "",
    branch: "",
    yearOfPassout: "",
    marksPercentage: "",
    cgpa: "",
    activeBacklogs: "",
    userId: userId
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

  //  Load UG data from backend
  useEffect(() => {
    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    axios.get(`${API}/api/student/ug-details/${userId}`)
      .then(res => {
        if (res?.data) {
          setFormData({ ...res.data, userId });
        }
      })
      .catch(() => {});
  }, [userId, navigate]);

  // Update completion %
  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f !== "" && f !== null).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseName') {
      setFormData(prev => ({ ...prev, [name]: value, branch: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, userId };
      await axios.put(`${API}/api/student/ug-details/update`, payload);

      setIsEditing(false);
      alert("UG details saved successfully ");
    } catch (err) {
      alert("Failed to save UG details ");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getAvailableBranches = () => {
    return courseBranches[formData.courseName] || [];
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">UG Details</h5>

        {!isEditing ? (
          <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <>
            <button className="btn btn-secondary btn-sm me-2" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
          </>
        )}
      </div>

      <div className="card-body">
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">University Roll No *</label>
            <input
              type="text"
              name="universityRollNo"
              className="form-control"
              value={formData.universityRollNo}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">College Name *</label>
            <input
              type="text"
              name="collegeName"
              className="form-control"
              value={formData.collegeName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Course Name *</label>
            <select
              name="courseName"
              className="form-select"
              value={formData.courseName}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Course</option>
              {ugCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Branch *</label>
            <select
              name="branch"
              className="form-select"
              value={formData.branch}
              onChange={handleChange}
              disabled={!isEditing || !formData.courseName}
            >
              <option value="">Select Branch</option>
              {getAvailableBranches().map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Year of Passout *</label>
            <input
              type="number"
              name="yearOfPassout"
              className="form-control"
              value={formData.yearOfPassout}
              onChange={handleChange}
              disabled={!isEditing}
              min="1950"
              max="2030"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Marks % *</label>
            <input
              type="number"
              name="marksPercentage"
              className="form-control"
              value={formData.marksPercentage}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">CGPA *</label>
            <input
              type="number"
              name="cgpa"
              className="form-control"
              value={formData.cgpa}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="10"
              step="0.01"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Active Backlogs *</label>
            <select
              name="activeBacklogs"
              className="form-select"
              value={formData.activeBacklogs}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Backlogs</option>
              {[...Array(10).keys()].map(num => (
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
