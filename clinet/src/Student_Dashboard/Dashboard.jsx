
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  return (
    <div className="row g-0">
      {/* Sidebar */}
      <div className="col-3">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <div className="col-9 p-4">
        <Routes>
          <Route path="student-dashboard" element={<StudentDashboard />} />
           <Route path="" element={<StudentDashboard/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

