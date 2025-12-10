import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL; 


const TwelfthGrade = ({ onCompletionChange }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [isEditing, setIsEditing] = useState(false);

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("");

  const [formData, setFormData] = useState({
    board: "",
    groupName: "",
    collegeName: "",
    yearOfPassout: "",
    marksPercentage: "",
    userId: userId
  });

  const [backupData, setBackupData] = useState({}); // for cancel

  const boards = ["CBSE", "ICSE", "State Board", "IB", "NIOS", "Other"];

  const groups = [
    "Science (PCM)",
    "Science (PCB)",
    "Science (PCMB)",
    "Commerce",
    "Arts/Humanities",
    "Vocational",
    "Other",
  ];

   const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);

    setTimeout(() => setAlertMsg(null), 3000);
  };
 
  // Load existing 12th details
  useEffect(() => {
    if (!userId) {
      showAlert("Session expired! Please login again.", "danger");
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/api/twelfth-grade/${userId}`)
      .then((res) => {
        if (res?.data) {
          setFormData({ ...res.data, userId });
          setBackupData({ ...res.data, userId });
        }
      })
      .catch(() => {});
  }, [userId, navigate]);

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "" && f !== null).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, userId };

      await axios.put(`${API}/api/twelfth-grade`, payload);

      setBackupData(payload);
      setIsEditing(false);

      showAlert("12th grade details saved successfully!", "success");
    } catch (error) {
      showAlert("Failed to save details! Try again.", "danger");
    }
  };

  const handleCancel = () => {
    setFormData(backupData); // restore old data
    setIsEditing(false);

    showAlert("Changes cancelled", "warning");
  };

 
  return (
    <div className="card shadow-sm border-0 my-3">

      {/* ALERT */}
      {alertMsg && (
        <div className={`alert alert-${alertType} rounded-0 m-0 text-center`}>
          {alertMsg}
        </div>
      )}

      {/* HEADER */}
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">12th / Intermediate / Diploma</h5>

        {!isEditing ? (
          <button className="btn btn-light btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div>
            <button className="btn btn-danger btn-sm me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      {/* BODY */}
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
                <option key={board} value={board}>{board}</option>
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
                <option key={grp} value={grp}>{grp}</option>
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
              max="2035"
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
