
import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaToggleOn, FaToggleOff } from "react-icons/fa";

const CourseManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"

  // ✅ New states for alerts
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_BASE = "http://localhost:8080/api/courses";

  // ✅ Alert Function
  const showAlert = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // ✅ Utility function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken") || 
                  localStorage.getItem("token") ||
                  sessionStorage.getItem("authToken") ||
                  sessionStorage.getItem("token");
    
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include"
      });

      // Check if response is OK
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          showAlert("Access denied. Please login first.", "danger");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Check content type before parsing JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Try to read as text first
        const text = await res.text();
        console.error("Non-JSON response:", text);
        showAlert("Server returned invalid response format", "danger");
        return;
      }

      const data = await res.json();
      // ✅ Map backend status to active boolean for frontend
      const coursesWithActive = data.map(course => ({
        ...course,
        active: course.status === "ACTIVE" // Convert "ACTIVE"/"INACTIVE" to boolean
      }));
      setCourses(coursesWithActive);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert("Unable to fetch courses. Check server connection.", "danger");
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!selectedCourse.trim() || !subjects.trim())
      return showAlert("Please fill all fields.", "warning");

    const courseData = { courseName: selectedCourse, subjects };

    try {
      if (editingIndex !== null && editingId) {
        // ✅ Update Course
        const res = await fetch(`${API_BASE}/update/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(courseData),
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            showAlert("You don't have permission to update courses", "danger");
            return;
          }
          const err = await res.json().catch(() => ({ message: "Error updating course" }));
          return showAlert(err.message || "Error updating course", "danger");
        }

        showAlert("Course updated successfully!", "primary");
      } else {
        // ✅ Create Course
        const res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(courseData),
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            showAlert("You don't have permission to create courses", "danger");
            return;
          }
          const err = await res.json().catch(() => ({ message: "Error creating course" }));
          return showAlert(err.message || "Error creating course", "danger");
        }

        showAlert("Course created successfully!", "success");
      }

      setSelectedCourse("");
      setSubjects("");
      setEditingIndex(null);
      setEditingId(null);
      await fetchCourses();
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong. Please try again.", "danger");
    }
  };

  const handleEdit = (index) => {
    const course = courses[index];
    setSelectedCourse(course.courseName);
    setSubjects(course.subjects);
    setEditingIndex(index);
    setEditingId(course.courseId);
  };

  const handleToggleStatus = async (courseId, currentActive) => {
    const newStatus = !currentActive;
    const action = newStatus ? "enable" : "disable";
    
    if (!window.confirm(`Are you sure you want to ${action} this course?`)) return;

    try {
      const res = await fetch(`${API_BASE}/${courseId}/status?active=${newStatus}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          showAlert("You don't have permission to toggle course status", "danger");
          return;
        }
        const err = await res.json().catch(() => ({ message: "Error toggling course status" }));
        return showAlert(err.message || "Error toggling course status", "danger");
      }

      await fetchCourses();
      showAlert(`Course ${action}d successfully!`, newStatus ? "success" : "warning");
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong. Please try again.", "danger");
    }
  };

  const handleClear = () => {
    setSelectedCourse("");
    setSubjects("");
    setEditingIndex(null);
    setEditingId(null);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "active" ? course.active === true :
      course.active === false;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container my-1">
      <h3 className="fw-bold mb-3">Course Management</h3>

      {/* ✅ Alert Message Display */}
      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      {/* Course Form */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Course Details</h5>

        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter course name"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Subjects (comma-separated)</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="e.g., Hooks, Context API, Reducers"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />
        </div>

        <div>
          <button className="btn btn-primary me-2" onClick={handleCreateOrUpdate}>
            {editingIndex !== null ? "Update Course" : "Create Course"}
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
        </div>
      </div>

      {/* All Courses Section */}
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">All Courses</h5>

          <div className="d-flex align-items-center gap-2">
            {/* Status Filter Buttons */}
            <div className="btn-group btn-group-sm me-2" role="group">
              <button
                type="button"
                className={`btn ${statusFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn ${statusFilter === "active" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </button>
              <button
                type="button"
                className={`btn ${statusFilter === "inactive" ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </button>
            </div>

            {/* Search Bar */}
            <div className="d-flex align-items-center border rounded px-2" style={{ maxWidth: "300px" }}>
              <FaSearch className="text-muted me-2" />
              <input
                type="text"
                className="form-control border-0 p-0"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr key={course.courseId}>
                  <td>{course.courseName}</td>
                  <td>{course.subjects}</td>
                  <td>
                    <span className={`badge ${course.active ? 'bg-success' : 'bg-secondary'}`}>
                      {course.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(index)}
                        title="Edit Course"
                        disabled={!course.active} // ✅ Disable edit for inactive courses
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`btn btn-sm ${course.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(course.courseId, course.active)}
                        title={course.active ? "Disable Course" : "Enable Course"}
                      >
                        {course.active ? <FaToggleOff /> : <FaToggleOn />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;