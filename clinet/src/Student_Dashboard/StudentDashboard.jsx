// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const interviewDurations = {
    "Technical Interview": 20,
    "Behavioral Interview": 10,
    "Communication Interview": 30,
  };

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        if (Array.isArray(res.data)) setCategories(res.data);
        else setCategories([]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleStartInterview = async () => {
    if (!selectedCategoryId) {
      alert("Please select a category before continuing.");
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const requestDto = {
      studentId: user?.userId || 1, // fallback
      categoryId: selectedCategoryId,
    };

    try {
      // Call backend to create interview (you said backend ready)
      const res = await axios.post("http://localhost:8080/api/interviews/start", requestDto);

      const interviewId = res.data?.interview?.interviewId;
      if (!interviewId) {
        alert("Invalid response from backend — interview ID missing.");
        return;
      }

      // find category name for nicer UX
      const cat = categories.find((c) => String(c.id) === String(selectedCategoryId));
      const categoryName = (cat && (cat.name || cat.categoryName)) || `Category ${selectedCategoryId}`;

      // Navigate to StartInterview with interviewId + category details
      navigate("/start-interview", {
        state: { interviewId, categoryId: selectedCategoryId, categoryName },
      });
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [scheduledInterviewType, setScheduledInterviewType] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const handleScheduleSubmit = () => {
    if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
      alert("Please select interview type, date, and time!");
      return;
    }
    alert(`${scheduledInterviewType} scheduled on ${scheduledDate} at ${selectedTime}`);
    setScheduledInterviewType("");
    setScheduledDate("");
    setSelectedTime("");
    setOpenSection(null);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Student Dashboard</h2>

      <div className="row g-4 text-center">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={() => setOpenSection(openSection === "start" ? null : "start")}
              >
                🎯 Start Interview
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <button
                className="btn btn-warning w-100 fw-semibold"
                onClick={() => setOpenSection(openSection === "schedule" ? null : "schedule")}
              >
                🗓 Schedule Interview
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">📈 Interview Progress</h5>
              <div className="progress mb-3" style={{ height: "25px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `0%` }}
                  aria-valuenow={0}
                  aria-valuemin="0"
                  aria-valuemax="20"
                >
                  0/20
                </div>
              </div>
              <p className="text-muted mb-0">Keep going! You're making great progress 🚀</p>
            </div>
          </div>
        </div>
      </div>

      {openSection && (
        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body">
            {openSection === "start" && (
              <>
                <h5 className="fw-semibold mb-3 text-primary">🎯 Start Interview</h5>
                <p className="text-muted mb-4">
                  Select your preferred category and click <strong>Continue</strong> to start.
                </p>

                <select
                  className="form-select mb-4"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name || cat.categoryName || `Category ${cat.id}`}
                    </option>
                  ))}
                </select>

                <div className="text-end">
                  <button
                    className="btn btn-success px-4"
                    onClick={handleStartInterview}
                    disabled={loading}
                  >
                    {loading ? "Starting..." : "Continue"}
                  </button>
                </div>
              </>
            )}

            {openSection === "schedule" && (
              <>
                <h5 className="fw-semibold mb-3 text-warning">🗓 Schedule Interview</h5>

                <label className="form-label fw-semibold">Select Interview Module</label>
                <select
                  className="form-select mb-3"
                  value={scheduledInterviewType}
                  onChange={(e) => setScheduledInterviewType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Behavioral Interview">Behavioral Interview</option>
                  <option value="Communication Interview">Communication Interview</option>
                </select>

                {scheduledInterviewType && (
                  <p className="text-muted">Duration: <strong>{interviewDurations[scheduledInterviewType]} mins</strong></p>
                )}

                <label className="form-label fw-semibold">Select Date</label>
                <input type="date" className="form-control mb-3" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />

                <label className="form-label fw-semibold">Select Time Slot</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`btn btn-outline-primary btn-sm ${selectedTime === slot ? "active" : ""}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="text-end">
                  <button className="btn btn-success" onClick={handleScheduleSubmit}>Confirm Schedule</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
