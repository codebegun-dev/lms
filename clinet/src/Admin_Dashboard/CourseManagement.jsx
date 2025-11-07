import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const CourseManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert("Unable to fetch courses. Check server.", "danger");
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });

        if (!res.ok) {
          const err = await res.json();
          return showAlert(err.message || "Error updating course", "danger");
        }

        showAlert("Course updated successfully!", "primary");
      } else {
        // ✅ Create Course
        const res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });

        if (!res.ok) {
          const err = await res.json();
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
      showAlert("Something went wrong. Check console.", "danger");
    }
  };

  const handleEdit = (index) => {
    const course = courses[index];
    setSelectedCourse(course.courseName);
    setSubjects(course.subjects);
    setEditingIndex(index);
    setEditingId(course.courseId);
  };

  const handleDelete = async (index) => {
    const courseId = courses[index].courseId;

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`${API_BASE}/delete/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        return showAlert(err.message || "Error deleting course", "danger");
      }

      await fetchCourses();
      showAlert("Course deleted successfully!", "danger");
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong. Check console.", "danger");
    }
  };

  const handleClear = () => {
    setSelectedCourse("");
    setSubjects("");
    setEditingIndex(null);
    setEditingId(null);
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Subjects</th>
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
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
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
