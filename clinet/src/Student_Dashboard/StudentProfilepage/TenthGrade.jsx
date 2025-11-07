import React, { useState, useEffect } from "react";
import axios from "axios";

const TenthGrade = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    board: "",
    schoolName: "",
    yearOfPassout: "",
    marksPercentage: "",
    userId: null,
  });

  const boards = ["CBSE", "ICSE", "State Board", "IB", "NIOS", "Other"];

  // ✅ Load userId from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) {
      alert("User not logged in. Please login again.");
      return;
    }

    setFormData((prev) => ({ ...prev, userId: user.userId }));

    // ✅ Fetch existing details
    axios
      .get(`http://localhost:8080/api/tenth-grade/${user.userId}`)
      .then((res) => {
        if (res.data) setFormData(res.data);
        calculateCompletion(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    calculateCompletion(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCompletion = (data) => {
    if (!data) return;

    const fields = Object.values({
      board: data.board,
      schoolName: data.schoolName,
      yearOfPassout: data.yearOfPassout,
      marksPercentage: data.marksPercentage,
    });

    const filled = fields.filter((v) => v && v !== "").length;
    onCompletionChange(Math.round((filled / fields.length) * 100));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/tenth-grade`, formData);
      setIsEditing(false);
      alert("10th Grade details saved ✅");
    } catch (error) {
      alert("Failed to save 10th details ❌");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm border-0 my-3">
      <div className="card-header bg-primary text-white d-flex justify-content-between">
        <h5 className="mb-0">10th Grade</h5>
        {!isEditing ? (
          <button className="btn btn-light btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <button className="btn btn-success btn-sm" onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="fw-semibold">Board *</label>
            <select
              className="form-select"
              name="board"
              value={formData.board}
              disabled={!isEditing}
              onChange={handleChange}
            >
              <option value="">Select Board</option>
              {boards.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="fw-semibold">School Name *</label>
            <input
              className="form-control"
              name="schoolName"
              value={formData.schoolName}
              disabled={!isEditing}
              onChange={handleChange}
              placeholder="Enter school name"
            />
          </div>

          <div className="col-md-6">
            <label className="fw-semibold">Year of Passout *</label>
            <input
              type="number"
              className="form-control"
              name="yearOfPassout"
              value={formData.yearOfPassout}
              disabled={!isEditing}
              onChange={handleChange}
              placeholder="YYYY"
            />
          </div>

          <div className="col-md-6">
            <label className="fw-semibold">Marks % *</label>
            <input
              type="number"
              className="form-control"
              name="marksPercentage"
              value={formData.marksPercentage}
              disabled={!isEditing}
              onChange={handleChange}
              placeholder="Percentage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenthGrade;
