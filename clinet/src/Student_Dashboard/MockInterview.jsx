 

// // MockInterview.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaPlay,
//   FaCalendarAlt,
//   FaCode,
//   FaComments,
//   FaStar,
//   FaEye,
// } from "react-icons/fa";

// const MockInterview = () => {
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openSection, setOpenSection] = useState(null);
//   const [pastInterviews, setPastInterviews] = useState([]);

//   // ✅ Fetch categories from backend
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/categories");
//         if (Array.isArray(res.data)) setCategories(res.data);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setCategories([]);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ Load past interviews from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("pastInterviews") || "[]");
//     setPastInterviews(stored);
//   }, []);

//   // Start interview
//   const handleStartInterview = async () => {
//     if (!selectedCategoryId) return alert("Please select a category!");

//     setLoading(true);

//     const user = JSON.parse(localStorage.getItem("user")) || {};

//     const requestDto = {
//       studentId: user?.userId || 1,
//       categoryId: selectedCategoryId,
//     };

//     try {
//       const res = await axios.post(
//         "http://localhost:8080/api/interviews/start",
//         requestDto
//       );

//       const interviewId = res.data?.interview?.interviewId;
//       if (!interviewId) {
//         alert("Invalid response — interview ID missing.");
//         return;
//       }

//       navigate("/start-interview", {
//         state: {
//           interviewId,
//           categoryId: selectedCategoryId,
//           categoryName:
//             categories.find((c) => String(c.id) === String(selectedCategoryId))
//               ?.name || "Category",
//         },
//       });
//     } catch (err) {
//       console.error("Error starting interview:", err);
//       alert("Failed to start interview. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Summary Section Calculations
//   const totalAllowed = 20;
//   const interviewsTaken = pastInterviews.length;
//   const interviewsLeft = totalAllowed - interviewsTaken;
//   const progressPercent = Math.round((interviewsTaken / totalAllowed) * 100);

//   const progressByType = (type) => {
//     const count = pastInterviews.filter((i) => i.type === type).length;
//     const total = Math.max(1, pastInterviews.length);
//     return Math.round((count / total) * 100);
//   };

//   return (
//     <div className="container-fluid p-4">
//       <div className="row g-4">

//         {/* LEFT PANEL */}
//         <div className="col-lg-3">
//           <div className="card shadow-sm ">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-4">Select Interview Type</h5>

//               <select
//                 className="form-select form-select-lg mb-4"
//                 value={selectedCategoryId}
//                 onChange={(e) => setSelectedCategoryId(e.target.value)}
//               >
//                 <option value="">Choose interview category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name || cat.categoryName}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 className="btn btn-primary btn-lg w-100 d-flex justify-content-center align-items-center mb-3"
//                 onClick={handleStartInterview}
//                 disabled={loading}
//               >
//                 <FaPlay className="me-2" /> {loading ? "Starting..." : "Start Interview"}
//               </button>

//               <button
//                 className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center"
//                 onClick={() =>
//                   setOpenSection(openSection === "schedule" ? null : "schedule")
//                 }
//               >
//                 <FaCalendarAlt className="me-2" /> Schedule Interview
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* MIDDLE PANEL */}
//         <div className="col-lg-6 mb-5">

//           {/* Interview Progress Summary */}
//           <div className="card shadow-sm mb-4">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-4">Interview Progress Summary</h5>

//               <div className="row text-center">
//                 <div className="col-4">
//                   <span className="text-muted small">Total Allowed</span>
//                   <h4 className="fw-bold">{totalAllowed}</h4>
//                 </div>
//                 <div className="col-4">
//                   <span className="text-muted small">Taken</span>
//                   <h4 className="fw-bold">{interviewsTaken}</h4>
//                 </div>
//                 <div className="col-4">
//                   <span className="text-muted small">Left</span>
//                   <h4 className="fw-bold">{interviewsLeft}</h4>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="mt-3 mb-5">
//                 <div className="d-flex justify-content-between small text-muted">
//                   <span>Progress</span>
//                   <span>{progressPercent}%</span>
//                 </div>
//                 <div className="progress" style={{ height: "8px" }}>
//                   <div
//                     className="progress-bar bg-primary"
//                     style={{ width: `${progressPercent}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Progress by Interview Types */}
//           <div className="card shadow-sm mb-4 mt-5 ">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-4">Your Progress Across Interview Types</h5>

//               <div className="row g-3">
//                 {["HR", "Technical", "Behavioral", "Communication", "Problem Solving"].map(
//                   (type, idx) => (
//                     <div key={idx} className="col-4">
//                       <div className="p-3 bg-light text-center rounded-4">
//                         <span className="small text-muted">{type}</span>
//                         <h4 className="fw-bold text-primary mt-1">
//                           {progressByType(type)}%
//                         </h4>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Recent Interview Feedback */}
//           <div className="card shadow-sm mb-4">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-3">Recent Interview Feedback</h5>

//               <div className="bg-light p-3 rounded-4">
//                 <h6 className="fw-semibold">Technical Interview #1 Feedback</h6>
//                 <p className="text-muted small mt-2">
//                   Your interview showed strong technical knowledge.
//                 </p>

//                 <strong>Key Strengths:</strong>
//                 <ul className="small text-muted">
//                   <li>Good understanding of data structures</li>
//                   <li>Logical approach while solving problems</li>
//                 </ul>

//                 <strong>Areas of Improvement:</strong>
//                 <ul className="small text-muted">
//                   <li>Explain time/space complexity better</li>
//                 </ul>

//                 <button className="btn btn-outline-primary btn-sm mt-2">
//                   View Detailed Feedback
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Past Interviews */}
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-3">Past Interviews</h5>

//               <table className="table table-hover table-sm">
//                 <thead>
//                   <tr>
//                     <th>Date/Time</th>
//                     <th>Duration</th>
//                     <th>Score</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {pastInterviews.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="text-center text-muted">
//                         No past interviews
//                       </td>
//                     </tr>
//                   ) : (
//                     pastInterviews.map((interview, idx) => (
//                       <tr key={idx}>
//                         <td>{interview.date}</td>
//                         <td>{interview.duration} min</td>
//                         <td>{interview.score}%</td>
//                         <td>
//                           <button className="btn btn-outline-primary btn-sm">
//                             <FaEye />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="col-lg-3">
//           <div className="card shadow-sm ">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-4">Suggestions & Improvements</h5>

//               <div className="mb-4">
//                 <div className="d-flex align-items-center">
//                   <div className="p-2 bg-primary bg-opacity-10 rounded-circle me-3">
//                     <FaCode className="text-primary" />
//                   </div>
//                   <h6 className="fw-semibold">Improve Technical Depth</h6>
//                 </div>
//                 <p className="small text-muted">
//                   Deepen your Data Structures and Algorithms knowledge.
//                 </p>
//                 <button className="btn btn-outline-primary btn-sm w-100">
//                   View Topics
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <div className="d-flex align-items-center">
//                   <div className="p-2 bg-success bg-opacity-10 rounded-circle me-3">
//                     <FaComments className="text-success" />
//                   </div>
//                   <h6 className="fw-semibold">Refine Communication</h6>
//                 </div>
//                 <p className="small text-muted">
//                   Practice explaining your thought process clearly.
//                 </p>
//                 <button className="btn btn-outline-success btn-sm w-100">
//                   Start Practice
//                 </button>
//               </div>

//               <div>
//                 <div className="d-flex align-items-center">
//                   <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-3">
//                     <FaStar className="text-warning" />
//                   </div>
//                   <h6 className="fw-semibold">Master STAR Method</h6>
//                 </div>
//                 <p className="small text-muted">
//                   Learn the Situation → Task → Action → Result format.
//                 </p>
//                 <button className="btn btn-outline-warning btn-sm w-100">
//                   Review Guide
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MockInterview;




// MockInterview.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlay,
  FaCalendarAlt,
  FaCode,
  FaComments,
  FaStar,
  FaEye,
  FaChartBar,
  FaSync,
} from "react-icons/fa";

const MockInterview = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Get user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUser(userData);
  }, []);

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        if (Array.isArray(res.data)) setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Load past interviews from backend API instead of localStorage
  useEffect(() => {
    if (user?.userId) {
      fetchPastInterviews();
    }
  }, [user]);

  // ✅ Fetch past interviews from backend
  const fetchPastInterviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/interviews/student/${user.userId}`);
      if (Array.isArray(res.data)) {
        const formattedInterviews = res.data.map(interview => ({
          interviewId: interview.interviewId || interview.id,
          date: interview.startTime ? new Date(interview.startTime).toLocaleDateString() : 'N/A',
          duration: interview.duration || '0',
          score: interview.score || '0',
          category: interview.categoryName,
          status: interview.status
        }));
        setPastInterviews(formattedInterviews);
        
        // If there are completed interviews, load feedback for the most recent one
        const completedInterviews = formattedInterviews.filter(i => i.status === 'COMPLETED');
        if (completedInterviews.length > 0) {
          fetchLatestFeedback(completedInterviews[0].interviewId);
        }
      }
    } catch (err) {
      console.error("Error fetching past interviews:", err);
      // Fallback to localStorage if API fails
      const stored = JSON.parse(localStorage.getItem("pastInterviews") || "[]");
      setPastInterviews(stored);
    }
  };

  // ✅ Fetch AI feedback for a specific interview
  const fetchLatestFeedback = async (interviewId) => {
    if (!interviewId) {
      console.error("No interview ID provided for feedback");
      return;
    }

    setFeedbackLoading(true);
    try {
      console.log("Fetching feedback for interview:", interviewId);
      const res = await axios.get(`http://localhost:8080/api/ai/${interviewId}`);
      console.log("AI Feedback response:", res.data);
      setAiFeedback(res.data);
    } catch (err) {
      console.error("Error fetching AI feedback:", err);
      console.log("Error details:", err.response?.data);
      setAiFeedback(null);
      
      // Show specific error message
      if (err.response?.status === 404) {
        console.log("Feedback not found for this interview yet");
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Start interview
  const handleStartInterview = async () => {
    if (!selectedCategoryId) return alert("Please select a category!");

    setLoading(true);

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

      navigate("/start-interview", {
        state: {
          interviewId,
          categoryId: selectedCategoryId,
          categoryName:
            categories.find((c) => String(c.id) === String(selectedCategoryId))
              ?.name || "Category",
        },
      });
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle viewing feedback for a specific interview
  const handleViewFeedback = async (interviewId) => {
    if (!interviewId) {
      alert("No interview ID available");
      return;
    }

    setFeedbackLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/ai/${interviewId}`);
      setAiFeedback(res.data);
      
      // Scroll to feedback section
      setTimeout(() => {
        const feedbackSection = document.getElementById('feedback-section');
        if (feedbackSection) {
          feedbackSection.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
      }, 100);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      if (err.response?.status === 404) {
        alert("AI feedback is still being processed for this interview. Please wait a moment and try again.");
      } else {
        alert("Failed to load feedback for this interview.");
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ✅ Refresh feedback
  const handleRefreshFeedback = () => {
    if (pastInterviews.length > 0) {
      const latestInterview = pastInterviews.find(i => i.status === 'COMPLETED');
      if (latestInterview) {
        fetchLatestFeedback(latestInterview.interviewId);
      }
    }
  };

  // ✅ Summary Section Calculations
  const totalAllowed = 20;
  const interviewsTaken = pastInterviews.length;
  const interviewsLeft = totalAllowed - interviewsTaken;
  const progressPercent = Math.round((interviewsTaken / totalAllowed) * 100);

  const progressByType = (type) => {
    const count = pastInterviews.filter((i) => i.category === type).length;
    const total = Math.max(1, pastInterviews.length);
    return Math.round((count / total) * 100);
  };

  return (
    <div className="container-fluid p-4">
      <div className="row g-4">

        {/* LEFT PANEL */}
        <div className="col-lg-3">
          <div className="card shadow-sm ">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Select Interview Type</h5>

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
                className="btn btn-primary btn-lg w-100 d-flex justify-content-center align-items-center mb-3"
                onClick={handleStartInterview}
                disabled={loading}
              >
                <FaPlay className="me-2" /> {loading ? "Starting..." : "Start Interview"}
              </button>

              <button
                className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center"
                onClick={() =>
                  setOpenSection(openSection === "schedule" ? null : "schedule")
                }
              >
                <FaCalendarAlt className="me-2" /> Schedule Interview
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="col-lg-6 mb-5">

          {/* Interview Progress Summary */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Interview Progress Summary</h5>

              <div className="row text-center">
                <div className="col-4">
                  <span className="text-muted small">Total Allowed</span>
                  <h4 className="fw-bold">{totalAllowed}</h4>
                </div>
                <div className="col-4">
                  <span className="text-muted small">Taken</span>
                  <h4 className="fw-bold">{interviewsTaken}</h4>
                </div>
                <div className="col-4">
                  <span className="text-muted small">Left</span>
                  <h4 className="fw-bold">{interviewsLeft}</h4>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 mb-5">
                <div className="d-flex justify-content-between small text-muted">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Feedback Card - NEW ADDITION */}
          <div id="feedback-section" className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <FaChartBar className="text-primary me-2" />
                  <h5 className="fw-semibold mb-0">AI Performance Feedback</h5>
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleRefreshFeedback}
                  disabled={feedbackLoading}
                >
                  <FaSync className={feedbackLoading ? "spinning" : ""} />
                </button>
              </div>

              {feedbackLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading feedback...</span>
                  </div>
                  <p className="text-muted mt-2">Loading AI feedback...</p>
                </div>
              ) : aiFeedback ? (
                <div>
                  {/* Overall Rating */}
                  <div className="row text-center mb-4">
                    <div className="col-12">
                      <span className="text-muted small">Overall Rating</span>
                      <h2 className="fw-bold text-primary">{aiFeedback.overallRating}/10</h2>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${aiFeedback.overallRating * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="row g-3 mb-4">
                    <div className="col-4">
                      <div className="p-3 bg-light text-center rounded-4">
                        <span className="small text-muted">Communication</span>
                        <h4 className="fw-bold text-info mt-1">
                          {aiFeedback.communicationScore}/10
                        </h4>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 bg-light text-center rounded-4">
                        <span className="small text-muted">Confidence</span>
                        <h4 className="fw-bold text-warning mt-1">
                          {aiFeedback.confidenceScore}/10
                        </h4>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 bg-light text-center rounded-4">
                        <span className="small text-muted">Technical</span>
                        <h4 className="fw-bold text-success mt-1">
                          {aiFeedback.categoryRoundTypeScore}/10
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  <div className="bg-light p-3 rounded-4">
                    <h6 className="fw-semibold">Improvement Suggestions</h6>
                    <p className="text-muted small mt-2">
                      {aiFeedback.improvementSuggestions || "No specific suggestions available."}
                    </p>
                  </div>

                  {/* Feedback Metadata */}
                  <div className="mt-3 small text-muted">
                    <div className="row">
                      <div className="col-6">
                        <strong>Category:</strong> {aiFeedback.categoryName || "N/A"}
                      </div>
                      <div className="col-6 text-end">
                        <strong>Date:</strong> {aiFeedback.createdAt ? new Date(aiFeedback.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No AI feedback available yet.</p>
                  <p className="small text-muted">
                    Complete an interview and wait for AI processing to get detailed feedback on your performance.
                  </p>
                  {pastInterviews.length > 0 && (
                    <button 
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => pastInterviews[0] && handleViewFeedback(pastInterviews[0].interviewId)}
                    >
                      Check for Feedback
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress by Interview Types */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Your Progress Across Interview Types</h5>

              <div className="row g-3">
                {categories.slice(0, 5).map((category) => (
                  <div key={category.id} className="col-4">
                    <div className="p-3 bg-light text-center rounded-4">
                      <span className="small text-muted">{category.name}</span>
                      <h4 className="fw-bold text-primary mt-1">
                        {progressByType(category.name)}%
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Interviews */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">Past Interviews</h5>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={fetchPastInterviews}
                >
                  <FaSync />
                </button>
              </div>

              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pastInterviews.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No past interviews found
                      </td>
                    </tr>
                  ) : (
                    pastInterviews.map((interview, idx) => (
                      <tr key={idx}>
                        <td>{interview.date}</td>
                        <td>{interview.category}</td>
                        <td>{interview.duration}</td>
                        <td>
                          <span className={`badge ${interview.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'}`}>
                            {interview.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewFeedback(interview.interviewId)}
                            disabled={interview.status !== 'COMPLETED'}
                            title={interview.status !== 'COMPLETED' ? 'Interview not completed' : 'View AI Feedback'}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-3">
          <div className="card shadow-sm ">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Suggestions & Improvements</h5>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-circle me-3">
                    <FaCode className="text-primary" />
                  </div>
                  <h6 className="fw-semibold">Improve Technical Depth</h6>
                </div>
                <p className="small text-muted">
                  Deepen your Data Structures and Algorithms knowledge.
                </p>
                <button className="btn btn-outline-primary btn-sm w-100">
                  View Topics
                </button>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <div className="p-2 bg-success bg-opacity-10 rounded-circle me-3">
                    <FaComments className="text-success" />
                  </div>
                  <h6 className="fw-semibold">Refine Communication</h6>
                </div>
                <p className="small text-muted">
                  Practice explaining your thought process clearly.
                </p>
                <button className="btn btn-outline-success btn-sm w-100">
                  Start Practice
                </button>
              </div>

              <div>
                <div className="d-flex align-items-center">
                  <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-3">
                    <FaStar className="text-warning" />
                  </div>
                  <h6 className="fw-semibold">Master STAR Method</h6>
                </div>
                <p className="small text-muted">
                  Learn the Situation → Task → Action → Result format.
                </p>
                <button className="btn btn-outline-warning btn-sm w-100">
                  Review Guide
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add CSS for spinning animation */}
      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MockInterview;