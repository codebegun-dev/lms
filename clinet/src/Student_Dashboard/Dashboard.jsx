
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentDashboard from "./StudentDashboard";
import StudentNavbar from "./StudentNavbar";


const Dashboard = () => {
  return (
    <>
    <div className="container-fluid">
      <div className="row">
        <StudentNavbar/>
      </div>
    <div className="row g-0">
      {/* Sidebar */}
      <div className="col-2">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <div className="col-10 ">
        <Routes>
          <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="" element={<StudentDashboard/>} />
        </Routes>
      </div>
    </div>
    </div>
    </>
  );
};

export default Dashboard;

