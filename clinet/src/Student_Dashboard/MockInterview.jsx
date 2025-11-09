
// MockInterview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaCalendarAlt, FaCode, FaComments, FaStar } from "react-icons/fa";

const MockInterview = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSection, setOpenSection] = useState(null);

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
      studentId: user?.userId || 1,
      categoryId: selectedCategoryId,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/interviews/start",
        requestDto
      );

      const interviewId = res.data?.interview?.interviewId;
      if (!interviewId) {
        alert("Invalid response — interview ID missing.");
        return;
      }

      const cat = categories.find(
        (c) => String(c.id) === String(selectedCategoryId)
      );
      const categoryName =
        (cat && (cat.name || cat.categoryName)) ||
        `Category ${selectedCategoryId}`;

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

  // Progress data
  const [pastInterviews, setPastInterviews] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("pastInterviews") || "[]");
    setPastInterviews(stored);
  }, []);

  const totalAllowed = 20;
  const interviewsTaken = pastInterviews.length;
  const interviewsLeft = Math.max(0, totalAllowed - interviewsTaken);

  const progressByType = (type) => {
    const total = Math.max(1, pastInterviews.length);
    const count = pastInterviews.filter((i) => i.type === type).length;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="container-fluid p-4">
      <div className="row g-4">

        {/* LEFT PANEL */}
        <div className="col-lg-3 col-md-12 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Select Interview Type</h5>

              <select
                className="form-select form-select-lg mb-4"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Choose interview category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.categoryName}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleStartInterview}
                disabled={loading}
              >
                <FaPlay className="me-2" /> Start Interview
              </button>

              <button
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                onClick={() => setOpenSection(openSection === "schedule" ? null : "schedule")}
              >
                <FaCalendarAlt className="me-2" /> Schedule Interview
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="col-lg-6 col-md-12 mb-4">

          {/* Interview Progress Summary */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Interview Progress Summary</h5>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Total Allowed</span>
                    <h4 className="fw-bold mb-0">{totalAllowed}</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Interviews Taken</span>
                    <h4 className="fw-bold mb-0">{interviewsTaken}</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Interviews Left</span>
                    <h4 className="fw-bold mb-0">{interviewsLeft}</h4>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted">Progress</span>
                  <span className="small fw-semibold">{Math.round((interviewsTaken / totalAllowed) * 100)}%</span>
                </div>
                <div className="progress" style={{ height: "8px", backgroundColor: "#E9ECEF" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${(interviewsTaken / totalAllowed) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Your Progress Across Interview Types */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Progress by Interview Type</h5>

              <div className="row g-4">
                {["HR", "Technical", "Behavioral", "Communication", "Problem Solving"].map((type) => (
                  <div className="col-md-4" key={type}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-muted small mb-2">{type}</span>
                        <h4 className="fw-bold mb-0 text-primary">{progressByType(type)}%</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-3 col-md-12">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Suggestions & Improvements</h5>

              <div className="improvement-section mb-4">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <FaCode className="text-primary" />
                  </div>
                  <h6 className="fw-semibold mb-0">Improve Technical Depth</h6>
                </div>
                <p className="text-muted small mb-3">Deepen your understanding in Data Structures and Algorithms.</p>
                <button className="btn btn-outline-primary btn-sm w-100">View Topics</button>
              </div>

              <div className="improvement-section mb-4">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                    <FaComments className="text-success" />
                  </div>
                  <h6 className="fw-semibold mb-0">Refine Communication</h6>
                </div>
                <p className="text-muted small mb-3">Practice explaining complex ideas with clarity and confidence.</p>
                <button className="btn btn-outline-success btn-sm w-100">Start Practice</button>
              </div>

              <div className="improvement-section">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                    <FaStar className="text-warning" />
                  </div>
                  <h6 className="fw-semibold mb-0">Master STAR Method</h6>
                </div>
                <p className="text-muted small mb-3">Perfect your behavioral responses using the STAR framework.</p>
                <button className="btn btn-outline-warning btn-sm w-100">Review Guide</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MockInterview;


