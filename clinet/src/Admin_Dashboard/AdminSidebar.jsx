import { NavLink } from "react-router-dom";
import { FaBook, FaUsers, FaLayerGroup, FaClipboardList, FaFolderPlus, FaRegListAlt, FaUserCog } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-light p-3" style={{ minHeight: "100vh", borderRight: "1px solid #ddd" }}>
      <h5 className="text-center fw-bold mb-4">Admin Dashboard</h5>
      
      <ul className="list-unstyled">
        <li className="mb-3">
          <NavLink
            to="course-management"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaBook className="me-2" /> Course Management
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="batch-management"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaLayerGroup className="me-2" /> Batch Management
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="question-bank"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaClipboardList className="me-2" /> Question Bank
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="category"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaFolderPlus className="me-2" /> Create Category
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="topic"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaRegListAlt className="me-2" /> Create Topic
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="sub-topic"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaRegListAlt className="me-2" /> Create Sub-Topic
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="usermanagement"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaUsers className="me-2" /> User Management
          </NavLink>
        </li>


        <li className="mb-3">
          <NavLink
            to="manage-roles"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaUsers className="me-2" /> Manage Roles
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="courses"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaUsers className="me-2" />Courses
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink
            to="quiz"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none ${isActive ? "fw-bold text-primary" : "text-dark"}`
            }
          >
            <FaUsers className="me-2" />Quiz
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default AdminSidebar;
