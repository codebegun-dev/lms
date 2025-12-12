// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaEye, FaEyeSlash, FaCamera, FaVideo, FaLock, FaLockOpen, FaClock, FaExclamationTriangle, FaEdit, FaTrash } from "react-icons/fa";

// const Quiz = () => {
//   // Quiz Basic Info
//   const [quizTitle, setQuizTitle] = useState("");
//   const [quizDescription, setQuizDescription] = useState("");
//   const [quizTime, setQuizTime] = useState(30); // in minutes
//   const [totalMarks, setTotalMarks] = useState(100);
  
//   // Quiz Settings
//   const [quizType, setQuizType] = useState("public"); // public or private
//   const [showResults, setShowResults] = useState(true); // show results after submission
  
//   // Security Settings
//   const [enableTabSwitchRestriction, setEnableTabSwitchRestriction] = useState(false);
//   const [enableCamera, setEnableCamera] = useState(false);
//   const [enableRecording, setEnableRecording] = useState(false);
//   const [maxTabSwitchAttempts, setMaxTabSwitchAttempts] = useState(3);
  
//   // Subjects & Topics
//   const [subjects, setSubjects] = useState([]); // From CreateTopic
//   const [subtopics, setSubtopics] = useState([]); // From CreateSubTopic
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedSubtopic, setSelectedSubtopic] = useState("");
//   const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  
//   // Private Quiz - Restricted Students
//   const [restrictedStudents, setRestrictedStudents] = useState("");
//   const [restrictedEmails, setRestrictedEmails] = useState([]);
  
//   // Alert State
//   const [alert, setAlert] = useState({ message: "", type: "" });
  
//   // Quiz List State
//   const [quizzes, setQuizzes] = useState([]);
  
//   // API URLs
//   const SUBJECT_URL = "http://localhost:8080/api/topics";
//   const SUBTOPIC_URL = "http://localhost:8080/api/subtopics";

//   // Show alert
//   const showAlert = (message, type) => {
//     setAlert({ message, type });
//     setTimeout(() => setAlert({ message: "", type: "" }), 3000);
//   };

//   // Fetch subjects (topics)
//   const fetchSubjects = async () => {
//     try {
//       const res = await axios.get(SUBJECT_URL);
//       setSubjects(res.data);
//     } catch (err) {
//       console.error("Error fetching subjects:", err);
//       showAlert("Failed to load subjects", "danger");
//     }
//   };

//   // Fetch all subtopics
//   const fetchSubtopics = async () => {
//     try {
//       const res = await axios.get(SUBTOPIC_URL);
//       setSubtopics(res.data);
//     } catch (err) {
//       console.error("Error fetching subtopics:", err);
//       showAlert("Failed to load subtopics", "danger");
//     }
//   };

//   // Fetch quizzes from localStorage (or you can replace with API call)
//   const fetchQuizzes = () => {
//     const savedQuizzes = localStorage.getItem("quizzes");
//     if (savedQuizzes) {
//       setQuizzes(JSON.parse(savedQuizzes));
//     }
//   };

//   useEffect(() => {
//     fetchSubjects();
//     fetchSubtopics();
//     fetchQuizzes();
//   }, []);

//   // Filter subtopics when subject changes
//   useEffect(() => {
//     if (selectedSubject) {
//       const filtered = subtopics.filter(sub => sub.topicId === parseInt(selectedSubject));
//       setFilteredSubtopics(filtered);
//       setSelectedSubtopic(""); // Reset subtopic when subject changes
//     } else {
//       setFilteredSubtopics([]);
//     }
//   }, [selectedSubject, subtopics]);

//   // Handle restricted students input
//   const handleRestrictedStudentsChange = (e) => {
//     setRestrictedStudents(e.target.value);
//     const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
//     setRestrictedEmails(emails);
//   };

//   // Validate email format
//   const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   // Form validation
//   const validateForm = () => {
//     if (!quizTitle.trim()) {
//       showAlert("Please enter quiz title", "warning");
//       return false;
//     }
//     if (!selectedSubject) {
//       showAlert("Please select a subject", "warning");
//       return false;
//     }
//     if (quizType === "private" && restrictedEmails.length === 0) {
//       showAlert("Please add at least one student email for private quiz", "warning");
//       return false;
//     }
//     if (quizType === "private") {
//       for (const email of restrictedEmails) {
//         if (!isValidEmail(email)) {
//           showAlert(`Invalid email format: ${email}`, "warning");
//           return false;
//         }
//       }
//     }
//     if (enableTabSwitchRestriction && maxTabSwitchAttempts <= 0) {
//       showAlert("Maximum tab switch attempts must be greater than 0", "warning");
//       return false;
//     }
//     return true;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     // Prepare quiz data
//     const quizData = {
//       id: Date.now(), // Generate unique ID
//       title: quizTitle,
//       description: quizDescription,
//       timeLimit: quizTime,
//       totalMarks: totalMarks,
//       subjectId: parseInt(selectedSubject),
//       subjectName: subjects.find(s => s.id === parseInt(selectedSubject))?.name || "",
//       subtopicId: selectedSubtopic ? parseInt(selectedSubtopic) : null,
//       subtopicName: selectedSubtopic ? 
//         filteredSubtopics.find(st => st.id === parseInt(selectedSubtopic))?.name || "" : "",
//       quizType: quizType,
//       showResults: showResults,
//       enableTabSwitchRestriction: enableTabSwitchRestriction,
//       maxTabSwitchAttempts: enableTabSwitchRestriction ? maxTabSwitchAttempts : 0,
//       enableCamera: enableCamera,
//       enableRecording: enableRecording,
//       restrictedEmails: quizType === "private" ? restrictedEmails : [],
//       createdAt: new Date().toISOString()
//     };

//     // Save to localStorage (or you can replace with API call)
//     const updatedQuizzes = [...quizzes, quizData];
//     setQuizzes(updatedQuizzes);
//     localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
    
//     showAlert("Quiz created successfully!", "success");
    
//     // Reset form
//     resetForm();
//   };

//   // Reset form
//   const resetForm = () => {
//     setQuizTitle("");
//     setQuizDescription("");
//     setQuizTime(30);
//     setTotalMarks(100);
//     setSelectedSubject("");
//     setSelectedSubtopic("");
//     setQuizType("public");
//     setShowResults(true);
//     setEnableTabSwitchRestriction(false);
//     setEnableCamera(false);
//     setEnableRecording(false);
//     setMaxTabSwitchAttempts(3);
//     setRestrictedStudents("");
//     setRestrictedEmails([]);
//   };

//   // Handle delete quiz
//   const handleDeleteQuiz = (id) => {
//     if (window.confirm("Are you sure you want to delete this quiz?")) {
//       const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
//       setQuizzes(updatedQuizzes);
//       localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
//       showAlert("Quiz deleted successfully!", "success");
//     }
//   };

//   // Handle edit quiz
//   const handleEditQuiz = (quiz) => {
//     // Populate form with quiz data for editing
//     setQuizTitle(quiz.title);
//     setQuizDescription(quiz.description);
//     setQuizTime(quiz.timeLimit);
//     setTotalMarks(quiz.totalMarks);
//     setSelectedSubject(quiz.subjectId.toString());
//     setSelectedSubtopic(quiz.subtopicId ? quiz.subtopicId.toString() : "");
//     setQuizType(quiz.quizType);
//     setShowResults(quiz.showResults);
//     setEnableTabSwitchRestriction(quiz.enableTabSwitchRestriction);
//     setEnableCamera(quiz.enableCamera);
//     setEnableRecording(quiz.enableRecording);
//     setMaxTabSwitchAttempts(quiz.maxTabSwitchAttempts);
//     setRestrictedStudents(quiz.restrictedEmails.join(', '));
//     setRestrictedEmails(quiz.restrictedEmails);
    
//     showAlert("Quiz loaded for editing. Make changes and save to update.", "info");
//   };

//   return (
//     <div className="container mt-4">
//       {/* Alert */}
//       {alert.message && (
//         <div className={`alert alert-${alert.type} text-center`} role="alert">
//           {alert.message}
//         </div>
//       )}

//       {/* Quiz Form Section */}
//       <div className="card shadow-lg mb-4">
//         <div className="card-header bg-primary text-white">
//           <h3 className="text-center mb-0">Create New Quiz</h3>
//         </div>
        
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             {/* Basic Quiz Information */}
//             <div className="row mb-4">
//               <div className="col-md-12">
//                 <h5 className="border-bottom pb-2">
//                   <FaExclamationTriangle className="me-2" />
//                   Basic Quiz Information
//                 </h5>
//               </div>
              
//               <div className="col-md-12 mb-3">
//                 <label className="form-label">Quiz Title *</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter quiz title"
//                   value={quizTitle}
//                   onChange={(e) => setQuizTitle(e.target.value)}
//                   required
//                 />
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Quiz Time (minutes) *</label>
//                 <div className="input-group">
//                   <span className="input-group-text"><FaClock /></span>
//                   <input
//                     type="number"
//                     className="form-control"
//                     min="1"
//                     max="300"
//                     value={quizTime}
//                     onChange={(e) => setQuizTime(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Total Marks</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   min="1"
//                   max="1000"
//                   value={totalMarks}
//                   onChange={(e) => setTotalMarks(e.target.value)}
//                 />
//               </div>
              
//               <div className="col-md-12 mb-3">
//                 <label className="form-label">Quiz Description</label>
//                 <textarea
//                   className="form-control"
//                   rows="2"
//                   placeholder="Enter quiz description"
//                   value={quizDescription}
//                   onChange={(e) => setQuizDescription(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Subject and Subtopic Selection */}
//             <div className="row mb-4">
//               <div className="col-md-12">
//                 <h5 className="border-bottom pb-2">Subject & Topic Selection</h5>
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Select Subject *</label>
//                 <select
//                   className="form-select"
//                   value={selectedSubject}
//                   onChange={(e) => setSelectedSubject(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Subject</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.id} value={subject.id}>
//                       {subject.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Select Subtopic (Optional)</label>
//                 <select
//                   className="form-select"
//                   value={selectedSubtopic}
//                   onChange={(e) => setSelectedSubtopic(e.target.value)}
//                   disabled={!selectedSubject}
//                 >
//                   <option value="">All Subtopics</option>
//                   {filteredSubtopics.map((subtopic) => (
//                     <option key={subtopic.id} value={subtopic.id}>
//                       {subtopic.name}
//                     </option>
//                   ))}
//                 </select>
//                 {!selectedSubject && (
//                   <small className="text-muted">Please select a subject first</small>
//                 )}
//               </div>
//             </div>

//             {/* Quiz Type and Settings */}
//             <div className="row mb-4">
//               <div className="col-md-12">
//                 <h5 className="border-bottom pb-2">Quiz Settings</h5>
//               </div>
              
//               <div className="col-md-12 mb-3">
//                 <label className="form-label">Quiz Type</label>
//                 <div className="d-flex gap-3">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="quizType"
//                       id="public"
//                       value="public"
//                       checked={quizType === "public"}
//                       onChange={(e) => setQuizType(e.target.value)}
//                     />
//                     <label className="form-check-label" htmlFor="public">
//                       <FaLockOpen className="me-1" /> Public (All Students)
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="quizType"
//                       id="private"
//                       value="private"
//                       checked={quizType === "private"}
//                       onChange={(e) => setQuizType(e.target.value)}
//                     />
//                     <label className="form-check-label" htmlFor="private">
//                       <FaLock className="me-1" /> Private (Restricted)
//                     </label>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Private Quiz Settings */}
//               {quizType === "private" && (
//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">Restricted Students (Email addresses, separated by commas)</label>
//                   <textarea
//                     className="form-control"
//                     rows="2"
//                     placeholder="student1@example.com, student2@example.com"
//                     value={restrictedStudents}
//                     onChange={handleRestrictedStudentsChange}
//                   />
//                   <small className="text-muted">
//                     {restrictedEmails.length} student(s) added
//                   </small>
//                 </div>
//               )}
              
//               <div className="col-md-12 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="showResults"
//                     checked={showResults}
//                     onChange={(e) => setShowResults(e.target.checked)}
//                   />
//                   <label className="form-check-label" htmlFor="showResults">
//                     {showResults ? <FaEye className="me-1" /> : <FaEyeSlash className="me-1" />}
//                     Show results after submission
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Security Settings */}
//             <div className="row mb-4">
//               <div className="col-md-12">
//                 <h5 className="border-bottom pb-2 text-warning">
//                   <FaLock className="me-2" />
//                   Security Settings
//                 </h5>
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="tabRestriction"
//                     checked={enableTabSwitchRestriction}
//                     onChange={(e) => setEnableTabSwitchRestriction(e.target.checked)}
//                   />
//                   <label className="form-check-label" htmlFor="tabRestriction">
//                     Restrict Tab Switching
//                   </label>
//                 </div>
//                 {enableTabSwitchRestriction && (
//                   <div className="mt-2">
//                     <label className="form-label">Max Tab Switch Attempts</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       min="1"
//                       max="10"
//                       value={maxTabSwitchAttempts}
//                       onChange={(e) => setMaxTabSwitchAttempts(e.target.value)}
//                     />
//                   </div>
//                 )}
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="enableCamera"
//                     checked={enableCamera}
//                     onChange={(e) => setEnableCamera(e.target.checked)}
//                   />
//                   <label className="form-check-label" htmlFor="enableCamera">
//                     <FaCamera className="me-1" />
//                     Enable Camera Monitoring
//                   </label>
//                 </div>
//               </div>
              
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="enableRecording"
//                     checked={enableRecording}
//                     onChange={(e) => setEnableRecording(e.target.checked)}
//                   />
//                   <label className="form-check-label" htmlFor="enableRecording">
//                     <FaVideo className="me-1" />
//                     Enable Session Recording
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="row">
//               <div className="col-md-12">
//                 <div className="d-flex justify-content-between">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={resetForm}
//                   >
//                     Reset Form
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary px-4"
//                   >
//                     Save Quiz
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
        
//         <div className="card-footer text-muted">
//           <small>
//             * Required fields. Quiz settings can be modified later.
//           </small>
//         </div>
//       </div>

//       {/* Quiz Details Table Section */}
//       <div className="card shadow-lg">
//         <div className="card-header bg-success text-white">
//           <h3 className="text-center mb-0">Quiz Details</h3>
//         </div>
        
//         <div className="card-body">
//           {quizzes.length === 0 ? (
//             <div className="text-center py-4">
//               <p className="text-muted">No quizzes created yet.</p>
//               <p>Create your first quiz using the form above.</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-striped table-hover table-bordered">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>#</th>
//                     <th>Quiz Title</th>
//                     <th>Subject</th>
//                     <th>Subtopic</th>
//                     <th>Time</th>
//                     <th>Marks</th>
//                     <th>Type</th>
//                     <th>Tab Restricted</th>
//                     <th>Camera</th>
//                     <th>Recording</th>
//                     <th>Results</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quizzes.map((quiz, index) => (
//                     <tr key={quiz.id}>
//                       <td>{index + 1}</td>
//                       <td>
//                         <strong>{quiz.title}</strong>
//                         {quiz.description && (
//                           <small className="d-block text-muted" style={{ fontSize: '0.8rem' }}>
//                             {quiz.description.length > 50 
//                               ? `${quiz.description.substring(0, 50)}...` 
//                               : quiz.description}
//                           </small>
//                         )}
//                       </td>
//                       <td>{quiz.subjectName}</td>
//                       <td>{quiz.subtopicName || "All"}</td>
//                       <td>
//                         <span className="badge bg-info">
//                           {quiz.timeLimit} min
//                         </span>
//                       </td>
//                       <td>
//                         <span className="badge bg-primary">
//                           {quiz.totalMarks}
//                         </span>
//                       </td>
//                       <td>
//                         <span className={`badge ${quiz.quizType === 'public' ? 'bg-success' : 'bg-warning'}`}>
//                           {quiz.quizType.toUpperCase()}
//                         </span>
//                       </td>
//                       <td>
//                         {quiz.enableTabSwitchRestriction ? (
//                           <span className="badge bg-danger">
//                             {quiz.maxTabSwitchAttempts} attempts
//                           </span>
//                         ) : (
//                           <span className="text-muted">No</span>
//                         )}
//                       </td>
//                       <td>
//                         {quiz.enableCamera ? (
//                           <span className="badge bg-warning text-dark">
//                             <FaCamera className="me-1" /> Yes
//                           </span>
//                         ) : (
//                           <span className="text-muted">No</span>
//                         )}
//                       </td>
//                       <td>
//                         {quiz.enableRecording ? (
//                           <span className="badge bg-warning text-dark">
//                             <FaVideo className="me-1" /> Yes
//                           </span>
//                         ) : (
//                           <span className="text-muted">No</span>
//                         )}
//                       </td>
//                       <td>
//                         {quiz.showResults ? (
//                           <span className="badge bg-success">
//                             <FaEye className="me-1" /> Show
//                           </span>
//                         ) : (
//                           <span className="badge bg-secondary">
//                             <FaEyeSlash className="me-1" /> Hide
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="btn-group" role="group">
//                           <button
//                             className="btn btn-warning btn-sm me-1"
//                             onClick={() => handleEditQuiz(quiz)}
//                             title="Edit Quiz"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             className="btn btn-danger btn-sm"
//                             onClick={() => handleDeleteQuiz(quiz.id)}
//                             title="Delete Quiz"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
        
//         <div className="card-footer text-muted">
//           <small>
//             Total Quizzes: {quizzes.length} | Click edit icon to modify a quiz
//           </small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quiz;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCamera, FaVideo, FaLock, FaLockOpen, FaClock, FaExclamationTriangle, FaEdit, FaTrash, FaPlus, FaQuestionCircle, FaSave } from "react-icons/fa";

const Quiz = () => {
  // Quiz Basic Info
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizTime, setQuizTime] = useState(30); // in minutes
  const [totalMarks, setTotalMarks] = useState(100);
  const navigate = useNavigate();

  
  // Quiz Settings
  const [quizType, setQuizType] = useState("public"); // public or private
  const [showResults, setShowResults] = useState(true); // show results after submission
  
  // Security Settings
  const [enableTabSwitchRestriction, setEnableTabSwitchRestriction] = useState(false);
  const [enableCamera, setEnableCamera] = useState(false);
  const [enableRecording, setEnableRecording] = useState(false);
  const [maxTabSwitchAttempts, setMaxTabSwitchAttempts] = useState(3);
  
  // Subjects & Topics
  const [subjects, setSubjects] = useState([]); // From CreateTopic
  const [subtopics, setSubtopics] = useState([]); // From CreateSubTopic
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  
  // Private Quiz - Restricted Students
  const [restrictedStudents, setRestrictedStudents] = useState("");
  const [restrictedEmails, setRestrictedEmails] = useState([]);
  
  // Alert State
  const [alert, setAlert] = useState({ message: "", type: "" });
  
  // Quiz List State
  const [quizzes, setQuizzes] = useState([]);
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  
  // API URLs
  const SUBJECT_URL = "http://localhost:8080/api/topics";
  const SUBTOPIC_URL = "http://localhost:8080/api/subtopics";

  // Show alert
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // Fetch subjects (topics)
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(SUBJECT_URL);
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      showAlert("Failed to load subjects", "danger");
    }
  };

  // Fetch all subtopics
  const fetchSubtopics = async () => {
    try {
      const res = await axios.get(SUBTOPIC_URL);
      setSubtopics(res.data);
    } catch (err) {
      console.error("Error fetching subtopics:", err);
      showAlert("Failed to load subtopics", "danger");
    }
  };

  // Fetch quizzes from localStorage
  const fetchQuizzes = () => {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchSubtopics();
    fetchQuizzes();
  }, []);

  // Filter subtopics when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const filtered = subtopics.filter(sub => sub.topicId === parseInt(selectedSubject));
      setFilteredSubtopics(filtered);
      setSelectedSubtopic(""); // Reset subtopic when subject changes
    } else {
      setFilteredSubtopics([]);
    }
  }, [selectedSubject, subtopics]);

  // Handle restricted students input
  const handleRestrictedStudentsChange = (e) => {
    setRestrictedStudents(e.target.value);
    const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
    setRestrictedEmails(emails);
  };

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form validation
  const validateForm = () => {
    if (!quizTitle.trim()) {
      showAlert("Please enter quiz title", "warning");
      return false;
    }
    if (!selectedSubject) {
      showAlert("Please select a subject", "warning");
      return false;
    }
    if (quizType === "private" && restrictedEmails.length === 0) {
      showAlert("Please add at least one student email for private quiz", "warning");
      return false;
    }
    if (quizType === "private") {
      for (const email of restrictedEmails) {
        if (!isValidEmail(email)) {
          showAlert(`Invalid email format: ${email}`, "warning");
          return false;
        }
      }
    }
    if (enableTabSwitchRestriction && maxTabSwitchAttempts <= 0) {
      showAlert("Maximum tab switch attempts must be greater than 0", "warning");
      return false;
    }
    return true;
  };

  // Handle form submission - Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const quizData = {
      id: editingId || Date.now(), // Use existing ID for edit, new ID for create
      title: quizTitle,
      description: quizDescription,
      timeLimit: quizTime,
      totalMarks: totalMarks,
      subjectId: parseInt(selectedSubject),
      subjectName: subjects.find(s => s.id === parseInt(selectedSubject))?.name || "",
      subtopicId: selectedSubtopic ? parseInt(selectedSubtopic) : null,
      subtopicName: selectedSubtopic ? 
        filteredSubtopics.find(st => st.id === parseInt(selectedSubtopic))?.name || "" : "",
      quizType: quizType,
      showResults: showResults,
      enableTabSwitchRestriction: enableTabSwitchRestriction,
      maxTabSwitchAttempts: enableTabSwitchRestriction ? maxTabSwitchAttempts : 0,
      enableCamera: enableCamera,
      enableRecording: enableRecording,
      restrictedEmails: quizType === "private" ? restrictedEmails : [],
      updatedAt: new Date().toISOString(),
      questions: editingId ? quizzes.find(q => q.id === editingId)?.questions || [] : []
    };

    let updatedQuizzes;
    if (editingId) {
      // Update existing quiz
      updatedQuizzes = quizzes.map(quiz => 
        quiz.id === editingId ? quizData : quiz
      );
      showAlert("Quiz updated successfully!", "success");
    } else {
      // Create new quiz
      quizData.createdAt = new Date().toISOString();
      quizData.questions = [];
      updatedQuizzes = [...quizzes, quizData];
      showAlert("Quiz created successfully!", "success");
    }

    setQuizzes(updatedQuizzes);
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
    
    // Reset form and editing state
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setQuizTime(30);
    setTotalMarks(100);
    setSelectedSubject("");
    setSelectedSubtopic("");
    setQuizType("public");
    setShowResults(true);
    setEnableTabSwitchRestriction(false);
    setEnableCamera(false);
    setEnableRecording(false);
    setMaxTabSwitchAttempts(3);
    setRestrictedStudents("");
    setRestrictedEmails([]);
    setEditingId(null);
  };

  // Handle delete quiz
  const handleDeleteQuiz = (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
      setQuizzes(updatedQuizzes);
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
      showAlert("Quiz deleted successfully!", "success");
    }
  };

  // Handle edit quiz
  const handleEditQuiz = (quiz) => {
    // Populate form with quiz data for editing
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description);
    setQuizTime(quiz.timeLimit);
    setTotalMarks(quiz.totalMarks);
    setSelectedSubject(quiz.subjectId.toString());
    setSelectedSubtopic(quiz.subtopicId ? quiz.subtopicId.toString() : "");
    setQuizType(quiz.quizType);
    setShowResults(quiz.showResults);
    setEnableTabSwitchRestriction(quiz.enableTabSwitchRestriction);
    setEnableCamera(quiz.enableCamera);
    setEnableRecording(quiz.enableRecording);
    setMaxTabSwitchAttempts(quiz.maxTabSwitchAttempts);
    setRestrictedStudents(quiz.restrictedEmails.join(', '));
    setRestrictedEmails(quiz.restrictedEmails);
    setEditingId(quiz.id);
    
    showAlert("Quiz loaded for editing. Make changes and click Update.", "info");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    resetForm();
    showAlert("Edit cancelled", "info");
  };

  // Handle add questions
  // const handleAddQuestions = (quizId) => {
  //   // Navigate to question management page or open modal
  //   // For now, just show an alert
  //   const quiz = quizzes.find(q => q.id === quizId);
  //   showAlert(`Navigate to add questions for: ${quiz.title}`, "info");
  //   // You can implement modal or navigation here
  //   console.log(`Add questions for quiz ID: ${quizId}`);
  // };


  // const handleAddQuestions = (quizId) => {
  //   navigate(`/quiz/${quizId}/questions`);
  // };

  const handleAddQuestions = (quizId) => {
  navigate(`/admin-dashboard/quizzes/${quizId}/questions`);
};

  // Get status badge
  const getStatusBadge = (status, value) => {
    if (status === 'type') {
      return (
        <span className={`badge ${value === 'public' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
          {value.toUpperCase()}
        </span>
      );
    }
    if (status === 'boolean') {
      return value ? (
        <span className="badge bg-success text-white">Yes</span>
      ) : (
        <span className="badge bg-secondary text-white">No</span>
      );
    }
    if (status === 'tab') {
      return value.enabled ? (
        <span className="badge bg-danger text-white">{value.attempts} attempts</span>
      ) : (
        <span className="badge bg-secondary text-white">No</span>
      );
    }
    return null;
  };

  return (
    <div className="container mt-4">
      {/* Alert */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ message: "", type: "" })}></button>
        </div>
      )}

      {/* Quiz Form Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {editingId ? (
                <>
                  <FaEdit className="me-2 text-primary" />
                  Edit Quiz
                </>
              ) : (
                <>
                  <h1 className="me-2 text-primary" />
                  Create New Quiz
                </>
              )}
            </h4>
            {editingId && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Quiz Information */}
            <div className="row mb-4">
              <div className="col-12 mb-3">
                <div className="card border">
                  <div className="card-body">
                    
                    
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">Quiz Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter quiz title"
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Time Limit (minutes) *</label>
                        <div className="input-group">
                          <span className="input-group-text"><FaClock /></span>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            max="300"
                            value={quizTime}
                            onChange={(e) => setQuizTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Total Marks</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="1000"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Describe the quiz purpose, topics covered, etc."
                          value={quizDescription}
                          onChange={(e) => setQuizDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject and Subtopic Selection */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">Subject & Topic</h6>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Select Subject *</label>
                        <select
                          className="form-select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          required
                        >
                          <option value="">Choose subject...</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Select Subtopic (Optional)</label>
                        <select
                          className="form-select"
                          value={selectedSubtopic}
                          onChange={(e) => setSelectedSubtopic(e.target.value)}
                          disabled={!selectedSubject}
                        >
                          <option value="">All subtopics</option>
                          {filteredSubtopics.map((subtopic) => (
                            <option key={subtopic.id} value={subtopic.id}>
                              {subtopic.name}
                            </option>
                          ))}
                        </select>
                        {!selectedSubject && (
                          <div className="form-text">Select a subject first</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Type and Settings */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">Quiz Settings</h6>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Quiz Type</label>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="quizType"
                            id="public"
                            value="public"
                            checked={quizType === "public"}
                            onChange={(e) => setQuizType(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="public">
                            <FaLockOpen className="me-1" /> Public (All Students)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="quizType"
                            id="private"
                            value="private"
                            checked={quizType === "private"}
                            onChange={(e) => setQuizType(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="private">
                            <FaLock className="me-1" /> Private (Restricted)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {quizType === "private" && (
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Restricted Students</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Enter email addresses, separated by commas"
                          value={restrictedStudents}
                          onChange={handleRestrictedStudentsChange}
                        />
                        <div className="form-text">
                          {restrictedEmails.length} student(s) added
                        </div>
                      </div>
                    )}
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showResults"
                        checked={showResults}
                        onChange={(e) => setShowResults(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="showResults">
                        {showResults ? <FaEye className="me-1" /> : <FaEyeSlash className="me-1" />}
                        Show results after submission
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="col-md-6">
                <div className="card border">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">
                      <FaLock className="me-2" />
                      Security Settings
                    </h6>
                    
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="tabRestriction"
                          checked={enableTabSwitchRestriction}
                          onChange={(e) => setEnableTabSwitchRestriction(e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="tabRestriction">
                          Restrict Tab Switching
                        </label>
                      </div>
                      {enableTabSwitchRestriction && (
                        <div className="mt-2 ms-4">
                          <label className="form-label">Max Attempts</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="1"
                            max="10"
                            value={maxTabSwitchAttempts}
                            onChange={(e) => setMaxTabSwitchAttempts(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="enableCamera"
                          checked={enableCamera}
                          onChange={(e) => setEnableCamera(e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="enableCamera">
                          <FaCamera className="me-1" />
                          Enable Camera Monitoring
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="enableRecording"
                          checked={enableRecording}
                          onChange={(e) => setEnableRecording(e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="enableRecording">
                          <FaVideo className="me-1" />
                          Enable Session Recording
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                  >
                    {editingId ? (
                      <>
                        <FaSave className="me-2" />
                        Update Quiz
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" />
                        Create Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quiz Details Table Section */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaQuestionCircle className="me-2 text-primary" />
              Quiz List ({quizzes.length})
            </h4>
          </div>
        </div>
        
        <div className="card-body">
          {quizzes.length === 0 ? (
            <div className="text-center py-5">
              <FaQuestionCircle className="text-muted mb-3" size={48} />
              <h5 className="text-muted">No quizzes created yet</h5>
              <p className="text-muted">Create your first quiz using the form above</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Quiz Details</th>
                    <th>Subject</th>
                    <th>Time</th>
                    <th>Marks</th>
                    <th>Type</th>
                    <th>Security</th>
                    <th>Questions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz, index) => (
                    <tr key={quiz.id} className={editingId === quiz.id ? 'table-primary' : ''}>
                      <td className="fw-semibold">{index + 1}</td>
                      <td>
                        <div>
                          <strong className="d-block">{quiz.title}</strong>
                          {quiz.description && (
                            <small className="text-muted d-block mt-1">
                              {quiz.description.length > 60 
                                ? `${quiz.description.substring(0, 60)}...` 
                                : quiz.description}
                            </small>
                          )}
                          {quiz.subtopicName && quiz.subtopicName !== "All" && (
                            <small className="text-muted d-block mt-1">
                              Subtopic: {quiz.subtopicName}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{quiz.subjectName}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaClock className="me-1 text-muted" size={14} />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {quiz.totalMarks} pts
                        </span>
                      </td>
                      <td>
                        {getStatusBadge('type', quiz.quizType)}
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex align-items-center">
                            <FaLock className="me-1 text-muted" size={12} />
                            <small>{getStatusBadge('tab', { 
                              enabled: quiz.enableTabSwitchRestriction, 
                              attempts: quiz.maxTabSwitchAttempts 
                            })}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaCamera className="me-1 text-muted" size={12} />
                            <small>{getStatusBadge('boolean', quiz.enableCamera)}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaVideo className="me-1 text-muted" size={12} />
                            <small>{getStatusBadge('boolean', quiz.enableRecording)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAddQuestions(quiz.id)}
                          title="Add/Manage Questions"
                        >
                          <FaPlus className="me-1" />
                          Add ({quiz.questions?.length || 0})
                        </button>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleEditQuiz(quiz)}
                            title="Edit Quiz"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            title="Delete Quiz"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
         
      </div>
    </div>
  );
};

export default Quiz;





