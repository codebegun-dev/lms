
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
 import StudentNavbar from "./StudentNavbar";
import MockInterview from "./MockInterview";
import Dashboard from "./Dashboard";

const StudentDashboard = () => {
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mock-interview" element={<MockInterview />} />

            <Route path="" element={<Dashboard/>} />
        </Routes>
      </div>
    </div>
    </div>
    </>
  );
};

export default StudentDashboard;

