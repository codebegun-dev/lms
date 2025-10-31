
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import CourseManagement from "./CourseManagement";
import BatchManagement from "./BatchManagement";
import QuestionBank from "./QuestionBank";
import Category from "./CreateCategory";
import CreateTopic from "./CreateTopic";
import CreateSubTopic from "./CreateSubTopic";
import AdminNavbar from "./AdminNavbar";
import UserManagement from "./UserManagement";
import ViewUserModel from "./UserViewModel";
import EditUserModel from "./EditUserModel";


const AdminDashboard = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <AdminNavbar />
        </div>
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-2">
            <AdminSidebar />
          </div>

          {/* Main Content */}
          <div className="col-9 p-4">
            <Routes>
              <Route path="course-management" element={<CourseManagement />} />
              <Route path="batch-management" element={<BatchManagement />} />
              <Route path="question-bank" element={<QuestionBank />} />
              <Route path="category" element={<Category />} />
              <Route path="topic" element={<CreateTopic />} />
              <Route path="sub-topic" element={<CreateSubTopic />} />
              <Route path="usermanagement" element={<UserManagement />} />
              <Route path="editusermodel" element={<EditUserModel/>} />
              <Route path="viewusermodel" element={<ViewUserModel/>} />
              <Route path="" element={<CourseManagement />} />
              
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

