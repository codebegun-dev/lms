import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="bg-light vh-100 p-3">
      <h5 className="text-center mb-4 border-bottom pb-2">Admin Dashboard</h5>
      <nav className="nav flex-column">
        <Link to="course-management" className="nav-link text-dark mb-2 rounded px-2">
          Course Management
        </Link>
        <Link to="batch-management" className="nav-link text-dark mb-2 rounded px-2">
          Batch Management
        </Link>
        <Link to="question-bank" className="nav-link text-dark mb-2 rounded px-2">
          Question Bank
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
