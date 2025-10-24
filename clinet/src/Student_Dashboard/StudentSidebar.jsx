
import { Link } from "react-router-dom";

const StudentSidebar = () => {
  return (
    <div className="bg-light vh-100 p-3">
      <h4 className="text-center mb-4 border-bottom pb-2">Dashboard</h4>
      <nav className="nav flex-column">
        <Link to="student-dashboard" className="nav-link text-dark mb-2 rounded px-2">
          Student Dashboard
        </Link>
         
      </nav>
    </div>
  );
};

export default StudentSidebar;
