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
        <Link to="category" className="nav-link text-dark mb-2 rounded px-2">
          Create Category
        </Link>
        <Link to="topic" className="nav-link text-dark mb-2 rounded px-2">
          Create Topic
        </Link>
        <Link to="sub-topic" className="nav-link text-dark mb-2 rounded px-2">
          Create Sub-Topic
        </Link>
        <Link to="usermanagement" className="nav-link text-dark mb-2 rounded px-2">
          User Management
        </Link>
        <Link to="editusermodel" className="nav-link text-dark mb-2 rounded px-2">
          Edit User Model
        </Link>
        <Link to="viewusermodel" className="nav-link text-dark mb-2 rounded px-2">
          View User Model
        </Link>
        
        
       </nav>
    </div>
  );
};

export default AdminSidebar;
