import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadProfilePic = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setProfilePic(user.profilePicturePath || "");
  };

  useEffect(() => {
    loadProfilePic();
    window.addEventListener("user-updated", loadProfilePic);
    return () => window.removeEventListener("user-updated", loadProfilePic);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("user")) || { firstName: "Student" };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Logo */}
            <h3 className="text-primary fw-bold mb-0">CodeBeGun</h3>

            {/* Profile Dropdown */}
            <div className="position-relative">
              <button
                className="btn p-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                style={{ 
                  border: "none", 
                  backgroundColor: showProfileMenu ? "#f8f9fa" : "transparent",
                  transition: "background-color 0.2s ease"
                }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                onMouseEnter={(e) => {
                  if (!showProfileMenu) e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  if (!showProfileMenu) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="position-relative">
                  {profilePic ? (
                    <img
                      src={`${profilePic}?t=${Date.now()}`}
                      alt="profile"
                      className="rounded-circle border border-2 border-primary"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-bold text-white border border-2 border-white shadow-sm"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {userInfo.firstName?.[0]?.toUpperCase() || "S"}
                    </div>
                  )}
                  
                  <span
                    className="position-absolute top-0 start-100 translate-middle bg-success border border-2 border-white rounded-circle"
                    style={{ width: "12px", height: "12px" }}
                  ></span>
                </div>

                <span className="fw-semibold text-dark d-none d-md-inline">
                  {userInfo.firstName}
                </span>

                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className="d-none d-md-block"
                  style={{
                    transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <path 
                    d="M4 6L8 10L12 6" 
                    stroke="#6c757d" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {showProfileMenu && (
                <div
                  className="dropdown-menu dropdown-menu-end show mt-2 shadow border rounded-3 overflow-hidden"
                  style={{
                    minWidth: "200px",
                    animation: "slideDown 0.2s ease"
                  }}
                >
                  <style>
                    {`
                      @keyframes slideDown {
                        from {
                          opacity: 0;
                          transform: translateY(-10px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                      .dropdown-item-custom {
                        transition: all 0.2s ease;
                      }
                      .dropdown-item-custom:hover {
                        background-color: #f8f9fa;
                        padding-left: 1.25rem;
                      }
                    `}
                  </style>

                  <button
                    className="dropdown-item dropdown-item-custom fw-semibold py-3"
                    onClick={() => {
                      navigate("/student-profile");
                      setShowProfileMenu(false);
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Profile
                    </div>
                  </button>

                  <hr className="dropdown-divider my-0" />

                  <button 
                    className="dropdown-item dropdown-item-custom fw-semibold text-danger py-3" 
                    onClick={handleLogout}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          <div className="modal-dialog modal-dialog-centered">
            <div 
              className="modal-content border-0 shadow-lg rounded-4"
              style={{ animation: "slideUp 0.3s ease" }}
            >
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="9" x2="12" y2="13" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h5 className="modal-title fw-bold mb-0">Confirm Logout</h5>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowLogoutConfirm(false)}
                ></button>
              </div>

              <div className="modal-body pt-3">
                <p className="text-secondary mb-0">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger px-4" 
                  onClick={confirmLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentNavbar;