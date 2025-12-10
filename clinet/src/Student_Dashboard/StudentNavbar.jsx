// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const StudentNavbar = () => {
// //   const navigate = useNavigate();
// //   const [showProfileMenu, setShowProfileMenu] = useState(false);
// //   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
// //   const [profilePic, setProfilePic] = useState("");
// //   const [userInfo, setUserInfo] = useState({ firstName: "Student" });

// //   const handleLogout = () => setShowLogoutConfirm(true);
// //   const confirmLogout = () => {
// //     localStorage.removeItem("user");
// //     navigate("/login");
// //   };

// //   //  Improved function to load profile data
// //   const loadProfileData = () => {
// //     const user = JSON.parse(localStorage.getItem("user")) || {};
// //     setUserInfo(user);
    
// //     // Try to get profile picture from multiple possible sources
// //     const profilePicture = 
// //       user.profilePicturePath || 
// //       user.profilePicture || 
// //       "";
    
// //     setProfilePic(profilePicture);
// //     console.log("Navbar - Loaded profile data:", { 
// //       firstName: user.firstName, 
// //       profilePic: profilePicture 
// //     });
// //   };

// //   //  Listen for profile updates from other components
// //   useEffect(() => {
// //     loadProfileData();
    
// //     // Listen for custom event when profile is updated
// //     const handleProfileUpdate = () => {
// //       console.log("Navbar - Profile update event received");
// //       loadProfileData();
// //     };

// //     // Listen for storage changes (when localStorage is updated)
// //     const handleStorageChange = (e) => {
// //       if (e.key === "user") {
// //         console.log("Navbar - Storage change detected");
// //         loadProfileData();
// //       }
// //     };

// //     // Add event listeners
// //     window.addEventListener("profile-updated", handleProfileUpdate);
// //     window.addEventListener("storage", handleStorageChange);
    
// //     // Poll for changes every 2 seconds (fallback)
// //     const interval = setInterval(loadProfileData, 2000);

// //     return () => {
// //       window.removeEventListener("profile-updated", handleProfileUpdate);
// //       window.removeEventListener("storage", handleStorageChange);
// //       clearInterval(interval);
// //     };
// //   }, []);

// //   //  Function to trigger profile update from other components
// //   const triggerProfileUpdate = () => {
// //     const event = new CustomEvent("profile-updated");
// //     window.dispatchEvent(event);
// //   };

// //   // Check if profile picture should be shown or letter avatar
// //   const showLetterAvatar =
// //     !profilePic ||
// //     profilePic.includes("ui-avatars.com") ||
// //     profilePic.includes("/uploads/") === false;

// //   return (
// //     <>
// //       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom">
// //         <div className="container-fluid px-4">
// //           <div className="d-flex justify-content-between align-items-center w-100">

// //              <div className="d-flex align-items-center">
// //               <span
// //                 className="fs-2 fw-bold cursor-pointer"
// //                 style={{
// //                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //                   WebkitBackgroundClip: "text",
// //                   WebkitTextFillColor: "transparent",
// //                   backgroundClip: "text",
// //                   letterSpacing: "-0.5px",
// //                 }}
// //                 onClick={() => navigate("/student-dashboard")}
// //               >
// //                 CodeBeGun
// //               </span>
// //             </div>
 
// //             {/* Profile Dropdown */}
// //             <div className="position-relative">
// //               <button
// //                 className="btn p-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
// //                 style={{
// //                   border: "none",
// //                   backgroundColor: showProfileMenu ? "#f8f9fa" : "transparent",
// //                   transition: "background-color 0.2s ease",
// //                 }}
// //                 onClick={() => setShowProfileMenu(!showProfileMenu)}
// //                 onMouseEnter={(e) => {
// //                   if (!showProfileMenu) e.currentTarget.style.backgroundColor = "#f8f9fa";
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   if (!showProfileMenu) e.currentTarget.style.backgroundColor = "transparent";
// //                 }}
// //               >
// //                 <div className="position-relative">
// //                   {showLetterAvatar ? (
// //                     <div
// //                       className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-bold text-white border border-2 border-white shadow-sm"
// //                       style={{ width: "40px", height: "40px" }}
// //                     >
// //                       {userInfo.firstName?.[0]?.toUpperCase() || "S"}
// //                     </div>
// //                   ) : (
// //                     <img
// //                       src={`${profilePic}?t=${new Date().getTime()}`} // ✅ Cache busting
// //                       alt="profile"
// //                       className="rounded-circle border border-2 border-primary"
// //                       style={{ 
// //                         width: "40px", 
// //                         height: "40px", 
// //                         objectFit: "cover" 
// //                       }}
// //                       onError={(e) => {
// //                         // If image fails to load, fall back to letter avatar
// //                         console.log("Image failed to load, falling back to letter avatar");
// //                         e.target.style.display = 'none';
// //                         setProfilePic(""); // Clear the broken image URL
// //                       }}
// //                     />
// //                   )}

// //                   <span
// //                     className="position-absolute top-0 start-100 translate-middle bg-success border border-2 border-white rounded-circle"
// //                     style={{ width: "12px", height: "12px" }}
// //                   ></span>
// //                 </div>

// //                 <span className="fw-semibold text-dark d-none d-md-inline">
// //                   {userInfo.firstName || "Student"}
// //                 </span>

// //                 <svg
// //                   width="16"
// //                   height="16"
// //                   viewBox="0 0 16 16"
// //                   fill="none"
// //                   className="d-none d-md-block"
// //                   style={{
// //                     transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)",
// //                     transition: "transform 0.2s ease",
// //                   }}
// //                 >
// //                   <path
// //                     d="M4 6L8 10L12 6"
// //                     stroke="#6c757d"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                   />
// //                 </svg>
// //               </button>

// //               {showProfileMenu && (
// //                 <div
// //                   className="dropdown-menu dropdown-menu-end show mt-2 shadow border rounded-3 overflow-hidden"
// //                   style={{
// //                     minWidth: "200px",
// //                     animation: "slideDown 0.2s ease",
// //                   }}
// //                 >
// //                   <style>
// //                     {`
// //                       @keyframes slideDown {
// //                         from {
// //                           opacity: 0;
// //                           transform: translateY(-10px);
// //                         }
// //                         to {
// //                           opacity: 1;
// //                           transform: translateY(0);
// //                         }
// //                       }
// //                       .dropdown-item-custom {
// //                         transition: all 0.2s ease;
// //                       }
// //                       .dropdown-item-custom:hover {
// //                         background-color: #f8f9fa;
// //                         padding-left: 1.25rem;
// //                       }
// //                       .cursor-pointer {
// //                         cursor: pointer;
// //                       }
// //                     `}
// //                   </style>

// //                   <div className="dropdown-header text-muted small px-3 py-2">
// //                     Signed in as<br />
// //                     <strong>{userInfo.email || "student@example.com"}</strong>
// //                   </div>

// //                   <hr className="dropdown-divider my-0" />

// //                   <button
// //                     className="dropdown-item dropdown-item-custom fw-semibold py-3"
// //                     onClick={() => {
// //                       navigate("/student-profile");
// //                       setShowProfileMenu(false);
// //                       // Trigger refresh when navigating to profile
// //                       setTimeout(triggerProfileUpdate, 100);
// //                     }}
// //                   >
// //                     <div className="d-flex align-items-center gap-2">
// //                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //                         <path
// //                           d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <circle
// //                           cx="12"
// //                           cy="7"
// //                           r="4"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                       </svg>
// //                       My Profile
// //                     </div>
// //                   </button>

// //                   <button
// //                     className="dropdown-item dropdown-item-custom fw-semibold py-3"
// //                     onClick={() => {
// //                       triggerProfileUpdate();
// //                       setShowProfileMenu(false);
// //                     }}
// //                   >
// //                     <div className="d-flex align-items-center gap-2">
// //                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //                         <path
// //                           d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <path
// //                           d="M3 3v5h5"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <path
// //                           d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <path
// //                           d="M16 16h5v5"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                       </svg>
// //                       Refresh Profile
// //                     </div>
// //                   </button>

// //                   <hr className="dropdown-divider my-0" />

// //                   <button
// //                     className="dropdown-item dropdown-item-custom fw-semibold text-danger py-3"
// //                     onClick={handleLogout}
// //                   >
// //                     <div className="d-flex align-items-center gap-2">
// //                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //                         <path
// //                           d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <polyline
// //                           points="16 17 21 12 16 7"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                         <line
// //                           x1="21"
// //                           y1="12"
// //                           x2="9"
// //                           y2="12"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                         />
// //                       </svg>
// //                       Logout
// //                     </div>
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Logout Confirmation Modal */}
// //       {showLogoutConfirm && (
// //         <div
// //           className="modal fade show d-block"
// //           tabIndex="-1"
// //           style={{
// //             backgroundColor: "rgba(0, 0, 0, 0.5)",
// //             backdropFilter: "blur(4px)",
// //             animation: "fadeIn 0.2s ease",
// //           }}
// //         >
// //           <style>
// //             {`
// //               @keyframes fadeIn {
// //                 from { opacity: 0; }
// //                 to { opacity: 1; }
// //               }
// //               @keyframes slideUp {
// //                 from {
// //                   opacity: 0;
// //                   transform: translateY(20px);
// //                 }
// //                 to {
// //                   opacity: 1;
// //                   transform: translateY(0);
// //                 }
// //               }
// //             `}
// //           </style>

// //           <div className="modal-dialog modal-dialog-centered">
// //             <div
// //               className="modal-content border-0 shadow-lg rounded-4"
// //               style={{ animation: "slideUp 0.3s ease" }}
// //             >
// //               <div className="modal-header border-0 pb-0">
// //                 <div className="d-flex align-items-center gap-3">
// //                   <div
// //                     className="d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10"
// //                     style={{ width: "48px", height: "48px" }}
// //                   >
// //                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
// //                       <path
// //                         d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
// //                         stroke="#dc3545"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                       />
// //                       <line
// //                         x1="12"
// //                         y1="9"
// //                         x2="12"
// //                         y2="13"
// //                         stroke="#dc3545"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                       />
// //                       <line
// //                         x1="12"
// //                         y1="17"
// //                         x2="12.01"
// //                         y2="17"
// //                         stroke="#dc3545"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                       />
// //                     </svg>
// //                   </div>
// //                   <h5 className="modal-title fw-bold mb-0">Confirm Logout</h5>
// //                 </div>
// //                 <button
// //                   type="button"
// //                   className="btn-close"
// //                   onClick={() => setShowLogoutConfirm(false)}
// //                 ></button>
// //               </div>

// //               <div className="modal-body pt-3">
// //                 <p className="text-secondary mb-0">
// //                   Are you sure you want to logout? You'll need to sign in again to access your account.
// //                 </p>
// //               </div>

// //               <div className="modal-footer border-0 pt-0">
// //                 <button
// //                   className="btn btn-secondary px-4"
// //                   onClick={() => setShowLogoutConfirm(false)}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button className="btn btn-danger px-4" onClick={confirmLogout}>
// //                   Logout
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default StudentNavbar;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const StudentNavbar = () => {
//   const navigate = useNavigate();
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [profilePic, setProfilePic] = useState("");
//   const [userInfo, setUserInfo] = useState({ firstName: "Student" });

//   const handleLogout = () => setShowLogoutConfirm(true);
//   const confirmLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // Load profile
//   const loadProfileData = () => {
//     const user = JSON.parse(localStorage.getItem("user")) || {};
//     setUserInfo(user);
//     const profilePicture =
//       user.profilePicturePath ||
//       user.profilePicture ||
//       "";

//     setProfilePic(profilePicture);
//   };

//   useEffect(() => {
//     loadProfileData();
//   }, []);

//   const showLetterAvatar =
//     !profilePic ||
//     !profilePic.includes("/uploads/");

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="navbar navbar-light bg-white shadow-sm border-bottom px-4 sticky-top">
//         <div className="container-fluid d-flex justify-content-between">

//           {/* Logo */}
//           <span
//             className="fs-3 fw-bold text-primary"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate("/student-dashboard")}
//           >
//             CodeBeGun
//           </span>

//           {/* Profile Button */}
//           <div className="dropdown">
//             <button
//               className="btn d-flex align-items-center gap-2"
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//             >
//               {/* Avatar */}
//               <div className="position-relative">
//                 {showLetterAvatar ? (
//                   <div
//                     className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
//                     style={{ width: "40px", height: "40px", fontSize: "18px" }}
//                   >
//                     {userInfo.firstName?.[0]?.toUpperCase() || "S"}
//                   </div>
//                 ) : (
//                   <img
//                     src={`${profilePic}?t=${Date.now()}`}
//                     alt="profile"
//                     className="rounded-circle"
//                     style={{ width: "40px", height: "40px", objectFit: "cover" }}
//                     onError={() => setProfilePic("")}
//                   />
//                 )}

//                 {/* Online Dot */}
//                 <span
//                   className="position-absolute top-0 start-100 translate-middle bg-success border border-white rounded-circle"
//                   style={{ width: "12px", height: "12px" }}
//                 ></span>
//               </div>

//               <span className="fw-semibold d-none d-md-inline">
//                 {userInfo.firstName || "Student"}
//               </span>

//               <i className="bi bi-caret-down-fill small"></i>
//             </button>

//             {/* Dropdown Menu */}
//             {showProfileMenu && (
//               <ul className="dropdown-menu dropdown-menu-end show shadow">
//                 <li className="dropdown-header small text-muted px-3">
//                   Signed in as
//                   <br />
//                   <strong>{userInfo.email || "student@example.com"}</strong>
//                 </li>

//                 <li><hr className="dropdown-divider" /></li>

//                 <li>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => {
//                       navigate("/student-profile");
//                       setShowProfileMenu(false);
//                     }}
//                   >
//                     My Profile
//                   </button>
//                 </li>

//                 <li>
//                   <button
//                     className="dropdown-item"
//                     onClick={() => {
//                       loadProfileData();
//                       setShowProfileMenu(false);
//                     }}
//                   >
//                     Refresh Profile
//                   </button>
//                 </li>

//                 <li><hr className="dropdown-divider" /></li>

//                 <li>
//                   <button
//                     className="dropdown-item text-danger"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* LOGOUT MODAL */}
//       {showLogoutConfirm && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">

//               <div className="modal-header">
//                 <h5 className="modal-title">Confirm Logout</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowLogoutConfirm(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <p>
//                   Are you sure you want to logout? You will need to sign in again.
//                 </p>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowLogoutConfirm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-danger" onClick={confirmLogout}>
//                   Logout
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default StudentNavbar;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userInfo, setUserInfo] = useState({ firstName: "Student" });

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadProfileData = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setUserInfo(user);

    const profilePicture =
      user.profilePicturePath ||
      user.profilePicture ||
      "";

    setProfilePic(profilePicture);
  };

  useEffect(() => {
    loadProfileData();

    // Close dropdown when clicking outside
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const showLetterAvatar =
    !profilePic ||
    !profilePic.includes("/uploads/");

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm border-bottom px-4 sticky-top">
        <div className="container-fluid d-flex justify-content-between">
          <span
            className="fs-3 fw-bold text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/student-dashboard")}
          >
            CodeBeGun
          </span>

          {/* PROFILE DROPDOWN WRAPPER */}
          <div className="dropdown profile-dropdown position-relative">
            <button
              className="btn d-flex align-items-center gap-2"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="position-relative">
                {showLetterAvatar ? (
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                    style={{ width: "40px", height: "40px", fontSize: "18px" }}
                  >
                    {userInfo.firstName?.[0]?.toUpperCase() || "S"}
                  </div>
                ) : (
                  <img
                    src={`${profilePic}?t=${Date.now()}`}
                    alt="profile"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                    onError={() => setProfilePic("")}
                  />
                )}

                <span
                  className="position-absolute top-0 start-100 translate-middle bg-success border border-white rounded-circle"
                  style={{ width: "12px", height: "12px" }}
                ></span>
              </div>

              <span className="fw-semibold d-none d-md-inline">
                {userInfo.firstName || "Student"}
              </span>

              <i className="bi bi-caret-down-fill small"></i>
            </button>

            {/* FIXED DROPDOWN */}
            {showProfileMenu && (
              <ul
                className="dropdown-menu show shadow"
                style={{
                  right: 0,          // Align inside page
                  left: "auto",
                  maxWidth: "300px",
                  transform: "none", // Prevent overflow
                  position: "absolute",
                  top: "50px",
                  zIndex: 9999,
                }}
              >
                <li className="dropdown-header small text-muted px-3">
                  Signed in as
                  <br />
                  <strong>{userInfo.email || "student@example.com"}</strong>
                </li>

                <li><hr className="dropdown-divider" /></li>

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

                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      loadProfileData();
                      setShowProfileMenu(false);
                    }}
                  >
                    Refresh Profile
                  </button>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutConfirm(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to logout? You will need to sign in
                  again.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
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
