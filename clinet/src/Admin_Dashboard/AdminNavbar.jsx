import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user || { firstName: "Admin" };
    } catch (error) {
      return { firstName: "Admin" };
    }
  };

  const userInfo = getUserInfo();

  const handleLogoutClick = () => {
    setShowMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("user");
    localStorage.removeItem("allUsers");
    window.location.href = "/login";
    if (onLogout) {
      onLogout();
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleMyProfile = () => {
    setShowMenu(false);
    navigate("/admin-dashboard/admin-profile");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm px-4 sticky-top border-bottom">
        <div className="container-fluid p-0">
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Left Section - Logo */}
            <div className="d-flex align-items-center">
              <span className="fs-3 fw-bold text-primary">CodeBeGun</span>
            </div>

            {/* Right Section - Profile Dropdown */}
            <div className="position-relative">
              <div
                className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                onClick={() => setShowMenu(!showMenu)}
                style={{ 
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  backgroundColor: showMenu ? "#f8f9fa" : "transparent"
                }}
                onMouseEnter={(e) => {
                  if (!showMenu) e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  if (!showMenu) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="bg-primary rounded-circle p-1">
                  <FaUserCircle size={28} className="text-white" />
                </div>
                <span className="fw-semibold text-dark d-none d-md-inline">
                  {userInfo.firstName}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className="ms-1"
                  style={{
                    transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
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
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded-3 shadow border overflow-hidden"
                  style={{ 
                    minWidth: "200px", 
                    zIndex: 1000,
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
                    className="dropdown-item dropdown-item-custom fw-semibold border-0 text-start py-3 px-4 w-100 bg-transparent"
                    onClick={handleMyProfile}
                    style={{ color: "#495057" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Profile
                    </div>
                  </button>

                  <button
                    className="dropdown-item dropdown-item-custom fw-semibold border-0 text-start py-3 px-4 w-100 bg-transparent border-top"
                    onClick={handleLogoutClick}
                    style={{ color: "#dc3545" }}
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
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" 
          style={{ 
            zIndex: 1060,
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
          
          <div 
            className="bg-white rounded-4 p-4 shadow-lg" 
            style={{ 
              maxWidth: "400px",
              animation: "slideUp 0.3s ease"
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
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
              <h5 className="fw-bold mb-0 text-dark">Confirm Logout</h5>
            </div>
            
            <p className="mb-4 text-secondary">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary px-4"
                onClick={cancelLogout}
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
      )}
    </>
  );
};

export default AdminNavbar;