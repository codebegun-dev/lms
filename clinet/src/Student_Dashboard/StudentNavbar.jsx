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
    window.addEventListener("user-updated", loadProfilePic); // triggers when personal info page updates image

    return () => window.removeEventListener("user-updated", loadProfilePic);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("user")) || { firstName: "Student" };

  return (
    <div className="bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h3 className="text-primary fw-bold mb-0">CodeBeGun</h3>

          <div className="dropdown position-relative">
            <button
              className="btn rounded-circle position-relative p-0"
              style={{ border: "none", background: "transparent" }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {profilePic ? (
                <img
                  src={`${profilePic}?t=${Date.now()}`}  // ✅ prevent caching
                  alt="profile"
                  className="rounded-circle bg-primary text-white"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-bold"
                  style={{ width: "40px", height: "40px", color: "white" }}
                >
                  {userInfo.firstName?.[0]?.toUpperCase() || "S"}
                </div>
              )}

              <span
                className="position-absolute top-0 end-0 translate-middle bg-success border border-white rounded-circle"
                style={{ width: "14px", height: "14px" }}
              ></span>
            </button>

            {showProfileMenu && (
              <ul
                className="dropdown-menu mt-2 shadow-sm show"
                style={{
                  left: "auto",
                  right: "0",
                }}
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/student-profile");
                      setShowProfileMenu(false);
                    }}
                  >
                    My Profile
                  </button>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

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
