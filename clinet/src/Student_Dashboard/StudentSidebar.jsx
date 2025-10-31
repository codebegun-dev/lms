
// import { Link } from "react-router-dom";

// const StudentSidebar = () => {
//   return (
//     <>
//     <div className="bg-light vh-100 ">
//       <h4 className="text-center mb-4 border-bottom pb-2">Dashboard</h4>
//       <nav className="nav flex-column">
//         <Link to="student-dashboard" className="nav-link text-dark mb-2 rounded px-2">
//           Student Dashboard
//         </Link>
         
//       </nav>
//     </div>
//     </>
//   );
// };

// export default StudentSidebar;


import { Link } from "react-router-dom";
import { useState } from "react";

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="d-flex flex-column flex-md-row">
        {/* Toggle button visible only on small screens */}
        <button
          className="btn btn-outline-dark m-2 d-md-none"
          type="button"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Sidebar section */}
        <div
          className={`bg-light p-3 border-end ${
            isOpen ? "d-block" : "d-none"
          } d-md-block`}
          style={{ minWidth: "220px", height: "100vh" }}
        >
          <h4 className="text-center mb-4 border-bottom pb-2">Dashboard</h4>
          <nav className="nav flex-column">
            <Link
              to="student-dashboard"
              className="nav-link text-dark mb-2 rounded px-2"
              onClick={() => setIsOpen(false)} // close sidebar when link clicked
            >
              Student Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
