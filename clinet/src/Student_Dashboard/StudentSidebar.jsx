 

import { Link } from "react-router-dom";
import { useState } from "react";

const StudentSidebar = () => {
  return (
    <>
       
    <div className="bg-light vh-100 p-3">
       <nav className="nav flex-column">
        <Link to="dashboard" className="nav-link text-dark mb-2 rounded px-2">
         Dashboard
        </Link>        
        <Link to="mock-interview" className="nav-link text-dark mb-2 rounded px-2">
          Mock Interviews
        </Link>   
                   
       </nav>
    </div>
  
    </>
  );
};

export default StudentSidebar;

