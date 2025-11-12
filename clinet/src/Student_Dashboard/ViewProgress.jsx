import React from 'react';
import { FaPlay, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ViewProgress = () => {
  const navigate = useNavigate();

  // Mock data (replace with actual API data later)
  const interviewData = {
    studentName: "Alice Johnson",
    date: "2024-03-15",
    duration: "35:20",
    scores: {
      communication: 85,
      technicalSkills: 78,
      behavioralQuestions: 90,
      overall: 84
    },
    transcript: {
      interviewer: "Good morning, Alice. Thank you for coming in today. Let's start by having you tell me a little bit about yourself.",
      alice: "Good morning! Thank you for having me. I'm Alice Johnson, a recent graduate with a Bachelor's degree in Computer Science. During my studies, I focused on software development and gained practical experience through several projects, including a web application for task management and a mobile app prototype. I'm passionate about creating efficient and user-friendly solutions, and I'm eager to apply my skills in a dynamic environment.",
      interviewer2: "That sounds great, Alice. Can you elaborate on your experience with the web application for task management? What technologies did you use, and what was your role in the project?",
      alice2: "Certainly. For the task management web application, our team primarily used React for the frontend, Node.js with Express for the backend, and MongoDB as the database. My role was primarily focused on the frontend development. I was responsible for designing and implementing the user interface components, integrating with the backend APIs, and ensuring a responsive design. I also contributed to the backend by developing several REST API endpoints for user authentication and task management operations. We used Agile methodologies, which allowed us to iterate quickly and incorporate feedback effectively."
    }
  };

  const handleBack = () => {
    navigate('/mock-interview');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Interview Review for {interviewData.studentName}</h4>
        <button 
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={handleBack}
        >
          <FaArrowLeft className="me-2" /> Back to Student Management
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column - Recording and Scores */}
        <div className="col-md-8">
          {/* Student Info */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-muted small">Student Name</div>
                  <div className="h6">{interviewData.studentName}</div>
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">Interview Date</div>
                  <div className="h6">{interviewData.date}</div>
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">Duration</div>
                  <div className="h6">{interviewData.duration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Recording */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Interview Recording</h6>
              <div className="position-relative bg-light rounded" style={{ height: "300px" }}>
                {/* Replace with actual video player */}
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button className="btn btn-primary rounded-circle p-3">
                    <FaPlay />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Transcript */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3">Interview Transcript</h6>
              <div className="interview-transcript">
                <div className="mb-3">
                  <strong className="text-primary">Interviewer:</strong>
                  <p className="mb-2">{interviewData.transcript.interviewer}</p>
                </div>
                <div className="mb-3">
                  <strong className="text-success">Alice:</strong>
                  <p className="mb-2">{interviewData.transcript.alice}</p>
                </div>
                <div className="mb-3">
                  <strong className="text-primary">Interviewer:</strong>
                  <p className="mb-2">{interviewData.transcript.interviewer2}</p>
                </div>
                <div className="mb-3">
                  <strong className="text-success">Alice:</strong>
                  <p className="mb-2">{interviewData.transcript.alice2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Scores and Notes */}
        <div className="col-md-4">
          {/* Score Breakdown */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title mb-4">Score Breakdown</h6>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Communication</span>
                  <span className="badge bg-primary rounded-pill">{interviewData.scores.communication}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${interviewData.scores.communication}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Technical Skills</span>
                  <span className="badge bg-primary rounded-pill">{interviewData.scores.technicalSkills}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${interviewData.scores.technicalSkills}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Behavioral Questions</span>
                  <span className="badge bg-primary rounded-pill">{interviewData.scores.behavioralQuestions}</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${interviewData.scores.behavioralQuestions}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Overall Score</h6>
                  <span className="h5 text-primary mb-0">{interviewData.scores.overall}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3">Admin Notes</h6>
              <textarea 
                className="form-control mb-3" 
                rows="5" 
                placeholder="Add your review notes here..."
              ></textarea>
              <button className="btn btn-primary w-100">Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;
