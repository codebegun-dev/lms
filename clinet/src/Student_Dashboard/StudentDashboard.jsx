import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [scheduledInterviewType, setScheduledInterviewType] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [completedInterviews, setCompletedInterviews] = useState(0);

  // ✅ Category state
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

  //  Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Invalid category response:", res.data);
          setCategories([]);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Start interview after category selection
  // ✅ Start interview after category selection
const handleStartInterview = async () => {
  if (!selectedCategoryId) {
    alert("Please select a category before continuing.");
    return;
  }

  setLoading(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const requestDto = {
    studentId: user?.userId,
    categoryId: selectedCategoryId,
  };

  try {
    const res = await axios.post("http://localhost:8080/api/interviews/start", requestDto);
    const interviewId = res.data.id || res.data.interviewId;

    if (interviewId) {
      // ✅ Navigate with interviewId for next-question API
      navigate("/start-interview");
    } else {
      alert("Invalid response from backend — interview ID missing.");
    }
  } catch (err) {
    console.error("Error starting interview:", err);
    alert("Failed to start interview. Please try again.");
  } finally {
    setLoading(false);
  }
};

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

      {/* === ROW OF 3 BUTTON CARDS === */}
      <div className="row g-4 text-center">
        {/* --- Start Interview --- */}
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

        {/* --- Schedule Interview --- */}
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

        {/* --- Progress --- */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">📈 Interview Progress</h5>
              <div className="progress mb-3" style={{ height: "25px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${(completedInterviews / 20) * 100}% `}}
                  aria-valuenow={completedInterviews}
                  aria-valuemin="0"
                  aria-valuemax="20"
                >
                  {completedInterviews}/20
                </div>
              </div>
              <p className="text-muted mb-0">Keep going! You're making great progress 🚀</p>
            </div>
          </div>
        </div>
      </div>

      {/* === DROPDOWN SECTION BELOW CARDS === */}
      {openSection && (
        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body">
            {/* --- Start Interview Section --- */}
            {openSection === "start" && (
              <>
                <h5 className="fw-semibold mb-3 text-primary">🎯 Start Interview</h5>
                <p className="text-muted mb-4">
                  Select your preferred category and click <strong>Continue</strong> to start.
                </p>

                {/* ✅ Fixed Category Dropdown */}
                <select
                  className="form-select mb-4"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name || cat.categoryName ||`Category ${cat.id}`}
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

            {/* --- Schedule Interview Section --- */}
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
                  <p className="text-muted">
                    Duration:{" "}
                    <strong>{interviewDurations[scheduledInterviewType]} mins</strong>
                  </p>
                )}

                <label className="form-label fw-semibold">Select Date</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />

                <label className="form-label fw-semibold">Select Time Slot</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`btn btn-outline-primary btn-sm ${
                        selectedTime === slot ? "active" : ""
                      }`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="text-end">
                  <button className="btn btn-success" onClick={handleScheduleSubmit}>
                    Confirm Schedule
                  </button>
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