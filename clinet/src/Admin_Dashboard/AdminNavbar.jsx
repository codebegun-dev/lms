// import React, { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
 
// const AdminNavbar = ({ onLogout }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   const getUserInfo = () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user || { firstName: "Admin" };
//     } catch (error) {
//       return { firstName: "Admin" };
//     }
//   };

//   const userInfo = getUserInfo();

//   return (
//     <nav className="navbar navbar-light bg-white shadow-sm px-4 sticky-top d-flex justify-content-between align-items-center">
//       {/* Left Section */}
//       <div className="d-flex align-items-center">
//         <span className="fs-4 fw-bold text-primary">CodeBeGun</span>
//       </div>

//       {/* Right Section */}
//       <div className="position-relative">
//         <div
//           className="d-flex align-items-center gap-2 px-2 py-1 rounded-3 hover-bg-light"
//           onClick={() => setShowMenu(!showMenu)}
//           style={{ cursor: "pointer" }}
//         >
//           <FaUserCircle size={32} className="text-primary" />
//           <span className="fw-medium text-dark d-none d-md-inline">
//             {userInfo.firstName}
//           </span>
//         </div>

//         {/* Dropdown */}
//         {showMenu && (
//           <div
//             className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-sm border"
//             style={{ minWidth: "160px", zIndex: 1000 }}
//           >
//             <button
//               className="dropdown-item text-danger fw-semibold border-top"
//               onClick={onLogout}
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;





import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
 
const AdminNavbar = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("allUsers");
    // Navigate to login page
    window.location.href = "/login";
    // Call onLogout if provided
    if (onLogout) {
      onLogout();
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm px-4 sticky-top d-flex justify-content-between align-items-center">
        {/* Left Section */}
        <div className="d-flex align-items-center">
          <span className="fs-4 fw-bold text-primary">CodeBeGun</span>
        </div>

        {/* Right Section */}
        <div className="position-relative">
          <div
            className="d-flex align-items-center gap-2 px-2 py-1 rounded-3 hover-bg-light"
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer" }}
          >
            <FaUserCircle size={32} className="text-primary" />
            <span className="fw-medium text-dark d-none d-md-inline">
              {userInfo.firstName}
            </span>
          </div>

          {/* Dropdown */}
          {showMenu && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-sm border"
              style={{ minWidth: "160px", zIndex: 1000 }}
            >
              <button
                className="dropdown-item text-danger fw-semibold border-top"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" 
          style={{ zIndex: 1060 }}
        >
          <div className="bg-white rounded-3 p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <h5 className="fw-semibold mb-3">Confirm Logout</h5>
            <p className="mb-4 text-secondary">
              Are you sure you want to logout?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={cancelLogout}
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
      )}
    </>
  );
};

export default AdminNavbar;