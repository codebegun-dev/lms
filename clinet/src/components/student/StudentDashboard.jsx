import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import PersonalInformation from './sections/PersonalInformation';
import GenericDetails from './sections/GenericDetails';
import TenthGrade from './sections/TenthGrade';
import TwelfthGrade from './sections/TwelfthGrade';
import UGDetails from './sections/UGDetails';
import PGDetails from './sections/PGDetails';
import CourseDetails from './sections/CourseDetails';
import FeeDetails from './sections/FeeDetails';
import Projects from './sections/Projects'; // ✅ add this line

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState('');

  const [selectedInterviewType, setSelectedInterviewType] = useState('');
  const [scheduledInterviewType, setScheduledInterviewType] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [completedInterviews, setCompletedInterviews] = useState(0);

  const [sectionCompletion, setSectionCompletion] = useState({
    personal: 0,
    generic: 0,
    tenth: 0,
    twelfth: 0,
    ug: 0,
    pg: 0,
    course: 0,
    projects: 0,
  });

  const interviewDurations = {
    "Technical Interview": 20,
    "Behavioral Interview": 10,
    "Communication Interview": 30,
  };

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  ];

  const calculateOverallCompletion = () => {
    const values = Object.values(sectionCompletion);
    const total = values.reduce((sum, val) => sum + val, 0);
    return Math.round(total / values.length);
  };

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const updateSectionCompletion = (section, percentage) => {
    setSectionCompletion(prev => ({
      ...prev,
      [section]: percentage
    }));
  };

  const handleProfilePicUpdate = (pic) => setProfilePic(pic);

  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user || { firstName: 'Student' };
    } catch {
      return { firstName: 'Student' };
    }
  };

  const userInfo = getUserInfo();

  const handleStartInterviewClick = () => {
    if (!selectedInterviewType) {
      alert("Please select an interview type!");
      return;
    }
    navigate("/start-interview", {
      state: { interviewType: selectedInterviewType },
    });
  };

  const handleScheduleInterviewSubmit = () => {
    if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
      alert("Please select interview type, date, and time!");
      return;
    }

    alert(`${scheduledInterviewType} scheduled on ${new Date(`${scheduledDate} ${selectedTime}`).toLocaleString()}`);
    setScheduledInterviewType("");
    setScheduledDate("");
    setSelectedTime("");
  };

  const handleMarkProgressClick = () => {
    const nextProgress = completedInterviews + 1;
    if (nextProgress > 20) {
      alert("All interviews completed!");
      return;
    }
    setCompletedInterviews(nextProgress);
  };

  return (
    <div className="student-dashboard">
      {/* Navbar */}
      <nav className="student-navbar">
        <div className="navbar-left">
          <div className="logo-container">
            <span className="logo-text">CodeBeGun</span>
          </div>
        </div>

        <div className="navbar-right">
          <div 
            className="profile-wrapper"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-circle">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-img" />
              ) : (
                <div className="profile-placeholder">
                  <span>{userInfo.firstName?.charAt(0)?.toUpperCase() || 'S'}</span>
                </div>
              )}
              <div className="completion-badge">{calculateOverallCompletion()}%</div>
            </div>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown-menu">
              <button 
                className="dropdown-menu-item"
                onClick={() => {
                  setShowMyProfile(true);
                  setShowProfileMenu(false);
                }}
              >
                My Profile
              </button>
              <button 
                className="dropdown-menu-item logout-item"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="dashboard-main">
        {!showMyProfile ? (
          <>
            <div className="welcome-section">
              <h1>Welcome, {userInfo.firstName}!</h1>
              <p>Manage your interviews and track your progress</p>
            </div>

            {/* Cards */}
            <div className="dashboard-cards-container">
              {/* Take Interview */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Take Interview</h3>
                </div>
                <div className="card-body">
                  <select
                    className="card-select"
                    value={selectedInterviewType}
                    onChange={(e) => setSelectedInterviewType(e.target.value)}
                  >
                    <option value="">Select Interview Type</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Behavioral Interview">Behavioral Interview</option>
                    <option value="Communication Interview">Communication Interview</option>
                  </select>
                  <button
                    className="card-btn btn-primary"
                    onClick={handleStartInterviewClick}
                  >
                    Start Interview
                  </button>
                </div>
              </div>

              {/* Schedule Interview */}
              <div className="dashboard-card schedule-card">
                <div className="card-header">
                  <h3>Schedule a Mock Interview</h3>
                </div>
                <div className="card-body">
                  <div className="schedule-grid">
                    <div className="schedule-left">
                      <label className="schedule-label">Select Interview Module</label>
                      <select
                        className="card-select"
                        value={scheduledInterviewType}
                        onChange={(e) => setScheduledInterviewType(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Technical Interview">Technical</option>
                        <option value="Behavioral Interview">Behavioral</option>
                        <option value="Communication Interview">Communication</option>
                      </select>

                      {scheduledInterviewType && (
                        <p className="duration-text">
                          Duration: {interviewDurations[scheduledInterviewType]} minutes
                        </p>
                      )}

                      <label className="schedule-label">Select Date</label>
                      <input
                        type="date"
                        className="card-input"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>

                    <div className="schedule-right">
                      <label className="schedule-label">Available Time Slots</label>
                      <div className="time-slots-grid">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            className={`time-slot ${selectedTime === slot ? "active" : ""}`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <label className="schedule-label">Interviewer Preference (Optional)</label>
                      <select className="card-select">
                        <option>Any Available</option>
                        <option>Interviewer A</option>
                        <option>Interviewer B</option>
                      </select>

                      <button
                        className="card-btn btn-primary full-width"
                        onClick={handleScheduleInterviewSubmit}
                      >
                        Confirm Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Student Interview Progress</h3>
                </div>
                <div className="card-body">
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(completedInterviews / 20) * 100}%` }}
                    >
                      {completedInterviews}/20
                    </div>
                  </div>
                  <button
                    className="card-btn btn-info"
                    onClick={handleMarkProgressClick}
                  >
                    Mark Interview Completed
                  </button>
                </div>
              </div>
            </div>

            {/* My Profile Button */}
            <div className="profile-action-section">
              <button 
                className="btn-complete-profile"
                onClick={() => setShowMyProfile(true)}
              >
                View My Profile
              </button>
            </div>
          </>
        ) : (
          <div className="profile-container">
            <div className="profile-header">
              <h2>My Profile</h2>
              <button 
                className="btn-back"
                onClick={() => setShowMyProfile(false)}
              >
                Back to Dashboard
              </button>
            </div>

            <div className="profile-sections-wrapper">
              <PersonalInformation 
                onCompletionChange={(percent) => updateSectionCompletion('personal', percent)}
                onProfilePicChange={handleProfilePicUpdate}
              />
              <GenericDetails 
                onCompletionChange={(percent) => updateSectionCompletion('generic', percent)}
              />
              <TenthGrade 
                onCompletionChange={(percent) => updateSectionCompletion('tenth', percent)}
              />
              <TwelfthGrade 
                onCompletionChange={(percent) => updateSectionCompletion('twelfth', percent)}
              />
              <UGDetails 
                onCompletionChange={(percent) => updateSectionCompletion('ug', percent)}
              />
              <PGDetails 
                onCompletionChange={(percent) => updateSectionCompletion('pg', percent)}
              />
              <CourseDetails 
                onCompletionChange={(percent) => updateSectionCompletion('course', percent)}
              />
              <Projects 
                onCompletionChange={(percent) => updateSectionCompletion('projects', percent)}
              />
              <FeeDetails />
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button 
                className="btn-modal-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
