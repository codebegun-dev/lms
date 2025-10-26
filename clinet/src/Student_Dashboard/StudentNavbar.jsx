import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "../components/student/sections/PersonalInformation";
import GenericDetails from "../components/student/sections/GenericDetails";
import TenthGrade from "../components/student/sections/TenthGrade";
import TwelfthGrade from "../components/student/sections/TwelfthGrade";
import UGDetails from "../components/student/sections/UGDetails";
import PGDetails from "../components/student/sections/PGDetails";
import CourseDetails from "../components/student/sections/CourseDetails";
import FeeDetails from "../components/student/sections/FeeDetails";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const [sectionCompletion, setSectionCompletion] = useState({
    personal: 0,
    generic: 0,
    tenth: 0,
    twelfth: 0,
    ug: 0,
    pg: 0,
    course: 0,
  });

  const calculateOverallCompletion = () => {
    const values = Object.values(sectionCompletion);
    const total = values.reduce((sum, val) => sum + val, 0);
    return Math.round(total / values.length);
  };

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const updateSectionCompletion = (section, percentage) => {
    setSectionCompletion((prev) => ({
      ...prev,
      [section]: percentage,
    }));
  };

  const handleProfilePicUpdate = (pic) => setProfilePic(pic);

  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user || { firstName: "Student" };
    } catch {
      return { firstName: "Student" };
    }
  };

  const userInfo = getUserInfo();

  return (
    <div className="bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h3 className="text-primary fw-bold mb-0">CodeBeGun</h3>

          {/* Profile Dropdown */}
          <div className="dropdown position-relative">
            <button
  className={`btn btn-primary rounded-circle position-relative d-flex justify-content-center align-items-center border-0 ${showProfileMenu ? "show" : ""}`}
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-100 h-100 rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span className="text-white fs-3 fw-bold">
                  {userInfo.firstName?.charAt(0)?.toUpperCase() || "S"}
                </span>
              )}

              {/* Green Status Dot */}
              <span
                className="position-absolute top-0 end-0 translate-middle bg-success border border-white rounded-circle"
                style={{
                  width: "14px",
                  height: "14px",
                }}
              ></span>
            </button>

            {/* Dropdown Menu */}
            <ul
              className={`dropdown-menu dropdown-menu-end mt-2 shadow-sm ${
                showProfileMenu ? "show" : ""
              }`}
              aria-labelledby="profileDropdown"
              style={{
                position: "absolute",
                right: 0,
                zIndex: 1050,
                minWidth: "160px",
              }}
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowMyProfile(true);
                    setShowProfileMenu(false);
                  }}
                >
                  My Profile
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        {showMyProfile && (
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h4>My Profile</h4>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMyProfile(false)}
              >
                Back to Dashboard
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              <PersonalInformation
                onCompletionChange={(p) => updateSectionCompletion("personal", p)}
                onProfilePicChange={handleProfilePicUpdate}
              />
              <GenericDetails
                onCompletionChange={(p) => updateSectionCompletion("generic", p)}
              />
              <TenthGrade
                onCompletionChange={(p) => updateSectionCompletion("tenth", p)}
              />
              <TwelfthGrade
                onCompletionChange={(p) => updateSectionCompletion("twelfth", p)}
              />
              <UGDetails
                onCompletionChange={(p) => updateSectionCompletion("ug", p)}
              />
              <PGDetails
                onCompletionChange={(p) => updateSectionCompletion("pg", p)}
              />
              <CourseDetails
                onCompletionChange={(p) => updateSectionCompletion("course", p)}
              />
              <FeeDetails />
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNavbar;
