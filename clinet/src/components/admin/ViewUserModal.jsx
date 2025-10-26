import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ViewUserModal.css';

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="view-user-modal">
        <div className="modal-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {/* Basic Information */}
          <div className="profile-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>First Name:</label>
                <span>{user.firstName || '-'}</span>
              </div>
              <div className="info-item">
                <label>Last Name:</label>
                <span>{user.lastName || '-'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email || '-'}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{user.phone || '-'}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${user.status}`}>{user.status}</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          {user.personalInfo && Object.keys(user.personalInfo).length > 0 && (
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Sure Name:</label>
                  <span>{user.personalInfo.surName || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Gender:</label>
                  <span>{user.personalInfo.gender || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth:</label>
                  <span>{user.personalInfo.dob || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Blood Group:</label>
                  <span>{user.personalInfo.bloodGroup || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Parent Mobile:</label>
                  <span>{user.personalInfo.parentMobile || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Generic Details */}
          {user.genericInfo && Object.keys(user.genericInfo).length > 0 && (
            <div className="profile-section">
              <h3>Generic Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Work Experience:</label>
                  <span>{user.genericInfo.workExperience || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Career Gap:</label>
                  <span>{user.genericInfo.careerGap || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Current State:</label>
                  <span>{user.genericInfo.currentState || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Current District:</label>
                  <span>{user.genericInfo.currentDistrict || '-'}</span>
                </div>
                <div className="info-item">
                  <label>GitHub:</label>
                  <span>{user.genericInfo.githubProfile || '-'}</span>
                </div>
                <div className="info-item">
                  <label>LinkedIn:</label>
                  <span>{user.genericInfo.linkedinProfile || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 10th Grade */}
          {user.tenthGrade && Object.keys(user.tenthGrade).length > 0 && (
            <div className="profile-section">
              <h3>10th Grade</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Board:</label>
                  <span>{user.tenthGrade.board || '-'}</span>
                </div>
                <div className="info-item">
                  <label>School Name:</label>
                  <span>{user.tenthGrade.schoolName || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Year of Passout:</label>
                  <span>{user.tenthGrade.yearOfPassout || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Marks %:</label>
                  <span>{user.tenthGrade.marksPercentage || '-'}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 12th Grade */}
          {user.twelfthGrade && Object.keys(user.twelfthGrade).length > 0 && (
            <div className="profile-section">
              <h3>12th Grade</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Board:</label>
                  <span>{user.twelfthGrade.board || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Group:</label>
                  <span>{user.twelfthGrade.group || '-'}</span>
                </div>
                <div className="info-item">
                  <label>College Name:</label>
                  <span>{user.twelfthGrade.collegeName || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Year of Passout:</label>
                  <span>{user.twelfthGrade.yearOfPassout || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Marks %:</label>
                  <span>{user.twelfthGrade.marksPercentage || '-'}%</span>
                </div>
              </div>
            </div>
          )}

          {/* UG Details */}
          {user.ugDetails && Object.keys(user.ugDetails).length > 0 && (
            <div className="profile-section">
              <h3>UG Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>University Roll No:</label>
                  <span>{user.ugDetails.universityRollNo || '-'}</span>
                </div>
                <div className="info-item">
                  <label>College Name:</label>
                  <span>{user.ugDetails.collegeName || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Course:</label>
                  <span>{user.ugDetails.courseName || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Branch:</label>
                  <span>{user.ugDetails.branch || '-'}</span>
                </div>
                <div className="info-item">
                  <label>CGPA:</label>
                  <span>{user.ugDetails.cgpa || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Active Backlogs:</label>
                  <span>{user.ugDetails.activeBacklogs || '0'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;