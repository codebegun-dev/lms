import React from "react";
import { FaTimes } from "react-icons/fa";
 
const ViewUserModel = ({ user, onClose }) => {
  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Header */}
          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title fw-semibold">User Profile</h5>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-circle"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            {/* Basic Information */}
            <Section title="Basic Information">
              <InfoGrid
                data={[
                  { label: "First Name", value: user.firstName },
                  { label: "Last Name", value: user.lastName },
                  { label: "Email", value: user.email },
                  { label: "Phone", value: user.phone },
                  {
                    label: "Role",
                    value: (
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "bg-primary"
                            : user.role === "Interviewer"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role || "-"}
                      </span>
                    ),
                  },
                  {
                    label: "Status",
                    value: (
                      <span
                        className={`badge ${
                          user.status === "active" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.status || "-"}
                      </span>
                    ),
                  },
                ]}
              />
            </Section>

            {/* Personal Information */}
            {user.personalInfo && Object.keys(user.personalInfo).length > 0 && (
              <Section title="Personal Information">
                <InfoGrid
                  data={[
                    { label: "Sure Name", value: user.personalInfo.surName },
                    { label: "Gender", value: user.personalInfo.gender },
                    { label: "Date of Birth", value: user.personalInfo.dob },
                    { label: "Blood Group", value: user.personalInfo.bloodGroup },
                    { label: "Parent Mobile", value: user.personalInfo.parentMobile },
                  ]}
                />
              </Section>
            )}

            {/* Generic Details */}
            {user.genericInfo && Object.keys(user.genericInfo).length > 0 && (
              <Section title="Generic Details">
                <InfoGrid
                  data={[
                    { label: "Work Experience", value: user.genericInfo.workExperience },
                    { label: "Career Gap", value: user.genericInfo.careerGap },
                    { label: "Current State", value: user.genericInfo.currentState },
                    { label: "Current District", value: user.genericInfo.currentDistrict },
                    { label: "GitHub", value: user.genericInfo.githubProfile },
                    { label: "LinkedIn", value: user.genericInfo.linkedinProfile },
                  ]}
                />
              </Section>
            )}

            {/* 10th Grade */}
            {user.tenthGrade && Object.keys(user.tenthGrade).length > 0 && (
              <Section title="10th Grade">
                <InfoGrid
                  data={[
                    { label: "Board", value: user.tenthGrade.board },
                    { label: "School Name", value: user.tenthGrade.schoolName },
                    { label: "Year of Passout", value: user.tenthGrade.yearOfPassout },
                    { label: "Marks %", value: `${user.tenthGrade.marksPercentage || "-"}%` },
                  ]}
                />
              </Section>
            )}

            {/* 12th Grade */}
            {user.twelfthGrade && Object.keys(user.twelfthGrade).length > 0 && (
              <Section title="12th Grade">
                <InfoGrid
                  data={[
                    { label: "Board", value: user.twelfthGrade.board },
                    { label: "Group", value: user.twelfthGrade.group },
                    { label: "College Name", value: user.twelfthGrade.collegeName },
                    { label: "Year of Passout", value: user.twelfthGrade.yearOfPassout },
                    { label: "Marks %", value: `${user.twelfthGrade.marksPercentage || "-"}%` },
                  ]}
                />
              </Section>
            )}

            {/* UG Details */}
            {user.ugDetails && Object.keys(user.ugDetails).length > 0 && (
              <Section title="UG Details">
                <InfoGrid
                  data={[
                    { label: "University Roll No", value: user.ugDetails.universityRollNo },
                    { label: "College Name", value: user.ugDetails.collegeName },
                    { label: "Course", value: user.ugDetails.courseName },
                    { label: "Branch", value: user.ugDetails.branch },
                    { label: "CGPA", value: user.ugDetails.cgpa },
                    { label: "Active Backlogs", value: user.ugDetails.activeBacklogs || "0" },
                  ]}
                />
              </Section>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable section component
const Section = ({ title, children }) => (
  <div className="mb-4 pb-3 border-bottom">
    <h6 className="fw-semibold text-primary mb-3">{title}</h6>
    {children}
  </div>
);

// ✅ Reusable grid component
const InfoGrid = ({ data }) => (
  <div className="row g-3">
    {data.map((item, index) => (
      <div className="col-md-4" key={index}>
        <div className="d-flex flex-column">
          <label className="fw-semibold text-secondary small">{item.label}:</label>
          <span className="text-dark">{item.value || "-"}</span>
        </div>
      </div>
    ))}
  </div>
);

export default ViewUserModel;
