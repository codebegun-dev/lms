import { Link } from "react-router-dom";
import { useState } from "react";

const StudentSidebar = () => {
  return (
    <>
       
    <div className="bg-light vh-100 p-3 shadow-sm border-end">
       <nav className="nav flex-column">
        <Link to="dashboard" className="nav-link text-dark mb-2 rounded px-3 py-2 fw-semibold">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </Link>        
        <Link to="mock-interview" className="nav-link text-dark mb-2 rounded px-3 py-2 fw-semibold">
          <i className="bi bi-mic me-2"></i>
          Mock Interviews
        </Link>   
                   
       </nav>
    </div>
  
    </>
  );
};

export default StudentSidebar;