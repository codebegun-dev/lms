import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "../components/student/sections/PersonalInformation";
import GenericDetails from "../components/student/sections/GenericDetails";
import TenthGrade from "../components/student/sections/TenthGrade";
import TwelfthGrade from "../components/student/sections/TwelfthGrade";
import UGDetails from "../components/student/sections/UGDetails";
import PGDetails from "../components/student/sections/PGDetails";
import CourseDetails from "../components/student/sections/CourseDetails";
import FeeDetails from "../components/student/sections/FeeDetails";


const StudentNavbar = () => {
     const navigate = useNavigate();
     const [showProfileMenu, setShowProfileMenu] = useState(false);
     const [showMyProfile, setShowMyProfile] = useState(false);
     const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
     const [profilePic, setProfilePic] = useState("");

     const [selectedInterviewType, setSelectedInterviewType] = useState("");
     const [scheduledInterviewType, setScheduledInterviewType] = useState("");
     const [scheduledDate, setScheduledDate] = useState("");
     const [selectedTime, setSelectedTime] = useState("");
     const [completedInterviews, setCompletedInterviews] = useState(0);

     const [sectionCompletion, setSectionCompletion] = useState({
          personal: 0,
          generic: 0,
          tenth: 0,
          twelfth: 0,
          ug: 0,
          pg: 0,
          course: 0,
     });

     const interviewDurations = {
          "Technical Interview": 20,
          "Behavioral Interview": 10,
          "Communication Interview": 30,
     };

     const timeSlots = [
          "9:00 AM",
          "9:30 AM",
          "10:00 AM",
          "10:30 AM",
          "11:00 AM",
          "11:30 AM",
          "1:00 PM",
          "1:30 PM",
          "2:00 PM",
          "2:30 PM",
          "3:00 PM",
          "3:30 PM",
     ];

     const calculateOverallCompletion = () => {
          const values = Object.values(sectionCompletion);
          const total = values.reduce((sum, val) => sum + val, 0);
          return Math.round(total / values.length);
     };

     const handleLogout = () => setShowLogoutConfirm(true);

     const confirmLogout = () => {
          localStorage.removeItem("user");
          sessionStorage.removeItem("currentUser");
          navigate("/login");
     };

     const updateSectionCompletion = (section, percentage) => {
          setSectionCompletion((prev) => ({
               ...prev,
               [section]: percentage,
          }));
     };

     const handleProfilePicUpdate = (pic) => setProfilePic(pic);

     const getUserInfo = () => {
          try {
               const user = JSON.parse(localStorage.getItem("user"));
               return user || { firstName: "Student" };
          } catch {
               return { firstName: "Student" };
          }
     };

     const userInfo = getUserInfo();

     const handleStartInterviewClick = () => {
          if (!selectedInterviewType) {
               alert("Please select an interview type!");
               return;
          }
          navigate("/start-interview", {
               state: { interviewType: selectedInterviewType },
          });
     };

     const handleScheduleInterviewSubmit = () => {
          if (!scheduledInterviewType || !scheduledDate || !selectedTime) {
               alert("Please select interview type, date, and time!");
               return;
          }
          alert(`${scheduledInterviewType} scheduled on ${scheduledDate} at ${selectedTime}`);
          setScheduledInterviewType("");
          setScheduledDate("");
          setSelectedTime("");
     };

     const handleMarkProgressClick = () => {
          const nextProgress = completedInterviews + 1;
          if (nextProgress > 20) {
               alert("All interviews completed!");
               return;
          }
          setCompletedInterviews(nextProgress);
     };

     return (
          <div className="bg-light min-vh-100">
               {/* Navbar */}
               <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-4 py-3">
                    <div className="container-fluid d-flex justify-content-between align-items-center">
                         <h3 className="text-primary fw-bold mb-0">CodeBeGun</h3>

                         <div className="position-relative">
                              <div
                                   className="rounded-circle border border-primary border-3 overflow-hidden"
                                   style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                              >
                                   {profilePic ? (
                                        <img
                                             src={profilePic}
                                             alt="Profile"
                                             className="w-100 h-100"
                                             style={{ objectFit: "cover" }}
                                        />
                                   ) : (
                                        <div className="bg-primary d-flex justify-content-center align-items-center h-100 text-white fw-bold fs-4">
                                             {userInfo.firstName?.charAt(0)?.toUpperCase() || "S"}
                                        </div>
                                   )}
                              </div>
                              <span className="position-absolute bottom-0 end-0 translate-middle badge rounded-pill bg-success">
                                   {calculateOverallCompletion()}%
                              </span>

                              {showProfileMenu && (
                                   <div className="dropdown-menu dropdown-menu-end show mt-2 shadow">
                                        <button
                                             className="dropdown-item"
                                             onClick={() => {
                                                  setShowMyProfile(true);
                                                  setShowProfileMenu(false);
                                             }}
                                        >
                                             My Profile
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                             Logout
                                        </button>
                                   </div>
                              )}
                         </div>
                    </div>
               </nav>

               {/* Main Content */}
               <div className="container py-4">
                    {!showMyProfile ? (
                         <>
                              <div className="bg-white rounded shadow-sm p-4 text-center mb-4">
                                   <h2 className="fw-bold">Welcome, {userInfo.firstName}!</h2>
                                   <p className="text-muted">Manage your interviews and track your progress</p>
                              </div>

                         

                              {/* My Profile Button */}
                              <div className="text-center">
                                   <button className="btn btn-primary px-4 py-2" onClick={() => setShowMyProfile(true)}>
                                        View My Profile
                                   </button>
                              </div>
                         </>
                    ) : (
                         <div className="bg-white p-4 rounded shadow-sm">
                              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                   <h4>My Profile</h4>
                                   <button className="btn btn-secondary" onClick={() => setShowMyProfile(false)}>
                                        Back to Dashboard
                                   </button>
                              </div>

                              <div className="d-flex flex-column gap-3">
                                   <PersonalInformation
                                        onCompletionChange={(p) => updateSectionCompletion("personal", p)}
                                        onProfilePicChange={handleProfilePicUpdate}
                                   />
                                   <GenericDetails
                                        onCompletionChange={(p) => updateSectionCompletion("generic", p)}
                                   />
                                   <TenthGrade onCompletionChange={(p) => updateSectionCompletion("tenth", p)} />
                                   <TwelfthGrade onCompletionChange={(p) => updateSectionCompletion("twelfth", p)} />
                                   <UGDetails onCompletionChange={(p) => updateSectionCompletion("ug", p)} />
                                   <PGDetails onCompletionChange={(p) => updateSectionCompletion("pg", p)} />
                                   <CourseDetails onCompletionChange={(p) => updateSectionCompletion("course", p)} />
                                   <FeeDetails />
                              </div>
                         </div>
                    )}
               </div>

               {/* Logout Modal */}
               {showLogoutConfirm && (
                    <div className="modal fade show d-block" tabIndex="-1">
                         <div className="modal-dialog">
                              <div className="modal-content">
                                   <div className="modal-header">
                                        <h5 className="modal-title">Confirm Logout</h5>
                                   </div>
                                   <div className="modal-body">
                                        <p>Are you sure you want to logout?</p>
                                   </div>
                                   <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                                             Cancel
                                        </button>
                                        <button className="btn btn-danger" onClick={confirmLogout}>
                                             Logout
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default StudentNavbar;
