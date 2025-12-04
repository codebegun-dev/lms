// import React, { useState, useEffect } from "react";
// import { CiCirclePlus } from "react-icons/ci";
// import { useNavigate } from "react-router-dom";

// const Courses = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [courseTitle, setCourseTitle] = useState("");
//   const [courseType, setCourseType] = useState("Recorded Course");
//   const [existingCourses, setExistingCourses] = useState([]);
//   const [searchTitle, setSearchTitle] = useState("");
//   const [searchTag, setSearchTag] = useState("");
//   const [createdCourses, setCreatedCourses] = useState([]);
//   const [selectedCourseFromDropdown, setSelectedCourseFromDropdown] = useState("");
//   const navigate = useNavigate();

//   // Load created courses from localStorage on mount
//   const loadCreatedCourses = () => {
//     try {
//       const saved = localStorage.getItem('createdCourses');
//       if (saved) {
//         setCreatedCourses(JSON.parse(saved));
//       }
//     } catch (error) {
//       console.error("Error loading created courses:", error);
//     }
//   };

//   // Save created courses to localStorage
//   const saveCreatedCourses = (courses) => {
//     try {
//       localStorage.setItem('createdCourses', JSON.stringify(courses));
//     } catch (error) {
//       console.error("Error saving created courses:", error);
//     }
//   };

//   // Fetch courses from the backend (from CourseManagement) - GET method only
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/courses/all");
//       const data = await res.json();
//       setExistingCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//     loadCreatedCourses(); // Load persisted courses
//   }, []);

//   const handleCreateCourse = async () => {
//     if (!courseTitle.trim()) {
//       console.warn("Please enter a course title");
//       return;
//     }

//     // If user selected from dropdown, just select it (don't create new course)
//     if (selectedCourseFromDropdown) {
//       const selectedCourse = {
//         courseId: Date.now(),
//         courseName: selectedCourseFromDropdown,
//         courseType: courseType,
//         createdAt: new Date().toISOString()
//       };

//       const updatedCourses = [...createdCourses, selectedCourse];
//       setCreatedCourses(updatedCourses);
//       saveCreatedCourses(updatedCourses); // Persist to localStorage
//       setShowCreateModal(false);
//       setCourseTitle("");
//       setSelectedCourseFromDropdown("");
//       setCourseType("Recorded Course");
//       return;
//     }

//     // Only create new course if it's a new title (not from dropdown)
//     const courseData = {
//       courseName: courseTitle,
//       subjects: "",
//       courseType: courseType
//     };

//     try {
//       const res = await fetch("http://localhost:8080/api/courses/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(courseData),
//       });

//       if (res.ok) {
//         setShowCreateModal(false);
//         setCourseTitle("");
//         setSelectedCourseFromDropdown("");
//         setCourseType("Recorded Course");

//         // Add the newly created course to createdCourses state
//         const newCourse = {
//           courseId: Date.now(),
//           courseName: courseTitle,
//           courseType: courseType,
//           createdAt: new Date().toISOString()
//         };

//         const updatedCourses = [...createdCourses, newCourse];
//         setCreatedCourses(updatedCourses);
//         saveCreatedCourses(updatedCourses); // Persist to localStorage
//         await fetchCourses(); // Refresh the existing courses for dropdown
//       } else {
//         const error = await res.json();
//         console.error("Error creating course:", error.message || "Error creating course");
//       }
//     } catch (error) {
//       console.error("Error creating course:", error);
//     }
//   };

//   const handleDropdownSelect = (e) => {
//     const selectedValue = e.target.value;
//     setSelectedCourseFromDropdown(selectedValue);
//     if (selectedValue) {
//       setCourseTitle(selectedValue);
//     }
//   };

//   const handleInputChange = (e) => {
//     setCourseTitle(e.target.value);
//     setSelectedCourseFromDropdown(""); // Clear dropdown selection when typing
//   };

//   const handleOpenCourseBuilder = (courseName) => {
//     const encodedCourseName = encodeURIComponent(courseName);
//     navigate(`/admin-dashboard/syllabus/${encodedCourseName}`);
//   };

//   // Only show courses that were created in THIS component
//   const displayCourses = createdCourses.filter(course =>
//     course.courseName.toLowerCase().includes(searchTitle.toLowerCase()) &&
//     (searchTag === "" || course.subjects?.includes(searchTag))
//   );

//   const formatDate = (dateString) => {
//     if (!dateString) return "November 24th, 2025";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Rest of your JSX remains exactly the same...
//   return (
//     <div className="container my-4">
//       {/* Your existing JSX code here - no changes needed */}
//       <h1 className="fw-bold mb-4">All courses</h1>
//       <p className="text-muted mb-4">Quick look at everything going around within your courses</p>

//       {/* Search and Filter Section */}
//       <div className="row mb-4">
//         <div className="col-md-4 mb-3">
//           <label className="form-label fw-semibold">Search by title</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter partial match here"
//             value={searchTitle}
//             onChange={(e) => setSearchTitle(e.target.value)}
//           />
//         </div>
//         <div className="col-md-4 mb-3">
//           <label className="form-label fw-semibold">Search by tag name</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter exact tag name here"
//             value={searchTag}
//             onChange={(e) => setSearchTag(e.target.value)}
//           />
//         </div>
//         <div className="col-md-4 mb-3 d-flex align-items-end">
//           <button
//             className="btn btn-outline-secondary me-2"
//             onClick={() => {
//               setSearchTitle("");
//               setSearchTag("");
//             }}
//           >
//             Clear results
//           </button>
//         </div>
//       </div>

//       {/* Courses Table */}
//       <div className="card">
//         <div className="card-body p-0">
//           {/* Table Header */}
//           <div className="row m-0 align-items-center border-bottom">
//             <div className="col-md-5 p-3">
//               <strong>General information</strong>
//             </div>
//             <div className="col-md-2 p-3">
//               <strong>Tags</strong>
//             </div>
//             <div className="col-md-2 p-3">
//               <strong>Created at</strong>
//             </div>
//             <div className="col-md-3 p-3">
//               <strong>Actions</strong>
//             </div>
//           </div>

//           {/* Create New Course Row */}
//           <div className="row m-0 align-items-center border-bottom">
//             <div className="col-md-5 p-3">
//               <div
//                 className="d-flex align-items-center text-primary cursor-pointer"
//                 onClick={() => setShowCreateModal(true)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <CiCirclePlus className="me-2" size={20} />
//                 <span className="fw-semibold">Create new course</span>
//               </div>
//             </div>
//             <div className="col-md-2 p-3"></div>
//             <div className="col-md-2 p-3"></div>
//             <div className="col-md-3 p-3"></div>
//           </div>

//           {/* Existing Courses List */}
//           {displayCourses.map((course, index) => (
//             <div key={course.courseId || index} className="row m-0 align-items-center border-bottom">
//               {/* General Information Column */}
//               <div className="col-md-5 p-3">
//                 <div className="fw-semibold">{course.courseName}</div>
//                 <div className="small text-muted">
//                   {course.courseType === "Cohort-Based Course (CBC)" ? "Cohort Based Course" : course.courseType}
//                 </div>
//                 <div className="small">
//                   <span className="badge bg-light text-dark border">Unlisted</span>
//                 </div>
//               </div>

//               {/* Tags Column */}
//               <div className="col-md-2 p-3">
//                 <button className="btn btn-outline-secondary btn-sm">
//                   Add tag
//                 </button>
//               </div>

//               {/* Created At Column */}
//               <div className="col-md-2 p-3">
//                 <div className="text-muted">{formatDate(course.createdAt)}</div>
//               </div>

//               {/* Actions Column */}
//               <div className="col-md-3 p-3">
//                 <button 
//                   className="btn btn-outline-primary btn-sm"
//                   onClick={() => handleOpenCourseBuilder(course.courseName)}
//                 >
//                   Open course builder
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* No Courses Message */}
//       {displayCourses.length === 0 && createdCourses.length === 0 && (
//         <div className="card mt-4">
//           <div className="card-body text-center text-muted py-5">
//             No courses found. Create your first course by clicking "Create new course" above.
//           </div>
//         </div>
//       )}

//       {/* Create Course Modal - unchanged */}
//       {showCreateModal && (
//         <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Create a new course</h5>
//               </div>
//               <div className="modal-body">
//                 <p className="text-muted mb-4">Enter your course details to get started</p>

//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Course title *
//                   </label>

//                   <select
//                     className="form-select mb-3"
//                     onChange={handleDropdownSelect}
//                     value={selectedCourseFromDropdown}
//                   >
//                     <option value="">Choose an existing course</option>
//                     {existingCourses.map((course) => (
//                       <option key={course.courseId} value={course.courseName}>
//                         {course.courseName}
//                       </option>
//                     ))}
//                   </select>                  
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Course type *
//                   </label>
//                   <select
//                     className="form-select"
//                     value={courseType}
//                     onChange={(e) => setCourseType(e.target.value)}
//                   >
//                     <option value="Recorded Course">Recorded Course</option>
//                     <option value="Cohort-Based Course (CBC)">Cohort-Based Course (CBC)</option>
//                   </select>
//                   <div className="form-text">
//                     {courseType === "Recorded Course"
//                       ? "Pre-recorded content that students can access anytime at their own pace"
//                       : "Live course with scheduled sessions, specific start and end dates"
//                     }
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setShowCreateModal(false);
//                     setCourseTitle("");
//                     setSelectedCourseFromDropdown("");
//                     setCourseType("Recorded Course");
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleCreateCourse}
//                 >
//                   {selectedCourseFromDropdown ? "Select Course" : "Create Course"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Courses;




import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseType, setCourseType] = useState("Recorded Course");
  const [existingCourses, setExistingCourses] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [createdCourses, setCreatedCourses] = useState([]);
  const [selectedCourseFromDropdown, setSelectedCourseFromDropdown] = useState("");
  const navigate = useNavigate();

  // Load created courses from localStorage on mount
  const loadCreatedCourses = () => {
    try {
      const saved = localStorage.getItem('createdCourses');
      if (saved) {
        setCreatedCourses(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading created courses:", error);
    }
  };

  // Save created courses to localStorage
  const saveCreatedCourses = (courses) => {
    try {
      localStorage.setItem('createdCourses', JSON.stringify(courses));
    } catch (error) {
      console.error("Error saving created courses:", error);
    }
  };

  // Fetch courses from the backend (from CourseManagement) - GET method only
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/courses/all");
      const data = await res.json();
      setExistingCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    loadCreatedCourses(); // Load persisted courses
  }, []);

  // Delete course function
  const handleDeleteCourse = (courseId, courseName) => {
    if (window.confirm(`Are you sure you want to delete the course "${courseName}"? This action cannot be undone and will also delete all associated syllabus data.`)) {
      // Remove from createdCourses
      const updatedCourses = createdCourses.filter(course => course.courseId !== courseId);
      setCreatedCourses(updatedCourses);
      saveCreatedCourses(updatedCourses);
      
      // Also remove from localStorage syllabus data
      const syllabusKey = `syllabus_${courseName}`;
      localStorage.removeItem(syllabusKey);
      
      alert(`Course "${courseName}" has been deleted successfully.`);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseTitle.trim()) {
      console.warn("Please enter a course title");
      return;
    }

    // If user selected from dropdown, just select it (don't create new course)
    if (selectedCourseFromDropdown) {
      const selectedCourse = {
        courseId: Date.now(),
        courseName: selectedCourseFromDropdown,
        courseType: courseType,
        createdAt: new Date().toISOString()
      };

      const updatedCourses = [...createdCourses, selectedCourse];
      setCreatedCourses(updatedCourses);
      saveCreatedCourses(updatedCourses); // Persist to localStorage
      setShowCreateModal(false);
      setCourseTitle("");
      setSelectedCourseFromDropdown("");
      setCourseType("Recorded Course");
      return;
    }

    // Only create new course if it's a new title (not from dropdown)
    const courseData = {
      courseName: courseTitle,
      subjects: "",
      courseType: courseType
    };

    try {
      const res = await fetch("http://localhost:8080/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setCourseTitle("");
        setSelectedCourseFromDropdown("");
        setCourseType("Recorded Course");

        // Add the newly created course to createdCourses state
        const newCourse = {
          courseId: Date.now(),
          courseName: courseTitle,
          courseType: courseType,
          createdAt: new Date().toISOString()
        };

        const updatedCourses = [...createdCourses, newCourse];
        setCreatedCourses(updatedCourses);
        saveCreatedCourses(updatedCourses); // Persist to localStorage
        await fetchCourses(); // Refresh the existing courses for dropdown
      } else {
        const error = await res.json();
        console.error("Error creating course:", error.message || "Error creating course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleDropdownSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedCourseFromDropdown(selectedValue);
    if (selectedValue) {
      setCourseTitle(selectedValue);
    }
  };

  const handleInputChange = (e) => {
    setCourseTitle(e.target.value);
    setSelectedCourseFromDropdown(""); // Clear dropdown selection when typing
  };

  const handleOpenCourseBuilder = (courseName) => {
    const encodedCourseName = encodeURIComponent(courseName);
    navigate(`/admin-dashboard/syllabus/${encodedCourseName}`);
  };

  // Only show courses that were created in THIS component
  const displayCourses = createdCourses.filter(course =>
    course.courseName.toLowerCase().includes(searchTitle.toLowerCase()) &&
    (searchTag === "" || course.subjects?.includes(searchTag))
  );

  const formatDate = (dateString) => {
    if (!dateString) return "November 24th, 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container my-4">
      <h1 className="fw-bold mb-4">All courses</h1>
      <p className="text-muted mb-4">Quick look at everything going around within your courses</p>

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <label className="form-label fw-semibold">Search by title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter partial match here"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label fw-semibold">Search by tag name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter exact tag name here"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => {
              setSearchTitle("");
              setSearchTag("");
            }}
          >
            Clear results
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="card-body p-0">
          {/* Table Header */}
          <div className="row m-0 align-items-center border-bottom">
            <div className="col-md-4 p-3">
              <strong>General information</strong>
            </div>
            <div className="col-md-2 p-3">
              <strong>Tags</strong>
            </div>
            <div className="col-md-2 p-3">
              <strong>Created at</strong>
            </div>
            <div className="col-md-4 p-3">
              <strong>Actions</strong>
            </div>
          </div>

          {/* Create New Course Row */}
          <div className="row m-0 align-items-center border-bottom">
            <div className="col-md-4 p-3">
              <div
                className="d-flex align-items-center text-primary cursor-pointer"
                onClick={() => setShowCreateModal(true)}
                style={{ cursor: 'pointer' }}
              >
                <CiCirclePlus className="me-2" size={20} />
                <span className="fw-semibold">Create new course</span>
              </div>
            </div>
            <div className="col-md-2 p-3"></div>
            <div className="col-md-2 p-3"></div>
            <div className="col-md-4 p-3"></div>
          </div>

          {/* Existing Courses List */}
          {displayCourses.map((course, index) => (
            <div key={course.courseId || index} className="row m-0 align-items-center border-bottom">
              {/* General Information Column */}
              <div className="col-md-4 p-3">
                <div className="fw-semibold">{course.courseName}</div>
                <div className="small text-muted">
                  {course.courseType === "Cohort-Based Course (CBC)" ? "Cohort Based Course" : course.courseType}
                </div>
                <div className="small">
                  <span className="badge bg-light text-dark border">Unlisted</span>
                </div>
              </div>

              {/* Tags Column */}
              <div className="col-md-2 p-3">
                <button className="btn btn-outline-secondary btn-sm">
                  Add tag
                </button>
              </div>

              {/* Created At Column */}
              <div className="col-md-2 p-3">
                <div className="text-muted">{formatDate(course.createdAt)}</div>
              </div>

              {/* Actions Column */}
              <div className="col-md-4 p-3">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleOpenCourseBuilder(course.courseName)}
                  >
                    Open course builder
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteCourse(course.courseId, course.courseName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Courses Message */}
      {displayCourses.length === 0 && createdCourses.length === 0 && (
        <div className="card mt-4">
          <div className="card-body text-center text-muted py-5">
            No courses found. Create your first course by clicking "Create new course" above.
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a new course</h5>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">Enter your course details to get started</p>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Course title *
                  </label>

                  <select
                    className="form-select mb-3"
                    onChange={handleDropdownSelect}
                    value={selectedCourseFromDropdown}
                  >
                    <option value="">Choose an existing course</option>
                    {existingCourses.map((course) => (
                      <option key={course.courseId} value={course.courseName}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>                  
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Course type *
                  </label>
                  <select
                    className="form-select"
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                  >
                    <option value="Recorded Course">Recorded Course</option>
                    <option value="Cohort-Based Course (CBC)">Cohort-Based Course (CBC)</option>
                  </select>
                  <div className="form-text">
                    {courseType === "Recorded Course"
                      ? "Pre-recorded content that students can access anytime at their own pace"
                      : "Live course with scheduled sessions, specific start and end dates"
                    }
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCourseTitle("");
                    setSelectedCourseFromDropdown("");
                    setCourseType("Recorded Course");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateCourse}
                >
                  {selectedCourseFromDropdown ? "Select Course" : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;