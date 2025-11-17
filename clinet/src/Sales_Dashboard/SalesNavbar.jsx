import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom";

function SalesNavbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  // Fetch Sales User from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { firstName: "Sales" };
    } catch {
      return { firstName: "Sales" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("allUsers");
    window.location.href = "/login";
  };

  return (
    <>
      {/* NAVBAR HEADER */}
      <nav
        className="navbar bg-white shadow-sm px-4 d-flex justify-content-between align-items-center position-sticky top-0"
        style={{ 
          height: "70px",
          borderBottom: "1px solid #e5e7eb",
          zIndex: 1000
        }}
      >
        {/* Logo / Title */}
        <div className="d-flex align-items-center">
          <span 
            className="fs-2 fw-bold"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px"
            }}
          >
            CodeBeGun
          </span>
        </div>

        {/* Profile Section */}
        <div className="position-relative">
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 transition-all"
            style={{ 
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: openMenu ? "#f3f4f6" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (!openMenu) e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              if (!openMenu) e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div 
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                padding: "2px"
              }}
            >
              <FaUserCircle size={32} className="text-white" />
            </div>
            <span 
              className="fw-semibold d-none d-md-inline"
              style={{ color: "#1f2937" }}
            >
              {user.firstName}
            </span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              style={{
                transform: openMenu ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }}
            >
              <path 
                d="M4 6L8 10L12 6" 
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div
              className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 border overflow-hidden"
              style={{ 
                minWidth: "200px", 
                zIndex: 2000,
                animation: "slideDown 0.2s ease",
                borderColor: "#e5e7eb"
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
                    background-color: #f3f4f6;
                    padding-left: 1.25rem;
                  }
                `}
              </style>
              
              <button
                className="dropdown-item dropdown-item-custom fw-medium border-0 text-start py-3 px-4"
                style={{ color: "#374151" }}
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/sales-dashboard/myprofile");
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

              <button
                className="dropdown-item dropdown-item-custom fw-medium border-0 text-start py-3 px-4"
                style={{ 
                  color: "#dc2626",
                  borderTop: "1px solid #e5e7eb"
                }}
                onClick={() => {
                  setOpenMenu(false);
                  setConfirmLogout(true);
                }}
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
      </nav>

      {/* Logout Confirm Modal */}
      {confirmLogout && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ 
            zIndex: 3000,
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
          
          <div 
            className="bg-white rounded-4 p-4 shadow-lg" 
            style={{ 
              width: "380px",
              animation: "slideUp 0.3s ease"
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#fee2e2"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h5 className="fw-bold mb-0" style={{ color: "#111827" }}>
                Confirm Logout
              </h5>
            </div>
            
            <p className="mb-4" style={{ color: "#6b7280", fontSize: "15px" }}>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn px-4 py-2 fw-medium rounded-3"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>

              <button 
                className="btn px-4 py-2 fw-medium rounded-3"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SalesNavbar;