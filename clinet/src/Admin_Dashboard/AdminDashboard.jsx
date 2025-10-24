
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import CourseManagement from "./CourseManagement";
import BatchManagement from "./BatchManagement";
import QuestionBank from "./QuestionBank";

const AdminDashboard = () => {
  return (
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
          <Route path="" element={<CourseManagement/>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

