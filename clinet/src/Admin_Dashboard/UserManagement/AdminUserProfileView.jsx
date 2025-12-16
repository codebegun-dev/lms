// import React, { useEffect, useState } from "react";
// import { 
//   FaTimes, FaArrowLeft, FaSave, FaEdit, 
//   FaTimesCircle, FaCheckCircle, FaGraduationCap,
//   FaRupeeSign, FaLock
// } from "react-icons/fa";
// import axios from "axios";

// const API_BASE = "http://localhost:8080";

// const AdminUserProfileView = ({ user, onClose }) => {
//   const [activeSection, setActiveSection] = useState(null);
//   const [editMode, setEditMode] = useState({});
//   const [sectionData, setSectionData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [userRole, setUserRole] = useState("");
//   const [courses, setCourses] = useState([]);
//   const [batches, setBatches] = useState([]);

//   // Determine user role
//   useEffect(() => {
//     if (user) {
//       const role = user.role?.name || user.role || "";
//       setUserRole(role.toUpperCase());
//     }
//   }, [user]);

//   // Load all section data
//   useEffect(() => {
//     loadAllSections();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, userRole]);

//   // Fetch courses and batches for course & fee section
//   useEffect(() => {
//     if (userRole === "STUDENT") {
//       fetchCoursesAndBatches();
//     }
//   }, [userRole]);

//   const fetchCoursesAndBatches = async () => {
//     try {
//       // Fetch courses
//       const coursesRes = await axios.get(`${API_BASE}/api/courses/all`);
//       setCourses(coursesRes.data || []);

//       // Fetch batches
//       const batchesRes = await axios.get(`${API_BASE}/api/batches/all`);
//       setBatches(batchesRes.data || []);
//     } catch (err) {
//       console.error("Error fetching courses/batches:", err);
//     }
//   };

//   const loadAllSections = async () => {
//     try {
//       setLoading(true);
//       const loaded = {};
      
//       // Always load basic info
//       loaded.basic = {
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         role: user.role?.name || user.role || "",
//         status: user.status || "active",
//       };

//       // Load role-specific data
//       if (userRole === "STUDENT") {
//         await loadStudentSections(loaded);
//       } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
//         await loadAdminSections(loaded);
//       } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
//         await loadSalesSections(loaded);
//       } else if (userRole === "INTERVIEWER") {
//         await loadInterviewerSections(loaded);
//       }

//       setSectionData(loaded);
//     } catch (err) {
//       console.error("Error loading sections", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStudentSections = async (loaded) => {
//     try {
//       const userId = user.id || user.userId;
      
//       // Personal Information
//       const personalRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`);
//       loaded.personal = personalRes.data || {};
      
//       // Generic Details
//       const genericRes = await axios.get(`${API_BASE}/api/student-generic-details/${userId}`);
//       loaded.generic = genericRes.data || {};
      
//       // 10th Grade
//       const tenthRes = await axios.get(`${API_BASE}/api/tenth-grade/${userId}`);
//       loaded.tenth = tenthRes.data || {};
      
//       // 12th Grade
//       const twelfthRes = await axios.get(`${API_BASE}/api/twelfth-grade/${userId}`);
//       loaded.twelfth = twelfthRes.data || {};
      
//       // UG Details
//       const ugRes = await axios.get(`${API_BASE}/api/student/ug-details/${userId}`);
//       loaded.ug = ugRes.data || {};
      
//       // PG Details
//       const pgRes = await axios.get(`${API_BASE}/api/student/pg-details/${userId}`);
//       loaded.pg = pgRes.data || {};
      
//       // Projects
//       const projectsRes = await axios.get(`${API_BASE}/api/student/projects/${userId}`);
//       loaded.projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      
//       // Course & Fee Details (combined)
//       let courseData = {};
//       let feeData = {};
      
//       try {
//         const courseRes = await axios.get(`${API_BASE}/api/student/course-details/${userId}`);
//         courseData = courseRes.data || {};
        
//         const feeRes = await axios.get(`${API_BASE}/api/student/fee-details/${userId}`);
//         feeData = feeRes.data || {};
//       } catch (err) {
//         console.log("No course/fee details found");
//       }

//       loaded.courseFee = {
//         courseId: courseData.courseId || "",
//         courseName: courseData.courseName || "Full Stack Java",
//         batchId: courseData.batchId || "",
//         batchName: courseData.batchName || "Batch A-2025",
//         startDate: courseData.startDate || "2025-02-15",
//         totalFee: feeData.totalFee || 50000,
//         paidFee: feeData.paidFee || 25000,
//         balanceFee: feeData.balanceFee || 25000
//       };
      
//     } catch (err) {
//       console.error("Error loading student sections:", err);
//     }
//   };

//   const loadAdminSections = async (loaded) => {
//     try {
//       const userId = user.id || user.userId;
//       const adminRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`);
//       loaded.adminPersonal = {
//         ...adminRes.data,
//         jobTitle: adminRes.data.jobTitle || "",
//       };
//     } catch (err) {
//       console.error("Error loading admin sections:", err);
//       loaded.adminPersonal = {};
//     }
//   };

//   const loadSalesSections = async (loaded) => {
//     try {
//       const userId = user.id || user.userId;
//       const salesRes = await axios.get(`${API_BASE}/api/sales/personal-info/${userId}`);
//       loaded.salesPersonal = {
//         ...salesRes.data,
//         jobTitle: salesRes.data.jobTitle || "",
//       };
//     } catch (err) {
//       console.error("Error loading sales sections:", err);
//       loaded.salesPersonal = {};
//     }
//   };

//   const loadInterviewerSections = async (loaded) => {
//     try {
//       const userId = user.id || user.userId;
//       // You might have a different endpoint for interviewers
//       const interviewerRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`);
//       loaded.interviewerPersonal = {
//         ...interviewerRes.data,
//         jobTitle: interviewerRes.data.jobTitle || "Interviewer",
//       };
//     } catch (err) {
//       console.error("Error loading interviewer sections:", err);
//       loaded.interviewerPersonal = {};
//     }
//   };

//   // Define sections based on user role
//   const getSections = () => {
//     const baseSections = [
//       { key: "basic", title: "Basic Information", icon: "👤" },
//     ];

//     if (userRole === "STUDENT") {
//       return [
//         ...baseSections,
//         { key: "personal", title: "Personal Information", icon: "👤" },
//         { key: "generic", title: "Generic Details", icon: "📋" },
//         { key: "tenth", title: "10th Grade", icon: "🎓" },
//         { key: "twelfth", title: "12th Grade", icon: "📚" },
//         { key: "ug", title: "UG Details", icon: "🎯" },
//         { key: "pg", title: "PG Details", icon: "🏆" },
//         { key: "courseFee", title: "Course & Fee Details", icon: "📖" },
//         { key: "projects", title: "Projects", icon: "💼" },
//       ];
//     } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
//       return [
//         ...baseSections,
//         { key: "adminPersonal", title: "Admin Personal Info", icon: "👔" },
//       ];
//     } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
//       return [
//         ...baseSections,
//         { key: "salesPersonal", title: "Sales Personal Info", icon: "💰" },
//       ];
//     } else if (userRole === "INTERVIEWER") {
//       return [
//         ...baseSections,
//         { key: "interviewerPersonal", title: "Interviewer Personal Info", icon: "🎤" },
//       ];
//     }
    
//     return baseSections;
//   };

//   const toggleEdit = (key) => {
//     // Don't allow edit for non-admin on courseFee
//     const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
//     const currentAdminRole = currentAdmin?.role?.name || currentAdmin?.role || "";
    
//     if (key === "courseFee" && !["ADMIN", "MASTER_ADMIN"].includes(currentAdminRole.toUpperCase())) {
//       alert("Only ADMIN/MASTER_ADMIN can edit Course & Fee details.");
//       return;
//     }
    
//     setEditMode((p) => ({ ...p, [key]: !p[key] }));
//   };

//   const handleSave = async (key, data) => {
//     try {
//       const userId = user.id || user.userId;
//       let endpoint = "";
//       let payload = { ...data, userId };

//       switch (key) {
//         case "personal":
//           endpoint = `${API_BASE}/api/student/personal-info/update`;
//           break;
//         case "generic":
//           endpoint = `${API_BASE}/api/student-generic-details/update`;
//           break;
//         case "tenth":
//           endpoint = `${API_BASE}/api/tenth-grade`;
//           break;
//         case "twelfth":
//           endpoint = `${API_BASE}/api/twelfth-grade`;
//           break;
//         case "ug":
//           endpoint = `${API_BASE}/api/student/ug-details/update`;
//           break;
//         case "pg":
//           endpoint = `${API_BASE}/api/student/pg-details/update`;
//           break;
//         case "courseFee":
//           // Split into course and fee updates
//           const coursePayload = {
//             userId,
//             courseId: data.courseId,
//             courseName: data.courseName,
//             batchId: data.batchId,
//             batchName: data.batchName,
//             startDate: data.startDate
//           };
          
//           const feePayload = {
//             userId,
//             totalFee: data.totalFee,
//             paidFee: data.paidFee,
//             balanceFee: data.balanceFee
//           };
          
//           // Update course details
//           await axios.put(`${API_BASE}/api/student/course-details/update`, coursePayload);
          
//           // Update fee details
//           await axios.put(`${API_BASE}/api/student/fee-details/update`, feePayload);
          
//           setSectionData((p) => ({ ...p, [key]: data }));
//           setEditMode((p) => ({ ...p, [key]: false }));
//           alert("Course & Fee details updated successfully!");
//           return;
//         case "adminPersonal":
//           endpoint = `${API_BASE}/api/student/personal-info/update`;
//           break;
//         case "salesPersonal":
//           endpoint = `${API_BASE}/api/sales/personal-info/update`;
//           break;
//         case "interviewerPersonal":
//           endpoint = `${API_BASE}/api/student/personal-info/update`;
//           break;
//         default:
//           console.warn(`No endpoint defined for section: ${key}`);
//           return;
//       }

//       await axios.put(endpoint, payload);
//       setSectionData((p) => ({ ...p, [key]: data }));
//       setEditMode((p) => ({ ...p, [key]: false }));
//       alert("Changes saved successfully!");
//     } catch (err) {
//       console.error("Save failed", err);
//       alert("Failed to save: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const CourseFeeSection = ({ isEditing, formState, setFormState, errors, setErrors }) => {
//     // Filter batches by selected course
//     const getBatchesForCourse = () => {
//       if (!formState.courseId && !formState.courseName) return batches;
      
//       return batches.filter(batch => {
//         if (formState.courseId) {
//           return batch.courseId === formState.courseId;
//         }
//         return batch.courseName === formState.courseName;
//       });
//     };

//     const handleInputChange = (field, value) => {
//       setFormState(prev => {
//         const updated = { ...prev, [field]: value };
        
//         if (field === "courseId" || field === "courseName") {
//           updated.batchId = "";
//           updated.batchName = "";
          
//           if (field === "courseId" && value) {
//             const selectedCourse = courses.find(c => c.courseId === value);
//             if (selectedCourse) {
//               updated.courseName = selectedCourse.courseName;
//             }
//           }
//         }
        
//         if (field === "batchId" && value) {
//           const selectedBatch = batches.find(b => b.id === value);
//           if (selectedBatch) {
//             updated.batchName = selectedBatch.name;
//           }
//         }
        
//         if (field === "totalFee" || field === "paidFee") {
//           const total = field === "totalFee" ? (parseInt(value) || 0) : prev.totalFee;
//           const paid = field === "paidFee" ? (parseInt(value) || 0) : prev.paidFee;
//           updated.balanceFee = Math.max(0, total - paid);
//         }
        
//         return updated;
//       });
      
//       setErrors((p) => ({ ...p, [field]: "" }));
//     };

//     const progressPercentage = formState.totalFee > 0 
//       ? ((formState.paidFee / formState.totalFee) * 100).toFixed(0)
//       : "0";

//     return (
//       <div className="row">
//         {/* Course Details Section */}
//         <div className="col-md-6 border-end pe-md-4">
//           <h6 className="fw-bold mb-3 text-primary">
//             <FaGraduationCap className="me-2" />
//             Course Details
//           </h6>
          
//           <div className="row g-3">
//             {/* Course Selection */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Course *
//               </label>
//               {isEditing ? (
//                 <select
//                   className={`form-select ${errors.courseName ? "is-invalid" : ""}`}
//                   value={formState.courseId || formState.courseName}
//                   onChange={(e) => {
//                     if (e.target.value.startsWith("id:")) {
//                       handleInputChange("courseId", e.target.value.replace("id:", ""));
//                     } else {
//                       handleInputChange("courseName", e.target.value);
//                     }
//                   }}
//                 >
//                   <option value="">Select Course</option>
//                   {courses.map(course => (
//                     <option 
//                       key={course.courseId || course.id} 
//                       value={course.courseId ? `id:${course.courseId}` : course.courseName}
//                     >
//                       {course.courseName}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <div className="p-2 bg-light rounded border">
//                   {formState.courseName || <span className="text-muted">Not assigned</span>}
//                 </div>
//               )}
//             </div>

//             {/* Batch Selection */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Batch *
//               </label>
//               {isEditing ? (
//                 <select
//                   className={`form-select ${errors.batchName ? "is-invalid" : ""}`}
//                   value={formState.batchId}
//                   onChange={(e) => handleInputChange("batchId", e.target.value)}
//                   disabled={!formState.courseId && !formState.courseName}
//                 >
//                   <option value="">Select Batch</option>
//                   {getBatchesForCourse().map(batch => (
//                     <option key={batch.id} value={batch.id}>
//                       {batch.name} ({batch.startDate})
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <div className="p-2 bg-light rounded border">
//                   {formState.batchName || <span className="text-muted">Not assigned</span>}
//                 </div>
//               )}
//             </div>

//             {/* Start Date */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Course Start Date
//               </label>
//               {isEditing ? (
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={formState.startDate}
//                   onChange={(e) => handleInputChange("startDate", e.target.value)}
//                 />
//               ) : (
//                 <div className="p-2 bg-light rounded border">
//                   {formState.startDate ? new Date(formState.startDate).toLocaleDateString() : "Not set"}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Fee Details Section */}
//         <div className="col-md-6 ps-md-4">
//           <h6 className="fw-bold mb-3 text-primary">
//             <FaRupeeSign className="me-2" />
//             Fee Details
//           </h6>
          
//           <div className="row g-3">
//             {/* Total Fee */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Total Fee
//               </label>
//               {isEditing ? (
//                 <div className="input-group">
//                   <span className="input-group-text">₹</span>
//                   <input
//                     type="number"
//                     className={`form-control ${errors.totalFee ? "is-invalid" : ""}`}
//                     value={formState.totalFee}
//                     onChange={(e) => handleInputChange("totalFee", e.target.value)}
//                     min="0"
//                     step="1000"
//                   />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-light rounded border fw-bold text-primary">
//                   ₹ {formState.totalFee.toLocaleString("en-IN")}
//                 </div>
//               )}
//             </div>

//             {/* Paid Fee */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Paid Amount
//               </label>
//               {isEditing ? (
//                 <div className="input-group">
//                   <span className="input-group-text">₹</span>
//                   <input
//                     type="number"
//                     className={`form-control ${errors.paidFee ? "is-invalid" : ""}`}
//                     value={formState.paidFee}
//                     onChange={(e) => handleInputChange("paidFee", e.target.value)}
//                     min="0"
//                     max={formState.totalFee}
//                     step="1000"
//                   />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-light rounded border fw-bold text-success">
//                   ₹ {formState.paidFee.toLocaleString("en-IN")}
//                 </div>
//               )}
//             </div>

//             {/* Balance Fee */}
//             <div className="col-12">
//               <label className="form-label fw-semibold text-secondary">
//                 Balance Amount
//               </label>
//               <div className="p-2 bg-light rounded border fw-bold text-danger">
//                 ₹ {formState.balanceFee.toLocaleString("en-IN")}
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="col-12 mt-4">
//               <div className="d-flex justify-content-between mb-2 fw-semibold text-secondary">
//                 <span>Payment Progress</span>
//                 <span>{progressPercentage}%</span>
//               </div>
//               <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
//                 <div
//                   className="progress-bar progress-bar-striped bg-success"
//                   role="progressbar"
//                   style={{ width: `${progressPercentage}%` }}
//                   aria-valuenow={progressPercentage}
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const Section = ({ title, keyName, icon }) => {
//     const isEditing = !!editMode[keyName];
//     const [formState, setFormState] = useState(sectionData[keyName] || {});

//     useEffect(() => {
//       setFormState(sectionData[keyName] || {});
//     }, [sectionData, keyName]);

//     const handleChange = (field, value) => {
//       setFormState((p) => ({ ...p, [field]: value }));
//       setErrors((p) => ({ ...p, [field]: "" }));
//     };

//     const handleFieldChange = (e) => {
//       const { name, value } = e.target;
//       handleChange(name, value);
//     };

//     const handleSaveSection = () => {
//       const newErrors = {};
      
//       if (keyName === "personal" || keyName === "adminPersonal" || keyName === "salesPersonal" || keyName === "interviewerPersonal") {
//         if (!formState.firstName?.trim()) newErrors.firstName = "First name is required";
//         if (!formState.lastName?.trim()) newErrors.lastName = "Last name is required";
//         if (!formState.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
//       }
      
//       if (keyName === "courseFee") {
//         if (!formState.courseName?.trim()) newErrors.courseName = "Course is required";
//         if (!formState.batchName?.trim()) newErrors.batchName = "Batch is required";
//         if (formState.paidFee > formState.totalFee) newErrors.paidFee = "Paid fee cannot exceed total fee";
//       }
      
//       if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return;
//       }
      
//       handleSave(keyName, formState);
//     };

//     const renderFields = () => {
//       if (!formState || Object.keys(formState).length === 0) {
//         return (
//           <div className="text-center py-5">
//             <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
//             <p className="text-muted mb-0 mt-2">No data available</p>
//           </div>
//         );
//       }

//       // Special rendering for projects (array)
//       if (keyName === "projects" && Array.isArray(formState)) {
//         return (
//           <div className="row g-3">
//             {formState.map((project, index) => (
//               <div className="col-12 mb-3 border p-3 rounded" key={index}>
//                 <h6>Project {index + 1}</h6>
//                 {Object.entries(project).map(([k, v]) => (
//                   <div className="mb-2" key={k}>
//                     <label className="form-label fw-semibold text-secondary small text-capitalize">
//                       {k.replace(/([A-Z])/g, " $1").trim()}
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={v || ""}
//                         onChange={(e) => {
//                           const newProjects = [...formState];
//                           newProjects[index][k] = e.target.value;
//                           setFormState(newProjects);
//                         }}
//                       />
//                     ) : (
//                       <div className="p-2 bg-light rounded border">
//                         {v || <span className="text-muted">-</span>}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         );
//       }

//       // Special rendering for course & fee details
//       if (keyName === "courseFee") {
//         return (
//           <CourseFeeSection
//             isEditing={isEditing}
//             formState={formState}
//             setFormState={setFormState}
//             errors={errors}
//             setErrors={setErrors}
//           />
//         );
//       }

//       // Default rendering for object data
//       return (
//         <div className="row g-3">
//           {Object.entries(formState).map(([k, v]) => {
//             if (k === "userId" || k === "id") return null;
            
//             if (k.toLowerCase().includes("date")) {
//               v = v ? new Date(v).toISOString().split('T')[0] : v;
//             }
            
//             return (
//               <div className="col-md-6" key={k}>
//                 <label className="form-label fw-semibold text-secondary small text-capitalize">
//                   {k.replace(/([A-Z])/g, " $1").trim()}
//                   {(k === "firstName" || k === "lastName" || k === "mobileNumber") && " *"}
//                 </label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type={k.toLowerCase().includes("email") ? "email" : 
//                             k.toLowerCase().includes("date") ? "date" : "text"}
//                       name={k}
//                       className={`form-control ${errors[k] ? "is-invalid" : ""}`}
//                       value={v || ""}
//                       onChange={handleFieldChange}
//                     />
//                     {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
//                   </>
//                 ) : (
//                   <div className="p-2 bg-light rounded border" style={{ minHeight: "38px" }}>
//                     {v || <span className="text-muted">-</span>}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       );
//     };

//     // Check if current admin can edit this section
//     const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
//     const currentAdminRole = currentAdmin?.role?.name || currentAdmin?.role || "";
//     const canEditCourseFee = ["ADMIN", "MASTER_ADMIN"].includes(currentAdminRole.toUpperCase());
//     const showEditButton = keyName === "courseFee" ? canEditCourseFee : true;

//     return (
//       <div className="border rounded-3 mb-3 shadow-sm overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
//         <div
//           className="p-3 d-flex justify-content-between align-items-center"
//           style={{
//             cursor: "pointer",
//             background: activeSection === keyName ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f8f9fa",
//           }}
//           onClick={() => setActiveSection(activeSection === keyName ? null : keyName)}
//         >
//           <h6 className={`mb-0 fw-semibold d-flex align-items-center ${activeSection === keyName ? "text-white" : "text-dark"}`}>
//             <span className="me-2" style={{ fontSize: "1.2rem" }}>{icon}</span>
//             {title}
//             {keyName === "courseFee" && !canEditCourseFee && (
//               <span className="ms-2 badge bg-secondary">
//                 <FaLock size={8} className="me-1" />
//                 Admin Only
//               </span>
//             )}
//           </h6>

//           <div className="d-flex gap-2 align-items-center">
//             {activeSection === keyName && showEditButton && (
//               <button 
//                 className={`btn btn-sm ${isEditing ? "btn-light" : "btn-outline-light"}`} 
//                 onClick={(e) => { 
//                   e.stopPropagation(); 
//                   toggleEdit(keyName); 
//                 }}
//               >
//                 {isEditing ? <><FaTimes className="me-1" /> Cancel</> : <><FaEdit className="me-1" /> Edit</>}
//               </button>
//             )}
//             <span className={`fw-bold ${activeSection === keyName ? "text-white" : "text-primary"}`}>
//               {activeSection === keyName ? "▲" : "▼"}
//             </span>
//           </div>
//         </div>

//         {activeSection === keyName && (
//           <div className="p-4 bg-white">
//             {renderFields()}

//             {isEditing && showEditButton && (
//               <div className="mt-4 d-flex justify-content-end gap-2">
//                 <button className="btn btn-secondary" onClick={() => toggleEdit(keyName)}>
//                   <FaTimes className="me-1" /> Cancel
//                 </button>
//                 <button className="btn btn-success" onClick={handleSaveSection}>
//                   <FaSave className="me-1" /> Save Changes
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const sections = getSections();

//   return (
//     <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
//       <div className="container py-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
//         <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//             <div className="text-white">
//               <h4 className="mb-2 fw-bold d-flex align-items-center">
//                 👤 {user.firstName} {user.lastName}'s Complete Profile
//               </h4>
//               <div className="d-flex gap-2 flex-wrap">
//                 <span className="badge bg-white text-dark px-3 py-2">{userRole}</span>
//                 <span className="badge bg-white text-dark px-3 py-2">{user.email}</span>
//                 <span className="badge bg-white text-dark px-3 py-2">ID: {user.id || user.userId}</span>
//               </div>
//             </div>

//             <button className="btn btn-light rounded-circle shadow" onClick={onClose}>
//               <FaTimes />
//             </button>
//           </div>

//           <div className="p-3" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
//             <div className="alert alert-success mb-0 d-flex align-items-center border-0 shadow-sm">
//               <FaCheckCircle className="me-2 fs-5" />
//               <span className="fw-semibold">
//                 Admin Full Access - You can view {userRole === "STUDENT" ? "all" : "personal"} details
//                 {userRole === "STUDENT" ? " (Course & Fee editable by ADMIN/MASTER_ADMIN only)" : ""}
//               </span>
//             </div>
//           </div>

//           <div className="p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
//                 <p className="mt-3 text-muted fw-semibold">Loading user information...</p>
//               </div>
//             ) : (
//               sections.map((s) => (
//                 <Section key={s.key} title={s.title} keyName={s.key} icon={s.icon} />
//               ))
//             )}
//           </div>

//           <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ background: "#f8f9fa" }}>
//             <div className="text-muted small">
//               {userRole === "STUDENT" 
//                 ? "All data is fetched from the database. Course & Fee section editable by ADMIN/MASTER_ADMIN only."
//                 : "All data is fetched from the database."}
//             </div>
//             <button className="btn btn-primary" onClick={onClose}>
//               <FaArrowLeft className="me-2" /> Back
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUserProfileView;





// src/Admin_Dashboard/UserManagement/AdminUserProfileView.jsx
import React, { useEffect, useState } from "react";
import { 
  FaTimes, FaArrowLeft, FaSave, FaEdit, 
  FaTimesCircle, FaCheckCircle, FaGraduationCap,
  FaRupeeSign, FaLock
} from "react-icons/fa";
import axios from "axios";

const API_BASE = "http://localhost:8080";

const AdminUserProfileView = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState("");
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const token = localStorage.getItem("token");

  // Determine user role
  useEffect(() => {
    if (user) {
      const role = user.role?.name || user.role || "";
      setUserRole(role.toUpperCase());
    }
  }, [user]);

  // Load all section data
  useEffect(() => {
    loadAllSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRole]);

  // Fetch courses and batches for course & fee section
  useEffect(() => {
    if (userRole === "STUDENT") {
      fetchCoursesAndBatches();
    }
  }, [userRole]);

  const fetchCoursesAndBatches = async () => {
    try {
      // Fetch courses
      const coursesRes = await axios.get(`${API_BASE}/api/courses/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(coursesRes.data || []);

      // Fetch batches
      const batchesRes = await axios.get(`${API_BASE}/api/batches/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatches(batchesRes.data || []);
    } catch (err) {
      console.error("Error fetching courses/batches:", err);
    }
  };

  const loadAllSections = async () => {
    try {
      setLoading(true);
      const loaded = {};
      
      // Always load basic info
      loaded.basic = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role?.name || user.role || "",
        status: user.status || "active",
      };

      // Load role-specific data
      if (userRole === "STUDENT") {
        await loadStudentSections(loaded);
      } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
        await loadAdminSections(loaded);
      } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
        await loadSalesSections(loaded);
      } else if (userRole === "INTERVIEWER") {
        await loadInterviewerSections(loaded);
      }

      setSectionData(loaded);
    } catch (err) {
      console.error("Error loading sections", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      
      // Personal Information
      const personalRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.personal = personalRes.data || {};
      
      // Generic Details
      const genericRes = await axios.get(`${API_BASE}/api/student-generic-details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.generic = genericRes.data || {};
      
      // 10th Grade
      const tenthRes = await axios.get(`${API_BASE}/api/tenth-grade/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.tenth = tenthRes.data || {};
      
      // 12th Grade
      const twelfthRes = await axios.get(`${API_BASE}/api/twelfth-grade/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.twelfth = twelfthRes.data || {};
      
      // UG Details
      const ugRes = await axios.get(`${API_BASE}/api/student/ug-details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.ug = ugRes.data || {};
      
      // PG Details
      const pgRes = await axios.get(`${API_BASE}/api/student/pg-details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.pg = pgRes.data || {};
      
      // Projects
      const projectsRes = await axios.get(`${API_BASE}/api/student/projects/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      
      // Course & Fee Details (combined)
      let courseData = {};
      let feeData = {};
      
      try {
        const courseRes = await axios.get(`${API_BASE}/api/student/course-details/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        courseData = courseRes.data || {};
        
        const feeRes = await axios.get(`${API_BASE}/api/student/fee-details/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        feeData = feeRes.data || {};
      } catch (err) {
        console.log("No course/fee details found");
      }

      loaded.courseFee = {
        courseId: courseData.courseId || "",
        courseName: courseData.courseName || "Full Stack Java",
        batchId: courseData.batchId || "",
        batchName: courseData.batchName || "Batch A-2025",
        startDate: courseData.startDate || "2025-02-15",
        totalFee: feeData.totalFee || 50000,
        paidFee: feeData.paidFee || 25000,
        balanceFee: feeData.balanceFee || 25000
      };
      
    } catch (err) {
      console.error("Error loading student sections:", err);
    }
  };

  const loadAdminSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      const adminRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.adminPersonal = {
        ...adminRes.data,
        jobTitle: adminRes.data.jobTitle || "",
      };
    } catch (err) {
      console.error("Error loading admin sections:", err);
      loaded.adminPersonal = {};
    }
  };

  const loadSalesSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      const salesRes = await axios.get(`${API_BASE}/api/sales/personal-info/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.salesPersonal = {
        ...salesRes.data,
        jobTitle: salesRes.data.jobTitle || "",
      };
    } catch (err) {
      console.error("Error loading sales sections:", err);
      loaded.salesPersonal = {};
    }
  };

  const loadInterviewerSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      const interviewerRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loaded.interviewerPersonal = {
        ...interviewerRes.data,
        jobTitle: interviewerRes.data.jobTitle || "Interviewer",
      };
    } catch (err) {
      console.error("Error loading interviewer sections:", err);
      loaded.interviewerPersonal = {};
    }
  };

  // Define sections based on user role
  const getSections = () => {
    const baseSections = [
      { key: "basic", title: "Basic Information", icon: "👤" },
    ];

    if (userRole === "STUDENT") {
      return [
        ...baseSections,
        { key: "personal", title: "Personal Information", icon: "👤" },
        { key: "generic", title: "Generic Details", icon: "📋" },
        { key: "tenth", title: "10th Grade", icon: "🎓" },
        { key: "twelfth", title: "12th Grade", icon: "📚" },
        { key: "ug", title: "UG Details", icon: "🎯" },
        { key: "pg", title: "PG Details", icon: "🏆" },
        { key: "courseFee", title: "Course & Fee Details", icon: "📖" },
        { key: "projects", title: "Projects", icon: "💼" },
      ];
    } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
      return [
        ...baseSections,
        { key: "adminPersonal", title: "Admin Personal Info", icon: "👔" },
      ];
    } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
      return [
        ...baseSections,
        { key: "salesPersonal", title: "Sales Personal Info", icon: "💰" },
      ];
    } else if (userRole === "INTERVIEWER") {
      return [
        ...baseSections,
        { key: "interviewerPersonal", title: "Interviewer Personal Info", icon: "🎤" },
      ];
    }
    
    return baseSections;
  };

  const toggleEdit = (key) => {
    // Don't allow edit for non-admin on courseFee
    const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
    const currentAdminRole = currentAdmin?.role?.name || currentAdmin?.role || "";
    
    if (key === "courseFee" && !["ADMIN", "MASTER_ADMIN"].includes(currentAdminRole.toUpperCase())) {
      alert("Only ADMIN/MASTER_ADMIN can edit Course & Fee details.");
      return;
    }
    
    setEditMode((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async (key, data) => {
    try {
      const userId = user.id || user.userId;
      let endpoint = "";
      let payload = { ...data, userId };

      switch (key) {
        case "personal":
          endpoint = `${API_BASE}/api/student/personal-info/update`;
          break;
        case "generic":
          endpoint = `${API_BASE}/api/student-generic-details/update`;
          break;
        case "tenth":
          endpoint = `${API_BASE}/api/tenth-grade`;
          break;
        case "twelfth":
          endpoint = `${API_BASE}/api/twelfth-grade`;
          break;
        case "ug":
          endpoint = `${API_BASE}/api/student/ug-details/update`;
          break;
        case "pg":
          endpoint = `${API_BASE}/api/student/pg-details/update`;
          break;
        case "courseFee":
          // Split into course and fee updates
          const coursePayload = {
            userId,
            courseId: data.courseId,
            courseName: data.courseName,
            batchId: data.batchId,
            batchName: data.batchName,
            startDate: data.startDate
          };
          
          const feePayload = {
            userId,
            totalFee: data.totalFee,
            paidFee: data.paidFee,
            balanceFee: data.balanceFee
          };
          
          // Update course details
          await axios.put(`${API_BASE}/api/student/course-details/update`, coursePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Update fee details
          await axios.put(`${API_BASE}/api/student/fee-details/update`, feePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setSectionData((p) => ({ ...p, [key]: data }));
          setEditMode((p) => ({ ...p, [key]: false }));
          alert("Course & Fee details updated successfully!");
          return;
        case "adminPersonal":
          endpoint = `${API_BASE}/api/student/personal-info/update`;
          break;
        case "salesPersonal":
          endpoint = `${API_BASE}/api/sales/personal-info/update`;
          break;
        case "interviewerPersonal":
          endpoint = `${API_BASE}/api/student/personal-info/update`;
          break;
        default:
          console.warn(`No endpoint defined for section: ${key}`);
          return;
      }

      await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSectionData((p) => ({ ...p, [key]: data }));
      setEditMode((p) => ({ ...p, [key]: false }));
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    }
  };

  const CourseFeeSection = ({ isEditing, formState, setFormState, errors, setErrors }) => {
    // Filter batches by selected course
    const getBatchesForCourse = () => {
      if (!formState.courseId && !formState.courseName) return batches;
      
      return batches.filter(batch => {
        if (formState.courseId) {
          return batch.courseId === formState.courseId;
        }
        return batch.courseName === formState.courseName;
      });
    };

    const handleInputChange = (field, value) => {
      setFormState(prev => {
        const updated = { ...prev, [field]: value };
        
        if (field === "courseId" || field === "courseName") {
          updated.batchId = "";
          updated.batchName = "";
          
          if (field === "courseId" && value) {
            const selectedCourse = courses.find(c => c.courseId === value);
            if (selectedCourse) {
              updated.courseName = selectedCourse.courseName;
            }
          }
        }
        
        if (field === "batchId" && value) {
          const selectedBatch = batches.find(b => b.id === value);
          if (selectedBatch) {
            updated.batchName = selectedBatch.name;
          }
        }
        
        if (field === "totalFee" || field === "paidFee") {
          const total = field === "totalFee" ? (parseInt(value) || 0) : prev.totalFee;
          const paid = field === "paidFee" ? (parseInt(value) || 0) : prev.paidFee;
          updated.balanceFee = Math.max(0, total - paid);
        }
        
        return updated;
      });
      
      setErrors((p) => ({ ...p, [field]: "" }));
    };

    const progressPercentage = formState.totalFee > 0 
      ? ((formState.paidFee / formState.totalFee) * 100).toFixed(0)
      : "0";

    return (
      <div className="row">
        {/* Course Details Section */}
        <div className="col-md-6 border-end pe-md-4">
          <h6 className="fw-bold mb-3 text-primary">
            <FaGraduationCap className="me-2" />
            Course Details
          </h6>
          
          <div className="row g-3">
            {/* Course Selection */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Course *
              </label>
              {isEditing ? (
                <select
                  className={`form-select ${errors.courseName ? "is-invalid" : ""}`}
                  value={formState.courseId || formState.courseName}
                  onChange={(e) => {
                    if (e.target.value.startsWith("id:")) {
                      handleInputChange("courseId", e.target.value.replace("id:", ""));
                    } else {
                      handleInputChange("courseName", e.target.value);
                    }
                  }}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option 
                      key={course.courseId || course.id} 
                      value={course.courseId ? `id:${course.courseId}` : course.courseName}
                    >
                      {course.courseName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 bg-light rounded border">
                  {formState.courseName || <span className="text-muted">Not assigned</span>}
                </div>
              )}
            </div>

            {/* Batch Selection */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Batch *
              </label>
              {isEditing ? (
                <select
                  className={`form-select ${errors.batchName ? "is-invalid" : ""}`}
                  value={formState.batchId}
                  onChange={(e) => handleInputChange("batchId", e.target.value)}
                  disabled={!formState.courseId && !formState.courseName}
                >
                  <option value="">Select Batch</option>
                  {getBatchesForCourse().map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} ({batch.startDate})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 bg-light rounded border">
                  {formState.batchName || <span className="text-muted">Not assigned</span>}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Course Start Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  className="form-control"
                  value={formState.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-light rounded border">
                  {formState.startDate ? new Date(formState.startDate).toLocaleDateString() : "Not set"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fee Details Section */}
        <div className="col-md-6 ps-md-4">
          <h6 className="fw-bold mb-3 text-primary">
            <FaRupeeSign className="me-2" />
            Fee Details
          </h6>
          
          <div className="row g-3">
            {/* Total Fee */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Total Fee
              </label>
              {isEditing ? (
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className={`form-control ${errors.totalFee ? "is-invalid" : ""}`}
                    value={formState.totalFee}
                    onChange={(e) => handleInputChange("totalFee", e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>
              ) : (
                <div className="p-2 bg-light rounded border fw-bold text-primary">
                  ₹ {formState.totalFee.toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {/* Paid Fee */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Paid Amount
              </label>
              {isEditing ? (
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className={`form-control ${errors.paidFee ? "is-invalid" : ""}`}
                    value={formState.paidFee}
                    onChange={(e) => handleInputChange("paidFee", e.target.value)}
                    min="0"
                    max={formState.totalFee}
                    step="1000"
                  />
                </div>
              ) : (
                <div className="p-2 bg-light rounded border fw-bold text-success">
                  ₹ {formState.paidFee.toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {/* Balance Fee */}
            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">
                Balance Amount
              </label>
              <div className="p-2 bg-light rounded border fw-bold text-danger">
                ₹ {formState.balanceFee.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="col-12 mt-4">
              <div className="d-flex justify-content-between mb-2 fw-semibold text-secondary">
                <span>Payment Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
                <div
                  className="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, keyName, icon }) => {
    const isEditing = !!editMode[keyName];
    const [formState, setFormState] = useState(sectionData[keyName] || {});

    useEffect(() => {
      setFormState(sectionData[keyName] || {});
    }, [sectionData, keyName]);

    const handleChange = (field, value) => {
      setFormState((p) => ({ ...p, [field]: value }));
      setErrors((p) => ({ ...p, [field]: "" }));
    };

    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      handleChange(name, value);
    };

    const handleSaveSection = () => {
      const newErrors = {};
      
      if (keyName === "personal" || keyName === "adminPersonal" || keyName === "salesPersonal" || keyName === "interviewerPersonal") {
        if (!formState.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!formState.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!formState.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      }
      
      if (keyName === "courseFee") {
        if (!formState.courseName?.trim()) newErrors.courseName = "Course is required";
        if (!formState.batchName?.trim()) newErrors.batchName = "Batch is required";
        if (formState.paidFee > formState.totalFee) newErrors.paidFee = "Paid fee cannot exceed total fee";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      handleSave(keyName, formState);
    };

    const renderFields = () => {
      if (!formState || Object.keys(formState).length === 0) {
        return (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
            <p className="text-muted mb-0 mt-2">No data available</p>
          </div>
        );
      }

      // Special rendering for projects (array)
      if (keyName === "projects" && Array.isArray(formState)) {
        return (
          <div className="row g-3">
            {formState.map((project, index) => (
              <div className="col-12 mb-3 border p-3 rounded" key={index}>
                <h6>Project {index + 1}</h6>
                {Object.entries(project).map(([k, v]) => (
                  <div className="mb-2" key={k}>
                    <label className="form-label fw-semibold text-secondary small text-capitalize">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={v || ""}
                        onChange={(e) => {
                          const newProjects = [...formState];
                          newProjects[index][k] = e.target.value;
                          setFormState(newProjects);
                        }}
                      />
                    ) : (
                      <div className="p-2 bg-light rounded border">
                        {v || <span className="text-muted">-</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }

      // Special rendering for course & fee details
      if (keyName === "courseFee") {
        return (
          <CourseFeeSection
            isEditing={isEditing}
            formState={formState}
            setFormState={setFormState}
            errors={errors}
            setErrors={setErrors}
          />
        );
      }

      // Default rendering for object data
      return (
        <div className="row g-3">
          {Object.entries(formState).map(([k, v]) => {
            if (k === "userId" || k === "id") return null;
            
            if (k.toLowerCase().includes("date")) {
              v = v ? new Date(v).toISOString().split('T')[0] : v;
            }
            
            return (
              <div className="col-md-6" key={k}>
                <label className="form-label fw-semibold text-secondary small text-capitalize">
                  {k.replace(/([A-Z])/g, " $1").trim()}
                  {(k === "firstName" || k === "lastName" || k === "mobileNumber") && " *"}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type={k.toLowerCase().includes("email") ? "email" : 
                            k.toLowerCase().includes("date") ? "date" : "text"}
                      name={k}
                      className={`form-control ${errors[k] ? "is-invalid" : ""}`}
                      value={v || ""}
                      onChange={handleFieldChange}
                    />
                    {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
                  </>
                ) : (
                  <div className="p-2 bg-light rounded border" style={{ minHeight: "38px" }}>
                    {v || <span className="text-muted">-</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    // Check if current admin can edit this section
    const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
    const currentAdminRole = currentAdmin?.role?.name || currentAdmin?.role || "";
    const canEditCourseFee = ["ADMIN", "MASTER_ADMIN"].includes(currentAdminRole.toUpperCase());
    const showEditButton = keyName === "courseFee" ? canEditCourseFee : true;

    return (
      <div className="border rounded-3 mb-3 shadow-sm overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
        <div
          className="p-3 d-flex justify-content-between align-items-center"
          style={{
            cursor: "pointer",
            background: activeSection === keyName ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f8f9fa",
          }}
          onClick={() => setActiveSection(activeSection === keyName ? null : keyName)}
        >
          <h6 className={`mb-0 fw-semibold d-flex align-items-center ${activeSection === keyName ? "text-white" : "text-dark"}`}>
            <span className="me-2" style={{ fontSize: "1.2rem" }}>{icon}</span>
            {title}
            {keyName === "courseFee" && !canEditCourseFee && (
              <span className="ms-2 badge bg-secondary">
                <FaLock size={8} className="me-1" />
                Admin Only
              </span>
            )}
          </h6>

          <div className="d-flex gap-2 align-items-center">
            {activeSection === keyName && showEditButton && (
              <button 
                className={`btn btn-sm ${isEditing ? "btn-light" : "btn-outline-light"}`} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleEdit(keyName); 
                }}
              >
                {isEditing ? <><FaTimes className="me-1" /> Cancel</> : <><FaEdit className="me-1" /> Edit</>}
              </button>
            )}
            <span className={`fw-bold ${activeSection === keyName ? "text-white" : "text-primary"}`}>
              {activeSection === keyName ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {activeSection === keyName && (
          <div className="p-4 bg-white">
            {renderFields()}

            {isEditing && showEditButton && (
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => toggleEdit(keyName)}>
                  <FaTimes className="me-1" /> Cancel
                </button>
                <button className="btn btn-success" onClick={handleSaveSection}>
                  <FaSave className="me-1" /> Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const sections = getSections();

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="container py-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
        <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="text-white">
              <h4 className="mb-2 fw-bold d-flex align-items-center">
                👤 {user.firstName} {user.lastName}'s Complete Profile
              </h4>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-dark px-3 py-2">{userRole}</span>
                <span className="badge bg-white text-dark px-3 py-2">{user.email}</span>
                <span className="badge bg-white text-dark px-3 py-2">ID: {user.id || user.userId}</span>
              </div>
            </div>

            <button className="btn btn-light rounded-circle shadow" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="p-3" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="alert alert-success mb-0 d-flex align-items-center border-0 shadow-sm">
              <FaCheckCircle className="me-2 fs-5" />
              <span className="fw-semibold">
                Admin Full Access - You can view {userRole === "STUDENT" ? "all" : "personal"} details
                {userRole === "STUDENT" ? " (Course & Fee editable by ADMIN/MASTER_ADMIN only)" : ""}
              </span>
            </div>
          </div>

          <div className="p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3 text-muted fw-semibold">Loading user information...</p>
              </div>
            ) : (
              sections.map((s) => (
                <Section key={s.key} title={s.title} keyName={s.key} icon={s.icon} />
              ))
            )}
          </div>

          <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ background: "#f8f9fa" }}>
            <div className="text-muted small">
              {userRole === "STUDENT" 
                ? "All data is fetched from the database. Course & Fee section editable by ADMIN/MASTER_ADMIN only."
                : "All data is fetched from the database."}
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              <FaArrowLeft className="me-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfileView;