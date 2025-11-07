import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TwelfthGrade = ({ onCompletionChange }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    board: "",
    groupName: "",
    collegeName: "",
    yearOfPassout: "",
    marksPercentage: "",
    userId: userId
  });

  const boards = [
    "CBSE",
    "ICSE",
    "State Board",
    "IB (International Baccalaureate)",
    "NIOS",
    "Other",
  ];

  const groups = [
    "Science (PCM)",
    "Science (PCB)",
    "Science (PCMB)",
    "Commerce",
    "Arts/Humanities",
    "Vocational",
    "Other",
  ];

  // ✅ Redirect to login if no session
  useEffect(() => {
    if (!userId) {
      alert("Session expired! Please login again.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8080/api/twelfth-grade/${userId}`)
      .then((res) => {
        if (res?.data) {
          setFormData({ ...res.data, userId });
        }
      })
      .catch(() => {});
  }, [userId, navigate]);

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "" && f !== null).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, userId };

      await axios.put("http://localhost:8080/api/twelfth-grade", payload);

      setIsEditing(false);
      alert("12th grade details saved successfully ✅");
    } catch (error) {
      alert("Failed to save! ❌ Try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm border-0 my-3">
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">12th / Intermediate / Diploma</h5>

        {!isEditing ? (
          <button className="btn btn-light btn-sm" onClick={() => setIsEditing(true)}>
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
          
          <div className="col-md-4">
            <label className="form-label fw-semibold">Board *</label>
            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Board</option>
              {boards.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Group *</label>
            <select
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Select Group</option>
              {groups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
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

export default TwelfthGrade;
