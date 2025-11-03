import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import PersonalInformation from "./StudentProfilepage/PersonalInformation";
import GenericDetails from "./StudentProfilepage/GenericDetails";
import TenthGrade from "./StudentProfilepage/TenthGrade";
import TwelfthGrade from "./StudentProfilepage/TwelfthGrade";
import UGDetails from "./StudentProfilepage/UGDetails";
import PGDetails from "./StudentProfilepage/PGDetails";
import Projects from "./StudentProfilepage/Projects";
import CourseDetails from "./StudentProfilepage/CourseDetails";
import FeeDetails from "./StudentProfilepage/FeeDetails";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [sectionCompletion, setSectionCompletion] = useState({
    personal: 0,
    generic: 0,
    tenth: 0,
    twelfth: 0,
    ug: 0,
    pg: 0,
    projects: 0,
    course: 0,
  });

  const updateSectionCompletion = (section, percentage) => {
    setSectionCompletion((prev) => ({
      ...prev,
      [section]: percentage,
    }));
  };

  return (
    <>
      {/* ✅ Navbar always visible at top */}
      <StudentNavbar />

      {/* ✅ Profile main container */}
      <div className="container py-4">
        <div className="bg-white p-4 rounded shadow-sm">
          
          {/* ✅ Header with right-aligned Back button */}
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h4 className="mb-0 fw-bold">My Profile</h4>
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>

          {/* ✅ All profile sections */}
          <div className="d-flex flex-column gap-3">
            <PersonalInformation
              onCompletionChange={(p) => updateSectionCompletion("personal", p)}
            />
            <GenericDetails
              onCompletionChange={(p) => updateSectionCompletion("generic", p)}
            />
            <TenthGrade
              onCompletionChange={(p) => updateSectionCompletion("tenth", p)}
            />
            <TwelfthGrade
              onCompletionChange={(p) => updateSectionCompletion("twelfth", p)}
            />
            <UGDetails
              onCompletionChange={(p) => updateSectionCompletion("ug", p)}
            />
            <PGDetails
              onCompletionChange={(p) => updateSectionCompletion("pg", p)}
            />
            <Projects
              onCompletionChange={(p) => updateSectionCompletion("projects", p)}
            />
            <CourseDetails
              onCompletionChange={(p) => updateSectionCompletion("course", p)}
            />
            <FeeDetails />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
